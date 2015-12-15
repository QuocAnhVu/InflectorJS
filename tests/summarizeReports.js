// Interfaces used:
 // Test { string spec, T<Stringable> input, T<Stringable> expectedOutput, T<Stringable> result }
 // Report { string meta, Test[] tests, Test[] failed }
 // Summary { float totalCategories, float tests, float failedTests }

// Summarizes an array of reports
module.exports = function(reports) {
  var TAB = "  ";

  // Format report of failed test
  var summarizeFailedReport = function(report) {
    var result = "";
    result += TAB + "Suite (" + report.meta + "): Failed " + report.failed.length + " tests.\n";
    report.failed.forEach(function(failedTest) {
      result += TAB+TAB + failedTest.spec + " failed.\n";
      result += TAB+TAB + "Inputted " + failedTest.input.toString() + ".\n";
      result += TAB+TAB + "Expected " + failedTest.expectedOutput.toString() + ".\n";
      result += TAB+TAB +  "Returned " + failedTest.result.toString() + ".\n\n";
    });
    return result;
  }

  // Records string to logfile and console
  var record = function(string) {
    var fs = require('fs');
    var logFile = ('./testLog.txt');
    // TODO: Following is asynchronous. If race conditions exist in logfile, look here first.
    fs.writeFile(logFile, string + "\n", function(err) { console.log(err); });
    console.log(string);
  }

  // Log summary of reports
  var summary = {
    totalCategories: reports.length,
    tests: 0,
    failedTests: 0
  };
  reports.forEach(function(report) {
    summary.tests += report.tests.length;
    summary.failedTests += report.failed.length;
  });
  record("Out of " + summary.tests + " tests, " + summary.failedTests + " tests failed.");

  // Log all reports
  reports.forEach(function(report) {
    if(report.failed.length == 0) {
      record(TAB + "Suite (" + report.meta + "): All tests passed!\n")
    } else {
      record(_summarizeFailedReport(report) + "\n");
    }
  });
}