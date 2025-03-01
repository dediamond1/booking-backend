const Tenant = require('../models/tenant.model');

// Create a new tenant
exports.createTenant = async (req, res) => {
  const { name, domain } = req.body;

  if (!name || !domain) {
    return res.status(400).send({ message: 'Tenant name and domain are required' });
  }

  try {
    const tenant = new Tenant(req.body);
    const savedTenant = await tenant.save();
    res.status(201).send(savedTenant);
  } catch (error) {
    res.status(400).send({ message: 'Error creating tenant', error: error.message });
  }
};

// Get a tenant by ID
exports.getTenant = async (req, res) => {
  res.status(200).send({ message: "getTenant Controller function is under construction." });
};

// Get all tenants
exports.getAllTenants = async (req, res) => {
  res.status(200).send({ message: "getAllTenants Controller function is under construction." });
};

// Update a tenant by ID
exports.updateTenant = async (req, res) => {
  res.status(200).send({ message: "updateTenant Controller function is under construction." });
};

// Delete a tenant by ID
exports.deleteTenant = async (req, res) => {
  res.status(200).send({ message: "deleteTenant Controller function is under construction." });
};
