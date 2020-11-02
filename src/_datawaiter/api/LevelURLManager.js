var baseurl = "/level";

var   addApiLevel = function () {
  return baseurl+"/addapilevel";
};
exports.addApiLevel = addApiLevel;

var   findApiLevel = function () {
  return baseurl+"/findapilevel";
};
exports.findApiLevel = findApiLevel;

var   deleteLevelById = function () {
  return baseurl+"/deletelevelbyid?id=";
};
exports.deleteLevelById = deleteLevelById;
