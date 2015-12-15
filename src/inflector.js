// inflections.
//   acronym_regex
//   acronyms[]
//   uncountables[]
//   humans[{pattern, replacement}]
//   (locale).plurals
//   (locale).singulars
module.exports = function(inflector) {

  this.inflections = require('./inflections');
  
  this.camelize = function(term, uppercaseFirstLetter) { 
    uppercaseFirstLetter = uppercaseFirstLetter != null ? uppercaseFirstLetter : true;
    term = term.toString();
    if(uppercaseFirstLetter) {
      term = term.replace(/^[a-z\d]*/, function(match) {
        return inflector.capitalize(match);
      });
    } else {
      var re = new RegExp("^(?:" + inflections.acronym_regex + "(?=\b|[A-Z_])|\w)")
      term = term.replace(re, function(match) {
        return match.toLowerCase();
      });
    }
    term = term.replace(/(?:_|(\/))([a-z\d]*)/gi, function(match, p1, p2) {
      return p1 + inflector.capitalize(p2);;
    })
    term = term.replace(/\//g, '::');
    return term;
  }

  this.classify = function(tableName) {
    return this.camelize(this.singularize(tableName.toString().replace(/.*\./, '')));
  }

  this.constantize = function(camelCasedWord) {}

  this.dasherize = function(underscoredWord) {
    return underscoredWord.replace(/_/g, '-');
  }

  this.deconstantize = function(path) {}

  this.demodulize = function(path) {
    path = path.toString();
    var i = path.indexOf('::');
    if(i > -1) {
      return path.substring(i + 2);
    } else {
      return path;
    }
  }

  this.foreign_key = function(className, separateClassNameAndIDWithUnderscore) {
    var underscore = separateClassNameAndIDWithUnderscore;
    underscore = underscore != null ? underscore : true;
    return this.underscore(this.demodulize(className)) + (underscore ? '_id' : 'id');
  }

  this.humanize = function(lowerCaseAndUnderscoredWord, options) {
    var result = lowerCaseAndUnderscoredWord.toString();

    inflections.humans.forEach(function(rule) {
      result = result.replace(new RegExp(rule.pattern, 'g'), rule.replacement);
    }

    result = result.replace(/\A_+/, '');
    result = result.replace(/_id\z/, '');
    result = result.replace(/_/g, ' ');

    result = result.replace(/([a-z\d]*)/g, function(match) {
      return inflections.acronyms[match] ? inflections.acronyms[match] : match.toLowerCase();
    });

    if(options[capitalize] != null && options[capitalize]) {
      result = result.replace(/\A\w/, function(match) { 
        return match.toUpperCase();
      });
    }

    return result;
  }

  this.ordinal = function(number) {
    if(isNaN(number)) { 
      throw number.toString() + " is NaN"; 
    }

    var abs_number = Math.abs(number);

    if(abs_number % 100 >= 11 && abs_number % 100 <= 13) {
      return 'th';
    } else {
      switch(abs_number % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }
  }

  // TODO: Error handling is in two different place. Is that good??
  this.ordinalize = function(number) {
    if(isNaN(number)) { 
      throw number.toString() + " is NaN"; 
    }
    return number.toString() + this.ordinal(number);
  }

  this.parameterize = function(string) {}

  this.pluralize = function(word, locale) {
    locale = locale != null ? locale : 'en';
    return apply_inflections(word, inflections(locale).plurals);
  }

  this.safe_constantize = function(string) {}

  this.singularize = function(word, locale) {
    locale = locale != null ? locale : 'en';
    return apply_inflections(word, inflections(locale).singulars);
  }

  this.tableize = function(className) {
    return this.pluralize(this.underscore(className));
  }

  this.titleize = function(word) {
    return this.humanize(this.underscore(word)).replace(/\b(?<!['â`])[a-z]/g, function(match) {
      this.capitalize(match);
    });
  }

  this.transliterate = function(string) {}

  this.underscore = function(camelCasedWord) {
    // if(!camelCasedWord.match(/[A-Z-]|::/)) {
    //   return camelCasedWord;
    // }

    // var word = camelCasedWord.toString();

    // word = word.replace(/::/g, '/');
    // var re = new RegExp('(?:(?<=([A-Za-z\d]))|\b)(' + inflections.acronym_regex + ')(?=\b|[^a-z])');
    // word = word.replace(re, function(match, p1, p2) {
    //   return 
    // })
  }

  // TODO: match unicode letters w/ symbols (ex: 'á') 
  this.capitalize = function(string) {
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
      rules.forEach(function(rule) {
        word = word.replace(new RegExp(rule.pattern, 'g'), rule.replacement);
      }
    }
  }

  return inflector;
}