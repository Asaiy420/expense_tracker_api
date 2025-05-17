import { Router } from "express";
import { getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense } from "../controllers/expense.controller";


const router = Router();

router.get("/", getExpenses)
router.get("/:id", getExpenseById)
router.post("/create", createExpense)
router.put("/:id", updateExpense)
router.delete("/:id", deleteExpense)

export default router;
