import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    tweetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'allCreatedTweets',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

//virtual field for book mark count

bookmarkSchema.virtual('noOfLikes', {
  ref: 'Like',
  localField: 'userId',
  foreignField: 'userId',
  count: true,
});

//count comment

bookmarkSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: 'userId',
  foreignField: 'userId',
  count: true,
});

//count the number of retweet a particular tweet has

bookmarkSchema.virtual('retweetCount', {
  ref: 'allReTweets',
  localField: 'userId',
  foreignField: 'reTweeterId',
  count: true,
});

//return comments

bookmarkSchema.virtual('allComment', {
  ref: 'Comment',
  localField: 'userId',
  foreignField: 'userId',
});

bookmarkSchema.virtual('bookmarkCount', {
  ref: 'Bookmark',
  localField: 'userId',
  foreignField: 'userId',
  count: true,
});

//name of person that created the tweet

bookmarkSchema.virtual('createdBy', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
