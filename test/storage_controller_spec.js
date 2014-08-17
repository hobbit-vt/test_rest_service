var UserRepo          = require('../models/user_repository'),
    StorageController = require('../controllers/storage');

describe('Storage controller', function(){

  var response = {
  setHeader: jasmine.createSpy('response.setHeader'),
    write: jasmine.createSpy('response.write')
  }
  var request = { url: '/' };

  var token;
  var objectKeys = [];
  var objectVals = ['some val1', 'some val2'];

  beforeEach(function(){

    token = UserRepo.login('hobbit', '1234');
  });

  afterEach(function(){

    UserRepo.logout(token);
  });

  it('should return 401 status', function(){

    response.end = function(){

      expect(response.statusCode).toEqual(401);
      expect(response.write).not.toHaveBeenCalled();
    };
    
    StorageController.findAll(request, response, { token: 'wrong token' });
    delete response.statusCode;
    StorageController.findAll(request, response, { });
    delete response.statusCode;

    StorageController.find(request, response, { key: 'asd', token: 'wrong token' });
    delete response.statusCode;

    StorageController.add(request, response, { token: 'wrong token' });
    delete response.statusCode;

    StorageController.update(request, response, { token: 'wrong token' });
    delete response.statusCode;

    StorageController.delete(request, response, { token: 'wrong token' });
    delete response.statusCode;
  });

  it('should add object', function(){

    response.write.andCallFake(function(data){

      objectKeys.push(JSON.parse(data).key);
    });
    response.end = function(){

      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(response.write).toHaveBeenCalledWith(JSON.stringify({ key: objectKeys[callCount], val: objectVals[callCount] }));
    }

    var callCount = 0;
    StorageController.add(request, response, { val: 'some val1', token: token });
    callCount = 1;
    StorageController.add(request, response, { val: 'some val2', token: token });
  });

  it('should findAll objects', function(){

    response.write.andCallFake(function(){});
    response.end = function(){

      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(response.write).toHaveBeenCalledWith(JSON.stringify([
        { key: objectKeys[0], val: objectVals[0] },
        { key: objectKeys[1], val: objectVals[1] }
      ]));
    }

    StorageController.findAll(request, response, { token: token });
  });

  it('should find object', function(){

    response.end = function(){

      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(response.write).toHaveBeenCalledWith(JSON.stringify({ key: objectKeys[0], val: objectVals[0] }));
    }

    StorageController.find(request, response, { key: objectKeys[0], token: token });
  });

  it('should update object', function(){

    response.end = function(){

      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(response.write).toHaveBeenCalledWith(JSON.stringify(true));
    }

    objectVals[1] = 'somve val2 new';
    StorageController.update(request, response, { key: objectKeys[1], val: objectVals[1], token: token });
  });

  it('should delete object', function(){

    response.end = function(){

      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(response.write).toHaveBeenCalledWith(JSON.stringify(true));
    }

    StorageController.delete(request, response, { key: objectKeys[0], token: token });
    StorageController.delete(request, response, { key: objectKeys[1], token: token });
  });
});