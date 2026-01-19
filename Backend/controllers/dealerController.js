const Dealer = require('../models/Dealer');

// @desc    Get all dealers (Sorted by debt/balance)
// @route   GET /api/dealers
// @access  Private (Admin)
const getDealers = async (req, res) => {
  try {
    const dealers = await Dealer.find().sort({ createdAt: -1 });
    res.json(dealers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add new dealer to Khata
// @route   POST /api/dealers
// @access  Private (Admin)
const createDealer = async (req, res) => {
  try {
    const { name, location, mobile, balance } = req.body;

    const dealer = new Dealer({
      name,
      location,
      mobile,
      balance: balance || 0 
    });

    const createdDealer = await dealer.save();
    
    // 🔥 SOCKET EMIT: Admin list update
    req.io.emit('dealer_updated', createdDealer);

    res.status(201).json(createdDealer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update Dealer Balance (Record Payment or Add Debt)
// @route   PUT /api/dealers/:id/transaction
// @access  Private (Admin)
const updateDealerTransaction = async (req, res) => {
  try {
    const { amount, type } = req.body; 
    
    const dealer = await Dealer.findById(req.params.id);

    if (!dealer) {
        return res.status(404).json({ msg: 'Dealer not found' });
    }
    
    dealer.balance = dealer.balance + Number(amount);
    
    if(Number(amount) > 0) {
        dealer.lastPaymentDate = Date.now();
        dealer.lastPaymentAmount = Number(amount);
    }

    const updatedDealer = await dealer.save();

    // 🔥 SOCKET EMIT: Real-time update in Admin Khata list
    req.io.emit('dealer_updated', updatedDealer);

    res.json(updatedDealer);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getDealers,
  createDealer,
  updateDealerTransaction
};