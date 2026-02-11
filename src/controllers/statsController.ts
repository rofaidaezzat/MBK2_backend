import type { Request, Response } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // 1. Total Revenue (excluding cancelled orders)
        const revenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // 2. Active Orders
        const activeOrders = await Order.countDocuments({
            status: { $in: ['pending', 'processing'] }
        });

        // 3. Inventory Health (percentage of products in stock)
        const totalProducts = await Product.countDocuments();
        const inStockProducts = await Product.countDocuments({ stock: { $gt: 0 } });
        const inventoryHealth = totalProducts > 0 ? Math.round((inStockProducts / totalProducts) * 100) : 0;

        // 4. Sales Activity (Last 24 hours) - simplified for chart
        // Aggregate sales by hour
        const last24h = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
        const salesActivity = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: last24h },
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: { $hour: "$createdAt" },
                    total: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        // Fill in missing hours with 0
        const formattedSalesActivity = [];
        for (let i = 0; i < 24; i++) {
            const hourData = salesActivity.find(item => item._id === i);
            formattedSalesActivity.push({
                hour: i,
                sales: hourData ? hourData.total : 0
            });
        }

        // 5. Site Traffic (Mock Data as requested/implied by "Site Traffic 12.4K")
        // Since we don't have a tracking system, we'll return a static or random value for now
        const siteTraffic = 12400;

        res.status(200).json({
            status: 'success',
            data: {
                totalRevenue,
                activeOrders,
                inventoryHealth,
                siteTraffic,
                salesActivity: formattedSalesActivity
            }
        });

    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching dashboard stats',
            error: error.message
        });
    }
};
