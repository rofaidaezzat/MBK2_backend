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
import { parseProductBody } from '../middleware/parseProductBody.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProduct);

router.use(protect);

router.post('/', upload.array('images'), parseProductBody, validateRequest(createProductSchema), createProduct);
router.put('/:id', upload.array('images'), parseProductBody, validateRequest(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
