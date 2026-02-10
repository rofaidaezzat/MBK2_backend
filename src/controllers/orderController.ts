import type { Request, Response } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

interface IRequestWithUser extends Request {
    user?: any;
}

export const createOrder = async (req: IRequestWithUser, res: Response) => {
    try {
        const { items, shippingAddress, paymentMethod, guestName, guestEmail, guestPhone } = req.body;
        const userId = req.user ? req.user._id : undefined;

        let totalAmount = 0;
        const orderItems = [];

        // Validate products and calculate total
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                res.status(404).json({ message: `Product not found: ${item.product}` });
                return;
            }
            if (product.stock < item.quantity) {
                res.status(400).json({ message: `Insufficient stock for product: ${product.title}` });
                return;
            }

            // Deduct stock (simple approach, ideally use transaction)
            product.stock -= item.quantity;
            await product.save();

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
            });
            totalAmount += product.price * item.quantity;
        }

        const newOrder = new Order({
            user: userId,
            guestName,
            guestEmail,
            guestPhone,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || 'COD',
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            status: 'success',
            code: 201,
            message: 'Order created successfully',
            data: savedOrder,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

export const getMyOrders = async (req: IRequestWithUser, res: Response) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate('items.product', 'title price image');

        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Orders retrieved successfully',
            results: orders.length,
            data: orders,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving orders', error: error.message });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const totalDocs = await Order.countDocuments();
        const orders = await Order.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('user', 'name email')
            .populate('items.product', 'title price');

        const numberOfPages = Math.ceil(totalDocs / limit);

        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'All orders retrieved successfully',
            results: orders.length,
            pagination: {
                currentPage: page,
                limit: limit,
                numberOfPages: numberOfPages,
                next: page < numberOfPages ? page + 1 : undefined,
            },
            data: orders,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving all orders', error: error.message });
    }
};

export const getOrder = async (req: IRequestWithUser, res: Response) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'title price image description');

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        // Check ownership or admin role
        // If order has no user (guest), only admin can view (or we need another mechanism like order token)
        const orderUserId = order.user ? (order.user as any)._id.toString() : null;
        const currentUserId = req.user ? req.user._id.toString() : null;
        const isAdmin = req.user && req.user.role === 'admin';

        if (orderUserId !== currentUserId && !isAdmin) {
            res.status(403).json({ message: 'Not authorized to view this order' });
            return;
        }

        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Order retrieved successfully',
            data: order,
        });
    } catch (error: any) {
        if (error.kind === 'ObjectId') {
            res.status(400).json({ message: 'Invalid Order ID' });
            return
        }
        res.status(500).json({ message: 'Error retrieving order', error: error.message });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Order status updated successfully',
            data: order,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Order deleted successfully',
            data: null,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
};
