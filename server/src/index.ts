import { ApolloServer } from "@apollo/server"; // Apollo Server 4
import { expressMiddleware } from "@apollo/server/express4"; // Express middleware for Apollo 4
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import { verifyToken } from "../helpers/auth";

dotenv.config();

const app = express();

app.use(cors()); 
app.use(bodyParser.json()); 

const MONGO_URI = process.env.MONGO_URI as string;
const SECRET_KEY = process.env.SECRET_KEY as string;


mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


const server = new ApolloServer({
  typeDefs,
  resolvers
});

async function startServer() {
  await server.start(); 

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || "";
        const user = verifyToken(token, SECRET_KEY as string);
        return { user };
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
}
  
  

startServer();
