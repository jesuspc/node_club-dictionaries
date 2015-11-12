module.exports = function(opts){
  var router = opts.router;

  var transactions = opts.transactions;

  var parameterize = opts.parameterize;
  var authorize = opts.authorize;

  var serialize = opts.serialize;

  router.get('/:scope/:uuid/dictionaries.json', parameterize, authorize, function(req, res, next) {
    var filters = {'meta.uuid': req.params.uuid, 'meta.scope': req.params.scope};
    var handleResponse = function(dictionaries) {
      res.json(dictionaries.map(function(dict){
        return serialize(dict);
      }));
    };

    transactions.index(filters).then(handleResponse);
  });

  router.get('/:scope/:uuid/dictionaries/:name.json', parameterize, authorize, function(req, res, next) {
    var filters = {'meta.uuid': req.params.uuid, 'meta.scope': req.params.scope, name: req.params.name};
    var handleResponse = function(dictionary) {
      if(dictionary) {
        res.json(serialize(dictionary));
      } else {
        res.sendStatus(404);
      }
    };

    transactions.show(filters).then(handleResponse);
  });

  router.put('/:scope/:uuid/dictionaries/:name.json', parameterize, authorize, function(req, res, next) {

  });

  router.delete('/:scope/:uuid/dictionaries/:name.json', parameterize, authorize, function(req, res, next) {

  });

  return router;
};