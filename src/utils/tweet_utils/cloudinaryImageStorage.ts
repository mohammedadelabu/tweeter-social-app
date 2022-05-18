const cloudinaryImage = require('cloudinary');

import dotenv from 'dotenv';

dotenv.config();

try {
  cloudinaryImage.config({
    cloud_name: process.env.CLOUDINARY_NAME_1,
    api_key: process.env.CLOUDINARY_API_KEY_1,
    api_secret: process.env.CLOUDINARY_SECRET_1,
  });
} catch (error: any) {
  console.error(error.message);
}

export default cloudinaryImage;
