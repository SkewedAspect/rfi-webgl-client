// ---------------------------------------------------------------------------------------------------------------------
// Input Manager
//
// @module inputman.js
// ---------------------------------------------------------------------------------------------------------------------

var Promise = require('bluebird');

// ---------------------------------------------------------------------------------------------------------------------

function InputManagerFactory($rootScope)
{
    function InputManager()
    {
        this.commands = [];

        $rootScope.$on('config reload', this.reloadConfig.bind(this));
    } // end InputManager

    InputManager.prototype.reloadConfig = function()
    {
        //TODO: Reload config
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

    return new InputManager();
} // end InputManagerFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('InputManager', ['$rootScope', InputManagerFactory]);

// ---------------------------------------------------------------------------------------------------------------------