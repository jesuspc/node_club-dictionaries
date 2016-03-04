module.exports = function(boxer) {
  boxer.bind('app', function() {
    var path = require('path'),
        app  = require('express')();

    app.set('views', path.join('../' + __dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(boxer.fetch('middleware.logger'));
    app.use(boxer.fetch('middleware.bodyParser.json'));
    app.use(boxer.fetch('middleware.bodyParser.urlEncoded'));
    app.use(boxer.fetch('middleware.cookieParser'));
    app.use(boxer.fetch('middleware.publicFiles'));
    app.use(boxer.fetch('middleware.session'));
    app.use('/admin/healthcheck', boxer.fetch('middleware.healthcheck'));
    app.use('/swagger', boxer.fetch('middleware.swaggerUi'));
    app.use('/api/v1.0', boxer.fetch('dictionaries.api.middleware'));
    app.use(boxer.fetch('middleware.errorHandler.notFound'));

    if(app.get('env') === 'development'){
      app.use(boxer.fetch('middleware.errorHandler.stackTrace'));
    } else {
      app.use(boxer.fetch('middleware.errorHandler.silent'));
    }

    return app;
  }).asSingleton();
};


