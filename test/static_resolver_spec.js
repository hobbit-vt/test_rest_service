var FS = require('fs');
var StaticResolver = require('../static_resolver');

var staticResolver = new StaticResolver('./');

describe('StaticResolver', function() {

  it('should determine content type', function(){
    
    expect(StaticResolver._resolveContentType('app.js')).toEqual('application/javascript');
    expect(StaticResolver._resolveContentType('app.html')).toEqual('text/html');
    expect(StaticResolver._resolveContentType('app')).toEqual('text/plain');
    expect(StaticResolver._resolveContentType('app.ext')).toEqual('text/plain');
    
  });

  it('should write file', function(done){

    var fileContent = FS.readFileSync('test/test_file.html').toString();

    var response = {
      setHeader: jasmine.createSpy('response.setHeader'),
      write: jasmine.createSpy('response.write'),
      end: function() { 

        expect(response.write).toHaveBeenCalledWith(fileContent);
        expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'text/html');
        done(); 
      }
    };
    var request = {
      url: '/test/test_file.html'
    };

    expect(staticResolver.resolve(request, response)).toBeTruthy();
  });

  it('shouldn\'t write file', function(){

    var response  = {},
        request   = {url: '/sasd/asd.ts'};

    expect(staticResolver.resolve(request, response)).toBeFalsy();
  });
});
