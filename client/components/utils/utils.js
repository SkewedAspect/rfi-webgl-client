// ---------------------------------------------------------------------------------------------------------------------
// Utils - A set of useful utilities that one might use, unless their use eclipses utility.
//
// @module utils.js
// ---------------------------------------------------------------------------------------------------------------------

function UtilsFactory()
{
    function Utils(){}

    Utils.prototype.inherits = function inherits(ctor, superCtor)
    {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    };

    return new Utils();
} // end UtilsFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.utils').service('utils', [
    UtilsFactory
]);

// ---------------------------------------------------------------------------------------------------------------------