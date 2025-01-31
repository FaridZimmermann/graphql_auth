import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {UserModel} from "../models/User";
import { IResolvers } from "@graphql-tools/utils";

const SECRET_KEY = process.env.SECRET_KEY as string;



const resolvers: IResolvers = {
    Query: {
        me: async (_, __, { user }) => {

            if (!user) throw new Error("Noth authenticated");
            return await UserModel.findById(user.id);
        }
    },

    Mutation: {
        register: async (_, {email, password}) => {
            
            const existingUser = await UserModel.findOne({email});
            if(existingUser) throw new Error("User already exists");

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({email, password: hashedPassword});
            const savedUser = await newUser.save();

            const token = jwt.sign({id: savedUser.id, email: savedUser.email}, SECRET_KEY, {expiresIn: "1h"});
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
