// ---------------------------------------------------------------------------------------------------------------------
// SyncService
//
// @module sync.js
// ---------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var now = require('rfi-physics').now;

// ---------------------------------------------------------------------------------------------------------------------

function SyncServiceFactory(socket)
{
    function SyncService()
    {
        this.windowSize = 10;
        this.pingInterval = 5000;
        this.pingTimes = [];
    } // end SyncService

    SyncService.prototype = {
        get latency()
        {
            return ((_.reduce(this.pingTimes, function(pingSums, ping)
            {
                return pingSums + ping;
            }, 0) / this.pingTimes.length) / 2).toFixed(2);
        }
    }; // end prototype

    SyncService.prototype._ping = function()
    {
        var self = this;
        var startTime = now();
        socket.request('ping').then(function()
        {
            var pingTime = now() - startTime;
            self.pingTimes.push(pingTime);

            // Stay inside our window size
            var overflow = self.pingTimes.length - self.windowSize;
            if(overflow > 0)
            {
                self.pingTimes.splice(0, overflow);
            } // end if
        });
    }; // end _ping

    SyncService.prototype.start = function()
    {
        this.intervalHandle = setInterval(this._ping.bind(this), this.pingInterval);
    }; // end start

    SyncService.prototype.stop = function()
    {
        if(this.intervalHandle)
        {
            clearInterval(this.intervalHandle);
        } // end if
    }; // end stop

    return new SyncService();
} // end SyncServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('SyncService', [
    'SocketService',
    SyncServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------