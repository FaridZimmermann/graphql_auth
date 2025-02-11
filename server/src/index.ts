import { ApolloServer } from "@apollo/server"; 
import { expressMiddleware } from "@apollo/server/express4"; 
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import { verifyToken } from "../helpers/auth";
import connectDb from "../helpers/connectDb";

dotenv.config();

let app = express();

app.use(cors()); 
app.use(bodyParser.json()); 

const SECRET_KEY = process.env.SECRET_KEY as string;


connectDb();
let server: ApolloServer | null = null;



async function startServer() {
  // Start the Apollo Server, set Middleware

  server = new ApolloServer({
    typeDefs,
    resolvers
  });
  
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
