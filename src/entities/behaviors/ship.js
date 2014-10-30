// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of ship.js.
//
// @module ship.js
// ---------------------------------------------------------------------------------------------------------------------

var util = require('util');
var PhysicalEntity = require('./physical');

// ---------------------------------------------------------------------------------------------------------------------

function ShipEntity()
{
    PhysicalEntity.apply(this, arguments);
} // end ShipEntity

util.inherits(ShipEntity, PhysicalEntity);

ShipEntity.prototype._init = function(babylon, physics, inputMan)
{
    PhysicalEntity.prototype._init.call(this, babylon, physics);

    this.inputMan = inputMan;
    this._registerCommands();
}; // end _init

ShipEntity.prototype._registerCommands = function()
{
    //TODO: Register for any input commands we need.
}; // end _registerCommands

// ---------------------------------------------------------------------------------------------------------------------

module.exports = ShipEntity;

angular.module('rfi-client.behaviors').factory('ShipEntity', [
    'babylon',
    'PhysicsService',
    'InputManager',
    function(babylon, physics, inputMan)
    {
        return function(entityDef, controller)
        {
            var ship = new ShipEntity(entityDef, controller);
            ship._init(babylon, physics, inputMan);
            return ship;
        };
    }
]);

// ---------------------------------------------------------------------------------------------------------------------