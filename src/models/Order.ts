import mongoose, { Schema, type Document } from 'mongoose';

export interface IOrder extends Document {
    user?: mongoose.Types.ObjectId;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    items: {
        product: mongoose.Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: string;
    paymentMethod: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        guestName: { type: String },
        guestEmail: { type: String },
        guestPhone: { type: String },
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true }, // Price at time of order
            },
        ],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        shippingAddress: { type: String, required: true },
        paymentMethod: { type: String, default: 'COD' },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
