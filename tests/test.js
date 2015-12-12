"use strict";

// AKA ReportBuilder { void describe(), assert(), finish() }
var reportBuilder = require('./reportBuilder.js');
// AKA void summarize(Report[] reports)
var summarize = require('./summarizeReports.js');

// TODO: Unclean script below

// Define finishReport function for reportBuilder reporters
var reports = [];
var finishReport = function(report) {
  reports.push(report);
  if(reports.length == files.length) {
    summarize(reports);
  }
}

// TODO: If generalizing, change file directory.
var fs = require('fs');
var testDir = "./unit/";
var subjFile = "../src/inflector.js"

// Get test suite file paths
var filenames = fs.readdirSync('./tests/unit/');
var files = [];
filenames.forEach(function(filename) {
  if(filename.substr(-3) === ".js") {
    files.push(testDir + filename);
  }
});

// Run test suite for each test suite file path
files.forEach(function(file) {
  var suite = require(file);
  var subject = require(subjFile);
  var reporter = reportBuilder(finishReport);
  suite(subject, reporter);
});