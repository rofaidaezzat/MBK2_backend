import type { Request, Response } from "express";
import Product from '../models/Product.js';
import { generateUniqueSlug } from '../utils/slugGenerator.js';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const totalDocs = await Product.countDocuments();
        const products = await Product.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const numberOfPages = Math.ceil(totalDocs / limit);

        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Products retrieved successfully',
            results: products.length,
            pagination: {
                currentPage: page,
                limit: limit,
                numberOfPages: numberOfPages,
                next: page < numberOfPages ? page + 1 : undefined,
            },
            data: products,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        let product;

        // Check if valid ObjectId, otherwise treat as slug
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(id);
        } else {
            product = await Product.findOne({ slug: id });
        }

        if (!product) {
            res.status(404).json({
                status: 'error',
                code: 404,
                message: 'Product not found',
                data: null
            });
            return;
        }

        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Product retrieved successfully',
            data: product,
        });
    } catch (error: any) {
        if (error.name === 'CastError') {
            res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Invalid ID format',
                error: error.message
            });
            return;
        }
        res.status(500).json({ message: 'Error retrieving product', error });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        let imageUrls: string[] = [];

        if (files && files.length > 0) {
            imageUrls = files.map((file) => file.path);
        }

        // If 'images' is also sent in body (mixed?), handle it or overwrite? 
        // For now, if files exist, use them. If not, use body.
        if (imageUrls.length > 0) {
            req.body.images = imageUrls;
        }

        // Generate unique slug
        if (req.body.title && !req.body.slug) {
            req.body.slug = await generateUniqueSlug(Product, req.body.title);
        }

        // Parse sizes if sent as stringified JSON (common in form-data)
        if (req.body.sizes && typeof req.body.sizes === 'string') {
            try {
                req.body.sizes = JSON.parse(req.body.sizes);
            } catch (e) {
                // If parse fails, assume it's a single item or invalid; split by comma?
                // Better to leave it and let validation/mongoose handle or fail.
                // Or try splitting by comma:
                req.body.sizes = req.body.sizes.split(',').map((s: string) => s.trim());
            }
        }

        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json({
            status: 'success',
            code: 201,
            message: 'Product created successfully',
            data: savedProduct,
        });
    } catch (error: any) {
        console.error("Error creating product:", error);

        if (error.name === 'ValidationError') {
            res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Validation Error',
                errors: error.errors
            });
            return;
        }

        if (error.code === 11000) {
            res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Duplicate key error',
                error: error.message
            });
            return;
        }

        res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Error creating product',
            error: error.message || error,
            stack: error.stack // DEBUG: Remove in production
        });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        let imageUrls: string[] = [];

        if (files && files.length > 0) {
            imageUrls = files.map((file) => file.path);
        }

        // Check if there are new files uploaded
        if (imageUrls.length > 0) {
            // Logic: If new files are provided, we typically replace the images array or append?
            // Standard PUT/PATCH with a "field" usually replaces that field.
            // If the user wants to KEEP old images, they should arguably send them in the body,
            // but dealing with mixed file/text 'images' array in Multer/Express can be tricky (e.g. array vs single string).
            // Simple approach: If new files uploaded, USE THEM.
            // If we want to support APPENDING, we'd need to fetch existing product, but `findByIdAndUpdate` is one-shot.
            // Let's stick to: "If files uploaded, they become the new 'images' list".
            req.body.images = imageUrls;
        }

        const id = req.params.id as string;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
        }); // new: true returns the updated document

        if (!updatedProduct) {
            res.status(404).json({
                status: 'error',
                code: 404,
                message: 'Product not found',
                data: null
            });
            return;
        }

        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Product updated successfully',
            data: updatedProduct,
        });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Validation Error',
                errors: error.errors
            });
            return;
        }
        if (error.name === 'CastError') {
            res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Invalid ID format',
                error: error.message
            });
            return;
        }
        res.status(500).json({ message: 'Error updating product', error });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            res.status(404).json({
                status: 'error',
                code: 404,
                message: 'Product not found',
                data: null
            });
            return;
        }

        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Product deleted successfully',
            data: deletedProduct, // Or null if preferred
        });
    } catch (error: any) {
        if (error.name === 'CastError') {
            res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Invalid ID format',
                error: error.message
            });
            return;
        }
        res.status(500).json({ message: 'Error deleting product', error });
    }
};
