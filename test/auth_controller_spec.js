var AuthController = require('../controllers/auth');

var response = {
  setHeader: jasmine.createSpy('response.setHeader'),
  write: jasmine.createSpy('response.write')
}
var request = { url: '/' };

var token;

describe('Auth controller', function(){

  it('should unsuccess log in', function(){

    response.end = function() {

      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(response.write).toHaveBeenCalledWith(JSON.stringify({ token: null }));
    };
    AuthController.login(request, response, { name: 'hobbit', pass: 'qwerty' });
  });

  it('should success log in', function(){

    response.write.andCallFake(function(data){
      token = JSON.parse(data).token;
    });
    response.end = function() {

      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(response.write).toHaveBeenCalledWith(JSON.stringify({ token: token }));
    };
    AuthController.login(request, response, { name: 'hobbit', pass: '1234' });
  });

  it('should return same token when repat login', function(){

    response.write.andCallFake(function(){});
    response.end = function() {

      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(response.write).toHaveBeenCalledWith(JSON.stringify({ token: token }));
    };
    AuthController.login(request, response, { name: 'hobbit', pass: '1234' });
  });

  it('should success log out', function(){

    response.end = function() {

      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(response.write).toHaveBeenCalledWith(JSON.stringify({ status: true }));
    };
    AuthController.logout(request, response, { token: token });
  });

  it('should retrun anotner token when log in', function(){

    var newToken;

    response.write.andCallFake(function(data){
      newToken = JSON.parse(data).token;
    });
    response.end = function() {

      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(token).not.toEqual(newToken);
    };
    AuthController.login(request, response, { name: 'hobbit', pass: '1234' });
  });
});