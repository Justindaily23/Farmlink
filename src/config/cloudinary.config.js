import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { getEnvironmentVariable } from './dotenvConfig.js';

// Configure cloudinary credentials
cloudinary.config({
  cloud_name: getEnvironmentVariable('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnvironmentVariable('CLOUDINARY_API_KEY'),
  api_secret: getEnvironmentVariable('CLOUDINARY_API_SECRET'),
});

// Setup storage engine for multer using cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'farmlink/products', // folder name in cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Unique filename
  },
});

export { cloudinary, storage };
