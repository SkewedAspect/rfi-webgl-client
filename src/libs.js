// ---------------------------------------------------------------------------------------------------------------------
// Wrapper modules for third-party libraries.
//
// @module libs.js
// ---------------------------------------------------------------------------------------------------------------------
/* global angular: true */

angular.module('babylon', []).factory('babylon', ['$window', function($window) { return $window.BABYLON; }]);
angular.module('keypress', []).factory('keypress', ['$window', function($window) { return $window.keypress; }]);
angular.module('lodash', []).factory('lodash', ['$window', function($window) { return $window._; }]);
angular.module('bluebird', []).factory('bluebird', ['$window', function($window) { return $window.Promise; }]);
angular.module('rfi-physics', []).factory('rfi-physics', ['$window', function($window) { return $window.RFIPhysics; }]);
angular.module('eventemitter2', []).factory('eventemitter2', ['$window', function($window) { return $window.EventEmitter2; }]);
angular.module('path', []).factory('path', ['$window', function($window) { return $window.path; }]);

// ---------------------------------------------------------------------------------------------------------------------
