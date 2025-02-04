import bcrypt from "bcrypt";
import { AuthenticationError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import {UserModel} from "../models/User";
import { IResolvers } from "@graphql-tools/utils";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY as string;

const generateToken = (user: any) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
  };

const resolvers: IResolvers = {
    Query: {
        me: async (_, __, { user }) => {

            if (!user) throw new Error("Noth authenticated");
            return await UserModel.findById(user.id);
        }
    },

    Mutation: {
        googleOAuth: async (_: any, { token }: { token: string }) => {
            try {
                const googleUser = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`).then(res => res.json());
        
                if (!googleUser || googleUser.error) {
                  throw new AuthenticationError("Invalid Google token");
                }
        
                let user = await UserModel.findOne({ email: googleUser.email });
                if (!user) {
                    //if user not found create new one
                  user = new UserModel({
                    username: googleUser.name,
                    email: googleUser.email,
                  });
                  await user.save();
                }
        
                const jwtToken = generateToken(user);
                return { token: jwtToken, user };
              } catch (error) {
                throw new AuthenticationError("OAuth authentication failed");
              }
        
        },

        register: async (_, {email, password}) => {
            
            const existingUser = await UserModel.findOne({email});
            if(existingUser) throw new Error("User already exists");

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({email, password: hashedPassword});
            const savedUser = await newUser.save();

            const token = generateToken(savedUser);
            return {...savedUser.toObject(), id: savedUser.id, token}

        },
        login: async (_, {email, password}) => {

            const user = await UserModel.findOne({email});
            if (!user) throw new Error("User does not exist");

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) throw new Error("Invalid password");

            const token = jwt.sign({id: user.id, email: user.email}, SECRET_KEY, {expiresIn: "1h"});
            return {...user.toObject(), id: user.id, token}

        }
    }
}

export default resolvers;
