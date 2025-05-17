import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
  };
}

export const getExpenses = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const expenses = await prisma.expense.findMany();

    if (!expenses) {
      return res.status(404).json({ message: "No expenses found" });
    }

    return res.status(200).json({ expenses });
  } catch (error: any) {
    console.log("Error in getExpenses controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getExpenseById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!expense) {
      return res
        .status(404)
        .json({ message: "Expense with this id does not exist" });
    }

    return res.status(200).json({ expense });
  } catch (error: any) {
    console.log("Error in getExpenseById controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createExpense = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userReq = req as AuthenticatedRequest;
  try {
    const { title, description, amount, category } = req.body;
    const userId = userReq.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !description || !amount || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (
      category !== "Groceries" &&
      category !== "Leisure" &&
      category !== "Electronics" &&
      category !== "Utilities" &&
      category !== "Clothing" &&
      category !== "Health" &&
      category !== "Others"
    ) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const newExpense = await prisma.expense.create({
      data: {
        title,
        description,
        amount,
        category,
        user: {
          connect: { id: userId },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Expense created succesfully!",
      expense: newExpense,
    });
  } catch (error: any) {
    console.log("Error in createExpense controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateExpense = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userReq = req as AuthenticatedRequest;

  try {
    const { id } = req.params;
    const { title, description, amount, category } = req.body;
    const userId = userReq.user?.id;

    // check for userId

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // check for expense

    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!expense) {
      return res
        .status(404)
        .json({ message: "Expense with this id does not exist" });
    }

    if (expense.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this expense" });
    }

    if (
      category !== "Groceries" &&
      category !== "Leisure" &&
      category !== "Electronics" &&
      category !== "Utilities" &&
      category !== "Clothing" &&
      category !== "Health" &&
      category !== "Others"
    ) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        amount,
        category,
      },
    });

    return res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error: any) {
    console.log("Error in updateExpense controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteExpense = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const userReq = req as AuthenticatedRequest;
    const userId = userReq.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!expense) {
      return res
        .status(404)
        .json({ message: "Expense with this id does not exist" });
    }

    if (expense.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this expense" });
    }

    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error: any) {
    console.log("Error in deleteExpense controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
