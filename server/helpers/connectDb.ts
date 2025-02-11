import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

export default function connectDb() {
    //Connects to mongoose database using the MONGO_URI from the .env file
    mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));
}

export function disconnectDb() {
    // Disconnects from the mongoose database
    mongoose.connection.close();
}