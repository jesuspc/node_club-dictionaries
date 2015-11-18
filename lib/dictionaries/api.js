module.exports = function(opts){
  var router = opts.router;

  var transactions = opts.transactions;

  var parameterize = opts.parameterize;
  var authorize = opts.authorize;

  var serialize = opts.serialize;

  router.get('/:scope/:uuid/dictionaries.json', parameterize, authorize, function(req, res, next) {
    var filters = {'meta.uuid': req.params.uuid, 'meta.scope': req.params.scope};
    if(req.query.filters){
      filters.name = req.query.filters
    }
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
    var upsertParameterizer = function(dictionaryData, params){
      var filters = {'meta.uuid': params.uuid, 'meta.scope': params.scope, name: params.name};
      if (!dictionaryData.name){
        dictionaryData.name = params.name;
      }
      return {
        filters: filters,
        dictionaryData: dictionaryData
      };
    };

    var handleResponse = function(dictionary) {
      if(dictionary) {
        res.json(serialize(dictionary));
      } else {
        res.sendStatus(200);
      }
    };

    var parameterizedRequest = upsertParameterizer(req.body, req.params)

    transactions.upsert(parameterizedRequest.filters, parameterizedRequest.dictionaryData).then(handleResponse);
  });

  router.delete('/:scope/:uuid/dictionaries/:name.json', parameterize, authorize, function(req, res, next) {
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
