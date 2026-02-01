import type { Request, Response } from "express";

import ContactMessage from '../models/ContactMessage.js';

export const createMessage = async (req: Request, res: Response) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = new ContactMessage({ name, email, message });
        const savedMessage = await newMessage.save();

        res.status(201).json({
            status: 'success',
            code: 201,
            message: 'Message sent successfully',
            data: savedMessage,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
};

export const getAllMessages = async (req: Request, res: Response) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Messages retrieved successfully',
            results: messages.length,
            data: messages,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving messages', error });
    }
};

export const getMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const message = await ContactMessage.findById(id);

        if (!message) {
            res.status(404).json({
                status: 'error',
                code: 404,
                message: 'Message not found',
                data: null
            });
            return;
        }

        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Message retrieved successfully',
            data: message,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving message', error });
    }
};

export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedMessage = await ContactMessage.findByIdAndDelete(id);

        if (!deletedMessage) {
            res.status(404).json({
                status: 'error',
                code: 404,
                message: 'Message not found',
                data: null
            });
            return;
        }

        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Message deleted successfully',
            data: deletedMessage,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting message', error });
    }
};
