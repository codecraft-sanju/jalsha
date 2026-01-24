const Order = require('../models/Order');
const Product = require('../models/Product');
const Dealer = require('../models/Dealer');

// @desc    Create Order & Handle Stock/Ledger
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { customerName, customerMobile, items, totalAmount, paymentStatus } = req.body;
    let { dealerId } = req.body; // Let isliye use kiya taaki update kar sakein

    // 1️⃣ Validate Stock (Stock hai ya nahi?)
    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product || product.stock < item.quantity) {
            return res.status(400).json({ msg: `Insufficient stock for ${product ? product.size : 'Unknown Item'}` });
        }
    }

    // 2️⃣ Automatic Dealer Link Logic (Khata ke liye zaroori)
    // Agar dealerId nahi aayi, toh Mobile se dhundo
    if (!dealerId) {
        const existingDealer = await Dealer.findOne({ mobile: customerMobile });
        if (existingDealer) {
            dealerId = existingDealer._id; // Link kar diya
        }
    }

    // 3️⃣ Create Order
    const newOrder = new Order({
        orderId: `#ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName,
        customerMobile,
        dealerId: dealerId || null, // Link hone par ID, warna null
        items,
        totalAmount,
        paymentStatus: paymentStatus || 'Unpaid',
        status: 'Pending'
    });

    const savedOrder = await newOrder.save();

    // 4️⃣ Deduct Stock & Notify
    for (const item of items) {
        const product = await Product.findById(item.productId);
        if(product) {
            product.stock -= item.quantity;
            await product.save();
            if(req.io) req.io.emit('stock_updated', product);
        }
    }

    // 5️⃣ Ledger Update (Agar Dealer Link hua hai toh)
    // Sirf tab update karo agar payment 'Paid' nahi hai (yani Udhaar hai)
    if (dealerId && paymentStatus !== 'Paid') {
        const dealer = await Dealer.findById(dealerId);
        if (dealer) {
            // Balance badhao (Udhaar)
            dealer.balance += Number(totalAmount);
            
            // History me likho
            dealer.transactions.push({
                amount: Number(totalAmount),
                type: 'Debit', // Maal gaya, Paisa lena baki hai
                description: `Order ${savedOrder.orderId}`,
                date: Date.now()
            });
            
            await dealer.save();
            if(req.io) req.io.emit('dealer_updated', dealer);
        }
    }

    if(req.io) req.io.emit('new_order', savedOrder);
    res.status(201).json(savedOrder);

  } catch (err) {
    console.error("Order Create Error:", err);
    res.status(500).send('Server Error');
  }
};

// @desc    Get All Orders (Dynamic: Admin or Customer)
// @route   GET /api/orders?mobile=9876543210
const getAllOrders = async (req, res) => {
    try {
        const { mobile } = req.query; // Frontend se ?mobile=... aayega
        
        let query = {};
        
        // ✅ Agar mobile number hai, toh filter karo (Customer Dashboard ke liye)
        if (mobile) {
            query.customerMobile = mobile; 
        }
        // ✅ Agar mobile nahi hai, toh sab dikhao (Admin Panel ke liye)

        const orders = await Order.find(query)
            .populate('dealerId', 'name mobile shopName') // Dealer ki details bhi le aao
            .sort({ createdAt: -1 });
            
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Update Order Status
// @route   PUT /api/orders/:id
const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status, paymentStatus },
        { new: true }
    );

    if(req.io) req.io.emit('order_status_updated', order);
    
    res.json(order);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

module.exports = { createOrder, updateOrderStatus, getAllOrders };