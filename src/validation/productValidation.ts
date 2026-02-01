import Joi from 'joi';

export const createProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    sizes: Joi.array().items(Joi.string()).default([]),
    images: Joi.array().items(Joi.string()).default([]),
    // Slug is generated on server, so not required in body
});

export const updateProductSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number(),
    category: Joi.string(),
    sizes: Joi.array().items(Joi.string()),
    images: Joi.array().items(Joi.string()),
    slug: Joi.string()
});
