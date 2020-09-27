const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EmployeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

EmployeeSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

EmployeeSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Employee', EmployeeSchema);
