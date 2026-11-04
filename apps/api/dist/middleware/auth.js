"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Authorization token is required',
            status: 'error',
        });
    }
    try {
        const token = authHeader.replace('Bearer ', '');
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = payload;
        return next();
    }
    catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token',
            status: 'error',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.authenticate = authenticate;
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
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
exports.authorizeRoles = authorizeRoles;
