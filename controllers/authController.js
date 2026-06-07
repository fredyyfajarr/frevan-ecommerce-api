import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import asyncHandler from '../middlewares/asyncHandler.js';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

const createSendResToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOption = {
    expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  };

  res.cookie('jwt', token, cookieOption);

  user.password = undefined;

  res.status(statusCode).json({
    data: user,
  });
};

const ensureOwnProfile = (req, res) => {
  if (req.params.id !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this profile');
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const isOwner = (await User.countDocuments()) === 0;

  const role = isOwner ? 'owner' : 'user';

  const default_img =
    req.body.profile_image ||
    'https://res.cloudinary.com/dlpqwetbk/image/upload/v1740400315/default_img_sfc36a.png';

  const createUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role,
    profile_image: default_img,
  });
  createSendResToken(createUser, 201, res);
});

export const loginUser = asyncHandler(async (req, res) => {
  // validation
  if (!req.body.email || !req.body.password) {
    res.status(400);
    throw new Error('Email/password must be filled');
  }

  // check email
  const userData = await User.findOne({
    email: req.body.email,
  });

  // check password
  if (userData && (await userData.comparePassword(req.body.password))) {
    createSendResToken(userData, 200, res);
  } else {
    res.status(400);
    throw new Error('Invalid User');
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  if (req.params.id !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this profile');
  }
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    return res.status(200).json({
      user,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const fileUploadUser = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'profile_uploads',
        allowed_formats: ['jpg', 'png'],
      },
      (err, result) => {
        if (err) {
          console.log(err);
          reject('Failed to upload image');
        } else {
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export const deleteOldImage = async (imageUrl) => {
  if (
    !imageUrl ||
    imageUrl.includes('default_img_sfc36a.png') // Jika gambar adalah default, jangan hapus
  ) {
    return;
  }

  // Ambil public_id dari URL Cloudinary
  const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];

  try {
    await cloudinary.uploader.destroy(`uploads/${publicId}`);
  } catch (error) {
    console.log('Failed to delete old image:', error);
  }
};

export const updateUser = asyncHandler(async (req, res) => {
  ensureOwnProfile(req, res);

  const paramsId = req.params.id;
  let updateFields = { ...req.body };

  // Cari user untuk mendapatkan profile_image lama
  const user = await User.findById(paramsId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Jika ada file baru, hapus gambar lama kecuali default
  if (req.file) {
    try {
      await deleteOldImage(user.profile_image); // Hapus foto lama dulu
      const imageUrl = await fileUploadUser(req.file); // Upload foto baru
      updateFields.profile_image = imageUrl; // Simpan URL baru
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  // Update data user
  const updateUser = await User.findByIdAndUpdate(paramsId, updateFields, {
    runValidators: false,
    new: true,
  });

  return res.status(201).json({
    message: 'Profile Update Success',
    data: updateUser,
  });
});

export const updatePasswordUser = asyncHandler(async (req, res) => {
  ensureOwnProfile(req, res);

  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error('Incorrect old password');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
});

export const logoutUser = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });

  res.status(200).json({
    message: 'Logout Success',
  });
};
