import express from 'express';
import {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrder,
    updateOrderStatus,
    deleteOrder,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateRequest } from '../validation/validateRequest.js';
import { createOrderSchema, updateOrderSchema } from '../validation/orderValidation.js';

const router = express.Router();

// Public/User routes
router.post('/', validateRequest(createOrderSchema), createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.patch('/:id/status', protect, admin, validateRequest(updateOrderSchema), updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

export default router;
