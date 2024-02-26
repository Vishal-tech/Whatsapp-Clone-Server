import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  uid: String,
  name: String,
  email: String,
  friends: [String],
  lastSeen: Date,
  pendingRequests: [String],
  sentRequests: [String],
});

export const users = mongoose.model("users", userSchema);
