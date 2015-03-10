// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of ship.js.
//
// @module ship.js
// ---------------------------------------------------------------------------------------------------------------------

function ShipEntityFactory(utils, PhysicalEntity)
{
    function ShipEntity()
    {
        PhysicalEntity.apply(this, arguments);

        this._registerCommands();
    } // end ShipEntity

    utils.inherits(ShipEntity, PhysicalEntity);

    ShipEntity.prototype._registerCommands = function()
    {
        //TODO: Register for any input commands we need.
    }; // end _registerCommands

    return ShipEntity;
} // end ShipEntityFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.behaviors').factory('ShipEntity', [
    'utils',
    'PhysicalEntity',
    ShipEntityFactory
]);

// ---------------------------------------------------------------------------------------------------------------------