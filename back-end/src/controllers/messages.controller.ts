import { Request, Response } from "express";
import { Types } from "mongoose";

import { ErrorResponse, MessageContents } from "../types/types.js";
import { messageSchema } from "../types/schemas.js";
import {
  ERROR_IN_DATABASE,
  INVALID_REQUEST_BODY,
  NO_SUCH_RESOURCE,
} from "../utility/constants.js";
import { Message } from "../models/messages.model.js";

const createMessage = async (
  req: Request<{}, MessageContents | ErrorResponse, MessageContents>,
  res: Response<MessageContents | ErrorResponse>
) => {
  let message;
  try {
    message = messageSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: INVALID_REQUEST_BODY,
    });
  }

  const newMessage = new Message({
    text: message.text,
    time: message.time,
    owner: new Types.ObjectId(message.owner),
    conversation: new Types.ObjectId(message.conversation),
  });

  try {
    await newMessage.save();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: ERROR_IN_DATABASE,
    });
  }

  return res.status(201).json({
    text: message.text,
    time: message.time,
    owner: message.owner,
    conversation: message.conversation,
  });
};

const getMessage = async (
  req: Request<{ id: string }, MessageContents | ErrorResponse, {}>,
  res: Response<MessageContents | ErrorResponse>
) => {
  const id: string = req.params.id;

  let message;
  try {
    message = await Message.findById(id);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: ERROR_IN_DATABASE,
    });
  }

  if (!message) {
    return res.status(400).json({
      status: 400,
      message: NO_SUCH_RESOURCE,
    });
  }

  return res.status(200).json({
    text: message.text,
    time: message.time,
    owner: message.owner.toString(),
    conversation: message.conversation.toString(),
  });
};

export { createMessage, getMessage };
