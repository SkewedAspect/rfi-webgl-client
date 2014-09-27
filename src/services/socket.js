// ---------------------------------------------------------------------------------------------------------------------
// Socket service
//
// @module socket.js
// ---------------------------------------------------------------------------------------------------------------------

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Promise = require('bluebird');

// ---------------------------------------------------------------------------------------------------------------------

function SocketService($timeout)
{
    this.$timeout = $timeout;
} // end SocketService

util.inherits(SocketService, EventEmitter);

SocketService.prototype.connect = function(url)
{
    this.socket = io(url);

    // We only have to worry about events from the server.
    this.socket.on('event', this._handleEvent.bind(this));
}; // end connect

SocketService.prototype.event = function()
{
    var args = Array.prototype.slice.call(arguments);
    args.unshift('event');

    if(this.socket)
    {
        this.socket.emit.apply(this.socket, arguments);
    } // end if
};

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
                self.$timeout(function()
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
}; // end emit

SocketService.prototype._handleEvent = function()
{
    this.emit.apply(this, arguments);
}; // end _handleEvent

/*
 SocketService.prototype.on = function (event, callback) {
 var self = this;
 var wrappedCB = function () {
 var args = Array.prototype.slice.call(arguments, 0);

 // By wrapping this in `$timeout(0)`, we schedule this to be run on the next digest cycle,
 // and handle the need for `$apply`.
 self.$timeout(function () {
 callback.apply(callback, args);
 }, 0);
 };

 if (this.socket) {
 this.socket.on.apply(this.socket, [event, wrappedCB]);
 } // end if
 }; // end on
 */

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('socket', ['$timeout', SocketService]);

// ---------------------------------------------------------------------------------------------------------------------