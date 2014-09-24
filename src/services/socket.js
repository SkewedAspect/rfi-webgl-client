// ---------------------------------------------------------------------------------------------------------------------
// Socket service
//
// @module socket.js
// ---------------------------------------------------------------------------------------------------------------------

var Promise = require('bluebird');

function SocketService($timeout) {
    this.$timeout = $timeout;
} // end SocketService

SocketService.prototype.connect = function (url) {
    this.socket = io(url);
}; // end connect

SocketService.prototype.request = function () {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 0);

    return new Promise(function (resolve, reject)
        {
            var wrappedCB = function () {
                var args = Array.prototype.slice.call(arguments, 0);

                // By wrapping this in `$timeout(0)`, we schedule this to be run on the next digest cycle,
                // and handle the need for `$apply`.
                self.$timeout(function () {
                    resolve(args);
                }, 0);
            };

            // Add our callback
            args.push(wrappedCB);

            // Emit over socket.io
            if (self.socket) {
                self.socket.emit.apply(self.socket, args);
            } // end if
        }
    );
}; // end emit

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

SocketService.prototype.channel = function (channel) {
    function SocketChannel() {
        this.socket = io.connect(channel)
    } // end SocketChannel

    SocketChannel.prototype.on = this.on;
    SocketChannel.prototype.emit = this.emit;

    return Promise.resolve(new SocketChannel());
}; // end channel

SocketService.prototype.event = function () {
    if (this.socket) {
        this.socket.emit.apply(this.socket, arguments);
    } // end if
};

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('socket', ['$timeout', SocketService]);

// ---------------------------------------------------------------------------------------------------------------------