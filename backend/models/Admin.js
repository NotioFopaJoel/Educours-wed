const mongoose = require('mongoose');
const User = require('./User');
const { ROLES } = require('../utils/constants');

const adminSchema = new mongoose.Schema({
  superAdmin: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Admin = User.discriminator(ROLES.ADMIN, adminSchema);

module.exports = Admin;
