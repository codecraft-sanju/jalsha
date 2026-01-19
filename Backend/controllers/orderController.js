const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const { orderId, customerName, items, totalAmount } = req.body;

    // Basic Validation
    if (!items || items.length === 0) {
        return res.status(400).json({ msg: 'No order items' });
    }

    const order = new Order({
      orderId,
      customerName,
      items,
      totalAmount,
      status: 'Pending'
    });

    const createdOrder = await order.save();

    // 🔥 SOCKET EMIT: Notify Admin Panel instantly (Real-time Order Alert)
    req.io.emit('new_order', createdOrder);

    res.status(201).json(createdOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
  try {
    // Return orders sorted by newest first
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );

    if (!order) {
        return res.status(404).json({ msg: 'Order not found' });
    }

    // 🔥 SOCKET EMIT: Notify everyone status changed (Customer/Admin)
    req.io.emit('order_status_updated', order);

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus
};