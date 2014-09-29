// ---------------------------------------------------------------------------------------------------------------------
// Configuration Manager
//
// @module configman.js
// ---------------------------------------------------------------------------------------------------------------------

function ConfigurationManagerFactory($rootScope)
{
    function ConfigurationManager(){}

    return new ConfigurationManager();
} // end ConfigurationManagerFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('ConfigurationManager', ['$rootScope', ConfigurationManagerFactory]);

// ---------------------------------------------------------------------------------------------------------------------