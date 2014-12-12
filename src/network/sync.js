// ---------------------------------------------------------------------------------------------------------------------
// SyncService
//
// @module sync.js
// ---------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var now = require('rfi-physics').now;

// ---------------------------------------------------------------------------------------------------------------------

function SyncServiceFactory($rootScope, socket)
{
    function SyncService()
    {
        this.windowSize = 10;
        this.pingInterval = 5000;
        this.pingTimes = [];
        this.latency = 0;
        this.running = false;

        // Pre-bind #stop() so we can use it as an event handler, and remove it later.
        this.stop = this.stop.bind(this);
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
            var sumOfPingTimes = _.reduce(self.pingTimes,
                function(sum, ping) { return sum + ping; },
                0);
            var lastLatency = self.latency;
            self.latency = ((sumOfPingTimes / self.pingTimes.length) / 2).toFixed(2);

            if(self.latency != lastLatency)
            {
                $rootScope.$broadcast('syncService.latencyChanged');
            } // end if

            if(self.running)
            {
                self.timeoutHandle = setTimeout(self._ping.bind(self), self.pingInterval);
            } // end if
        });
    }; // end _ping

    SyncService.prototype.start = function()
    {
        if(!this.running)
        {
            this.running = true;
            this.timeoutHandle = setTimeout(this._ping.bind(this), this.pingInterval);
            socket.socket.on('disconnect', this.stop);
            socket.socket.on('reconnect_failed', this.stop);
        } // end if
    }; // end start

    SyncService.prototype.stop = function()
    {
        this.running = false;
        if(this.timeoutHandle)
        {
            socket.socket.removeListener('disconnect', this.stop);
            socket.socket.removeListener('reconnect_failed', this.stop);
            clearTimeout(this.timeoutHandle);
        } // end if
    }; // end stop

    return new SyncService();
} // end SyncServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('SyncService', [
    '$rootScope',
    'SocketService',
    SyncServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
