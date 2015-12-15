// inflections.
//   acronym_regex
//   acronyms[]
//   uncountables[]

var inflector = (function(inflector) {
  var inflector = {};
  var inflections = require('./inflections');
  
  inflector.camelize = function(string, uppercaseFirstLetter) { 
    uppercaseFirstLetter = uppercaseFirstLetter != null ? uppercaseFirstLetter : true;
    string = string.toString();
    if(uppercaseFirstLetter) {
      string = string.replace(/^[a-z\d]*/, function(match) {
        return inflector.capitalize(match);
      });
    } else {
      var re = new RegExp("^(?:" + inflections.acronym_regex + "(?=\b|[A-Z_])|\w)")
      string = string.replace(re, function(match) {
        return match.toLowerCase();
      });
    }
    string = string.replace(/(?:_|(\/))([a-z\d]*)/i, function(match, p1, p2) {
      return p1 + inflector.capitalize(p2);;
    })
    string = string.replace(/\//, '::');
    return string;
  }

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

  // TODO: match unicode letters w/ symbols (ex: 'á') 
  inflector.capitalize = function(string) {
    if(string.length > 1 || inflections.acronyms[string] != null) {
      return inflections.acronyms[string];
    } else {
      return string.replace(/\b[a-z]/, function(match) {
        return match.toUpperCase();
      }
    }
  }

  var apply_inflections = function(word, rules) {
    word = word.toString();
    if(word.length == 0 || inflections.uncountables.indexOf(word) != -1) { // !word.isEmpty? || inflections.uncountables.includes(word)
      return word;
    } else {
      rules.forEach(function(rule, replacement) {

      }
    }
  }

  return inflector;
})(inflector);

module.exports = inflector;