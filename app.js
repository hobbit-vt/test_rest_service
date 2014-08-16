var HTTP            = require('http'),
    Router          = require('./router');
    StaticResolver  = require('./static_resolver');

var router = new Router();
var staticResolver = new StaticResolver('public/');
	
HTTP.createServer(function(request, response) {

  response.statusCode = 200;

  if (!router.resolve(request, response)) {

    if (!staticResolver.resolve(request, response)) {

      response.statusCode = 404;
      response.end();
    }
  }
}).listen(3000);


var homeController    = require('./controllers/home'),
    authController    = require('./controllers/auth'),
    storageController = require('./controllers/storage');

router.get('/', homeController.index);

router.post('/login/:name/:pass', authController.login);
router.post('/logout/:token', authController.logout);

router.get('/storage/:token', storageController.findAll);
router.get('/storage/:key/:token', storageController.findByKey);

router.post('/storage/:token', storageController.add);
router.put('/storage/:key/:token', storageController.update);
router.delete('/storage/:key/:token', storageController.delete);