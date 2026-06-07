import asyncHandler from '../middlewares/asyncHandler.js';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// @desc Get cart by user
// @route GET /api/v1/cart
// @access Private
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name image price stock',
  });

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  res.status(200).json(cart);
});

// @desc Clear current user's cart
// @route DELETE /api/v1/cart
// @access Private
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await Cart.findOneAndDelete({ user: userId });

  res.status(200).json({
    message: 'Cart cleared',
    cart: {
      user: userId,
      items: [],
      totalPrice: 0,
    },
  });
});

// @desc Add or update cart
// @route POST /api/v1/cart
// @access Private
const createCart = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const userId = req.user._id;

  if (!Array.isArray(items) || items.length < 1) {
    return res.status(400).json({ message: 'Cart items are required' });
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  for (const newItem of items) {
    const product = await Product.findById(newItem.product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const quantity = Number(newItem.quantity);
    if (!Number.isFinite(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === product._id.toString()
    );
    const nextQuantity = (existingItem?.quantity || 0) + quantity;
    if (nextQuantity > product.stock) {
      return res.status(400).json({ message: 'Quantity exceeds product stock' });
    }

    if (existingItem) {
      existingItem.quantity = nextQuantity;
      existingItem.price = product.price;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        price: product.price,
      });
    }
  }

  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();
  res.status(201).json(cart);
});

// @desc Delete one item from cart
// @route DELETE /api/v1/cart/:productId
// @access Private
const deleteCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cartId = req.params.cartId; // Pakai cartId dari params

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const itemExists = cart.items.some((item) => item._id.toString() === cartId);
  if (!itemExists) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  // Filter item yang tidak dihapus
  cart.items = cart.items.filter((item) => item._id.toString() !== cartId);

  // Hitung ulang total harga
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();
  res.status(200).json({ message: 'Item removed from cart', cartId });
});

// @desc Update item quantity in cart
// @route PUT /api/v1/cart/:productId
// @access Private
const updateCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cartId = req.params.cartId;
  const { quantity } = req.body;

  if (!Number.isFinite(Number(quantity))) {
    return res.status(400).json({ message: 'Quantity must be a number' });
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === cartId
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    const product = await Product.findById(cart.items[itemIndex].product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: 'Quantity exceeds product stock' });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price;
  }

  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();
  res.status(200).json(cart);
});

export { getCart, createCart, clearCart, deleteCart, updateCart };
