import { Schema, Model, model } from "mongoose";

import { UserDetails } from "../types/types.js";

interface IUser extends UserDetails {
  conversations?: Array<Schema.Types.ObjectId>;
  verificationStatus: boolean;
  onlineStatus: boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  conversations: {
    type: [
      { type: Schema.Types.ObjectId, required: true, ref: "Conversation" },
    ],
  },
  verificationStatus: { type: Boolean, default: false },
  onlineStatus: { type: Boolean, default: false },
});

const User: Model<IUser> = model<IUser>("User", userSchema);

export { IUser, User };
