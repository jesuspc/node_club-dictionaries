module.exports = function(inject) {
  var path = require('path'),
      app  = require('express')();

  app.set('views', path.join('../' + __dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(inject('middleware.logger'));
  app.use(inject('middleware.bodyParser.json'));
  app.use(inject('middleware.bodyParser.urlEncoded'));
  app.use(inject('middleware.cookieParser'));
  app.use(inject('middleware.publicFiles'));
  app.use(inject('middleware.session'));
  app.use('/admin/healthcheck', inject('middleware.healthcheck'));
  app.use('/swagger', inject('middleware.swaggerUi'));
  app.use('/api/v1.0', inject('dictionaries.api.middleware'));
  app.use(inject('middleware.errorHandler.notFound'));

  if(app.get('env') === 'development'){
    app.use(inject('middleware.errorHandler.stackTrace'));
  } else {
    app.use(inject('middleware.errorHandler.silent'));
  }

  return app;
};