import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};



export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.status(200).json({
                status: 'success',
                code: 200,
                message: 'User logged in successfully',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken((user._id as unknown) as string),
                },
            });
        } else {
            res.status(401).json({
                status: 'error',
                code: 401,
                message: 'Invalid email or password',
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message || error,
        });
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    // Client-side should remove the token. 
    // This endpoint can be used for server-side validity checks if we had a blacklist, 
    // but for simple JWT, it's just a response.
    res.status(200).json({
        status: 'success',
        code: 200,
        message: 'User logged out successfully',
    });
};
