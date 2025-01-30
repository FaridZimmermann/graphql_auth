import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
import dotenv from "dotenv";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import { verifyToken } from "./utils/auth";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;
const SECRET_KEY = process.env.SECRET_KEY as string;


mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


  const server = new ApolloServer({ typeDefs, resolvers , 
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      const user = verifyToken(token, SECRET_KEY);
      return {user};
  }});

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);

  });