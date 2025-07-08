import { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  user: Schema.Types.ObjectId;
}
