import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            const parts = req.headers.authorization.split(' ');
            if (parts.length === 2) {
                token = parts[1];
            }

            if (!token) {
                res.status(401).json({
                    status: 'error',
                    code: 401,
                    message: 'Not authorized, no token',
                });
                return;
            }

            // Verify token
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            res.status(401).json({
                status: 'error',
                code: 401,
                message: 'Not authorized',
                error: 'Invalid token'
            });
        }
    }

    if (!token) {
        res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Not authorized, no token',
        });
    }
};
