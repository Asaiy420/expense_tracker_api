import { Router } from "express";
import { getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense } from "../controllers/expense.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getExpenses)
router.get("/:id", getExpenseById)
router.post("/create", authMiddleware, createExpense)
router.put("/:id",authMiddleware, updateExpense)
router.delete("/:id", authMiddleware, deleteExpense)

export default router;
