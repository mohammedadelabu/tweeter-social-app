import mongoose from 'mongoose';

const reTweetSchema = new mongoose.Schema(
  {
    tweetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'allCreatedTweets',
    },
    reTweeterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// If you retweet other user's tweet, it should show on your timeline  with comments, likes
// This is enable by using virtual fields

reTweetSchema.virtual('noOfLikes', {
  ref: 'Like',
  localField: 'tweetId',
  foreignField: 'tweetId',
  count: true,
});

//count comment

reTweetSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: 'tweetId',
  foreignField: 'tweetId',
  count: true,
});

//name of the person that you reweet his tweet

reTweetSchema.virtual('retweeter_name', {
  ref: 'User',
  localField: 'reTweeterId',
  foreignField: '_id',
});

reTweetSchema.index({ text: 'text' });

const CreateReTweet = mongoose.model('allReTweets', reTweetSchema);

export default CreateReTweet;
