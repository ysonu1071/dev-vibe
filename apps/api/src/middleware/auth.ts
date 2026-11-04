import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export type AuthUser = {
  userId: string;
  email: string;
  role: string;
  branchId?: string;
};

type AuthRequest = Request & {
  user?: AuthUser;
};

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authorization token is required',
      status: 'error',
    });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token',
      status: 'error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'You do not have permission to access this resource',
        status: 'error',
      });
    }

    return next();
  };
};
