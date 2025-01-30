const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 

const resolvers = {
    Query: {
        me: async (_, __, { user }) => {

            if (!user) throw new Error("Noth authenticated");
            return await User.findById(user.id);
        }
    },

    Mutation: {
        register: async (_, {email, password}) => {
            
            const existingUser = await User.findOne({email});
            if(existingUser) throw new Error("User already exists");

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({email, password: hashedPassword});
            const savedUser = await newUser.save();

            const token = jwt.sign({id: savedUser.id, email: savedUser.email}, process.env.SECRET_KEY, {expiresIn: "1h"});
            return {...savedUser._doc, id: savedUser.id, token}

        },
        login: async (_, {email, password}) => {

            const user = await User.findOne({email});
            if (!user) throw new Error("User does not exist");

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) throw new Error("Invalid password");

            const token = jwt.sign({id: user.id, email: user.email}, process.env.SECRET_KEY, {expiresIn: "1h"});
            return {...user._doc, id: user.id, token}

        }
    }
}