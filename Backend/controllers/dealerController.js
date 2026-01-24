const Dealer = require('../models/Dealer');

// @desc    Get all dealers
// @route   GET /api/dealers
const getDealers = async (req, res) => {
  try {
    const dealers = await Dealer.find().sort({ updatedAt: -1 });
    res.json(dealers);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// @desc    Create New Dealer
// @route   POST /api/dealers
const createDealer = async (req, res) => {
  try {
    const { name, shopName, location, mobile, gstin } = req.body;

    // Check if dealer already exists
    let dealer = await Dealer.findOne({ mobile });
    if (dealer) {
        return res.status(400).json({ msg: 'Dealer with this mobile already exists' });
    }

    dealer = new Dealer({
      name, 
      shopName, 
      location, 
      mobile, 
      gstin, 
      balance: 0,
      transactions: [] // Initialize empty history
    });

    const createdDealer = await dealer.save();
    
    // 🟢 Socket Emit (Real-time update to Admin Panel)
    if (req.io) req.io.emit('dealer_updated', createdDealer);
    
    res.status(201).json(createdDealer);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

// @desc    Add Transaction (Receive Payment or Manual Debit)
// @route   PUT /api/dealers/:id/transaction
const updateDealerTransaction = async (req, res) => {
  try {
    const { amount, type, description } = req.body; 
    // type: 'Credit' = Payment Received (Paisa aaya)
    // type: 'Debit'  = Goods Given / Manual Charge (Udhaar badha)

    const dealer = await Dealer.findById(req.params.id);
    if (!dealer) return res.status(404).json({ msg: 'Dealer not found' });

    // 1. Update Balance Logic
    if (type === 'Credit') {
        // Dealer ne payment di hai, toh udhaar KAM hoga
        dealer.balance -= Number(amount);
    } else {
        // Dealer ne maal liya (ya manual charge), toh udhaar BADHEGA
        dealer.balance += Number(amount);
    }

    // 2. Add to Ledger History (Transactions Array)
    dealer.transactions.push({
        amount: Number(amount),
        type,
        description: description || (type === 'Credit' ? 'Payment Received' : 'Manual Charge'),
        date: Date.now()
    });

    const updatedDealer = await dealer.save();
    
    // 🟢 Socket Emit
    if (req.io) req.io.emit('dealer_updated', updatedDealer);
    
    res.json(updatedDealer);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = { getDealers, createDealer, updateDealerTransaction };