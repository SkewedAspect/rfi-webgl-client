// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of ship.js.
//
// @module ship.js
// ---------------------------------------------------------------------------------------------------------------------

var util = require('util');
var BaseEntity = require('./entity');

// ---------------------------------------------------------------------------------------------------------------------

function ShipEntity()
{
    BaseEntity.apply(this, arguments);
} // end ShipEntity

//TODO: This probably will not inherit from BaseEntity directly in the future; but for now this works.
util.inherits(ShipEntity, BaseEntity);

ShipEntity.prototype._registerCommands = function()
{
    this.inputMan.onCommand('pitch', function(pitch)
    {
        console.log("Pitch Input:", pitch);
    });
};

ShipEntity.prototype._init = function()
{
    this._registerCommands();
};


// ---------------------------------------------------------------------------------------------------------------------

module.exports = ShipEntity;

angular.module('rfi-client.behaviors').factory('ShipEntity', ['InputManager', function(inputMan)
{
    return function(entityDef, controller)
    {
        var ship = new ShipEntity(entityDef, controller);
        ship.inputMan = inputMan;
        ship._init();
        return ship;
    };
}]);

// ---------------------------------------------------------------------------------------------------------------------