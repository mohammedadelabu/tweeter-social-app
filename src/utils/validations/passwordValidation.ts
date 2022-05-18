import Joi from 'joi';

interface Password {
  previousPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface ResetPassword {
  password: string;
  confirmNewPassword: string;
}
const validateChangePassword = (user: Password) => {
  const schema = Joi.object({
    previousPassword: Joi.string()
      .min(6)
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .error(() => new Error('previous password is required')),
    newPassword: Joi.string()
      .min(6)
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .error(() => new Error('new password is required')),
    confirmNewPassword: Joi.string()
      .required()
      .valid(Joi.ref('newPassword'))
      .error(() => new Error('passwords do not match')),
  });

  return schema.validate(user);
};

const validateResetPassword = (user: ResetPassword) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(6)
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .error(() => new Error('new password is required')),
    passwordConfirm: Joi.string()
      .required()
      .valid(Joi.ref('password'))
      .error(() => new Error('passwords do not match')),
  });

  return schema.validate(user);
};

export default { validateChangePassword, validateResetPassword };
