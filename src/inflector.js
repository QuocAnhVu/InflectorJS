module.exports = function(locale) {
  this.defaultLocale = locale || 'en';
  this.inflections = require('./inflections')(defaultLocale);
  
  this.camelize = function(term, uppercaseFirstLetter) { 
    uppercaseFirstLetter = uppercaseFirstLetter || true;

    term = term.toString();
    if(uppercaseFirstLetter) {
      term = term.replace(/^[a-z\d]*/, function(match) {
        return inflector.capitalize(match);
      });
    } else {
      var re = new RegExp("^(?:" + inflections.acronymRegex() + "(?=\b|[A-Z_])|\w)")
      term = term.replace(re, function(match) {
        return match.toLowerCase();
      });
    }
    term = term.replace(/(?:_|(\/))([a-z\d]*)/gi, function(match, p1, p2) {
      return p1 + inflector.capitalize(p2);;
    })
    term = term.replace(/\//g, '::');
    return term;
  };

  this.classify = function(tableName) {
    return this.camelize(this.singularize(tableName.toString().replace(/.*\./, '')));
  };

  // this.constantize = function(camelCasedWord) {}

  // this.safe_constantize = function(string) {}

  this.dasherize = function(underscoredWord) {
    return underscoredWord.replace(/_/g, '-');
  };

  // this.deconstantize = function(path) {}

  this.demodulize = function(path) {
    path = path.toString();
    var i = path.indexOf('::');
    if(i > -1) {
      return path.substring(i + 2);
    } else {
      return path;
    }
  };

  this.foreign_key = function(className, separateClassNameAndIDWithUnderscore) {
    separateClassNameAndIDWithUnderscore = separateClassNameAndIDWithUnderscore || true;

    var underscore = separateClassNameAndIDWithUnderscore.toString();
    return this.underscore(this.demodulize(className)) + (underscore ? '_id' : 'id');
  };

  this.humanize = function(lowerCaseAndUnderscoredWord, capitalizeFirstWord) {
    capitalizeFirstWord = capitalizeFirstWord || false;
    var result = lowerCaseAndUnderscoredWord.toString();

    inflections.humans.forEach(function(rule) {
      result = result.replace(rule[0], rule[1]);
    };

    result = result.replace(/\A_+/, '');
    result = result.replace(/_id\z/, '');
    result = result.replace(/_/g, ' ');

    result = result.replace(/([a-z\d]*)/g, function(match) {
      return inflections.acronyms[match] || match.toLowerCase();
    });

    if(capitalizeFirstWord) {
      result = this.capitalize(result);
    }

    return result;
  };

  this.ordinal = function(number) {
    if(isNaN(number)) { 
      throw number.toString() + " is NaN";
      return '';
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
  };

  // TODO: Error handling is in two different place. Is that good??
  this.ordinalize = function(number) {
    try {
      return number.toString() + this.ordinal(number);
    } catch(e) {
      throw e;
      return number.toString();
    }
  };

  // this.parameterize = function(string) {};

  this.pluralize = function(word, locale) {
    locale = locale || this.defaultLocale;
    return applyInflections(word, inflections.plurals());
  };

  this.singularize = function(word, locale) {
    locale = locale || this.defaultLocale;
    return applyInflections(word, inflections.singulars());
  };

  this.tableize = function(className) {
    return this.pluralize(this.underscore(className));
  };

  this.titleize = function(word) {
    return this.humanize(this.underscore(word)).replace(/\b(?<!['â`])[a-z]/g, function(match) {
      this.capitalize(match);
    });
  };

  // this.transliterate = function(string) {};

  // this.underscore = function(camelCasedWord) {
  //   if(!camelCasedWord.match(/[A-Z-]|::/)) {
  //     return camelCasedWord;
  //   }

  //   var word = camelCasedWord.toString();

  //   word = word.replace(/::/g, '/');
  //   var re = new RegExp('(?:(?<=([A-Za-z\d]))|\b)(' + inflections.acronymRegex() + ')(?=\b|[^a-z])');
  //   word = word.replace(re, function(match, p1, p2) {
  //     return 
  //   })
    
  // };

  // TODO: match unicode letters w/ symbols (ex: 'á') 
  this.capitalize = function(string) {
    if(inflections.acronyms[string] != null) {
      return inflections.acronyms[string];
    } else {
      return string.replace(/\A\w/, function(match) { 
        return match.toUpperCase();
      });
    }
  };

  var applyInflections = function(word, rules) {
    word = word.toString();
    if(word.length == 0 || inflections.uncountables[word.toLowerCase()] != null) { // !word.isEmpty? || inflections.uncountables.includes(word)
      return word;
    } else {
      rules.forEach(function(rule) {
        word = word.replace(rule[0], rule[1]);
      };
    }
  };
};