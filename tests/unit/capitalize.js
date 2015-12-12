module.exports = function(subject, reporter) {
  reporter.describe("Unit Test: ''.capitalize()");
  reporter.assert(subject.capitalize, "test", "Test", "'Test' is capitalized");
  reporter.assert(subject.capitalize, "thisIsATest", "ThisIsATest", "'ThisIsATest' is capitalized");
  reporter.finish();
}