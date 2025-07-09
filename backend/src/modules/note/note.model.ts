import { model, Schema } from "mongoose";
import { INote } from "./node.interface";

const NoteSchema: Schema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String },
  },
  { timestamps: true }
);

const Note = model<INote>("Note", NoteSchema);
export default Note;
