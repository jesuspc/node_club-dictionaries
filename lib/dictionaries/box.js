module.exports = function(boxer) {
  boxer.autoloadInner();

  boxer.enbox('api');
  boxer.enbox('transactions');
};