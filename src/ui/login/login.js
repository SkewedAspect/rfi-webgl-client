// ---------------------------------------------------------------------------------------------------------------------
// Login widget
//
// @module login.js
// ---------------------------------------------------------------------------------------------------------------------

function LoginController($scope, $timeout, ngToast, socket, charService, entityMan, syncService, confMan)
{
    $scope.form = {};
    $scope.selected = {};
    $scope.successful = false;
    $scope.hideWindow = false;
    $scope.error = undefined;

    $scope.login = function()
    {
        $scope.error = undefined;
        socket.makeRequest('login', $scope.form)
            .spread(function(results)
            {
                if(results.confirm)
                {
                    $scope.characters = results.characters;
                }
                else
                {
                    $scope.error = results;
                    console.error(results);
                } // end if
            })
            .catch(function(error)
            {
                ngToast.create({
                    content: "Error logging in: " + error,
                    className: 'danger',
                    dismissButton: true
                });
            });
    }; // end login

    $scope.select = function(char)
    {
        $scope.selected = char;
    }; // end select

    $scope.submitChar = function()
    {
        charService.character = $scope.selected;

        var query = {
            character:  $scope.selected.id
        };

        socket.makeRequest('select character', query)
            .spread(function(results)
            {
                if(results.confirm)
                {
                    $scope.$root.$broadcast('successful login');
                    $scope.successful = true;

                    // Start the sync service
                    syncService.start();

                    $timeout(function()
                    {
                        $scope.hideWindow = true;
                    }, 2000);

                    confMan.getConfigs();
                }
                else
                {
                    console.error(results);
                } // end if
            });
    }; // end submitChar
} // end LoginController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.widgets').directive('login', function()
{
    return {
        restrict: 'E',
        templateUrl: '/ui/login/login.html',
        controller: 'LoginController',
        replace: true
    };
});

angular.module('rfi-client.widgets').controller('LoginController', [
    '$scope',
    '$timeout',
    'ngToast',
    'SocketService',
    'CharacterService',
    'EntityManager',    //TODO: Inject this in a more logical location once one exists!
    'SyncService',
    'ConfigurationManager',
    LoginController
]);

// ---------------------------------------------------------------------------------------------------------------------
