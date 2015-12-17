module.exports = function(){
  function base(dictionary){
    delete dictionary.meta;
    delete dictionary._id;
    return dictionary;
  }

  return { base: base };
};