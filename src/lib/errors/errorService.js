// ---------------------------------------------------------------------------------------------------------------------
// ErrorService
//
// @module errorService
// ---------------------------------------------------------------------------------------------------------------------

function ErrorServiceFactory(makeError)
{
    // -----------------------------------------------------------------------------------------------------------------
    // HACK: We have to do an eval to stop the minification from mangling our function names
    // -----------------------------------------------------------------------------------------------------------------

    /* jshint evil:true */
    eval("1");

    // -----------------------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------------------
    // NotImplementedError
    // -----------------------------------------------------------------------------------------------------------------

    function NotImplementedError(functionName)
    {
        var message = functionName ? "'" + functionName + "' not implemented." : "Not implemented.";

        NotImplementedError.super.call(this, message);

        this.functionName = functionName;
    } // end NotImplemented

    makeError(NotImplementedError);

    // -----------------------------------------------------------------------------------------------------------------
    // RequestDeniedError
    // -----------------------------------------------------------------------------------------------------------------

    function RequestDeniedError(reason, message)
    {
        RequestDeniedError.super.call(this, "Request Denied: " + message);

        this.reason = reason;
    } // end RequestDenied

    makeError(RequestDeniedError);

    // -----------------------------------------------------------------------------------------------------------------

    return {
        NotImplemented: NotImplementedError,
        RequestDenied: RequestDeniedError
    };
} // end ErrorServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').factory('ErrorService', [
    'makeError',
    ErrorServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------