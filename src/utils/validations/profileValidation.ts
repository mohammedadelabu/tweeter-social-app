import Joi from 'joi';
// import { ISign } from '../interfaces/userInterface';

export const profileValidator = (profile: any) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(20),
    lastName: Joi.string().min(2).max(20),
    bioData: Joi.string(),
  });
  return schema.validate(profile);
};

export const profilePicValidator = (profile: any) => {
  const schema = Joi.object({
    profilePic: Joi.string(),
  });
  return schema.validate(profile);
};
