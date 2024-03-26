import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import AppConfig from '../../config/index.js';
import { GoogleAuthService } from '../../services/auth.js';
import { generateRandomCharacters, encryptData } from '../../utils/index.js';
import '../../types/index.js';
import { CustomSessionData, OTPChannel } from '../../types/index.js';
import initializeRedisClient from '../../config/redis.js';
import sendEmail from '../../config/nodemailer.js';
import { generateSixDigitsOTP } from '../../utils/generators.js';
import axios from 'axios';

export const authenticateWithGoogle = asyncHandler(async (req: Request, res: Response) => {
  const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  const GOOGLE_AUTH_SCOPE = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];
  const REDIRECT_URI = 'api/v1/auth/google/';
  const MOBILE_APP_DEEP_LINK = AppConfig.NODE_ENV === 'production' ? AppConfig.LIVE_MOBILE_APP_DEEP_LINK : AppConfig.LOCAL_MOBILE_APP_DEEP_LINK;
  const BACKEND_DOMAIN = AppConfig.NODE_ENV === 'production' ? AppConfig.LIVE_BACKEND_URL : AppConfig.LOCAL_BACKEND_URL;

  if (req.query.obtainAuthUrl) {
    const state = generateRandomCharacters(20);

    console.log('STATE', state);
    const encryptedState = encryptData(state);
    console.log('ENCRYPTED STATE', encryptedState);
    const googleAuthUrlParams = {
      response_type: 'code',
      client_id: AppConfig.GOOGLE_OAUTH2_CLIENT_ID,
      redirect_uri: `${BACKEND_DOMAIN}/${REDIRECT_URI}`,
      prompt: 'select_account',
      access_type: 'offline',
      scope: GOOGLE_AUTH_SCOPE.join(' '),
      state: encryptedState,
    };

    const response_data = {
      googleAuthUrl: `${GOOGLE_AUTH_URL}?${new URLSearchParams(googleAuthUrlParams).toString()}`,
    };

    (req.session as CustomSessionData).state = encryptedState;

    res.status(200).json(response_data);
  } else {
    const stateFromRequest = req.query.state;
    console.log('session: ', req.session);
    const stateFromSession = (req.session as CustomSessionData).state;
    console.log('SESSION STATE', stateFromSession);
    console.log('REQUEST STATE', stateFromRequest);

    if (stateFromSession === stateFromRequest) {
      const { code, error } = req.query;

      if (error || !code) {
        const urlParams = { message: error };
        res.redirect(`${MOBILE_APP_DEEP_LINK}?error=${JSON.stringify(urlParams)}`);
      }

      const { accessToken, refreshToken } = await GoogleAuthService.getTokens(code as string, `${BACKEND_DOMAIN}/${REDIRECT_URI}`);
      console.log('ACCESSSS', accessToken, refreshToken);
      await GoogleAuthService.validateAccessToken(accessToken);

      const userData = await GoogleAuthService.getUserInfo(accessToken);
      console.log('USER DATA', userData);
      const firstName = userData?.given_name;
      const lastName = userData?.family_name || '';

      const userProfile = {
        email: userData.email,
        firstName,
        lastName,
        photoUrl: userData.picture || '',
        googleRefreshToken: refreshToken,
      };

      res.redirect(`${MOBILE_APP_DEEP_LINK}?userProfile=${btoa(JSON.stringify(userProfile))}`);
    } else {
      console.log();
      throw new Error('Unable to complete Google authentication: State parameter mismatch');
    }
  }
});

export const sendOTP = asyncHandler(async (req: Request, res: Response) => {
  let { channel } = req.query;
  channel = (channel as string)?.toLowerCase();
  const { phoneNumber, email } = req.body;

  if (!channel) {
    res.status(400).json({ error: 'Channel is required' });
  } else if (channel !== OTPChannel.SMS && channel !== OTPChannel.EMAIL) {
    res.status(400).json({ error: 'Channel must be either SMS or Email' });
  }

  if (channel === OTPChannel.SMS && !phoneNumber) {
    res.status(400).json({ error: 'Phone number is required when channel is SMS' });
  } else if (channel === OTPChannel.EMAIL && !email) {
    res.status(400).json({ error: 'Email is required when channel is Email' });
  }

  const redisClient = await initializeRedisClient();

  if (channel === OTPChannel.SMS) {
    const requestData = {
      originator: 'Farmceries',
      recipient: phoneNumber,
      content:
        'Greetings from Farmceries, your mobile verification code is: {}. This code will expire in 5 minutes and is usable only once. \n\nIf you did not initiate this request, kindly ignore this message.',
      expiry: '300',
      data_coding: 'text',
    };

    const requestOptions = {
      headers: {
        'content-type': 'application/json',
        Token: AppConfig.RAPID_API_AUTH_TOKEN,
        'X-RapidAPI-Key': AppConfig.RAPID_API_KEY,
        'X-RapidAPI-Host': AppConfig.RAPID_API_HOST,
      },
    };

    try {
      const response = await axios.post('https://d7-verify.p.rapidapi.com/verify/v1/otp/send-otp', requestData, requestOptions);

      const OTP_ID = response.data.otp_id;
      await redisClient?.setEx(`sms-otp-id:${phoneNumber}`, 300, OTP_ID);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to send OTP' });
    }
  } else {
    const OTP = generateSixDigitsOTP();
    const emailData = {
      subject: 'Node.js Email Example',
      website: 'https://google.com',
      email,
      OTP,
    };

    await sendEmail(emailData, '../templates/emails/verifyOTP.pug');
    console.log('Email sent');
    await redisClient?.setEx(`email-otp:${email}`, 300, OTP);
  }
});

export const resendOTP = asyncHandler(async (req: Request, res: Response) => {
  const { channel } = req.query;
  const { phoneNumber, email } = req.body;

  if (!channel) {
    res.status(400).json({ error: 'Channel is required' });
  } else if (channel !== OTPChannel.SMS && channel !== OTPChannel.EMAIL) {
    res.status(400).json({ error: 'Channel must be either SMS or Email' });
  }

  if (channel === OTPChannel.SMS && !phoneNumber) {
    res.status(400).json({ error: 'Phone number is required when channel is SMS' });
  } else if (channel === OTPChannel.EMAIL && !email) {
    res.status(400).json({ error: 'Email is required when channel is Email' });
  }

  const redisClient = await initializeRedisClient();

  if (channel === OTPChannel.SMS) {
    const requestData = {
      originator: 'Farmceries',
      recipient: phoneNumber,
      content:
        'Greetings from Farmceries, your mobile verification code is: {}. This code will expire in 5 minutes and is usable only once. \n\nIf you did not initiate this request, kindly ignore this message.',
      expiry: '300',
      data_coding: 'text',
    };

    const requestOptions = {
      headers: {
        'content-type': 'application/json',
        Token: AppConfig.RAPID_API_AUTH_TOKEN,
        'X-RapidAPI-Key': AppConfig.RAPID_API_KEY,
      },
    };

    try {
      const response = await axios.post('https://d7-verify.p.rapidapi.com/verify/v1/otp/send-otp', requestData, requestOptions);

      const OTP_ID = response.data.otp_id;
      await redisClient?.setEx(`sms-otp-id:${phoneNumber}`, 300, OTP_ID);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to send OTP' });
    }
  } else if (channel === OTPChannel.EMAIL) {
    const OTP = generateSixDigitsOTP();
    const emailData = {
      subject: 'Node.js Email Example',
      website: 'https://google.com',
      email,
      OTP,
    };

    await sendEmail(emailData, '../templates/emails/verifyOTP.pug');
    console.log('Email sent');
    await redisClient?.setEx(`email-otp:${email}`, 300, OTP);
  }
});

export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { phoneNumber, email, OTPFromUser } = req.body;
  const { channel } = req.query;

  // Validate input
  if (!OTPFromUser) {
    res.status(400).json({ error: 'OTP is required' });
  } else if (!channel) {
    res.status(400).json({ error: 'Channel is required' });
  } else if (channel !== OTPChannel.SMS && channel !== OTPChannel.EMAIL) {
    res.status(400).json({ error: 'Channel must be either SMS or Email' });
  }

  if (channel === OTPChannel.SMS && !phoneNumber) {
    res.status(400).json({ error: 'Phone number is required when channel is SMS' });
  } else if (channel === OTPChannel.EMAIL && !email) {
    res.status(400).json({ error: 'Email is required when channel is Email' });
  }

  const redisClient = await initializeRedisClient();

  if (channel === OTPChannel.SMS) {
    const OTP_ID = await redisClient?.get(`sms-otp-id:${phoneNumber}`);
    if (!OTP_ID) {
      res.status(400).json({ error: 'OTP has expired' });
    }

    const requestData = {
      otp_id: OTP_ID,
      otp_code: OTPFromUser,
    };

    const requestOptions = {
      headers: {
        'content-type': 'application/json',
        Token: AppConfig.RAPID_API_AUTH_TOKEN,
        'X-RapidAPI-Key': AppConfig.RAPID_API_KEY,
      },
    };

    try {
      const response = await axios.post('https://d7-verify.p.rapidapi.com/verify/v1/otp/verify-otp', requestData, requestOptions);
      console.log(response.data);

      if (response.data.status === 'APPROVED') {
        res.status(200).json({ message: 'OTP verification successful' });
      } else if (response.data.code === 'INVALID_OTP_CODE') {
        res.status(400).json({ error: 'The OTP is invalid' });
      } else if (response.data.status === 'EXPIRED') {
        res.status(400).json({ error: 'The OTP has expired' });
      }
    } catch (error) {
      console.error(error);
    }
  } else if (channel === OTPChannel.EMAIL) {
    const OTP = await redisClient?.get(`email-otp:${email}`);
    if (!OTP) {
      res.status(400).json({ error: 'OTP has expired' });
    }

    if (OTP !== OTPFromUser) {
      res.status(400).json({ error: 'Invalid OTP' });
    }
  }
});
