module.exports = function(opts){
  var router = opts.router;
  var transactions = opts.transactions;
  var parameterizer = opts.parameterizer;
  var authorize = opts.authorize;
  var serialize = opts.serialize;

  router.get('/:scope/:uuid/dictionaries.json', parameterizer.default, parameterizer.filterFormat, authorize, function(req, res, next) {
    req.query.filters['meta.uuid'] = req.params.uuid;
    req.query.filters['meta.scope'] = req.params.scope;
    var handleResponse = function(dictionaries) {
      res.json(dictionaries.map(function(dict){
        return serialize(dict);
      }));
    };
    transactions.index(req.query.filters).then(handleResponse);
  });

  router.get('/:scope/:uuid/dictionaries/:name.json', parameterizer.default, authorize, function(req, res, next) {
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

  router.put('/:scope/:uuid/dictionaries/:name.json', parameterizer.default, parameterizer.nameInBody, authorize, function(req, res, next) {
    var filters = {'meta.uuid': req.params.uuid, 'meta.scope': req.params.scope, name: req.params.name};

    var handleResponse = function(dictionary) {
      if(dictionary) {
        res.json(serialize(dictionary));
      } else {
        res.sendStatus(200);
      }
    };

    transactions.upsert(filters, req.body).then(handleResponse);
  });

  router.delete('/:scope/:uuid/dictionaries/:name.json', parameterizer.default, authorize, function(req, res, next) {
    var filters = {'meta.uuid': req.params.uuid, 'meta.scope': req.params.scope, name: req.params.name};
    var handleResponse = function(dictionary) {
      if(dictionary) {
        res.json(serialize(dictionary));
      } else {
        res.sendStatus(404);
      }
    };

    transactions.destroy(filters).then(handleResponse);
  });

  return router;
};
