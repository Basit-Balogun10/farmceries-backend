import { Request, Response } from "express";
import AppConfig from "../../config/index.js";
import { GoogleAuthService } from '../../services/auth.js';
import {
	generateToken,
	generateRandomCharacters,
	encryptData,
	decryptState,
} from '../../utils/index.js';


export const authenticateWithGoogle = async (req: Request, res: Response) => {
	const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
	const GOOGLE_AUTH_SCOPE = [
		'https://www.googleapis.com/auth/userinfo.email',
		'https://www.googleapis.com/auth/userinfo.profile',
	];
	const REDIRECT_URI = 'api/v1/auth/google/';
	const BASE_FRONTEND_URL =
		AppConfig.NODE_ENV === 'production'
			? AppConfig.APP_LIVE_URL
			: AppConfig.BASE_FRONTEND_URL;
	const BACKEND_DOMAIN =
		AppConfig.NODE_ENV === 'production'
			? AppConfig.APP_LIVE_URL
			: AppConfig.BASE_BACKEND_URL;

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
		const cookieOptions = {
			maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
			secure: true,
			httpOnly: true,
			sameSite: 'none' as const,
		};
		const response_data = {
			googleAuthUrl: `${GOOGLE_AUTH_URL}?${new URLSearchParams(
				googleAuthUrlParams
			).toString()}`,
		};

		res.cookie(
			AppConfig.OAUTH_STATE_PARAM_NAME,
			encryptedState,
			cookieOptions
		);
		res.status(200).json(response_data);
	} else {
		const stateFromRequest = req.query.state;
		console.log('cookies: ', req.cookies);
		if (req.cookies) {
			const stateFromCookies = req.cookies[AppConfig.OAUTH_STATE_PARAM_NAME];
			console.log('COOKIE STATE', stateFromCookies);
		}
		console.log('REQUEST STATE', stateFromRequest);

		// if (stateFromCookies === stateFromRequest) {
		if (true) {
			// const { isSignup } = decryptState(stateFromCookies);
			// const { isSignup } = decryptState(stateFromRequest as string);
			// console.log('IS SIGNUP', isSignup);
			const { code, error } = req.query;

			if (error || !code) {
				const urlParams = { message: error };
				res.redirect(
					`exp://192.168.0.3:8081/--/?error=${JSON.stringify(
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

			const userProfileData = {
				email: userData.email,
				firstName,
				googlePictureUrl: userData.picture || '',
				googleRefreshToken: refreshToken,
				isMentor: false,
				lastName,
				password: '',
			};

			// let user = await UserService.getUser(userData.email);

			// if (!user) {
			// 	user = await UserService.createUser(userProfileData);
			// }
			// const token = generateToken(user);

			// const resData = {
			// 	user: {
			// 		email: user.email,
			// 		firstName: user.firstName,
			// 		id: user.id,
			// 		isMentor: user.isMentor,
			// 		lastName: user.lastName,
			// 		googlePictureUrl: user.pictureUrl,
			// 	},
			// };

			const cookieOptions = {
				maxAge: 7 * 24 * 60 * 60 * 1000, // 30 minutes in milliseconds
				secure: true,
				httpOnly: true,
				sameSite: 'lax' as const,
			};

			res.cookie(AppConfig.AUTH_COOKIE_NAME, 54321, cookieOptions);
			// res.redirect(
			// 	`${BASE_FRONTEND_URL}/mentors?user=${btoa(
			// 		JSON.stringify(resData)
			// 	)}`
			// );
            res.redirect(
				`exp://192.168.0.3:8081/--/?token=${54321}&user=${btoa(
					JSON.stringify(userProfileData)
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

}

export const resendOTP = () => {

}

export const verifyOTP = () => {

}