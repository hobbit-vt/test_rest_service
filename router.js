var Url = require('url');

var Router = function(){

  this._routes = {
    get: [],
    post: [],
    put: [],
    delete: []
  };
};
Router.prototype = {

  constructor: Router,

  get: function(path, listener){

    var route = Router._buildRoute(path, listener);
    this._routes.get.push(route);
  },
  post: function(path, listener){

    var route = Router._buildRoute(path, listener);
    this._routes.post.push(route);
  },
  put: function(path, listener){

    var route = Router._buildRoute(path, listener);
    this._routes.put.push(route);
  },
  delete: function(path, listener){

    var route = Router._buildRoute(path, listener);
    this._routes.delete.push(route);
  },
  /**
   * Resolves route and invoke listener
   * @param {Object} request Request http object
   * @param {Object} response Response http object
   * @return {Boolean} Is listener resolved
   */
  resolve: function(request, response){

    var result = false,
        routesByMethod = this._routes[ request.method.toLowerCase() ],
        urlParts = Router.separateUrl( 
                     Url.parse(request.url).path
                   );

    if (routesByMethod !== undefined) {

      if (urlParts.length === 0) {

        for (var i = 0; i < routesByMethod.length; i++) {
          
          if (routesByMethod[i].parts[0] === '/') {

            result = true;
            routesByMethod[i].listener(request, response);
            break;
          }
        }
      } else {

        var curentRoutes = routesByMethod,
            newCurrentRoutes = [];
        //resolve necessary route       
        for (var i = 0; i < urlParts.length; i++) {

          if (curentRoutes.length !== 0) {

            for (var j = 0; j < curentRoutes.length; j++) {
              
              var part = curentRoutes[j].parts[i] || '';
              var isDynamicPart = Router._isDynamicRoutePart(part);

              if (part === urlParts[i] || isDynamicPart) {

                newCurrentRoutes.push(curentRoutes[j]);
              }
            }
            curentRoutes = newCurrentRoutes.slice(0);
            newCurrentRoutes.length = 0;
          } else {

            break;
          }
        }
        //invoke listener
        if(curentRoutes.length !== 0) {

          result = true;
          var dynamicProperties = Router._getDynamicProperties(curentRoutes[0], urlParts);
          curentRoutes[0].listener(request, response, dynamicProperties);
        }
      }
    }
    return result;
  }
}
/**
 * Separates url into an array
 * @param  {String} url
 * @return {Array} array with url's part
 */
Router.separateUrl = function(url){
  //validate url
  if (url[0] === '/') {

    url = url.substr(1);
  }    
  if (url[url.length - 1] === '/') {

    url = url.substr(0, url.length - 1);
  }
  //separate url
  return url === '' ? [] : url.split('/');
};
/**
 * Builds route object by path and listener
 * @param  {String} path
 * @param  {Function} listener 
 * @return {Object} Route object
 */
Router._buildRoute = function(path, listener) {

  var result = {};
  
  if(path === '/') {

    result.parts = ['/'];    

  } else {

    result.parts = Router.separateUrl(path);
  }
  result.listener = listener;

  return result;
};
/**
 * Extracts name of dynamic part of route
 * @param  {String} routePart dynamic part of route
 * @return {String} dynamic part or null
 */
Router._isDynamicRoutePart = function(routePart){

  var result = false;
  
  if(routePart.indexOf(':') === 0) {

    result = true;
  }
  return result;
};
/**
 * Gets dynamic properties for route
 * @param  {Object} route    
 * @param  {Array} urlParts separated url
 * @return {Object} dynamic properties for route
 */
Router._getDynamicProperties = function(route, urlParts){

  var dynamicProperties = {};

  for (var i = 0; i < route.parts.length; i++) {
    
    var part = route.parts[i];
    var isDynamicPart = Router._isDynamicRoutePart(part);

    if(isDynamicPart) {

      dynamicProperties[part.substr(1)] = urlParts[i]; 
    }
  }
  return dynamicProperties;
}

module.exports = Router;