import Produce from '../models/produce.model.js';
/**
 * @desc Save a new produce to the database
 * @param {Object} produceData - all fields to store
 */

export const createProduceService = async (produceData) => {
  return await Produce.create(produceData);
};

// Get all lists of produce from the database
export const getAllProduceService = async () => {
  return await Produce.findAll();
};

// Get a single produce by Id
export const getProduceService = async (id) => {
  return await Produce.findByPk(id);
};

// Update a produce
export const updateProduceService = async (id, updateData) => {
  const produce = await Produce.findByPk(id);

  if (!produce) return null;

  return await produce.update(updateData);
};

// Delete a produce
export const deleteProduceService = async (id) => {
  const produce = await Produce.findByPk(id);
  if (!produce) return null;

  return await produce.destroy();
};
