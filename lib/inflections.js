// Inflections
// Contains inflector customizations from both the specified locale and user.

var Inflections = module.exports = function(locale) {
	this.locale = locale;
	this.reset();
};

Inflections.prototype.clear = function() {
	this.acronyms = {};
	this.uncountables = {};
	this.humans = [];
	this.plurals = [];
	this.singulars = [];
};

Inflections.prototype.reset = function() {
	this.clear();

	if(this.locale != null) {
		require('./locales/' + locale)(this);
	}
}

Inflections.prototype.acronym = function(acronym) {
	this.acronyms[acronym.toLowerCase()] = acronym;
};

Inflections.prototype.acronymsRegex = function() {
	return Object.keys(this.acronyms).map(function(key) {
		return this.acronyms[key];
	}).join('|');
};

Inflections.prototype.uncountable = function(uncountable) {
	this.uncountables[uncountable.toLowerCase()] = uncountable;
};

Inflections.prototype.human = function(pattern, replacement) {
	this.humans.push([new RegExp(pattern, 'i'), replacement]);
};

Inflections.prototype.plural = function(pattern, replacement) {
	this.plurals.push([new RegExp(pattern, 'i'), replacement]);
};

Inflections.prototype.singular = function(pattern, replacement) {
	this.singulars.push([new RegExp(pattern, 'i'), replacement]);
};

Inflections.prototype.irregular = function(singular, plural) {
	this.plurals(singular, plural);
	this.singular(plural, singular);
};