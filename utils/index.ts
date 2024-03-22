export { generateToken, generateRandomCharacters } from './generators.js'
export { encryptData, decryptData, decryptState } from './cryptography.js'

// export const throwErrorIfEmpty = (field: { name: string}, res) => {
// 	if (!field.name) {
// 		res.status(400)
// 		throw new Error(`${field.label} is required`)
// 	}
// }