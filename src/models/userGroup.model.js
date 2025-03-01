const mongoose = require('mongoose');

const userGroupSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant',
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  permissions: {
    type: mongoose.Schema.Types.Mixed, // Flexible permissions object
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  userCount: {
    type: Number,
    default: 0,
  },
  defaultRoles: [{
    type: String, // Array of default roles for users in this group
  }],
  groupType: {
    type: String, // e.g., 'department', 'team', 'customer-segment'
  },
});

const UserGroup = mongoose.model('UserGroup', userGroupSchema);

module.exports = UserGroup;
