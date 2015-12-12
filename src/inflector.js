module.exports = (function() {
  var inflector = {};
  var inflections = require('inflections');
  
  inflector.camelize = require('./methods/camelize.js')(inflections);
  inflector.classify = function(string) {}
  inflector.constantize = function(string) {}
  inflector.dasherize = function(string) {}
  inflector.deconstantize = function(string) {}
  inflector.demodulize = function(string) {}
  inflector.foreign_key = function(string) {}
  inflector.humanize = function(string) {}
  inflector.inflections = function(string) {}
  inflector.ordinal = function(string) {}
  inflector.ordinalize = function(string) {}
  inflector.parameterize = function(string) {}
  inflector.pluralize = function(string) {}
  inflector.safe_constantize = function(string) {}
  inflector.singularize = function(string) {}
  inflector.tableize = function(string) {}
  inflector.titleize = function(string) {}
  inflector.transliterate = function(string) {}
  inflector.underscore = function(string) {}

  return inflector;
})();
