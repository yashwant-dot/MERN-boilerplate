const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EmployeeSessionSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('EmployeeSession', EmployeeSessionSchema);
