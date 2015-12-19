// inflections.
//   acronym_regex
//   acronyms[]
//   humans[{pattern, replacement}]
//   (locale).plurals
//   (locale).singulars
//   uncountables[]

module.exports = function(locale) {
	this.locale = locale;
	this.acronyms = this.acronyms || {};
	this.uncountables = this.uncountables || {};
	this.humans = this.humans || [];
	this.plurals = this.plurals || [];
	this.singulars = this.singulars || [];

	this.clear = function() {
		this.acronyms = {};
		this.uncountables = {};
		this.humans = [];
		this.plurals = [];
		this.singulars = [];
	};

	this.acronym = function(acronym) {
		this.acronyms[acronym.toLowerCase()] = acronym;
	};
	this.acronymsRegex = function() {
		return Object.keys(this.acronyms).map(function(key) {
			return this.acronyms[key];
		}).join('|');
	};

	this.uncountable = function(uncountable) {
		this.uncountables[uncountable.toLowerCase()] = uncountable;
	};

	this.human = function(pattern, replacement) {
		this.humans.push([new RegExp(pattern, 'i'), replacement]);
	};

	this.plural = function(pattern, replacement) {
		this.plurals.push([new RegExp(pattern, 'i'), replacement]);
	};

	this.singular = function(pattern, replacement) {
		this.singulars.push([new RegExp(pattern, 'i'), replacement]);
	};

	this.irregular = function(singular, plural) {
		this.plurals(singular, plural);
		this.singular(plural, singular);
	};

	if(locale != null) {
		require('./locales/' + locale)(this);
	}
};