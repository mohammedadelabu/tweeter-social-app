import express, { Request, Response, NextFunction, urlencoded, json } from 'express';
import Like from '../models/likeModel';
import catchAsync from '../utils/catchAsync';
import ErrorHandler from '../utils/appError';
import tweet from '../models/tweetModel';

export const likeTweet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const userId = req.user._id;

  const like = await Like.create({ tweetId: id, userId });
  if (!like) return next(new ErrorHandler(500, 'Error occured'));
  res.status(200).json({ message: 'The post has been liked', data: like });
});

export const unlikeTweet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  console.log(req.body);
  const userId = req.user._id;

  const result = await Like.deleteOne({ tweetId: id, userId });
  console.log(result);
  if (!result) return next(new ErrorHandler(500, 'Error occured'));
  res.status(200).json('The post has been disliked');
});

export const getLikes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const userId = req.user._id;

  const likes = await Like.find({ tweetId: id, userId }).populate('tweetId').populate('userId');
  if (!likes) return next(new ErrorHandler(500, 'Error occured'));
  res.status(200).json({ message: 'All likes', data: likes, number: likes.length });
});

export const getLikesByUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const likes = await Like.find({ tweetId: id }).populate('tweetId').populate('userId');
    if (!likes) return next(new ErrorHandler(500, 'Error occured'));
    res.status(200).json({ message: 'Tweets Liked By User', data: likes, number: likes.length });
  },
);
