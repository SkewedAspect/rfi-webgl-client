// ---------------------------------------------------------------------------------------------------------------------
// LoggingService
//
// @module logging.js
// ---------------------------------------------------------------------------------------------------------------------

function LoggingServiceFactory($log)
{
    function LoggingService(){}

    LoggingService.prototype.debug = function()
    {
        $log.debug.apply($log, arguments);
    }; // end debug

    LoggingService.prototype.info = function()
    {
        $log.info.apply($log, arguments);
    }; // end debug

    LoggingService.prototype.warn = function()
    {
        $log.warn.apply($log, arguments);
    }; // end debug

    LoggingService.prototype.error = function()
    {
        $log.error.apply($log, arguments);
    }; // end debug

    return new LoggingService();
} // end LoggingServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('LoggingService', [
    '$log',
    LoggingServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------