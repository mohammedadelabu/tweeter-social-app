import express, { Request, Response, NextFunction } from 'express';
import CreateTweetCln from '../models/tweetModel';
import catchAsync from '../utils/catchAsync';
import ErrorHandler from '../utils/appError';
import Paginate from '../utils/apiFeatures';

export const getLatestTweet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const result = new Paginate(CreateTweetCln.find(), req.query).sort().paginate();
    const tweets = await result.query.populate('_id').populate('userId');
    if (!tweets) return next(new ErrorHandler(400, 'Error occurred'));
    res.status(200).json({ message: 'Latest tweets', number: tweets.length, data: tweets });
  },
);
//const tweets = await CreateTweetCln.find()

export const getMediaTweet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let pageNo = req.query.pageNo as string;
  let pageSize = req.query.pageSize as string;
  const userId = req.user._id;
  const result = new Paginate(CreateTweetCln.find({ tweetImage: /.+/i }), req.query)
    .sort()
    .paginate();
  const mediaTweet = await result.query.populate('_id').populate('userId');
  if (!mediaTweet) return next(new ErrorHandler(400, 'Error occurred'));
  res.status(200).json({ message: 'Media tweets', number: mediaTweet.length, data: mediaTweet });
});
