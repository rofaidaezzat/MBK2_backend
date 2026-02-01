import type { Request, Response, NextFunction } from 'express';
import type { Schema } from 'joi';

export const validateRequest = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Validation Error',
                errors: error.details.map((detail) => detail.message),
            });
            return;
        }

        next();
    };
};
