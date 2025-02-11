import { ApolloServer } from "@apollo/server"; 
import { expressMiddleware } from "@apollo/server/express4"; 
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import { verifyToken } from "../helpers/auth";
import connectDb from "../helpers/connectDb";

dotenv.config();

const app = express();

app.use(cors()); 
app.use(bodyParser.json()); 

const SECRET_KEY = process.env.SECRET_KEY as string;


connectDb();
let server: ApolloServer | null = null;



export default async function startServer() {
  // Start the Apollo Server, set Middleware
  if (!server) {

  server = new ApolloServer({
    typeDefs,
    resolvers
  });
  
  await server.start(); 
}
 if(app) {
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
}

export async function startTestServer() {
  // Start the Apollo Server, set Middleware for testing

    if (!server) {
          server = new ApolloServer({
            typeDefs,
            resolvers,
          });
          await server.start();
          console.log("Server started")
    }

    if (!app) {
        const app = express();
        app.use(cors());
        app.use(bodyParser.json());
        app.use("/graphql", expressMiddleware(server));
    }
    return app;
  }

  export async function stopTestServer() {
    if (server) {
      try {
        await server.stop();
      } catch (error) {
        console.error("Error stopping Apollo Server:", error);
      }
      server = null;
    }
  }
  
  

startServer();
