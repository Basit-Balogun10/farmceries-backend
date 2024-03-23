import { generateToken } from "../../utils"
import {AccountService} from "../../services/account"

export const createAccount = () => {
    // get profile
    const profile = {}

    // get or create account
    let account = AccountService.getAccount(profile)
    
    if (!account) {
        account = AccountService.createAccount(profile)
    }
    
    // generate token
    const token = generateToken(account)

    
        // const resData = {
        // 	account: {
        // 		id: account.id,
        // 		email: account.email,
        // 		firstName: account.firstName,
        // 		lastName: account.lastName,
        // 		phoneNumber: account.phoneNumber,
        // 		type: account.type,
        // 		googlePictureUrl: account.pictureUrl,
        // 	},
        // };

}

export const updateAccount = () => {

}

export const deleteAccount = () => {

}