var TAB = "  ";

// Summarizes an array of reports
var summarizeReports = module.exports = function(reports) {
  var summary = {
    totalCategories: reports.length,
    tests: 0,
    failedTests: 0
  };

  // Declare failed report format in advance.
  var _summarizeFailedReport = function(report) {
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

  // Condense reports to a summary
  reports.forEach(function(report) {
    summary.tests += report.tests.length;
    summary.failedTests += report.failed.length;
  });

  // Log summary and reports
  record("Out of " + summary.tests + " tests, " + summary.failedTests + " tests failed.");
  reports.forEach(function(report) {
    if(report.failed.length == 0) {
      record(TAB + "Suite (" + report.meta + "): All tests passed!\n")
    } else {
      record(_summarizeFailedReport(report) + "\n");
    }
  });
}

// Records log to console and to file
// TODO: Dependency order is weird. If generalizing, fix.
var fs = require('fs');
var logFile = ('./testLog.txt');
function record(logString) {
  console.log(logString);
  // TODO: Following is asynchronous. If race conditions exist in logfile, look here first.
  fs.writeFile(logFile, logString + "\n", function(err) { console.log(err); });
}