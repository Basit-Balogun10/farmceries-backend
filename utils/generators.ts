import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import AppConfig from '../config/index.js';

export const generateToken = (account: any) => {
	const issuedAt = new Date().getTime()

	const tokenPayload = {
		id: account._id,
		email: account.email,
		phoneNumber: account.phoneNumber,
		iat: issuedAt,
	}

	return jwt.sign(tokenPayload, AppConfig.JWT_SECRET, {
		expiresIn: '7d',
	});
}

export const generateRandomCharacters = (length: number) => {
	return crypto.randomBytes(length).toString('hex')
}
