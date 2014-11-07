// ---------------------------------------------------------------------------------------------------------------------
// Input Manager
//
// @module inputman.js
// ---------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var Promise = require('bluebird');

// ---------------------------------------------------------------------------------------------------------------------

function InputManagerFactory($rootScope, configMan, keySvc, sceneMan, socket)
{
    function InputManager()
    {
        this.commands = [];

        $rootScope.$on('config load', this.reloadConfig.bind(this));
    } // end InputManager

    // -----------------------------------------------------------------------------------------------------------------

    InputManager.prototype._buildSingleShot = function(commandEvent, value)
    {
        var self = this;
        return function singleShotFunc()
        {
            console.log('single-shot "%s" with value:', commandEvent, value);
            self.broadcast(commandEvent, value);
        }; // end singleShotFunc
    }; // end _buildSingleShot

    InputManager.prototype._buildMomentary = function(commandEvent, onValue, offValue)
    {
        var self = this;
        onValue = onValue === undefined ? true : onValue;
        offValue = offValue === undefined ? false : offValue;

        return [
            function momentaryOnFunc()
            {
                console.log('momentary "%s" set to value:', commandEvent, onValue);
                self.broadcast(commandEvent, onValue);
            }, // end momentaryOnFunc
            function momentaryOffFunc()
            {
                console.log('momentary "%s" reset to value:', commandEvent, offValue);
                self.broadcast(commandEvent, offValue);
            } // end momentaryOffFunc
        ];
    }; // end _buildMomentary

    InputManager.prototype._buildToggle = function(commandEvent, onValue, offValue)
    {
        var self = this;
        var value;
        var toggle = false;
        return function toggleFunc()
        {
            toggle = !toggle;
            value = toggle ? (onValue || true) : (offValue || false);

            console.log('toggle "%s" with value:', commandEvent, value);
            self.broadcast(commandEvent, value);
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
                keySvc.register(keys, self._buildSingleShot(cmdConf.command, cmdConf.value));
            }
            else
            {
                var handlers = self._buildMomentary(cmdConf.command, cmdConf.onValue, cmdConf.offValue);
                keySvc.register(keys, handlers[0], handlers[1]);
            } // end if
        });

        //--------------------------------------------------------------------------------------------------------------
    }; // end reloadConfig

    InputManager.prototype.broadcast = function(event, value)
    {
        $rootScope.$broadcast(event, value);
        socket.event(event, { value: value });
    }; // end broadcast

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
    'SocketService',
    InputManagerFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
