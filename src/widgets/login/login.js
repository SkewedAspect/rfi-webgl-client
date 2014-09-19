// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of login.js.
//
// @module login.js
// ---------------------------------------------------------------------------------------------------------------------

function LoginController()
{
    console.log('sup?');
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

angular.module('rfi-client.widgets').controller('LoginController', [LoginController]);

// ---------------------------------------------------------------------------------------------------------------------