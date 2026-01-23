const Order = require('../models/Order');
const Product = require('../models/Product');
const Dealer = require('../models/Dealer');

// @desc    Create Order & Handle Stock/Ledger
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { customerName, dealerId, items, totalAmount, paymentStatus } = req.body;

    // 1. Validate Stock Availability First
    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product || product.stock < item.quantity) {
            return res.status(400).json({ msg: `Insufficient stock for ${product ? product.size : 'Unknown Item'}` });
        }
    }

    // 2. Create Order
    const newOrder = new Order({
        orderId: `#ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName,
        dealerId: dealerId || null,
        items,
        totalAmount,
        paymentStatus: paymentStatus || 'Unpaid',
        status: 'Pending'
    });

    const savedOrder = await newOrder.save();

    // 3. Deduct Stock & Notify
    for (const item of items) {
        const product = await Product.findById(item.productId);
        product.stock -= item.quantity;
        await product.save();
        req.io.emit('stock_updated', product); // 🟢 Socket (Real-time Inventory Update)
    }

    // 4. If Dealer Order -> Update Ledger (Khata)
    // Agar payment 'Credit' (Udhaar) hai, toh Dealer ke balance me jod do
    if (dealerId && paymentStatus !== 'Paid') {
        const dealer = await Dealer.findById(dealerId);
        if (dealer) {
            dealer.balance += totalAmount; // Udhaar Badha
            dealer.transactions.push({
                amount: totalAmount,
                type: 'Debit', // Maal Gaya
                description: `Order ${savedOrder.orderId}`,
                date: Date.now()
            });
            await dealer.save();
            req.io.emit('dealer_updated', dealer); // 🟢 Socket (Update Khata UI)
        }
    }

    req.io.emit('new_order', savedOrder); // 🟢 Socket (Admin Dashboard Alert)
    res.status(201).json(savedOrder);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// @desc    Update Order Status (Dispatch/Deliver)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status, paymentStatus },
        { new: true }
    );

    req.io.emit('order_status_updated', order); // 🟢 Socket
    res.json(order);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const getAllOrders = async (req, res) => {
    const orders = await Order.find().populate('dealerId', 'name mobile').sort({ createdAt: -1 });
    res.json(orders);
};

module.exports = { createOrder, updateOrderStatus, getAllOrders };