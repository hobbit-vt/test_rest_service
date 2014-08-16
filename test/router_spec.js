var Router = require('../router');
//initializes router
var router = new Router();
//prepares spies for listeners
var rootListenerGet = jasmine.createSpy('rootListenerGet');
    
var loginListenerPost = jasmine.createSpy('loginListenerPost');
var logoutListerGet = jasmine.createSpy('logoutListerGet');

var storageAllListenerGet = jasmine.createSpy('storageAllListenerGet');
var storageKeyListenerGet = jasmine.createSpy('storageKeyListenerGet');

var storageAddListenerPost = jasmine.createSpy('storageAddListenerPost');
var storageUpdateListenerPut = jasmine.createSpy('storageUpdateListenerPut');
var storageDeleteListenerDelete = jasmine.createSpy('storageDeleteListenerDelete');


describe('router', function() {

  it('static should separate an url', function() {

    expect(Router.separateUrl('/asd1/:asd2/asd3/')).toEqual(['asd1', ':asd2', 'asd3']);
    expect(Router.separateUrl('/asd1/:asd2/asd3')).toEqual(['asd1', ':asd2', 'asd3']);
    expect(Router.separateUrl('asd1/:asd2/asd3/')).toEqual(['asd1', ':asd2', 'asd3']);
    expect(Router.separateUrl('asd1/:asd2/asd3')).toEqual(['asd1', ':asd2', 'asd3']);

    expect(Router.separateUrl('/')).toEqual([]);
  });

  it('static should build a route', function() {

    expect(Router._buildRoute('/asd1/:asd2/asd3/', 3)).toEqual({ parts: ['asd1', ':asd2', 'asd3'], listener: 3 });
    expect(Router._buildRoute('/', 3)).toEqual({ parts: ['/'], listener: 3 });
  });

  it('static should detect dynamic route', function() {

    expect(Router._isDynamicRoutePart(':asd')).toBeTruthy();
    expect(Router._isDynamicRoutePart('asd')).toBeFalsy();
  });

  it('should add routes', function() {

    router.get('/', rootListenerGet);

    router.post('/login/:login/:pass', loginListenerPost);
    router.get('/logout/:token', logoutListerGet);

    router.get('/storage/:token', storageAllListenerGet);
    router.get('/storage/:key/:token', storageKeyListenerGet);

    router.post('/storage/:token', storageAddListenerPost);
    router.put('/storage/:key/:token', storageUpdateListenerPut);
    router.delete('/storage/:key/:token', storageDeleteListenerDelete);

    expect(router._routes.get[0]).toEqual({ parts: ['/'], listener: rootListenerGet });

    expect(router._routes.post[0]).toEqual({ parts: ['login', ':login', ':pass'], listener: loginListenerPost });
    expect(router._routes.get[1]).toEqual({ parts: ['logout', ':token'], listener: logoutListerGet });

    expect(router._routes.get[2]).toEqual({ parts: ['storage', ':token'], listener: storageAllListenerGet });
    expect(router._routes.get[3]).toEqual({ parts: ['storage', ':key', ':token'], listener: storageKeyListenerGet });

    expect(router._routes.post[1]).toEqual({ parts: ['storage', ':token'], listener: storageAddListenerPost });
    expect(router._routes.put[0]).toEqual({ parts: ['storage', ':key', ':token'], listener: storageUpdateListenerPut });
    expect(router._routes.delete[0]).toEqual({ parts: ['storage', ':key', ':token'], listener: storageDeleteListenerDelete });
  });

  it('should invoke listener', function(){

    var request = {},
        response = {};

    request = {url: '/', method: 'GET'};
    expect(router.resolve(request, response)).toBeTruthy();
    expect(rootListenerGet).toHaveBeenCalledWith(request, response);

    request = {url: '/login/asd/sdf', method: 'POST'};
    expect(router.resolve(request, response)).toBeTruthy();
    expect(loginListenerPost).toHaveBeenCalledWith(request, response, { login: 'asd', pass: 'sdf' });

    request = {url: '/logout/someToken', method: 'GET'};
    expect(router.resolve(request, response)).toBeTruthy();
    expect(logoutListerGet).toHaveBeenCalledWith(request, response, { token: 'someToken' });

    request = {url: '/storage/someToken', method: 'GET'};
    expect(router.resolve(request, response)).toBeTruthy();
    expect(storageAllListenerGet).toHaveBeenCalledWith(request, response, { token: 'someToken' });

    request = {url: '/storage/someKey/someToken', method: 'GET'};
    expect(router.resolve(request, response)).toBeTruthy();
    expect(storageKeyListenerGet).toHaveBeenCalledWith(request, response, { key: 'someKey', token: 'someToken' });

    request = {url: '/storage/someToken', method: 'POST'};
    expect(router.resolve(request, response)).toBeTruthy();
    expect(storageAddListenerPost).toHaveBeenCalledWith(request, response, { token: 'someToken' });

    request = {url: '/storage/someToken', method: 'POST'};
    expect(router.resolve(request, response)).toBeTruthy();
    expect(storageAddListenerPost).toHaveBeenCalledWith(request, response, { token: 'someToken' });

    request = {url: '/storage/someKey/someToken', method: 'PUT'};
    expect(router.resolve(request, response)).toBeTruthy();
    expect(storageUpdateListenerPut).toHaveBeenCalledWith(request, response, { key: 'someKey', token: 'someToken' });

    request = {url: '/storage/someKey/someToken', method: 'DELETE'};
    expect(router.resolve(request, response)).toBeTruthy();
    expect(storageDeleteListenerDelete).toHaveBeenCalledWith(request, response, { key: 'someKey', token: 'someToken' });

    request = {url: '/asdasd/asdasddas', method: 'GET'};
    expect(router.resolve(request, response)).toBeFalsy();
  });
});