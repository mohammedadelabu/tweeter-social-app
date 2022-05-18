import express, { Request, Response, NextFunction } from 'express';
import Comment from '../models/commentModel';
import catchAsync from '../utils/catchAsync';
import ErrorHandler from '../utils/appError';
import Paginate from '../utils/apiFeatures';

export const commentTweet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { content } = req.body;

  const comment = await Comment.create({ tweetId: id, userId, content });
  if (!comment) return next(new ErrorHandler(400, 'Error occurred'));
  res.status(200).json({ message: 'Comment successful', data: comment });
});

export const getComments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const userId = req.user._id;

  const result = new Paginate(Comment.find({ tweetId: id, userId }), req.query).sort().paginate();
  const comments = await result.query.populate('tweetId').populate('userId');
  if (!comments) return next(new ErrorHandler(400, 'Error occurred'));
  res.status(200).json({ message: 'All comments', number: comments.length, data: comments });
});
