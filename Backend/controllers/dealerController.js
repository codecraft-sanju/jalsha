const Dealer = require('../models/Dealer');

// @desc    Get all dealers
const getDealers = async (req, res) => {
  try {
    const dealers = await Dealer.find().sort({ updatedAt: -1 });
    res.json(dealers);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @desc    Create Dealer
const createDealer = async (req, res) => {
  try {
    const { name, shopName, location, mobile, gstin } = req.body;

    const dealer = new Dealer({
      name, shopName, location, mobile, gstin, balance: 0
    });

    const createdDealer = await dealer.save();
    req.io.emit('dealer_updated', createdDealer); // 🟢 Socket
    res.status(201).json(createdDealer);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// @desc    Add Transaction (Payment or Credit)
// @route   PUT /api/dealers/:id/transaction
const updateDealerTransaction = async (req, res) => {
  try {
    const { amount, type, description } = req.body; 
    // Type: 'Credit' (Payment Received - Paisa Aaya), 'Debit' (Goods Given - Maal Gaya)

    const dealer = await Dealer.findById(req.params.id);
    if (!dealer) return res.status(404).json({ msg: 'Dealer not found' });

    // 1. Update Balance
    // Credit means dealer paid us (Balance kam karo)
    // Debit means dealer took goods (Balance badhao - Udhaar)
    if (type === 'Credit') {
        dealer.balance -= Number(amount);
        dealer.lastPaymentAmount = Number(amount);
        dealer.lastPaymentDate = Date.now();
    } else {
        dealer.balance += Number(amount);
    }

    // 2. Add to Ledger History
    dealer.transactions.push({
        amount: Number(amount),
        type,
        description: description || (type === 'Credit' ? 'Payment Received' : 'Goods Given'),
        date: Date.now()
    });

    const updatedDealer = await dealer.save();
    req.io.emit('dealer_updated', updatedDealer); // 🟢 Socket
    res.json(updatedDealer);

  } catch (err) {
    res.status(500).send('Server Error');
  }
};

module.exports = { getDealers, createDealer, updateDealerTransaction };