import express from 'express';
import {
    createMessage,
    getAllMessages,
    getMessage,
    deleteMessage,
} from '../controllers/contactMessageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createMessage);

router.use(protect);

router.get('/', getAllMessages);
router.get('/:id', getMessage);
router.delete('/:id', deleteMessage);

export default router;
