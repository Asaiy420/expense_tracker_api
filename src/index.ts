import express, { Request, Response } from "express";
import "dotenv/config";
import authRoute from "./routes/auth.route";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
