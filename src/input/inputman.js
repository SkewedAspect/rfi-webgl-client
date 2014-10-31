// ---------------------------------------------------------------------------------------------------------------------
// Input Manager
//
// @module inputman.js
// ---------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var Promise = require('bluebird');

// ---------------------------------------------------------------------------------------------------------------------

function InputManagerFactory($rootScope, configMan, keySvc, sceneMan)
{
    function InputManager()
    {
        this.commands = [];

        $rootScope.$on('config load', this.reloadConfig.bind(this));
    } // end InputManager

    // -----------------------------------------------------------------------------------------------------------------

    InputManager.prototype._buildSingleShot = function(commandEvent, onValue, offValue)
    {
        onValue = onValue || true;
        offValue = offValue || false;

        return [
            function sShotOnFunc()
            {
                console.log('single-shot "%s" set to value:', commandEvent, onValue);
                $rootScope.$broadcast(commandEvent, onValue);
            }, // end sShotOnFunc
            function sShotOffFunc()
            {
                console.log('single-shot "%s" reset to value:', commandEvent, offValue);
                $rootScope.$broadcast(commandEvent, offValue);
            } // end sShotOffFunc
        ]
    }; // end _buildMomentary

    InputManager.prototype._buildMomentary = function(commandEvent, value)
    {
        return function momentaryFunc()
        {
            console.log('momentary "%s" with value:', commandEvent, value);
            $rootScope.$broadcast(commandEvent, value);
        }; // end momentaryFunc
    }; // end _buildMomentary

    InputManager.prototype._buildToggle = function(commandEvent, onValue, offValue)
    {
        var value;
        var toggle = false;
        return function toggleFunc()
        {
            toggle = !toggle;
            value = toggle ? (onValue || true) : (offValue || false);

            console.log('toggle "%s" with value:', commandEvent, value);
            $rootScope.$broadcast(commandEvent, value);
        }; // end toggleFunc
    }; // end _buildToggle

    // -----------------------------------------------------------------------------------------------------------------

    InputManager.prototype.reloadConfig = function()
    {
        var self = this;
        var config = configMan.activeConfig;

        //--------------------------------------------------------------------------------------------------------------
        // Keyboard support
        //--------------------------------------------------------------------------------------------------------------

        // Clear existing bindings
        keySvc.clear();

        // Now, we bind based on our config
        _.forIn(config.keyboard, function(cmdConf, keys)
        {
            if(cmdConf.toggle)
            {
                keySvc.register(keys, self._buildToggle(cmdConf.command, cmdConf.onValue, cmdConf.offValue));
            }
            else if(cmdConf.singleShot)
            {
                var handlers = self._buildSingleShot(cmdConf.command, cmdConf.onValue, cmdConf.offValue);
                keySvc.register(keys, handlers[0], handlers[1]);
            }
            else
            {
                keySvc.register(keys, self._buildMomentary(cmdConf.command, cmdConf.value));
            } // end if
        });

        //--------------------------------------------------------------------------------------------------------------
    }; // end reloadConfig

    // -----------------------------------------------------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------------------------------------------------

    InputManager.prototype.enableMouseLook = function()
    {
        //TODO: This needs to use PointerLock as well: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
        sceneMan.playerCamera.attachControl(sceneMan.canvas);
    }; // end enableMouseLook

    InputManager.prototype.disableMouseLook = function()
    {
        //TODO: This needs to use PointerLock as well: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
        sceneMan.playerCamera.detachControl(sceneMan.canvas);
    }; // end disableMouseLook

    InputManager.prototype.onCommand = function(command, callback)
    {
        // Register the command if it doesn't already exist in our list of commands.
        if(this.commands.indexOf(command) === -1)
        {
            this.commands.push(command);
        } // end if

        return $rootScope.$on(command, function()
        {
            callback.apply(callback, arguments);
        });
    }; // end onCommand

    // -----------------------------------------------------------------------------------------------------------------

    return new InputManager();
} // end InputManagerFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('InputManager', [
    '$rootScope',
    'ConfigurationManager',
    'KeyBindingService',
    'SceneManager',
    InputManagerFactory
]);

// ---------------------------------------------------------------------------------------------------------------------