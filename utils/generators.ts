import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import AppConfig from '../config/index.js';

export const generateToken = (account: any) => {
  const issuedAt = new Date().getTime();

  const tokenPayload = {
    id: account._id,
    email: account.email,
    phoneNumber: account.phoneNumber,
    iat: issuedAt,
  };

  return jwt.sign(tokenPayload, AppConfig.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const generateRandomCharacters = (length: number) => {
  return crypto.randomBytes(length).toString('hex');
};

export const generateSixDigitsOTP = () => {
  const randomBytes = crypto.getRandomValues(new Uint32Array(1));
  const OTP = Math.floor(randomBytes[0] / (0xffffffff / 1000000))
    .toString()
    .padStart(6, '0');
  return OTP;
};
