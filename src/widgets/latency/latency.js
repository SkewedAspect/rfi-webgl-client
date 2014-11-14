// ---------------------------------------------------------------------------------------------------------------------
// A widget for monitoring latency to the server
//
// @module latency.js
// ---------------------------------------------------------------------------------------------------------------------

function latencyFactory(syncService)
{
    function latencyController($scope)
    {
        $scope.loggedIn = false;

        $scope.$on('successful login', function()
        {
            $scope.loggedIn = true;
        });

        Object.defineProperty($scope, 'latency', {
            get: function(){ return syncService.latency; }
        });
    } // end latencyController

    return {
        restrict: 'E',
        scope: true,
        templateUrl: '/partials/latency/latency.html',
        controller: ['$scope', latencyController]
    };
} // end latencyFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.widgets').directive('latency', [
    'SyncService',
    latencyFactory
]);

// ---------------------------------------------------------------------------------------------------------------------