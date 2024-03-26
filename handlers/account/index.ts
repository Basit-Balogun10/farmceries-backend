import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import AppConfig from '../../config/index.js';
import Account from '../../models/account.js';
import { AccountService } from '../../services/account.js';
import { generateToken } from '../../utils/generators.js';

export const createAccount = asyncHandler(async (req: Request, res: Response) => {
  // get user profile
  const { userProfile } = req.body;

  const MOBILE_APP_DEEP_LINK = AppConfig.NODE_ENV === 'production' ? AppConfig.LIVE_MOBILE_APP_DEEP_LINK : AppConfig.LOCAL_MOBILE_APP_DEEP_LINK;

  if (!userProfile) {
    res.status(400).json({ error: 'Invalid Request. Please provide userProfile' });
  }

  try {
    const account = await AccountService.getAccountByEmail(userProfile.email);

    if (account) {
      res.status(400).json({ error: 'Account with email already exists' });
    } else {
      const { newAccount, newUser } = await AccountService.createAccount(userProfile);

      // generate token
      const token = generateToken(account);

      const newProfile = {
        account: {
          id: newAccount.id,
          ...userProfile,
        },
        token,
        newUser,
      };

      res.redirect(`${MOBILE_APP_DEEP_LINK}?newProfile=${btoa(JSON.stringify(newProfile))}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create account' });
  }
});

export const updateAccount = asyncHandler(async (req: Request, res: Response) => {
  const { accountId } = req.params;
  const { updatedFields } = req.body;

  if (!accountId || !updatedFields) {
    res.status(400).json({ error: 'Invalid Request. Please provide account ID and the updated fields' });
  }

  try {
    const account = await Account.findById(accountId);

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
    }

    const updatedAccount = await AccountService.updateAccount(accountId, updatedFields);

    res.status(200).json(updatedAccount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update account' });
  }
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const { accountId } = req.params;

  // Get the account
  const account = await Account.findById(accountId);

  if (!account) {
    res.status(404).send({ success: false, message: 'Account not found' });
    return;
  }

  // Delete the account
  AccountService.deleteAccount(account);
});
