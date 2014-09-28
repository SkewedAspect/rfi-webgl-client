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

        $rootScope.on('config reload', this.reloadConfig.bind(this));
    } // end InputManager

    InputManager.prototype.reloadConfig = function()
    {
        //TODO: Reload config
    }; // end reloadConfig

    InputManager.prototype.listenForCommand = function()
    {
        var args = Array.prototype.slice(arguments);
        var command = args[0];
        args = args.slice(1);

        if(this.commands.indexOf(command) === -1)
        {
            this.commands.push(command);
        } // end if

        return new Promise(function(resolve)
        {
            $rootScope.on(command, function()
            {
                resolve(args);
            });
        });
    }; // end listenForCommand

    InputManager.prototype.getAllCommands = function()
    {
        return this.commands;
    }; // end getAllCommands

    return new InputManager();
} // end InputManagerFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('InputManager', ['$rootScope', InputManagerFactory]);

// ---------------------------------------------------------------------------------------------------------------------