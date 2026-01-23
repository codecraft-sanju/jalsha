const Order = require('../models/Order');
const Product = require('../models/Product');
const Dealer = require('../models/Dealer');

// @desc    Create Order & Handle Stock/Ledger
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    // 1️⃣ 'customerMobile' ko req.body se extract karo
    const { customerName, customerMobile, dealerId, items, totalAmount, paymentStatus } = req.body;

    // Validate Stock
    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product || product.stock < item.quantity) {
            return res.status(400).json({ msg: `Insufficient stock for ${product ? product.size : 'Unknown Item'}` });
        }
    }

    // 2️⃣ Order Create karte waqt customerMobile save karo
    const newOrder = new Order({
        orderId: `#ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName,
        customerMobile, // ✅ ADDED: Database me save hoga
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
        req.io.emit('stock_updated', product);
    }

    // 4. Ledger Update (Same as before)
    if (dealerId && paymentStatus !== 'Paid') {
        const dealer = await Dealer.findById(dealerId);
        if (dealer) {
            dealer.balance += totalAmount;
            dealer.transactions.push({
                amount: totalAmount,
                type: 'Debit',
                description: `Order ${savedOrder.orderId}`,
                date: Date.now()
            });
            await dealer.save();
            req.io.emit('dealer_updated', dealer);
        }
    }

    req.io.emit('new_order', savedOrder);
    res.status(201).json(savedOrder);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// @desc    Get All Orders (Dynamic: Admin or Customer)
// @route   GET /api/orders?mobile=9876543210
const getAllOrders = async (req, res) => {
    try {
        const { mobile } = req.query; // Frontend se ?mobile=... aayega
        
        let query = {};
        
        // ✅ Agar mobile number hai, toh filter karo (Customer View)
        if (mobile) {
            query.customerMobile = mobile; 
        }
        // ✅ Agar mobile nahi hai, toh sab dikhao (Admin View)

        const orders = await Order.find(query)
            .populate('dealerId', 'name mobile')
            .sort({ createdAt: -1 });
            
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Update Status (No Change needed here)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status, paymentStatus },
        { new: true }
    );
    req.io.emit('order_status_updated', order);
    res.json(order);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

module.exports = { createOrder, updateOrderStatus, getAllOrders };