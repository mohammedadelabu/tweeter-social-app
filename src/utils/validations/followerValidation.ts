import express, { NextFunction, Response, Request } from 'express';
import Joi from 'joi';

export const paginationPolicy = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    // userId: Joi.string().min(24).max(24).required(),
    pageNo: Joi.number().min(1).required(),
    pageSize: Joi.number().min(5).required(),
    //   pageno: Joi.number().max(255).required(),
  });
  // const { userId} = req.params;
  let pageNo = req.query.pageNo;
  let pageSize = req.query.pageSize;
  const { error }: any = schema.validate({ pageNo, pageSize });
  if (error) {
    return res.status(500).json({ message: error.details[0].message.split('"').join('') });
  }
  return next();
};
export const postFollowerPolicy = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    userId: Joi.string().min(24).max(24).required(),
    //   pageno: Joi.number().max(255).required(),
  });
  const { userId } = req.body;
  const { error }: any = schema.validate({ userId });
  if (error) {
    return res.status(500).json({ message: error.details[0].message.split('"').join('') });
  }
  return next();
};

export const unFollowPolicy = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    userId: Joi.string().min(24).max(24).required(),
    // followId: Joi.string().min(24).max(24).required(),
    //   pageno: Joi.number().max(255).required(),
  });
  const { userId } = req.body;
  const { error }: any = schema.validate({ userId });
  if (error) {
    return res.status(500).json({ message: error.details[0].message.split('"').join('') });
  }
  return next();
};
