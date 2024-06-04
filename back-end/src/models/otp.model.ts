import { Schema, model, Model, Types } from "mongoose";

type IOtp = {
  userId: Types.ObjectId;
  otp: string;
  createdAt: string;
  expiresAt: string;
};

const otpSchema = new Schema<IOtp>({
  userId: Schema.Types.ObjectId,
  otp: String,
  createdAt: String,
  expiresAt: String,
});

const OTP: Model<IOtp> = model<IOtp>("Otp", otpSchema);

export default OTP;
