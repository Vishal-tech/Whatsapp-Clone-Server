import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  const mongoURI = process.env.mongoURI;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    await mongoose.connect(mongoURI, options);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if unable to connect
  }
};
