"use strict";
var TAB = "  ";

// Interfaces used:
 // Test { string spec, T<Stringable> input, T<Stringable> expectedOutput, T<Stringable> result }
 // Report { string meta, Test[] tests, Test[] failed }
 // Summary { float totalCategories, float tests, float failedTests }


// Builds a report
var reportBuilder = function(callback) {
  reportBuilder.report = {
    meta: "",
    tests: [],
    failed: []
  };

  reportBuilder.describe = function(suite) {
    reportBuilder.report.meta = suite;
  }

  reportBuilder.assert = function(testedFunction, input, expectedOutput, spec) {
    var test = {
      spec: (spec != null ? spec : "Undefined"),
      input: input,
      expectedOutput: expectedOutput,
      result: {}
    }

    test.result = testedFunction(input);

    reportBuilder.report.tests.push(test);
    if(test.result !== expectedOutput) {
      reportBuilder.report.failed.push(test);
    }
  }

  reportBuilder.finish = function() {
    callback(reportBuilder.report);
  }

  return reportBuilder;
}

// Summarizes an array of reports
var summarize = function(reports) {
  var summary = {
    totalCategories: reports.length,
    tests: 0,
    failedTests: 0
  };

  // Declare failed report format in advance.
  summarize._summarizeFailedReport = function(report) {
    var result = "";
    result += TAB + report.meta + ": Failed " + report.failed.length + " tests.\n";
    report.failed.forEach(function(failedTest) {
      result += TAB+TAB + failedTest.spec + " failed.";
      result += TAB+TAB + "Inputted " + failedTest.input.toString() + ".\n";
      result += TAB+TAB + "Expected " + failedTest.expectedOutput.toString() + ".\n";
      result += TAB+TAB +  "Returned " + failedTest.result.toString() + ".\n\n";
    });
    return result;
  }

  // Condense reports to a summary
  reports.forEach(function(report) {
    summary.tests += report.tests.length;
    summary.failedTests += report.failed.length;
  });

  // Log summary and reports
  record("Out of " + summary.tests + " tests, " + summary.failedTests + " tests failed.");
  reports.forEach(function(report) {
    if(report.failed.length == 0) {
      record(TAB + report.meta + ": All tests passed!\n")
    } else {
      record(summarize._summarizeFailedReport(report) + "\n");
    }
  });
}

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