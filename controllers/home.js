var FS = require('fs');

homeController = {
  index: function(request, response){

    FS.readFile('public/index.html', function(err, data){

      if(err) {

        response.statusCode = 500;
        response.end();  
      
      } else {

        response.write(data);
        response.end();
      }
    });
  }
}

module.exports = homeController;