// ---------------------------------------------------------------------------------------------------------------------
// Main AngularJS Application for RFI Client
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------
/* global angular: true */

angular.module("rfi-client", [
        'ngRoute',

        'path',
        'ngToast',
        'lodash',
        'bluebird',
        'eventemitter2',
        'rfi-physics',

        'rfi-client.utils',
        'rfi-client.controllers',
        'rfi-client.services',
        'rfi-client.directives',
        'rfi-client.widgets',
        'rfi-client.behaviors'
    ])
    .config(['ngToastProvider', function(ngToastProvider) {
        ngToastProvider.configure({
            animation: 'fade',
            horizontalPosition: 'left',
            verticalPosition: 'bottom'
        });
    }])
    .run(['SocketService', '$location', function(socket, $location)
    {
        var host = $location.protocol() + '://' + $location.host() + ':8008';
        socket.connect(host);

        socket.socket.on('connect', function()
        {
            console.log('connected!');
        });

        window.socket = socket;
    }])
    .run(['$rootScope', 'bluebird', 'ngToast', function($rootScope, Promise, ngToast)
    {
        Promise.setScheduler(function(fn) {
            $rootScope.$evalAsync(fn);
        });

        // Register a default error handler
        window.addEventListener('unhandledrejection', function(error)
        {
            error.preventDefault();

            ngToast.create({
                content: "Unhandled Rejection: " + error.detail.reason,
                className: 'danger',
                dismissButton: true
            });
        });
    }]);

// ---------------------------------------------------------------------------------------------------------------------

angular.module("rfi-client.widgets", ['babylon']);
angular.module("rfi-client.services", ['babylon', 'keypress', 'lodash']);
angular.module("rfi-client.utils", ['rfi-client.services']);
angular.module("rfi-client.controllers", []);
angular.module("rfi-client.directives", []);
angular.module("rfi-client.behaviors", []);

// ---------------------------------------------------------------------------------------------------------------------

