import express, { Request, Response, NextFunction } from 'express';
import {
  createFollowModel,
  getFollowersModel,
  getFollowingModel,
  suggestFollowersModel,
  unFollowModel,
} from '../models/followModel';
import catchAsync from '../utils/catchAsync';
import ErrorHandler from '../utils/appError';
import Responses from '../utils/response';
import {
  findHashtagTweet,
  getTrendingHashtagwithTweet,
  getTrendingHashtagWithTweetCount,
} from '../models/trendingModel';

const responseClass = new Responses();

/****************************************************************************
 *                                                                           *
 *               Creation of trending Hashtags                               *
 *                                                                           *
/*****************************************************************************/

/***********************************
 * get trending harshtag
 ***********************************/

export const viewTrendsController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let data: any = await getTrendingHashtagwithTweet();
      responseClass.setSuccess(200, 'success', data);
      return responseClass.send(res);
    } catch (error) {
      return next(new ErrorHandler(401, 'Already following user'));
    }
  },
);
export const trendsTweetCountController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let data: any = await getTrendingHashtagWithTweetCount();
      responseClass.setSuccess(200, 'success', data);
      return responseClass.send(res);
    } catch (error) {
      return next(new ErrorHandler(401, 'Already following user'));
    }
  },
);
export const hashtagTweetController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { hashtag, pageNo, pageSize }: any = req.query;
      pageNo = parseInt(pageNo);
      let data: any = await findHashtagTweet(hashtag, pageNo, pageSize);
      responseClass.setSuccess(200, 'success', data);
      return responseClass.send(res);
    } catch (error) {
      return next(new ErrorHandler(401, 'Error occurred'));
    }
  },
);
