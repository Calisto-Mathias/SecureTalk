import { Router, Request, Response } from "express";
import { Conversation, ErrorResponse } from "../types/types.js";
import { Conversation as ConversationModel } from "../models/conversations.model.js";
import { Schema, Types } from "mongoose";
import { ERROR_IN_DATABASE, NO_SUCH_RESOURCE } from "../utility/constants.js";
import { User } from "../models/users.model.js";

const router: Router = Router();

// POST /create/
const createConversation = async (
  req: Request<{}, Conversation | ErrorResponse, Conversation>,
  res: Response
) => {
  console.log("Entered");
  const conversationDetails: Conversation = req.body;

  const owners: Types.ObjectId[] = [];
  req.body.owners.map((id: string) => {
    const objectId = new Types.ObjectId(id);
    owners.push(objectId);
  });

  const messages: Types.ObjectId[] = [];
  req.body.messages.map((id: string) => {
    const objectId = new Types.ObjectId(id);
    messages.push(objectId);
  });

  const newConversation = new ConversationModel({
    name: conversationDetails.name,
    owners: owners,
    messages: messages,
  });

  req.body.owners.map(async (item: string) => {
    const user = await User.findById(item);
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: NO_SUCH_RESOURCE,
      });
    }
    user.conversations.push(new Types.ObjectId(item));
    await user.save();
  });

  try {
    await newConversation.save();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: ERROR_IN_DATABASE,
    });
  }

  return res
    .status(201)
    .json({ ...conversationDetails, id: newConversation._id });
};

// GET /:id
const getConversation = async (req: Request<{ id: string }>, res: Response) => {
  const id: string = req.params.id;

  let conversation;
  try {
    conversation = await ConversationModel.findById(id);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: ERROR_IN_DATABASE,
    });
  }

  if (!conversation) {
    return res.status(500).json({
      status: 404,
      message: NO_SUCH_RESOURCE,
    });
  }

  return res.status(500).json(conversation);
};

export { createConversation, getConversation };
