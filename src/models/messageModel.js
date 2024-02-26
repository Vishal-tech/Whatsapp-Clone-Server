import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  sender: String,
  receiver: String,
  timestamp: String,
  received: Boolean,
});

export const messages = mongoose.model("messages", messageSchema);
