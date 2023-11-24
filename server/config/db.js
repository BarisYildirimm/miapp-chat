import mongoose from "mongoose";
import colors from "colors";

const mongoDbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected : ${conn.connection.host}`.bgGreen);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default mongoDbConnection;
