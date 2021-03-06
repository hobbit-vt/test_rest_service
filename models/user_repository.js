var Helper = require('../helper');
/**
 * Constant, user list who have permission to system
 * @type {Array}
 */
var USERS = [{
  name: 'hobbit',
  pass: '1234'
}];

var User = function(){
  /**
   * Logged user object
   * key: user token,
   * val: user name
   * @type {Object}
   */
  this._loggedUser = {};
};
User.prototype = {
  constructor: User,
  /**
   * Logs user in system
   * @param {String} name User name
   * @param {String} pass User pass
   * @return {String} user token or null
   */
  login: function(name, pass) {

    var token = null;

    for (var i = 0; i < USERS.length; i++) {

      if (USERS[i].name === name && USERS[i].pass === pass) {

        for(var userToken in this._loggedUser) {

          if(this._loggedUser[userToken] === name) {

            token = userToken;
            break;
          }
        }
        if(!token) {

          token = Helper.generateId();
        }
        this._loggedUser[token] = name;

        break;
      }
    }
    return token;
  },
  /**
   * Validates user token
   * @param {String} token User token
   * @return {Boolean} Whether a valid token
   */
  validateToken: function(token) {

    var result = false;

    if (this._loggedUser[token]) {

      result = true;
    }
    return result;
  },
  /**
   * Logs user out
   * @param {String} token User token
   */
  logout: function(token){

    var result = false;

    if (this._loggedUser[token]) {

      result = true;
      delete this._loggedUser[token];
    }
    return result;
  }
};

module.exports = new User();