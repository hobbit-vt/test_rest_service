var UserRepo = require('../models/user_repository');

var authController = {
  login: function(req, res, query){

    var dataToResponse = {
      token: null
    };

    if (query.name && query.pass) {

      dataToResponse.token = UserRepo.login(query.name, query.pass);
    } 

    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(dataToResponse));

    res.end();
  },
  logout: function(req, res, query){

    var dataToResponse = {
      status: false
    }

    if(query.token) {

      dataToResponse.status = UserRepo.logout(query.token);
    }

    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(dataToResponse));

    res.end();
  }
};

module.exports = authController;