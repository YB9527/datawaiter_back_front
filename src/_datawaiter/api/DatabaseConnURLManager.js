var baseurl = "/database";
var   findDatabaseEnum = function () {
  return baseurl+"/finddatabaseenum";
};
exports.findDatabaseEnum = findDatabaseEnum;

var   addConnection = function () {
  return baseurl+"/addConnection";
};
exports.addConnection = addConnection;

var   editConnection = function () {
  return baseurl+"/editConnection";
};
exports.editConnection = editConnection;


var   findAll = function () {
  return baseurl+"/findAll";
};
exports.findAll = findAll;

