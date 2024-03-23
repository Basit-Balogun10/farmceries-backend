import { Request, Response } from "express";
import AppConfig from "../../config/index.js";
import { GoogleAuthService } from '../../services/auth.js';
import {
	generateToken,
	generateRandomCharacters,
	encryptData,
} from '../../utils/index.js';
import '../../types/index.js'
import { CustomSessionData } from "../../types/index.js";

export const authenticateWithGoogle = async (req: Request, res: Response) => {
	const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
	const GOOGLE_AUTH_SCOPE = [
		'https://www.googleapis.com/auth/userinfo.email',
		'https://www.googleapis.com/auth/userinfo.profile',
	];
	const REDIRECT_URI = 'api/v1/auth/google/';
	const MOBILE_APP_DEEP_LINK =
		AppConfig.NODE_ENV === 'production'
			? AppConfig.LIVE_MOBILE_APP_DEEP_LINK
			: AppConfig.LOCAL_MOBILE_APP_DEEP_LINK;
	const BACKEND_DOMAIN =
		AppConfig.NODE_ENV === 'production'
			? AppConfig.LIVE_BACKEND_URL
			: AppConfig.LOCAL_BACKEND_URL;

	if (req.query.obtainAuthUrl) {
		let state = generateRandomCharacters(20);

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
			googleAuthUrl: `${GOOGLE_AUTH_URL}?${new URLSearchParams(
				googleAuthUrlParams
			).toString()}`,
		};

		(req.session as CustomSessionData).state = encryptedState;

		res.status(200).json(response_data);
	} else {
		const stateFromRequest = req.query.state;
		console.log('session: ', req.session);
		const stateFromSession = (req.session as CustomSessionData).state
		console.log('SESSION STATE', stateFromSession);
		console.log('REQUEST STATE', stateFromRequest);

		if (stateFromSession === stateFromRequest) {
			const { code, error } = req.query;

			if (error || !code) {
				const urlParams = { message: error };
				res.redirect(
					`${MOBILE_APP_DEEP_LINK}?error=${JSON.stringify(
						urlParams
					)}`
				);
			}

			const { accessToken, refreshToken } =
				await GoogleAuthService.getTokens(
					code as string,
					`${BACKEND_DOMAIN}/${REDIRECT_URI}`
				);
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

            res.redirect(
				`${MOBILE_APP_DEEP_LINK}?userProfile=${btoa(
					JSON.stringify(userProfile)
				)}`
			);
		} else {
			console.log();
			throw new Error(
				'Unable to complete Google authentication: State parameter mismatch'
			);
		}
	}
};

export const sendOTP = () => {
// Send OTP by two channels: SMS or Email
// Generate OTP
// Save OTP in Redis
// Send OTP to user
}

export const resendOTP = () => {

}

export const verifyOTP = () => {

}