import { Follow } from './followModel';
import CreateTweetCln from './tweetModel';
import mongoose from 'mongoose';
import CreateReTweet from './retweetModel';
import Bookmark from './bookmarkModel';
import Like from './likeModel';

/***********************************
 * Method to view tweets and retweets
 * for users a user follows
 ***********************************/
export async function viewTweet(userId: string, pageNo: number, pageSize: number): Promise<void> {
  let following: any = await Follow.find({ followId: userId })
    .skip(pageNo - 1)
    .limit(pageSize);
  let followingId = following.map((val: any) => val.userId);

  let data: any = await CreateTweetCln.find({ userId: { $in: followingId } }).populate(
    'userId noOfLikes commentCount allComment retweetCount bookmarkCount',
  );

  if (data) {
    const tweetsPromises = data.map(async (item: any) => {
      let isLiked = await Like.findOne({ userId: userId, tweetId: item._id });
      let isBookmarked = await Bookmark.findOne({ userId: userId, tweetId: item._id });
      let isRetweeted = await CreateReTweet.findOne({
        reTweeterId: userId,
        tweetId: item._id,
      });
      isLiked = isLiked ? true : false;
      isBookmarked = isBookmarked ? true : false;
      isRetweeted = isRetweeted ? true : false;

      return { isLiked, isBookmarked, isRetweeted };
    });

    const conditionalTweet = await Promise.all(tweetsPromises);

    let followingIdRe = following.map((val: any) => val.userId.toString());
    let retweet: any = await CreateReTweet.find({ reTweeterId: { $in: followingIdRe } }).populate(
      'reTweeterId',
    );

    let output: any = { following: followingId, tweet: data, retweet, conditionalTweet };
    return output;
  }
}
export async function viewTweetofFriend(
  userId: string,
  pageNo: number,
  pageSize: number,
): Promise<void> {
  let data: any = await CreateTweetCln.find({ userId: userId })
    .skip(pageNo - 1)
    .limit(pageSize);

  return data;
}
