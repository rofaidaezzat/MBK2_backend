import express from 'express';
import {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js';
import { validateRequest } from '../validation/validateRequest.js';
import { createProductSchema, updateProductSchema } from '../validation/productValidation.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

import { parseProductBody } from '../middleware/parseProductBody.js';

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', upload.array('images'), parseProductBody, validateRequest(createProductSchema), createProduct);
router.put('/:id', upload.array('images'), parseProductBody, validateRequest(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
