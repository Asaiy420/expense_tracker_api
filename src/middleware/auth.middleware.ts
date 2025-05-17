import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // Check for token in cookies first
  const tokenFromCookie = req.cookies?.token;

  // Then check for token in Authorization header
  const tokenFromHeader = req.headers.authorization?.split(" ")[1];

  // Use either cookie token or header token
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as { id: number };

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }
};
