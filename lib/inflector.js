// Inflector
// Transforms words between singular and plural. Provides ordinal for numbers.
// Switches names between many naming conventions including camelCase,
// class names, foreign keys, table names, titles, and more.

var Inflector = module.exports = function(locale) {
  this.inflections = new require('./inflections')(locale);
  // this.transliterations = require('./transliterate');
};
  
Inflector.prototype.camelize = function(term, uppercaseFirstLetter) { 
  uppercaseFirstLetter = uppercaseFirstLetter || true;

  term = term.toString();
  if(uppercaseFirstLetter) {
    term = term.replace(/^[a-z\d]*/, function(match) {
      return this.capitalize(match);
    });
  } else {
    var re = new RegExp("^(?:" + this.inflections.acronymRegex() + "(?=\b|[A-Z_])|\w)")
    term = term.replace(re, function(match) {
      return match.toLowerCase();
    });
  }
  term = term.replace(/(?:_|(\/))([a-z\d]*)/gi, function(match, p1, p2) {
    return p1 + this.capitalize(p2);;
  })
  term = term.replace(/\//g, '::');
  return term;
};

Inflector.prototype.classify = function(tableName) {
  return this.camelize(this.singularize(tableName.toString().replace(/.*\./, '')));
};

// Inflector.prototype.constantize = function(camelCasedWord) {}

// Inflector.prototype.safe_constantize = function(camelCasedWord) {}

Inflector.prototype.dasherize = function(underscoredWord) {
  return underscoredWord.replace(/_/g, '-');
};

Inflector.prototype.deconstantize = function(path) {
  path = path.toString();
  var index = path.indexOf('::');
  if(index == -1) {
    index = 0;
  }
  path.substring(0, index)
}

Inflector.prototype.demodulize = function(path) {
  path = path.toString();
  var i = path.indexOf('::');
  if(i > -1) {
    return path.substring(i + 2);
  } else {
    return path;
  }
};

Inflector.prototype.foreign_key = function(className, separateClassNameAndIDWithUnderscore) {
  separateClassNameAndIDWithUnderscore = separateClassNameAndIDWithUnderscore || true;

  var underscore = separateClassNameAndIDWithUnderscore.toString();
  return this.underscore(this.demodulize(className)) + (underscore ? '_id' : 'id');
};

Inflector.prototype.humanize = function(lowerCaseAndUnderscoredWord, capitalizeFirstWord) {
  capitalizeFirstWord = capitalizeFirstWord || false;
  var result = lowerCaseAndUnderscoredWord.toString();

  this.inflections.humans.forEach(function(rule) {
    result = result.replace(rule[0], rule[1]);
  });

  result = result.replace(/\A_+/, '');
  result = result.replace(/_id\z/, '');
  result = result.replace(/_/g, ' ');

  result = result.replace(/([a-z\d]*)/g, function(match) {
    return this.inflections.acronyms[match] || match.toLowerCase();
  });

  if(capitalizeFirstWord) {
    result = this.capitalize(result);
  }

  return result;
};

Inflector.prototype.ordinal = function(number) {
  number = parseInt(number, 10);
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

Inflector.prototype.ordinalize = function(number) {
  return number.toString() + this.ordinal(number);
};

// Inflector.prototype.parameterize = function(string, seperator) {
//   seperator = seperator || '-';
//   // Replace accented chars with ASCII equivalents
//   string = this.transliterate(string);
//   // Turn unwanted chars into the separator
//   string = string.replace(/[^a-z0-9\-_]+/gi, seperator);
//   if(seperator != null && seperator != '') {
//     var reSep = string.replace(/[\.\^\$\*\+\-\?\(\)\[\]\{\}\\\|]/g, '\\$&')
//     string = string.replace(new RegExp(reSep + '{2,}', g), seperator);
//     string = string.replace(new RegExp('^' + reSep + '|' + reSep + '$', g), '');
//   }
//   string = string.toLowerCase();
//   return string;
// };};

Inflector.prototype.pluralize = function(word) {
  return this.applyInflections(word, this.inflections.plurals);
};

Inflector.prototype.singularize = function(word) {
  return this.applyInflections(word, this.inflections.singulars);
};

Inflector.prototype.tableize = function(className) {
  return this.pluralize(this.underscore(className));
};

Inflector.prototype.titleize = function(title) {
  return this.humanize(this.underscore(title)).replace(/\b(?<!['â`])[a-z]/g, function(match) {
    this.capitalize(match);
  });
};

// Inflector.prototype.transliterate = function(string) { 
//   this.transliterate(string); 
// };

Inflector.prototype.underscore = function(camelCasedWord) {
  if(!camelCasedWord.match(/[A-Z-]|::/)) {
    return camelCasedWord;
  }

  var word = camelCasedWord.toString();

  word = word.replace(/::/g, '/');
  var re = new RegExp('(?:(?<=([A-Za-z\d]))|\b)(' + this.inflections.acronymRegex() + ')(?=\b|[^a-z])', 'g');
  word = word.replace(re, function(match, p1, p2) {
    return p1 + '_' + p2;
  });
  word = word.replace(/-/g, '_');
  word = word.toLowerCase();
  return word;
};

Inflector.prototype.capitalize = function(string) {
  if(this.inflections.acronyms[string] != null) {
    return this.inflections.acronyms[string];
  } else {
    return string.replace(/\A\w/, function(match) { 
      return match.toUpperCase();
    });
  }
};

Inflector.prototype.applyInflections = function(word, rules) {
  word = word.toString();
  if(word.length == 0 || this.inflections.uncountables[word.toLowerCase()] != null) { // !word.isEmpty? || inflections.uncountables.includes(word)
    return word;
  } else {
    rules.forEach(function(rule) {
      word = word.replace(rule[0], rule[1]);
    });
  }
};