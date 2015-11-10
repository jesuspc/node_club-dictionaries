module.exports = function() {
  return { isOwner: function(req, res, next) { next(); } }
};