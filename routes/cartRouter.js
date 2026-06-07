import express from 'express';
import { protectedMiddleware } from '../middlewares/authMiddleware.js';
import {
  clearCart,
  createCart,
  deleteCart,
  updateCart,
  getCart,
} from '../controllers/cartController.js';

const router = express.Router();

// GET /api/v1/cart (Ambil semua item di cart)
router.get('/', protectedMiddleware, getCart);

// POST /api/v1/cart (Tambah item ke cart)
router.post('/', protectedMiddleware, createCart);

// DELETE /api/v1/cart (Kosongkan cart user saat ini)
router.delete('/', protectedMiddleware, clearCart);

// DELETE /api/v1/cart/:cartId (Hapus 1 item dari cart)
router.delete('/:cartId', protectedMiddleware, deleteCart);

// PUT /api/v1/cart/:cartId (Update quantity item)
router.put('/:cartId', protectedMiddleware, updateCart);

export default router;
