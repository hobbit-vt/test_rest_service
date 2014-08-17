var Helper = require('../helper');

var Storage = function(){

  this._objectHash = {};
};
Storage.prototype = {
  constructor: Storage,

  /**
   * Finds all objects in storage
   * @return {Array} All objects in storage
   */
  findAll: function() {

    var result = [];

    for (var key in this._objectHash) {

      result.push({
        key: key, 
        val: this._objectHash[key]
      });
    }
    return result;
  },
  /**
   * Finds object by key
   * @param {String} key Object key in storage
   * @return {Object} Specific object
   */
  find: function(key) {

    var result = null;

    if (this._objectHash[key]) {

      result = {
        key: key,
        val: this._objectHash[key] 
      };
    }
    return result;
  },
  /**
   * Adds object into storage
   * @param {[type]} val Value for new object
   * @return {Object} Added object
   */
  add: function(val){

    var key = Helper.generateId();

    this._objectHash[key] = val;

    return {
      key: key,
      val: val
    };
  },
  /**
   * Updates storage's object
   * @param {String} key Object key
   * @param {String} val Object val
   */
  update: function(key, val){

    var result = false;

    if (this._objectHash[key]) {

      this._objectHash[key] = val;
      result = true;
    }
    return result;
  },
  /**
   * Deletes storage's object
   * @param {String} key Object key
   */
  delete: function(key) {

    result = false;

    if (this._objectHash[key]) {

      delete this._objectHash[key];
      result = true;
    }
    return result;
  }
}

module.exports = new Storage();