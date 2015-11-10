module.exports = function() {
  return { default: function(req, res, next) { next(); } }
};