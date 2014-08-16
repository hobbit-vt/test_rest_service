var FS    = require('fs'),
    Path  = require('path'),
    Url   = require('url');

var MIME = {
  '.js'   : 'application/javascript',
  '.html' : 'text/html'
}

var StaticResolver = function(path) {

  this._basePath = path || './';
}
StaticResolver.prototype.resolve = function(request, response) {
  
  var result = false;
  var url = Url.parse(request.url).path;
  
  if (url[url.length - 1] !== '/') {

    var path = Path.join(this._basePath, url),
        contentType = StaticResolver._resolveContentType(path);

    if (FS.existsSync(path)) {

      result = true;

      response.setHeader('Content-Type', contentType);
      FS.readFile(path, function(err, data) {

        if(err) {

          response.statusCode = 500;
          response.end();

        } else {

          response.write(data.toString());
          response.end();
        }
      });
    }
  }
  return result;
};
StaticResolver._resolveContentType = function(path){

  var result = 'text/plain',
      extname = Path.extname(path);

  if (MIME[extname]) {

    result = MIME[extname];
  }
  return result;
}

module.exports = StaticResolver;