import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import "dotenv/config";
import authRoute from "./routes/auth.route";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
