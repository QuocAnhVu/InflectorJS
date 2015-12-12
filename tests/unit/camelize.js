module.exports = function(subject, reporter) {
  reporter.describe("Unit Test: ''.camelize()");
  reporter.assert(subject.camelize, "test", "Test", "'Test' is camelized");
  reporter.finish();
}
