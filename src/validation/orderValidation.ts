import Joi from 'joi';

export const createOrderSchema = Joi.object({
    items: Joi.array().items(
        Joi.object({
            product: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
                'string.pattern.base': 'Invalid Product ID format'
            }),
            quantity: Joi.number().integer().min(1).required()
        })
    ).min(1).required(),
    shippingAddress: Joi.string().required(),
    paymentMethod: Joi.string().optional().default('COD'),
    guestName: Joi.string().optional(),
    guestEmail: Joi.string().email().optional(),
    guestPhone: Joi.string().optional()
});

export const updateOrderSchema = Joi.object({
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').required()
});
