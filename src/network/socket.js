// ---------------------------------------------------------------------------------------------------------------------
// Socket service
//
// @module socket.js
// ---------------------------------------------------------------------------------------------------------------------

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Promise = require('bluebird');

// ---------------------------------------------------------------------------------------------------------------------

function SocketServiceFactory($timeout)
{
    function SocketService(){}

    util.inherits(SocketService, EventEmitter);

    SocketService.prototype.connect = function(url)
    {
        this.socket = io(url);

        // We only have to worry about events from the server.
        this.socket.on('event', this._handleEvent.bind(this));
    }; // end connect

    SocketService.prototype.event = function(eventName, payload)
    {
        if(this.socket)
        {
            this.socket.emit('event', eventName, payload);
        } // end if
    }; // end event

    SocketService.prototype.request = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        args.unshift('request');

        return new Promise(function(resolve, reject)
            {
                var wrappedCB = function()
                {
                    var args = Array.prototype.slice.call(arguments, 0);

                    // By wrapping this in `$timeout(0)`, we schedule this to be run on the next digest cycle,
                    // and handle the need for `$apply`.
                    $timeout(function()
                    {
                        resolve(args);
                    }, 0);
                };

                // Add our callback
                args.push(wrappedCB);

                // Emit over socket.io
                if(self.socket)
                {
                    self.socket.emit.apply(self.socket, args);
                } // end if
            }
        );
    }; // end request

    SocketService.prototype._handleEvent = function()
    {
        this.emit.apply(this, arguments);
    }; // end _handleEvent

    return new SocketService();
} // end SocketServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('SocketService', ['$timeout', SocketServiceFactory]);

// ---------------------------------------------------------------------------------------------------------------------
