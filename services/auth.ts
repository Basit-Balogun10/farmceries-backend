import axios from 'axios'
import AppConfig from '../config/index.js';

export class GoogleAuthService {
	static GOOGLE_ID_TOKEN_INFO_URL =
		'https://www.googleapis.com/oauth2/v3/tokeninfo'
	static GOOGLE_ACCESS_TOKEN_OBTAIN_URL =
		'https://oauth2.googleapis.com/token'
	static GOOGLE_USER_INFO_URL =
		'https://www.googleapis.com/oauth2/v3/userinfo'

	static async validateAccessToken(accessToken: string) {
		await axios
			.get(`${this.GOOGLE_ID_TOKEN_INFO_URL}?access_token=${accessToken}`)
			.then(res => {
				if (res.status !== 200) {
					throw new Error('id_token is invalid')
				}

				const audience = res.data['aud']
				if (audience !== AppConfig.GOOGLE_OAUTH2_CLIENT_ID) {
					throw new Error('Invalid audience')
				}
			})
			.catch(err => {
				console.log('LINE 27', err, 'LINE 27')
				throw new Error(err)
			})
	}

	static async getTokens(code: string, redirectUri: string) {
		const request_data = {
			code: code,
			client_id: AppConfig.GOOGLE_OAUTH2_CLIENT_ID,
			client_secret: AppConfig.GOOGLE_OAUTH2_CLIENT_SECRET,
			redirect_uri: redirectUri,
			grant_type: 'authorization_code',
		}
		console.log(request_data)

		let accessToken = ''
		let refreshToken = ''
		console.log("IT'S IN HERE")

		await axios
			.post(this.GOOGLE_ACCESS_TOKEN_OBTAIN_URL, request_data)
			.then(res => {
				if (res.status !== 200) {
					throw new Error('Failed to obtain access token from Google')
				}
				console.log('TOKEN DATA', res.data)

				accessToken = res.data['access_token']
				refreshToken = res.data['refresh_token']
			})
			.catch(err => {
				console.log('LINE 60', err)
				throw new Error(err)
			})

		console.log('ACCESS & REFRESH', accessToken, refreshToken)

		return { accessToken, refreshToken }
	}

	static async getUserInfo(accessToken: string) {
		let userInfo: { [key: string]: any} = {}

		await axios
			.get(`${this.GOOGLE_USER_INFO_URL}?access_token=${accessToken}`)
			.then(res => {
				if (res.status !== 200) {
					throw new Error('Failed to obtain user info from Google')
				}

				userInfo = res.data
				console.log('USER INFO', userInfo, res.data)
			})
			.catch(err => {
				throw new Error(err)
			})

		return userInfo
	}
}
