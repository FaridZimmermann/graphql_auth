import "dotenv/config";
import { beforeAll, afterAll } from "vitest";
import connectDb, { disconnectDb } from "../helpers/connectDb";

beforeAll(async () => {
  await connectDb(); 
});

afterAll(async () => {
  await disconnectDb(); 
});