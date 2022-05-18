import { NextFunction, Response, Request } from 'express';
import Joi from 'joi';

export const hashtagTweetPolicy = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    hashtag: Joi.string().min(2).regex(/^#/).required(),
    pageNo: Joi.number().min(1).required(),
    pageSize: Joi.number().min(4).required(),
  });
  const { hashtag, pageNo, pageSize } = req.query;
  const { error }: any = schema.validate({ hashtag, pageNo, pageSize });
  if (error) {
    return res.status(500).json({ message: error.details[0].message.split('"').join('') });
  }
  return next();
};
