const Product = require('../models/Product');

// @desc    Get Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @desc    Create Product
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    req.io.emit('stock_updated', savedProduct); // 🟢 Socket
    res.json(savedProduct);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// @desc    Update Product (Price/Stock)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );
    req.io.emit('stock_updated', product); // 🟢 Socket
    res.json(product);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @desc    Delete Product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.io.emit('stock_updated', { _id: req.params.id, deleted: true }); // 🟢 Socket
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };