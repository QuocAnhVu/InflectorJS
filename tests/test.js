"use strict";

// Builds a report
var reportBuilder = require('./reportBuilder.js');

// Summarizes an array of reports
var summarize = require('./summarizeReports.js');

// TODO: Unclean script below

// TODO: If generalizing, change file directory.
var fs = require('fs');
var testDir = "./unit/";
var subjDir = "../src/inflector.js"

// console.log(fs.readdirSync("./tests/unit"))

var filenames = fs.readdirSync('./tests/unit/');
var files = [];
filenames.forEach(function(filename) {
  if(filename.substr(-3) === ".js") {
    files.push(testDir + filename);
  }
});

var reports = [];
var finishReport = function(report) {
  reports.push(report);
  if(reports.length == files.length) {
    summarize(reports);
  }
}

files.forEach(function(file) {
  var suite = require(file);
  var subject = require(subjDir);
  var reporter = reportBuilder(finishReport);
  suite(subject, reporter);
});