import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Cart from '../models/cartModel.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

dotenv.config({ path: process.env.SEED_ENV_FILE || '.env' });

const shouldReset = process.argv.includes('--reset');

const defaultProfileImage =
  'https://res.cloudinary.com/dlpqwetbk/image/upload/v1740400315/default_img_sfc36a.png';

const users = [
  {
    name: 'frevan_owner',
    email: 'owner@frevan.dev',
    password: 'Owner123',
    role: 'owner',
    profile_image: defaultProfileImage,
  },
  {
    name: 'frevan_demo',
    email: 'demo@frevan.dev',
    password: 'Demo123',
    role: 'user',
    profile_image: defaultProfileImage,
  },
];

const products = [
  {
    name: 'Adidas Samba OG Green',
    price: 2500000,
    description: 'Classic terrace sneaker dengan aksen hijau dan upper leather.',
    image:
      'https://res.cloudinary.com/dlpqwetbk/image/upload/v1739822020/uploads/xvdxr3w51ejfwbvz9jug.png',
    category: 'sepatu',
    stock: 8,
  },
  {
    name: 'Adidas Stadt Gold',
    price: 2000000,
    description: 'Silhouette retro dengan warna gold yang cocok untuk daily fit.',
    image:
      'https://res.cloudinary.com/dlpqwetbk/image/upload/v1739822158/uploads/zfklglepowvr1d8babxi.png',
    category: 'sepatu',
    stock: 6,
  },
  {
    name: 'Adidas SL 72 Blue',
    price: 2200000,
    description: 'Runner vintage ringan dengan warna biru dan outsole gum.',
    image:
      'https://res.cloudinary.com/dlpqwetbk/image/upload/v1737638934/uploads/o3i7fpr2ndotlyyvcyne.png',
    category: 'sepatu',
    stock: 5,
  },
  {
    name: 'Frevan Essential Hoodie',
    price: 399000,
    description: 'Hoodie fleece regular fit untuk casual dan travel harian.',
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop',
    category: 'hoodie',
    stock: 12,
  },
  {
    name: 'Frevan Oversized Tee',
    price: 189000,
    description: 'Kaos oversized cotton combed dengan cutting clean dan breathable.',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
    category: 'baju',
    stock: 18,
  },
  {
    name: 'Frevan Work Shirt',
    price: 289000,
    description: 'Kemeja twill relaxed fit untuk semi-formal dan layering.',
    image:
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1200&auto=format&fit=crop',
    category: 'kemeja',
    stock: 10,
  },
  {
    name: 'Frevan Straight Pants',
    price: 349000,
    description: 'Celana straight cut dengan bahan tebal dan siluet rapi.',
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1200&auto=format&fit=crop',
    category: 'celana',
    stock: 9,
  },
  {
    name: 'Nike Cortez Vintage',
    price: 1799000,
    description: 'Sneaker low-profile dengan look vintage dan midsole empuk.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
    category: 'sepatu',
    stock: 7,
  },
];

const connectDatabase = async () => {
  if (!process.env.DATABASE) {
    throw new Error('DATABASE env is required to run the seeder');
  }

  await mongoose.connect(process.env.DATABASE, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
};

const resetDatabase = async () => {
  await Order.deleteMany({});
  await Cart.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({});
};

const seedDatabase = async () => {
  if (shouldReset) {
    await resetDatabase();
  }

  const [userCount, productCount] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
  ]);

  if (!shouldReset && (userCount > 0 || productCount > 0)) {
    throw new Error('Database is not empty. Run npm run seed:reset to replace existing data.');
  }

  await User.create(users);
  await Product.create(products);

  return {
    users: users.length,
    products: products.length,
  };
};

try {
  await connectDatabase();
  const result = await seedDatabase();
  console.log(
    `Seed complete: ${result.users} users and ${result.products} products inserted.`
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
