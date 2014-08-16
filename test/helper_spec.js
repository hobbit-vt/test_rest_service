var Helper = require('../helper');

describe('Helper', function(){

  it('should generate random id', function(){

    var token1 = Helper.generateId();
    var token2 = Helper.generateId();
    var token3 = Helper.generateId();

    expect(token1).not.toEqual(token2);
    expect(token2).not.toEqual(token3);
  });
});