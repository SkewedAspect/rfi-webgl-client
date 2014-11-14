// ---------------------------------------------------------------------------------------------------------------------
// Wrapper modules for third-party libraries.
//
// @module libs.js
// ---------------------------------------------------------------------------------------------------------------------
/* global angular: true */

angular.module('babylon', []).factory('babylon', function($window) { return $window.BABYLON; });
angular.module('keypress', []).factory('keypress', function($window) { return $window.keypress; });
angular.module('lodash', []).factory('lodash', function($window) { return require('lodash'); });

// ---------------------------------------------------------------------------------------------------------------------
