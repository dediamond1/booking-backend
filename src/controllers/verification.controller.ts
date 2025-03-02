import { Request, Response } from 'express';
import User from '../models/user.model';
import { getErrorMessage } from '../utils/error'; // Assuming you have a utils/error.ts file

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      res.status(400).send({ message: 'Verification token is missing or invalid' });
      return;
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      res.status(404).send({ message: 'Invalid verification token' });
      return;
    }

    if (user.isVerified) {
      res.status(400).send({ message: 'Email address already verified' });
      return;
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Clear the verification token after successful verification
    await user.save();

    res.send({ message: 'Email address verified successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error verifying email', error: getErrorMessage(error) });
  }
};
