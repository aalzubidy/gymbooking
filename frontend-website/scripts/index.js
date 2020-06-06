// Set the url based on the window URL and port - used across all calls
var urlPrefix = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

// Change active class in navbar
$(document).ready(function () {
  $('nav a').click(function () {
    $('nav a').removeClass('active');
    $(this).addClass('active');
    let link = $(this).attr('href');
    window.location.href = link;
  });
});

// Set font size for all editors
var editorFontSize = 14;

/**
 * Download a file with date and json extension
 * @param {*} fileData
 * @param {string} fileName
 */
function downloadFile(fileData, fileName) {
  var d = new Date();
  var dateName = `${d.getMonth()+1}-${d.getDate()}-${d.getFullYear()}-${d.getHours()}-${d.getMinutes()}`;
  var dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fileData, null, 2));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", fileName + '-' + dateName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// Start an angularjs app
var app = angular.module('jsonToolkitApp', ['ngRoute']);

// Set routes
app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "jsonpath.html"
    })
    .when("/jsonschema", {
      templateUrl: "jsonschema.html"
    })
    .when("/api", {
      templateUrl: "api.html"
    })
    .when('/*', {
      templateUrl: "notFound.html"
    });
})

// Controller to run and evaluate json path
app.controller("jsonPathController", function ($scope) {
  // Option to run the json path automatically as typing
  $scope.autoRunLStatus = 'Off';

  // List of saved json paths, their input, and their output
  $scope.savedPaths = [];

  // Editor settings - Input JSON Object to run json paths
  var editorInputJSONPath = ace.edit("editorInputJSONPath");
  editorInputJSONPath.setTheme("ace/theme/solarized_light");
  editorInputJSONPath.session.setMode("ace/mode/json");
  editorInputJSONPath.setFontSize(editorFontSize);

  // Editor settings - Output for the results of json path
  var editorOutputJSONPath = ace.edit("editorOutputJSONPath");
  editorOutputJSONPath.setTheme("ace/theme/solarized_light");
  editorOutputJSONPath.session.setMode("ace/mode/json");
  editorOutputJSONPath.setFontSize(editorFontSize);

  // A listner to display any erros in the input object
  editorInputJSONPath.getSession().on('change', function () {
    if (editorInputJSONPath.session.$annotations.length > 0) {
      editorOutputJSONPath.setValue(JSON.stringify(editorInputJSONPath.session.$annotations));
    } else {
      editorOutputJSONPath.setValue('{}');
    }
  });

  // Function to run the json path against the input json object
  $scope.evaluateJSONPath = function evaluateJSONPath() {
    if ($scope.jsonP) {
      let input = JSON.parse(editorInputJSONPath.session.getValue());
      let jsonP = $scope.jsonP;
      let result = JSONPath.JSONPath({
        path: jsonP,
        json: input
      });
      editorOutputJSONPath.setValue(JSON.stringify(result, null, 1), -1);
    }
  }

  // Function to save json paths, their input, and their output in the current session
  $scope.savePath = function savePath() {
    if ($scope.jsonP) {
      $scope.savedPaths.push({
        path: $scope.jsonP,
        input: editorInputJSONPath.session.getValue(),
        output: editorOutputJSONPath.session.getValue()
      });
    }
  }

  // Change the auto run option
  $scope.setAutoRun = function setAutoRun() {
    if ($scope.autoRunLStatus === 'Off') {
      $scope.autoRunLStatus = 'On';
      $('#jsonP').on('input', () => {
        $scope.evaluateJSONPath();
      })
    } else {
      $('#jsonP').off();
      $scope.autoRunLStatus = 'Off';
    }
  }

  // Load the saved json path from the session along with the orignal input and output
  $scope.loadSavedPath = function loadSavedPath(p, i, o) {
    $scope.jsonP = p;
    editorInputJSONPath.setValue(i, -1);
    editorOutputJSONPath.setValue(o, -1);
  }

  // Use the output as an input
  $scope.switchOutputInput = function switchOutputInput() {
    editorInputJSONPath.setValue(editorOutputJSONPath.session.getValue());
    editorOutputJSONPath.setValue('{}');
  }
});

// A controller to handle generating a json schema and validating an object against schema
app.controller("jsonSchemaController", function ($scope) {
  // Store schema validation error
  $scope.jsonSchemaErrors = [];

  // Editor settings - Input json object
  var editorInputJSONObject = ace.edit("editorInputJSONObject");
  editorInputJSONObject.setTheme("ace/theme/solarized_light");
  editorInputJSONObject.session.setMode("ace/mode/json");
  editorInputJSONObject.setFontSize(editorFontSize);

  // Editor settings - Input or output for json schema
  var editorInputJSONSchema = ace.edit("editorInputJSONSchema");
  editorInputJSONSchema.setTheme("ace/theme/solarized_light");
  editorInputJSONSchema.session.setMode("ace/mode/json");
  editorInputJSONSchema.setFontSize(editorFontSize);

  // A function to validate a json object against a schema
  $scope.validateJSON = function validateJSON() {
    $scope.jsonSchemaErrors = [];
    let schema = JSON.parse(editorInputJSONSchema.session.getValue());
    let obj = JSON.parse(editorInputJSONObject.session.getValue());

    var ajv = new Ajv();
    var validate = ajv.compile(schema);
    var valid = validate(obj);
    if (!valid) {
      $scope.jsonSchemaResults = "Invalid";
      $scope.jsonSchemaErrors = validate.errors;
    } else {
      $scope.jsonSchemaResults = "Valid";
    }
  }

  // Generate a json schema from a json object
  $scope.generateSchema = function generateSchema() {
    let obj = JSON.parse(editorInputJSONObject.session.getValue());
    editorInputJSONSchema.setValue(JSON.stringify(j2s(obj), null, 1), -1);
  }

  // Download generated schema as a json file
  $scope.downloadSchema = function downloadSchema() {
    try {
      let schemaOutput = JSON.parse(editorInputJSONSchema.session.getValue());
      if (Object.keys(schemaOutput).length >= 1) {
        downloadFile(schemaOutput, 'jsonSchema');
      }
    } catch (error) {
      console.log('Schema is empty or not json format');
    }
  }

});