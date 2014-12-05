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
        this.latency = 0;
        this.running = false;
    } // end SyncService

    SyncService.prototype._ping = function()
    {
        var self = this;
        var startTime = now();
        socket.request('ping').then(function()
        {
            var pingTime = now() - startTime;
            self.pingTimes.push(pingTime);

            // Stay inside our window size
            while(self.pingTimes.length > self.windowSize)
            {
                self.pingTimes.shift();
            } // end while

            // Recalculate average latency (one-way) from accumulated ping measurements (round-trip).
            var sumOfPingTimes = _.reduce(this.pingTimes,
                function(sum, ping) { return sum + ping; },
                0);
            this.latency = ((sumOfPingTimes / this.pingTimes.length) / 2).toFixed(2);

            if(self.running)
            {
                self.timeoutHandle = setTimeout(this._ping.bind(this), this.pingInterval);
            } // end if
        });
    }; // end _ping

    SyncService.prototype.start = function()
    {
        if(!this.running)
        {
            this.running = true;
            this.timeoutHandle = setTimeout(this._ping.bind(this), this.pingInterval);
        } // end if
    }; // end start

    SyncService.prototype.stop = function()
    {
        this.running = false;
        if(this.timeoutHandle)
        {
            clearTimeout(this.timeoutHandle);
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
