module.exports = function(boxer) {
  boxer.autobind();

  boxer.enbox('api');
  boxer.enbox('transactions');

  // boxer.set -> boxer.singleton <- Always eager (generated on .box)
  //              boxer.factory <- Default
  //              boxer.request <- New for every request (Future scope)
  //              boxer.session <- New for every user session (Future scope)
  boxer.bind('index').to(function)//.as(scope);
  boxer.fetch

  boxer.bind('index').to(function(){
    return require('./index')(boxer.fetch);
  }).asSingleton();



  boxer.autobind();
  boxer.singleton('index');

  boxer.autobind();
  boxer.bind('config').to(function(){
    return readYaml('config');
  });

  boxer.bind('signer').to(function(){}).asSingleton();

  boxer.autobind();


  boxer.singleton('index', function(){
    //(...)
  });

  boxer.
};