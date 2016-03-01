module.exports = function(inject){
  var router = inject('router');
  var parameterizer = inject('parameterizer');
  var authorize = inject('authorize');
  var serialize = inject('serialize');
  var index_transaction = inject('transactions.index');
  var show_transaction = inject('transactions.show');
  var upsert_transaction = inject('transactions.upsert');
  var destroy_transaction = inject('transactions.destroy');


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

    index_transaction(filters).then(handleResponse);
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

    show_transaction(filters).then(handleResponse);
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

    upsert_transaction(filters, req.body).then(handleResponse);
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

    destroy_transaction(filters).then(handleResponse);
  });

  return router;
};
