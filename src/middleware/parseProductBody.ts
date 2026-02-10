import type { Request, Response, NextFunction } from 'express';

export const parseProductBody = (req: Request, res: Response, next: NextFunction) => {
    // Parse 'sizes' if it's a string (which happens in multipart/form-data)
    if (req.body.sizes && typeof req.body.sizes === 'string') {
        try {
            req.body.sizes = JSON.parse(req.body.sizes);
        } catch (error) {
            // Keep as string or handle error? 
            // If it fails to parse, Joi will likely catch it as "must be an array" anyway.
            // But strict JSON.parse might fail for simple "50ml, 100ml".
            // Let's also try splitting by comma if it doesn't look like JSON array
            if (req.body.sizes.includes("[") === false) {
                req.body.sizes = req.body.sizes.split(',').map((s: string) => s.trim());
            }
        }
    }

    // Also ensure numeric fields are actually numbers (Multer might parse them, but sometimes not)
    if (req.body.price) {
        req.body.price = Number(req.body.price);
    }
    if (req.body.stock) {
        req.body.stock = Number(req.body.stock);
    }

    // Parse 'tags' if it's a string
    if (req.body.tags && typeof req.body.tags === 'string') {
        try {
            req.body.tags = JSON.parse(req.body.tags);
        } catch (error) {
            if (req.body.tags.includes("[") === false) {
                req.body.tags = req.body.tags.split(',').map((s: string) => s.trim());
            }
        }
    }

    next();
};
