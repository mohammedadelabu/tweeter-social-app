import mongoose from 'mongoose';

export interface IChat extends mongoose.Document {
  members: string;
}

export interface IMessage extends mongoose.Document {
  chatId: string;
  senderId: string;
  text: string;
  deleted: boolean;
  emoji: string;
  media: string;
  audioR: string;
}

export interface IDelete extends mongoose.Document {
  messageId: string;
  deleteId: string;
}
