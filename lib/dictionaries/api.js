module.exports = function(opts){
  var router = opts.router;

  var transactions = opts.transactions;

  var parametrize = opts.parametrize;
  var authorize = opts.authorize;

  var serialize = opts.serialize;

  router.get('/:scope/:uuid/dictionaries.json', parametrize, authorize, function(req, res, next) {
    transactions.index({'meta.uuid': req.params.uuid}, function(dictionaries, callback) {
      res.json(dictionaries);
      callback();
    });
  });

  router.get('/:scope/:uuid/dictionaries/:name.json', parametrize, authorize, function(req, res, next) {
    transactions.show({'meta.uuid': req.params.uuid, name: req.params.name}, function(dictionary, callback) {
      if(dictionary) {
        res.json(serialize(dictionary));
      } else {
        res.sendStatus(404);
      }
      callback();
    });
  });

  router.put('/:scope/:uuid/dictionaries/:name.json', parametrize, authorize, function(req, res, next) {

  });

  router.delete('/:scope/:uuid/dictionaries/:name.json', parametrize, authorize, function(req, res, next) {

  });

  return router;
};