import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import AppConfig from '../config/index.js';

export const generateToken = (user: any) => {
	const issuedAt = new Date().getTime()

	const tokenPayload = {
		id: user._id,
		email: user.email,
		iat: issuedAt,
	}

	return jwt.sign(tokenPayload, AppConfig.JWT_SECRET, {
		expiresIn: '7d',
	});
}

export const generateRandomCharacters = (length: number) => {
	return crypto.randomBytes(length).toString('hex')
}
