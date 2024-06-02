import mongoose from "mongoose";

const useConnection = async () => {
  const mongoURL: string = process.env.MONGODB_URL!;
  try {
    await mongoose.connect(mongoURL);
  } catch (err) {
    console.log(
      `There was an issue connecting with the Mongo DB Database: ${err}`
    );
    throw new Error("MongoDB Error");
  }
};

export default useConnection;
