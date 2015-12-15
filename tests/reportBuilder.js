// Interfaces used:
 // Test { string spec, T<Stringable> input, T<Stringable> expectedOutput, T<Stringable> result }
 // Report { string meta, Test[] tests, Test[] failed }

 // Builds a report
module.exports = function(callback) {
  this.report = {
    meta: "",
    tests: [],
    failed: []
  };

  this.describe = function(suite) {
    this.report.meta = suite;
  }

  this.assert = function(testedFunction, input, expectedOutput, spec) {
    var test = {
      spec: (spec != null ? spec : "Undefined"),
      input: input,
      expectedOutput: expectedOutput,
      result: {}
    }

    test.result = testedFunction(input);

    this.report.tests.push(test);
    if(test.result !== expectedOutput) {
      this.report.failed.push(test);
    }
  }

  this.finish = function() {
    callback(null, reportBuilder.report);
  }

  return this;
}