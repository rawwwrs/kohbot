import mongoose, { Document, Schema } from "mongoose";

export interface CommandDoc extends Document {
  name: string;
  response: string;
}

export const CommandSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  response: { type: String, required: true },
});

export default mongoose.model<CommandDoc>("Command", CommandSchema);
