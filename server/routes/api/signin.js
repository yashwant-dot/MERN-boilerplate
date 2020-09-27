const Employee = require('../../models/Employee');
const EmployeeSession = require('../../models/EmployeeSession');

module.exports = (app) => {

  app.post('/api/account/signup', (req, res, next) => {
    const { body } = req;
    const {
      firstName,
      lastName,
      password
    } = body;

    let { email } = body;

    // Validation
    if(!firstName){
      return res.send({
        success: false,
        message: 'Error: First Name cannot be null'
      });
    }
    if(!lastName){
      return res.send({
        success: false,
        message: 'Error: Last Name cannot be null'
      });
    }
    if(!email){
      return res.send({
        success: false,
        message: 'Error: Email cannot be null'
      });
    }
    if(!password){
      return res.send({
        success: false,
        message: 'Error: Password cannot be null'
      });
    }

    email = email.toLowerCase();

    // Verify if email already exists
    Employee.find({
      email: email
    }, (err, previousUser) => {
      if(err){
        return res.send({
          success: false,
          message: 'Error: Server Error'
        });
      } else if(previousUser.length > 0) {
        return res.send({
          success: false,
          message: 'Error: Email Already Exists'
        });
      }

      // Save the new user
      const newEmployee = new Employee();

      newEmployee.firstName = firstName;
      newEmployee.lastName = lastName;
      newEmployee.email = email;
      console.log(newEmployee.email);
      newEmployee.password = newEmployee.generateHash(password);
      newEmployee.save((err, employee) => {
        if(err) {
          return res.send({
            success: false,
            message: 'Error: Server Error'
          });
        }
        return res.send({
          success: true,
          message: 'Signed Up'
        });
      });
    });

  });

  app.post('/api/account/signin', (req, res, next) => {
    const { body } = req;
    const { password } = body;
    let { email } = body;

    // Validation
    if(!email){
      return res.send({
        success: false,
        message: 'Error: Email cannot be null'
      });
    }
    if(!password){
      return res.send({
        success: false,
        message: 'Error: Password cannot be null'
      });
    }

    email = email.toLowerCase();

    Employee.find({
      email: email
    }, (err, employees) => {
      if(err){
        return res.send({
          success: false,
          message: 'Error: Server Error'
        });
      }

      const employee = employees[0];
      if(!employee.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Error: Invalid Password'
        })
      }

      // Otherwise create user session
      const employeeSession = new EmployeeSession();
      employeeSession.employeeId = employee._id;
      employeeSession.save((err, doc) => {
        if(err){
          return res.send({
            success: false,
            message: 'Error: Server Error'
          });
        }

        return res.send({
          success: true,
          message: 'Valid  Sign In',
          token: doc._id
        });
      });
    });
  });

  app.get('/api/account/verify', (req, res, next) => {

    // Get the token
    const { query } = req;
    const { token } = query;

    // Verify the token is one of a kind and not deleted
    EmployeeSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if(err) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      }

      return res.send({
        success: true,
        message: 'Nice!'
      });
    });
  });

  app.get('/api/account/logout', (req, res, next) => {

    // Get the token
    const { query } = req;
    const { token } = query;

    // Verify the token is one of a kind and not deleted
    EmployeeSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    }, {$set: {isDeleted: true}}, null, (err, sessions) => {
      if(err) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      }

      return res.send({
        success: true,
        message: 'Logged Out!'
      });
    });
  });


}  