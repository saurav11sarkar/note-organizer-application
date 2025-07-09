import { Document, Schema } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  category: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
