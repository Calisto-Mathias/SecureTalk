import { Model, Schema, Types, model } from "mongoose";
import { Conversation } from "../types/types.js";

type IConversation = {
  name: string;
  owners: Array<Types.ObjectId>;
  messages: Array<Types.ObjectId>;
};

const conversationSchema = new Schema<IConversation>({
  owners: {
    type: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
  },
  name: { type: String, required: true },
  messages: {
    type: [{ type: Schema.Types.ObjectId, required: true, ref: "Message" }],
    default: [],
  },
});

const Conversation: Model<IConversation> = model<IConversation>(
  "Conversation",
  conversationSchema
);

export { Conversation, IConversation };
