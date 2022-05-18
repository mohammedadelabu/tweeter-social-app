import express, { NextFunction, Response, Request } from 'express';
import Joi from 'joi';

export const viewtwitterPolicy = (req: Request, res: Response, next: NextFunction) => {
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
export const friendtweetPolicy = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    pageNo: Joi.number().min(1).required(),
    pageSize: Joi.number().min(5).required(),
    id: Joi.string().min(8).max(40).required(),
  });
  let pageNo = req.query.pageNo;
  let pageSize = req.query.pageSize;
  let id = req.params.id;
  const { error }: any = schema.validate({ pageNo, pageSize, id });
  if (error) {
    return res.status(500).json({ message: error.details[0].message.split('"').join('') });
  }
  return next();
};
