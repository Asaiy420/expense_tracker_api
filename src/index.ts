import express, { Request, Response } from "express";
import "dotenv/config";
import authRoute from "./routes/auth.route";
import cookieParser from "cookie-parser";
import expenseRoute from "./routes/expense.route";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/expense", expenseRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); 
});

