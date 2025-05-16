import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/jwt";
import { CookieOptions } from "express";

const prisma = new PrismaClient();

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only send the cookie over https in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "strict",
}

export const signUp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required to continue" });
    }

    // Check if user already exists

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists" });
    }

    // hash the password

    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = generateToken(newUser.id);
    res.cookie("token", token, cookieOptions); // set the cookie

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: newUser,
        token,
      },
    });
  } catch (error: any) {
    console.log("Error in sign up controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user exists

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if password is correct

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // generate a token

    const token = generateToken(user.id);

    const { password: _, ...userWithoutPassword } = user; // exclude the password from the response

    res.cookie("token", token, cookieOptions); // set the cookie

    return res
      .status(200)
      .json({
        success: true,
        message: "User logged in sucessfully",
        user: userWithoutPassword,
        token,
      });
  } catch (error: any) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req: Request, res: Response) => {
    try {
        
        res.clearCookie("token", cookieOptions);
        res.status(200).json({success: true, message: "User logged out successfully"});
    } catch (error: any) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
};
