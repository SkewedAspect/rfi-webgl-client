// ---------------------------------------------------------------------------------------------------------------------
// Socket service
//
// @module socket.js
// ---------------------------------------------------------------------------------------------------------------------

function SocketService($timeout)
{
    this.$timeout = $timeout;
} // end SocketService

SocketService.prototype.connect = function(url)
{
    this.socket = io(url);
}; // end connect

SocketService.prototype.emit = function()
{
    var self = this;
    var args = Array.prototype.slice.call(arguments, 0);

    // event is always the first arg, so we only have a callback if there's 2 or more arguments.
    if(args.length > 1)
    {
        var cb = args[args.length - 1];
        if(typeof cb == 'function')
        {
            var wrappedCB = function()
            {
                var args = Array.prototype.slice.call(arguments, 0);

                // By wrapping this in `$timeout(0)`, we schedule this to be run on the next digest cycle,
                // and handle the need for `$apply`.
                self.$timeout(function() { cb.apply(cb, args); }, 0);
            };

            // Replace the callback with our wrapped callback.
            args.splice(-1, 1, wrappedCB);
        } // end if
    } // end if

    // Emit over socket.io
    if(this.socket)
    {
        this.socket.emit.apply(this.socket, args);
    } // end if
}; // end emit

SocketService.prototype.on = function(event, callback)
{
    var self = this;
    var wrappedCB = function()
    {
        var args = Array.prototype.slice.call(arguments, 0);

        // By wrapping this in `$timeout(0)`, we schedule this to be run on the next digest cycle,
        // and handle the need for `$apply`.
        self.$timeout(function() { callback.apply(callback, args); }, 0);
    };

    if(this.socket)
    {
        this.socket.on.apply(this.socket, [event, wrappedCB]);
    } // end if
}; // end on

SocketService.prototype.channel = function(channel)
{
    function SocketChannel()
    {
        this.socket = io.connect(channel)
    } // end SocketChannel

    SocketChannel.prototype.on = this.on;
    SocketChannel.prototype.emit = this.emit;

    return new SocketChannel();
}; // end channel

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('socket', ['$timeout', SocketService]);

// ---------------------------------------------------------------------------------------------------------------------