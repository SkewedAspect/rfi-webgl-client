// ---------------------------------------------------------------------------------------------------------------------
// KeyBinding Service
//
// @module keybinding.js
// ---------------------------------------------------------------------------------------------------------------------

function KeyBindingServiceFactory($document, $timeout, keypress, _)
{
    function KeyBindingService()
    {
        this.initialized = false;
    } // end KeyBindingService

    KeyBindingService.prototype.init = function(elem)
    {
        console.log('binding to element:', elem);

        // Setup the listener with the right element
        this.listener = new keypress.Listener(elem, {
            prevent_default: true,
            prevent_repeat: true,
            is_exclusive: false
        });

        this.initialized = true;
    }; // end init

    KeyBindingService.prototype._wrapCallback = function(callback)
    {
        return function()
        {
            var args = Array.prototype.slice(arguments);
            $timeout(function()
            {
                callback.apply(callback, args);
            }, 0);
        };
    }; // end _wrapCallback

    KeyBindingService.prototype.register = function(binding, keyDown, keyUp)
    {
        if(!this.listener)
        {
            console.warn("Attempted to register keys before keybinding service has been initialized!");
            return;
        } // end if

        var newBinding = {};

        keyDown = keyDown || function(){};
        keyUp = keyUp || function(){};

        if(_.isString(binding))
        {
            newBinding = {
                keys: binding,
                on_keydown: this._wrapCallback(keyDown),
                on_keyup: this._wrapCallback(keyUp)
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

    KeyBindingService.prototype.clear = function()
    {
        if(!this.listener)
        {
            console.warn("Attempted to clear key bindings before keybinding service has been initialized!");
            return;
        } // end if

        this.listener.reset();
    }; // end clear

    return new KeyBindingService();
} // end KeyBindingServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('KeyBindingService', [
    '$document',
    '$timeout',
    'keypress',
    'lodash',
    KeyBindingServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
