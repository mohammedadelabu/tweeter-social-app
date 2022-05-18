import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { ISign } from '../utils/interfaces/userInterface';

const UserSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    profilePic: String,
    bioData: String,
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide valid email',
      },
    },
    password: {
      type: String,
      select: false,
    },
    isActive: {
      type: Boolean,
      select: false,
      default: false,
    },

    provider: {
      type: String,
      enum: ['local', 'facebook', 'google'],
      default: 'local',
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordExpires: {
      type: String,
    },
    passwordResetTokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ text: 'text' });

UserSchema.pre<ISign>('save', async function (next) {
  const user = this;
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

UserSchema.methods.confirmPassword = async function (userPassword: string) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

export default model<ISign>('User', UserSchema);
