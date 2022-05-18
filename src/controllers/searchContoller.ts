import catchAsync from './../utils/catchAsync';
import express, { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/appError';
import QueryApi from '../utils/apiFeatures';
import CreateTweetCln from '../models/tweetModel';
import Responses from '../utils/response';
import CreateReTweet from '../models/retweetModel';
import User from '../models/userModels';

const resData = new Responses();

export const searchTweets = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const searchString = req.query.search as string;

  if (!req.query.search) {
    return next(new ErrorHandler(400, 'Query must be provided'));
  }
  const usersQuery = new QueryApi(
    CreateTweetCln.find({
      messageBody: { $regex: `${searchString}` },
    }),
    req.query,
  )
    .sort()
    .paginate();

  let tweets = await usersQuery.query;
  tweets = tweets.populate('userId');
  resData.setSuccess(200, 'successfully searched for tweets and retweets', { tweets });
  return resData.send(res);
});

export const searchUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const searchString = req.query.search as string;
  if (!req.query.search) {
    return next(new ErrorHandler(401, 'Query must be provided'));
  }

  const usersQuery = new QueryApi(
    User.find({
      $or: [
        { firstName: { $regex: `${searchString}` } },
        { lastName: { $regex: `${searchString}` } },
      ],
    }),
    req.query,
  )
    .sort()
    .paginate();

  const users = await usersQuery.query;

  resData.setSuccess(200, 'successfully searched for users', { users });
  return resData.send(res);
});

export const searchLatestTweet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let searchString = req.query.search as string;

    if (!req.query.search) {
      return next(new ErrorHandler(400, 'Query must be provided'));
    }

    const tweets = await CreateTweetCln.find({
      messageBody: { $regex: `${searchString}` },
    })
      .sort({ createdAt: -1 })
      .populate('userId');
    console.log(tweets);

    resData.setSuccess(200, 'successfully searched for latest tweets', { tweets });
    return resData.send(res);
  },
);

export const searchThroughMedia = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const searchString = req.query.search as string;

    if (!req.query.search) {
      return next(new ErrorHandler(400, 'Query must be provided'));
    }
    const mediaTweet = await CreateTweetCln.find({
      tweetImage: /.+/i,
      messageBody: { $regex: `${searchString}` },
    })
      .sort({
        updatedAt: -1,
      })
      .populate('userId');
    if (!mediaTweet) return next(new ErrorHandler(400, 'Error occurred'));
    res.status(200).json({ message: 'Media tweets', data: mediaTweet });
  },
);
