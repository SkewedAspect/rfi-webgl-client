// ---------------------------------------------------------------------------------------------------------------------
// Keybinding Service
//
// @module keybinding.js
// ---------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');

// ---------------------------------------------------------------------------------------------------------------------

function KeybindingServiceFactory($window, $timeout)
{
    function KeybindingService()
    {
        this.listener = new $window.keypress.Listener();
    } // end KeybindingService

    KeybindingService.prototype._wrapCallback = function(callback)
    {
        return function()
        {
            var args = Array.prototype.slice(arguments);
            $timeout(function()
            {
                callback.apply(callback, args);
            }, 0);
        }
    }; // end _wrapCallback

    KeybindingService.prototype.register = function(binding, callback)
    {
        callback = callback || function(){};
        var newBinding = {};

        if(_.isString(binding))
        {
            newBinding = {
                keys: binding,
                on_keydown: this._wrapCallback(callback),
                is_exclusive: false
            };
        }
        else if(_.isPlainObject(binding))
        {
            var self = this;

            _.forIn(binding, function(value, key)
            {
                var newValue;
                if(_.isFunction(value))
                {
                    // Wrap the function in an angular friendly handler.
                    newValue = self._wrapCallback(value);
                } // end if

                newBinding[key] = newValue || value;
            });

            /*
            // We default 'is_exclusive' to true.
            if(newBinding['is_exclusive'] === undefined)
            {
                newBinding['is_exclusive'] = true;
            } // end if
            */
        }
        else
        {
            console.error('Failed to bind keys: Unknown binding object:', binding);
            return;
        } // end if

        var registerHandle = this.listener.register_combo(newBinding);

        // Return a function for unregistering.
        return function(){ self.listener.unregister_combo(registerHandle); };
    }; // end register

    KeybindingService.prototype.clear = function()
    {
        this.listener.reset();
    }; // end clear

    return new KeybindingService();
} // end KeybindingServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('KeybindingService', ['$window', '$timeout', KeybindingServiceFactory]);

// ---------------------------------------------------------------------------------------------------------------------