var genNewFunction = module.exports = function(functionName) {
  var fs = require('fs');
  var handleError = function(err) { if(err) throw err; }
  var addToScript = function() {
    // Create method in seperate file.
    var methodPath = "./src/methods/" + functionName + ".js";
    var payload = "var " + functionName + " = module.exports = function(string) { \n  \n}\n";
    fs.writeFile(methodPath, payload, handleError);

    // Create reference to method in inflector.js.
    var mainPath = "./src/inflector.js"
    var payload2 = "inflector." + functionName +" = require('./methods/" + functionName + ".js');\n";
    fs.appendFile(mainPath,  payload2, handleError);
  }
  var addTests = function() {
    var testPath = "./tests/unit/" + functionName + ".js";

    var payload = "module.exports = function(subject, reporter) {\n" +
                  "  reporter.describe(\"Unit Test: ''." + functionName + "()\");\n" +
                  "  reporter.assert(subject." + functionName + ", \"test\", \"Test\", \"'Test' is " + functionName + "d\");\n" +
                  "  reporter.finish();\n" +
                  "}\n"
    fs.writeFile(testPath, payload, handleError);
  }
  addToScript();
  addTests();
  console.log("dont forget to change readme");
}

if(process.argv.length > 2) {
  genNewFunction(process.argv[2]);
}