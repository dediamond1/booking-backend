const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9-_]+$/.test(v);
      },
      message: 'Tenant name must be alphanumeric and can include hyphens or underscores'
    }
  },
  domain: {
    type: String,
    required: true,
    unique: true,
  },
  companyLogo: {
    type: String, // URL or path to company logo
  },
  contactEmail: {
    type: String,
  },
  address: {
    type: String,
  },
  website: {
    type: String,
  },
  timezone: {
    type: String,
  },
  currency: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;
