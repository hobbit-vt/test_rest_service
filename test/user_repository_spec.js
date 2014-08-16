var userRepo = require('../models/user_repository');

var token;

describe('User repository', function(){

  it('should generate unique token', function(){

    var token1 = userRepo._generateToken();
    var token2 = userRepo._generateToken();
    var token3 = userRepo._generateToken();

    expect(token1).not.toEqual(token2);
    expect(token2).not.toEqual(token3);
  });

  it('shouldn\'t log in', function(){

    var token = userRepo.login('hobbit', 'qwerty');
    expect(token).toEqual(null);
  });

  it('should log in', function(){

    token = userRepo.login('hobbit', '1234');
    expect(userRepo._loggedUser[token]).toEqual('hobbit');
  });

  it('should validate valid token', function(){

    expect(userRepo.validateToken(token)).toBeTruthy();
  });

  it('should not validate invalid token', function(){

    expect(userRepo.validateToken('invalid token')).toBeFalsy();
  });

  it('should log out', function(){

    userRepo.logout(token);
    expect(userRepo._loggedUser[token]).toBeUndefined();
    expect(userRepo.validateToken(token)).toBeFalsy();
  });
});