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
    var self = this;

    this.inputMan.onCommand('heading', function(event, heading)
    {
        self.mesh.rotate(BABYLON.Axis.Y, self.mesh.rotation.y + heading, BABYLON.Space.LOCAL);
    });

    this.inputMan.onCommand('pitch', function(event, pitch)
    {
        self.mesh.rotate(BABYLON.Axis.Z, self.mesh.rotation.z + pitch, BABYLON.Space.LOCAL);
    });

    this.inputMan.onCommand('roll', function(event, roll)
    {
        self.mesh.rotate(BABYLON.Axis.X, self.mesh.rotation.x + roll, BABYLON.Space.LOCAL);
    })
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