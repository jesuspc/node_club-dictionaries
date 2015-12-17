module.exports = function(opts){
  var router = opts.router;
  var transactions = opts.transactions;
  var parameterizer = opts.parameterizer;
  var authorize = opts.authorize;
  var serialize = opts.serialize;

  var scopeFilters = function(filters, namespace) {
    filters.meta = filters.meta || {};
    filters.meta.uuid = namespace.uuid;
    filters.meta.scope = namespace.scope;
    return filters;
  };

  router.get('/:scope/:uuid/dictionaries.json', parameterizer.default, parameterizer.filterFormat, authorize, function(req, res, next) {
    var filters = scopeFilters(req.query.filters, req.params);
    var handleResponse = function(dictionaries) {
      res.json(dictionaries.map(function(dict){
        return serialize(dict);
      }));
    };

    transactions.index(filters).then(handleResponse);
  });

  router.get('/:scope/:uuid/dictionaries/:name.json', parameterizer.default, authorize, function(req, res, next) {
    var filters = scopeFilters({name: req.params.name}, req.params);
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
    var filters = scopeFilters({name: req.params.name}, req.params);
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
    var filters = scopeFilters({name: req.params.name}, req.params);
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
