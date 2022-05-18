import { Request, Response, NextFunction, response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModels';
import catchAsync from '../utils/catchAsync';
import ErrorHandler from '../utils/appError';
import sendEmail from '../utils/email';
import crypto from 'crypto';

import validators from '../utils/validations/passwordValidation';
import { ISign } from '../utils/interfaces/userInterface';
import Responses from '../utils/response';

const resData = new Responses();
interface IUser {
  _id?: string;
  email?: string;
  password: string | undefined;
  confirmNewPassword?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
}

const { validateChangePassword, validateResetPassword } = validators;

const generateToken = (id: string): string => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: '1d',
  });

  return token;
};

const sendToken = (res: Response, statusCode: number, user: IUser) => {
  const token = generateToken(user._id as string);

  const expires = new Date(Date.now() + 10 * 24 * 60 * 1000);

  const options: any = {
    expires,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.cookie('jwt', token, options);
  user.password = undefined;

  return res.status(statusCode).json({
    status: 'success',
    user,
    token: {
      token,
      expires,
    },
  });
  // resData.setSuccess(200, 'success', {user, token: {token, expires}})
  // resData.send(res)
};

const createPasswordResetToken = () => {
  const resetToken: any = crypto.randomBytes(32).toString('hex');

  const hashedToken: any = crypto.createHash('sha256').update(resetToken).digest('hex');

  return { resetToken, hashedToken };
};

const validatePassword = async (newPassword: string, existsPassword: string): Promise<boolean> => {
  return await bcrypt.compare(newPassword, existsPassword);
};

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user: any = await User.findById(req.user!._id).select('+password');

  if (!user) return next(new ErrorHandler(404, 'Sorry, user does not exist'));

  const { error } = validateChangePassword(req.body);
  if (error) {
    return next(new ErrorHandler(400, `${error.message}`));
  }

  const { newPassword, confirmNewPassword, previousPassword } = req.body;

  const isPreviousPasswordCorrect = await validatePassword(previousPassword, user.password);
  console.log(isPreviousPasswordCorrect);

  if (!isPreviousPasswordCorrect) return next(new ErrorHandler(400, 'incorrect'));

  user.password = newPassword;
  user.confirmNewPassword = confirmNewPassword;

  await user.save();

  sendToken(res, 200, user);
});

// forgot password
const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user: any = await User.findOne({ email: req.body!.email });
  if (!user) {
    return next(new ErrorHandler(404, 'user not found'));
  }

  const passwordExpires = Date.now() + 20 * 60 * 1000;

  const { resetToken, hashedToken } = createPasswordResetToken();

  await User.findByIdAndUpdate(
    user._id,
    {
      passwordExpires,
      passwordResetToken: hashedToken,
    },
    {
      runValidators: true,
      new: true,
    },
  );

  const url = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;

  try {
    if (process.env.NODE_ENV === 'test') {
      return res.status(200).json({
        status: 'success',
        message: 'check your mail to reset your password',
        resetToken,
      });
    }
    await sendEmail(
      req.body!.email,
      'Reset Password',
      `Forgot your password?, follow this link ${url} to reset your password
    Kindly ignore this email if you did not request for a password reset`,
    );

    // return res.status(200).json({
    //   status: 'success',
    //   message: 'check your email to reset your password',
    // });

    resData.setSuccess(200, 'check your email to reset your password', { url });
    return resData.send(res);
  } catch (e) {
    user.passwordExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save({ validateBeforeSave: false });
    console.log(e);

    return next(
      new ErrorHandler(500, 'There was an error sending a password reset email, please try again'),
    );
  }
});

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;

  const { error } = validateResetPassword(req.body);

  if (error) {
    return next(new ErrorHandler(400, `${error.message}`));
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user: any = await User.findOne({
    passwordResetToken: hashedToken,
    passwordExpires: { $gt: Date.now() },
  });

  if (!user) return next(new ErrorHandler(400, 'token expired or invalid'));

  const { password, passwordConfirm } = req.body;

  user.password = password;
  user.confirmNewPassword = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordExpires = undefined;

  await user.save();

  sendToken(res, 200, user);
});

export default { resetPassword, forgotPassword, changePassword };
