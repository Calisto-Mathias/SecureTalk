import { Schema, Types, Model, model } from "mongoose";
import { MessageContents } from "../types/types.js";

type IMessage = Omit<MessageContents, "owner" | "conversation"> & {
  owner: Schema.Types.ObjectId;
  conversation: Schema.Types.ObjectId;
};

const messageSchema = new Schema<IMessage>({
  text: { type: String, required: true },
  time: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
});

const Message: Model<IMessage> = model<IMessage>("Message", messageSchema);

export { Message, IMessage };
