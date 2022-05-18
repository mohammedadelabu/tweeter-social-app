import mongoose from 'mongoose';

/***********************************
 * tweet content interface
 ***********************************/

interface tweetIn {
  messageBody: string;
  tweetImage: string;
  userId: any;
  whoCanReply: string;
  cloudinary_id: string;
  hashtag: any;
}

// /***********************************
//  * sub schema for who can replay
//  ***********************************/

/***********************************
 * let whoCanReply = mongoose.model
 ***********************************/

const tweetSchema = new mongoose.Schema<tweetIn>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    messageBody: {
      type: String,
      default: '',
    },
    tweetImage: {
      type: String,
    },
    whoCanReply: {
      type: String,
      default: 'Everyone',
    },
    cloudinary_id: {
      type: String,
    },
    hashtag: [String],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// count likes
tweetSchema.index({ tweetImage: 'text', messageBody: 'text' });

tweetSchema.virtual('noOfLikes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'tweetId',
  count: true,
});

//count comment

tweetSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'tweetId',
  count: true,
});

//count the number of retweet a particular tweet has

tweetSchema.virtual('retweetCount', {
  ref: 'allReTweets',
  localField: '_id',
  foreignField: 'tweetId',
  count: true,
});

//return comments

tweetSchema.virtual('allComment', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'tweetId',
});

//name of person that created the tweet

tweetSchema.virtual('createdBy', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
});

tweetSchema.virtual('bookmarkCount', {
  ref: 'Bookmark',
  localField: '_id',
  foreignField: 'tweetId',
  count: true,
});

const CreateTweetCln = mongoose.model('allCreatedTweets', tweetSchema);

export default CreateTweetCln;
