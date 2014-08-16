var StorageRepo = require('../models/storage_repository');

var object1;
var object2;

describe('Storage respository', function(){

  it('should add object', function(){

    object1 = StorageRepo.add('val1');
    object2 = StorageRepo.add('val2');

    expect(StorageRepo._objectHash[object1.key]).toEqual(object1.val);
    expect(StorageRepo._objectHash[object2.key]).toEqual(object2.val);
  });

  it('should find all objects', function(){

    expect(StorageRepo.findAll()).toEqual([object1, object2]);
  });

  it('should find object by ley', function(){

    expect(StorageRepo.find(object1.key)).toEqual(object1);
  });
  it('shouldn\'t find object by ley', function(){

    expect(StorageRepo.find('invalid key')).toEqual(null);
  });

  it('should update object', function(){

    object2.val = 'new val2';
    StorageRepo.update(object2.key, object2.val);

    expect(StorageRepo._objectHash[object2.key]).toEqual(object2.val);
  });

  it('should delete object', function(){

    StorageRepo.delete(object2.key);

    expect(StorageRepo.findAll()).toEqual([object1]);
  });
});