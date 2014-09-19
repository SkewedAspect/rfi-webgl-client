// ---------------------------------------------------------------------------------------------------------------------
// Login widget
//
// @module login.js
// ---------------------------------------------------------------------------------------------------------------------

function LoginController($scope, socket)
{
    $scope.form = {};
    $scope.selected = {};
    $scope.successful = false;

    $scope.login = function()
    {
        console.log($scope.form);

        socket.emit('login', $scope.form, function(results)
        {
            if(results.confirm)
            {
                $scope.characters = results.characters;
            } // end if
        });
    }; // end login

    $scope.select = function(char)
    {
        $scope.selected = char;
    }; // end select

    $scope.submitChar = function()
    {
        var query = {
            character:  $scope.selected.id
        };

        socket.emit('select character', query, function(results)
        {
            if(results.confirm)
            {
                console.log('logged in!');
                $scope.successful = true;

                //TODO: This is for testing purposes!
                socket.emit('input',
                    {
                        foo: "bar!"
                    });
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

angular.module('rfi-client.widgets').controller('LoginController', ['$scope', 'socket', LoginController]);

// ---------------------------------------------------------------------------------------------------------------------