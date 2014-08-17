var UserRepo    = require('../models/user_repository'),
    StorageRepo = require('../models/storage_repository');

var storageController = {

  findAll: function(req, res, query){

    if(query.token && UserRepo.validateToken(query.token)) {

      var result = StorageRepo.findAll();

      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(result));

    } else {

      res.statusCode = 401;
    }
    res.end();
  },
  find: function(req, res, query){

    if(query.token && query.key && UserRepo.validateToken(query.token)) {

      var result = StorageRepo.find(query.key);

      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(result));

    } else {

      res.statusCode = 401;  
    }
    res.end();
  },
  add: function(req, res, query){

    if(query.token && query.val && UserRepo.validateToken(query.token)) {

      var result = StorageRepo.add(query.val);

      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(result));

    } else {

      res.statusCode = 401;  
    }
    res.end();
  },
  update: function(req, res, query){

    if(query.token && query.key && query.val && UserRepo.validateToken(query.token)) {

      var result = StorageRepo.update(query.key, query.val);

      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(result));

    } else {

      res.statusCode = 401;
    }
    res.end();
  },
  delete: function(req, res, query){

    if(query.token && query.key && UserRepo.validateToken(query.token)) {

      var result = StorageRepo.delete(query.key);

      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(result));

    } else {

      res.statusCode = 401;  
    }
    res.end();
  },
};

module.exports = storageController;