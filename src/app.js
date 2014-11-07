// ---------------------------------------------------------------------------------------------------------------------
// Main AngularJS Application for RFI Client
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------
/* global angular: true */

var Promise = require('bluebird');

// ---------------------------------------------------------------------------------------------------------------------

angular.module("rfi-client", [
        'ngRoute',

        'rfi-client.controllers',
        'rfi-client.services',
        'rfi-client.directives',
        'rfi-client.widgets',
        'rfi-client.behaviors'
    ])
    .run(['SocketService', function(socket)
    {
        socket.connect('http://localhost:8008');

        socket.socket.on('connect', function()
        {
            console.log('connected!');
        });

        window.socket = socket;
    }])
    .run(['$rootScope', function($rootScope)
    {
        Promise.setScheduler(function(fn) {
            $rootScope.$evalAsync(fn);
        });
    }]);

// ---------------------------------------------------------------------------------------------------------------------

angular.module("rfi-client.controllers", []);
angular.module("rfi-client.services", ['babylon']);
angular.module("rfi-client.directives", []);
angular.module("rfi-client.widgets", ['babylon']);
angular.module("rfi-client.behaviors", []);

// ---------------------------------------------------------------------------------------------------------------------

