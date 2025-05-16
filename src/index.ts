import express from "express";
import { PrismaClient } from "../generated/prisma";
import "dotenv/config";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
