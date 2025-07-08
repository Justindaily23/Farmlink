import Farmer from '../farmLink/models/farmer.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Ensure the potential user is a farmer
export const ensureFarmer = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const farmer = await Farmer.findByPk(req.user.id);
  if (!farmer) {
    return res.status(403).json({ message: 'Access denied: farmers only' });
  }

  // the farmer instance to req
  req.farmer = farmer;

  next();
});
