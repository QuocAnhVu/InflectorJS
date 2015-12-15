module.exports = function(subject, reporter) {
  reporter.describe("UNIT Camelizegit");
  reporter.assert(subject.camelize, "test", "Test", "'Test' is camelized");
  reporter.finish();
}
