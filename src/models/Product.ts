import mongoose, { Schema, type Document } from 'mongoose';
export interface IProduct extends Document {
    title: string;
    description: string;
    price: number;
    category: string;
    sizes: string[];
    images: string[];
    stock: number;
    tags: string[];
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema(
    {
        title: { type: String },
        description: { type: String },
        price: { type: Number },
        category: { type: String },
        sizes: { type: [String], default: [] },
        images: { type: [String], default: [] },
        stock: { type: Number, default: 0 },
        tags: { type: [String], default: [] },
        slug: { type: String, unique: true },
    },
    {
        timestamps: true,
    }
);
// middleware to generate slug from name if not provided (simple version)
// Slug generation moved to controller.

export default mongoose.model<IProduct>('Product', ProductSchema);
