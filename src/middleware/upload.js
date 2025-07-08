import multer from 'multer';
import { storage } from '../config/cloudinary.config.js';

// Configure multer to use cloudinary storage
export const upload = multer({ storage });
