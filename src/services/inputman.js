// ---------------------------------------------------------------------------------------------------------------------
// Input Manager
//
// @module inputman.js
// ---------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var Promise = require('bluebird');

// ---------------------------------------------------------------------------------------------------------------------

function InputManagerFactory($rootScope, keySvc)
{
    function InputManager()
    {
        this.commands = [];

        $rootScope.$on('config reload', this.reloadConfig.bind(this));

        //TODO: remove once the config service actually fires the right event
        this.reloadConfig();
    } // end InputManager

    // -----------------------------------------------------------------------------------------------------------------

    InputManager.prototype._buildMomentary = function(commandEvent, value)
    {
        return function momentaryFunc()
        {
            console.log('momentary "%s" with value:', commandEvent, value);
            $rootScope.$broadcast(commandEvent, value);
        }; // end momentaryFunc
    }; // end _buildMomentary

    InputManager.prototype._buildToggle = function(commandEvent)
    {
        var toggle = false;
        return function toggleFunc()
        {
            toggle = !toggle;
            console.log('toggle "%s" with value:', commandEvent, toggle);
            $rootScope.$broadcast(commandEvent, toggle);
        }; // end toggleFunc
    }; // end _buildToggle

    // -----------------------------------------------------------------------------------------------------------------

    InputManager.prototype.reloadConfig = function()
    {
        var self = this;

        //TODO: Really get the config from somewhere.
        var config = {
            /*
            keyboard: {
                'w': {
                    command: 'pitch',
                    value: -0.5
                },
                's': {
                    command: 'pitch',
                    value: 0.5
                },
                'a': {
                    command: 'heading',
                    value: -0.5
                },
                'd': {
                    command: 'heading',
                    value: -0.5
                },
                'c': {
                    command: 'crouch',
                    toggle: true
                },
                'space': {
                    command: 'fire'
                },
                'f1': {
                    command: 'test',
                    value: ['arg1', 0.99, true]
                }
            }
            */
        };

        // Keyboard support
        _.forIn(config.keyboard, function(cmdConf, keys)
        {
            if(cmdConf.toggle)
            {
                keySvc.register(keys, self._buildToggle(cmdConf.command));
            }
            else
            {
                keySvc.register(keys, self._buildMomentary(cmdConf.command, cmdConf.value));
            } // end if
        });
    }; // end reloadConfig

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
    'KeybindingService',
    InputManagerFactory
]);

// ---------------------------------------------------------------------------------------------------------------------