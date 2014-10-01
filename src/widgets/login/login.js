// ---------------------------------------------------------------------------------------------------------------------
// Login widget
//
// @module login.js
// ---------------------------------------------------------------------------------------------------------------------

function LoginController($scope, socket, charService, entityMan, confMan)
{
    $scope.form = {};
    $scope.selected = {};
    $scope.successful = false;

    $scope.login = function()
    {
        socket.request('login', $scope.form)
            .spread(function(results)
            {
                if(results.confirm)
                {
                    $scope.characters = results.characters;
                }
                else
                {
                    console.error(results);
                } // end if
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

        socket.request('select character', query)
            .spread(function(results)
            {
                if(results.confirm)
                {
                    console.log('logged in!');
                    $scope.successful = true;
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
        templateUrl: '/partials/login/login.html',
        controller: 'LoginController'
    }
});

angular.module('rfi-client.widgets').controller('LoginController', [
    '$scope',
    'SocketService',
    'CharacterService',
    'EntityManager',    //TODO: Inject this in a more logical location once one exists!
    'ConfigurationManager',
    LoginController
]);

// ---------------------------------------------------------------------------------------------------------------------