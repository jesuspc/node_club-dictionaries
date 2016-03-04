module.exports = function(fetch) {
    var path = require('path'),
        service  = require('express')();

    service.set('views', path.join('../' + __dirname, 'views'));
    service.set('view engine', 'jade');

    service.use(fetch('middleware.logger'));
    service.use(fetch('middleware.bodyParser.json'));
    service.use(fetch('middleware.bodyParser.urlEncoded'));
    service.use(fetch('middleware.cookieParser'));
    service.use(fetch('middleware.publicFiles'));
    service.use(fetch('middleware.session'));
    service.use('/admin/healthcheck', fetch('middleware.healthcheck'));
    service.use('/swagger', fetch('middleware.swaggerUi'));
    service.use('/api/v1.0', fetch('dictionaries.api.middleware'));
    service.use(fetch('middleware.errorHandler.notFound'));

    if(service.get('env') === 'development'){
      service.use(fetch('middleware.errorHandler.stackTrace'));
    } else {
      service.use(fetch('middleware.errorHandler.silent'));
    }

    return service;
}