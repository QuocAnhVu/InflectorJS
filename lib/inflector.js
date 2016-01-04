// Inflector
// Transforms words between singular and plural. Provides ordinal for numbers.
// Switches names between many naming conventions including camelCase,
// class names, foreign keys, table names, titles, and more.

var Inflector = module.exports = function(locale) {
  this.inflections = new require('./inflections')(locale);
  // this.transliterations = require('./transliterate');
};
  
// Camelize
// Converts the case of a string into camelCased form. UpperCamelCase form is used by default.
// If uppercaseFirstLetter is set to false, then lowerCamelCase form will be used.
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

// Classify
// UpperCamelizes and singularizes a string, following a class naming convention.
Inflector.prototype.classify = function(tableName) {
  return this.camelize(this.singularize(tableName.toString().replace(/.*\./, '')), 'uppercase');
};

// These two methods don't make sense in js.
// Inflector.prototype.constantize = function(camelCasedWord) {}
// Inflector.prototype.safe_constantize = function(camelCasedWord) {}

// Dasherize
// Replaces underscores with dashes in a string.
Inflector.prototype.dasherize = function(underscoredWord) {
  return underscoredWord.replace(/_/g, '-');
};

// Deconstantize
// Removes the rightmost segment of a constant expression in the string.
// Returns the module of a constant expression.
Inflector.prototype.deconstantize = function(path) {
  path = path.toString();
  var index = path.indexOf('::');
  if(index == -1) {
    index = 0;
  }
  path.substring(0, index)
}

// Demodulize
// Removes the module of a constant expression.
// Returns the constant part of a constant expression.
Inflector.prototype.demodulize = function(path) {
  path = path.toString();
  var i = path.indexOf('::');
  if(i > -1) {
    return path.substring(i + 2);
  } else {
    return path;
  }
};

// ForeignKey
// Returns a foreign key name from a class name. By default, there is an underscore between
// the name and 'id'. If separateClassNameAndIDWithUnderscore is set to false, then there is no
// underscore before 'id'.
Inflector.prototype.foreign_key = function(className, separateClassNameAndIDWithUnderscore) {
  separateClassNameAndIDWithUnderscore = separateClassNameAndIDWithUnderscore || true;

  var underscore = separateClassNameAndIDWithUnderscore.toString();
  return this.underscore(this.demodulize(className)) + (underscore ? '_id' : 'id');
};


// Humanize
// Tweaks an attribute name for display to end users.
// Specifically, humanize performs these transformations:
// - Applies human inflection rules to
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

// Ordinal
// Returns the suffix that should be added to a number to denote the position
// in an ordered sequence such as 1st, 2nd, 3rd, 4th.
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

// Ordinalize
// Turns a number into an ordinal string used to denote the position in an 
// ordered sequence such as 1st, 2nd, 3rd, 4th.
Inflector.prototype.ordinalize = function(number) {
  return number.toString() + this.ordinal(number);
};

// Parameterize
// Replaces the special characters in a string so that it may be used as part of a 'pretty' URL.
// Inflector.prototype.parameterize = function(string, seperator) {
//   seperator = seperator || '-';
//   // Replace accented chars with ASCII equivalents
//   string = this.transliterate(string);
//   // Turn unwanted chars into the separator
//   string = string.replace(/[^a-z0-9\-_]+/gi, seperator);
//   if(seperator != null && seperator != '') {
//     var reSep = string.replace(/\.\^\$\*\+\-\?\(\)\[\]\{\}\\\|/g, '\\$&')
//     string = string.replace(new RegExp(reSep + '{2,}', g), seperator);
//     string = string.replace(new RegExp('^' + reSep + '|' + reSep + '$', g), '');
//   }
//   string = string.toLowerCase();
//   return string;
// };};

// Pluralize
// Returns the plural form of a word in a string.
Inflector.prototype.pluralize = function(word) {
  return this.applyInflections(word, this.inflections.plurals);
};

// Singularize
// Returns the singular form of a word in a string.
Inflector.prototype.singularize = function(word) {
  return this.applyInflections(word, this.inflections.singulars);
};

// Tablelize
// Underscores and pluralizes a class name, following a table naming convention.
Inflector.prototype.tableize = function(className) {
  return this.pluralize(this.underscore(className));
};


// Titleize
// Underscores, humanizes, and capitalizes a string, following a title naming convention.
Inflector.prototype.titleize = function(title) {
  return this.humanize(this.underscore(title)).replace(/\b(?<!['â`])[a-z]/g, function(match) {
    this.capitalize(match);
  });
};

// Transliterate
// Replaces non-ASCII characters with an ASCII approximation. If no replacement exists, the
// replacement character defaults to '?'.
// Inflector.prototype.transliterate = function(string) { 
//   this.transliterate(string); 
// };

// Underscore
// Creates a lowercase, underscored version form of a string.
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

// Capitalize
// Capitalizes the first word of a string.
Inflector.prototype.capitalize = function(string) {
  if(this.inflections.acronyms[string] != null) {
    return this.inflections.acronyms[string];
  } else {
    return string.replace(/\A\w/, function(match) { 
      return match.toUpperCase();
    });
  }
};

// ApplyInflections
// Replaces matched patterns with replacements from the inflection rules.
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