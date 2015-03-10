// ---------------------------------------------------------------------------------------------------------------------
// A service that wraps up the integration of the RFI Physics module.
//
// @module physics.js
// ---------------------------------------------------------------------------------------------------------------------

function PhysicsServiceFactory(babylon, rfiPhysics, sceneMan)
{
    var now = rfiPhysics.now;

    function PhysicsService()
    {
        // The known universe started on Jan 1, 1970.
        this.lastTimeStamp = 0;

        this.engine = new rfiPhysics.PhysicsEngine();
    } // end PhysicsService

    PhysicsService.prototype = {
        get timeSinceLastFrame()
        {
            return now() - this.lastTimeStamp;
        }
    }; // end prototype

    // -----------------------------------------------------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------------------------------------------------

    PhysicsService.prototype.start = function()
    {
        this.lastTimeStamp = now();
        //sceneMan.on('before render', this._renderFrame.bind(this));
        this.engine.loop();
    }; // end start

    PhysicsService.prototype.stop = function()
    {
        //sceneMan.removeListener('before render', this._renderFrame.bind(this));
    }; // end stop

    // -----------------------------------------------------------------------------------------------------------------
    // Event Handlers
    // -----------------------------------------------------------------------------------------------------------------

    PhysicsService.prototype._renderFrame = function()
    {
        this.engine.tick(this.timeSinceLastFrame);
        this.lastTimeStamp = now();
    }; // end _renderFrame

    return new PhysicsService();
} // end PhysicsServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('PhysicsService', [
    'babylon',
    'rfi-physics',
    'SceneManager',
    PhysicsServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------