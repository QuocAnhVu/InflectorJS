"use strict";
var TAB = "  ";

// Interfaces used:
 // Test { string spec, T<Stringable> input, T<Stringable> expectedOutput, T<Stringable> result }
 // Report { string meta, Test[] tests, Test[] failed }
 // Summary { float totalCategories, float tests, float failedTests }


// Builds a report
var reportBuilder = require('./reportBuilder.js');

// Summarizes an array of reports
var summarize = require('./summarizeReports.js');

// TODO: Unclean script below

// TODO: Dependency order is weird. If generalizing, fix.
var fs = require('fs');
var logFile = ('./testLog.txt');
function record(logString) {
  console.log(logString);
  // TODO: Following is asynchronous. If race conditions exist in logfile, look here first.
  fs.writeFile(logFile, logString + "\n", function(err) { console.log(err); });
}

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