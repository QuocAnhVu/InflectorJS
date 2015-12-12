// Builds a report
var reportBuilder = module.exports = function(callback) {
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