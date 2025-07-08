import {
  createProduceService,
  deleteProduceService,
  getAllProduceService,
  getProduceService,
  updateProduceService,
} from '../services/produce.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { Error } from 'sequelize';
import { NotFoundException } from '../../lib/error-definitions.js';

/**
 * @desc Create a new produce
 * @route POST /api/v1/farmers/produce
 * @access Private (Farmer only)
 */
export const createProduce = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: 'Produce image is required' });
  }

  const {
    produce_name,
    category,
    quantity,
    unit,
    price,
    harvest_date,
    location,
    description,
  } = req.body;

  const farmerId = req.user?.id;
  const image_url = req.file?.path;

  const newProduce = await createProduceService({
    produce_name,
    category,
    quantity,
    unit,
    price,
    harvest_date,
    location,
    description,
    farmerId,
    image_url,
  });

  return res.status(201).json({
    success: true,
    message: 'Produce created successfully',
    data: newProduce,
  });
});

// Get all produce
export const getAllProduce = asyncHandler(async (req, res) => {
  const produce = await getAllProduceService();

  // Check if produce are in database
  if (!produce) throw new NotFoundException('No produce available');

  return res.status(200).json({
    success: true,
    data: produce,
  });
});

// Get a produce
export const getProduce = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const produce = await getProduceService(id);

  // Check if produce are in database
  if (!produce) throw new NotFoundException('No produce available');

  return res.status(200).json({
    success: true,
    data: produce,
  });
});

// Update a produce
export const updateProduce = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const produce = await updateProduceService(id);

  // Check if produce exists in database
  if (!produce) throw new NotFoundException('No produce available');
  return res.status(200).json({
    success: true,
    data: produce,
  });
});

// Delete a produce
export const deleteProduce = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const deleted = await deleteProduceService(id);

  if (!deleted) throw new NotFoundException('Produce not found');

  return res.status(200).json({
    success: true,
    message: 'Produce deleted successfully',
  });
});
