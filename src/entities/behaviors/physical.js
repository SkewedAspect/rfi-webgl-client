// ---------------------------------------------------------------------------------------------------------------------
// Behavior for entities affected by physics
//
// @module physical
// ---------------------------------------------------------------------------------------------------------------------

var util = require('util');

var rfiPhysics = require('rfi-physics');

var BaseEntity = require('./entity');

// ---------------------------------------------------------------------------------------------------------------------

function PhysicalEntity()
{
    BaseEntity.apply(this, arguments);

    // Default to a mass of 100
    this.mass = this.mass || 100;
} // end PhysicalEntity

util.inherits(PhysicalEntity, BaseEntity);

PhysicalEntity.prototype._init = function(babylon, physics)
{
    this.babylon = babylon;
    this.physics = physics;
    this.engine = physics.engine;
    this.body = this.engine.addBody({ mass: 1/*this.mass*/ });

    // Convert to radians/sec
    var turnRate = (this.turn_rate || 2) * (Math.PI / 180);

    // Create a target velocity controller
    this.targetVelocityController = new rfiPhysics.TargetVelocityController(this.body, {
        maxAngularThrust: {
            x: turnRate,
            y: turnRate,
            z: turnRate
        },
        angularTargetVelocityScaling: {
            x: turnRate,
            y: turnRate,
            z: turnRate
        },
        angularResponsiveness: {
            x: 10,
            y: 10,
            z: 10
        }
    });

    Object.defineProperties(this, {
        targetAngularVelocity: {
            get: function(){ return this.targetVelocityController.targetAngularVelocity}.bind(this),
            set: function(angVel){ this.targetVelocityController.targetAngularVelocity = angVel }.bind(this)
        },
        targetLinearVelocity: {
            get: function(){ return this.targetVelocityController.targetLinearVelocity}.bind(this),
            set: function(linVel){ this.targetVelocityController.targetLinearVelocity = linVel }.bind(this)
        }
    });

    // Register our update mesh function to the event that fires after physics has completed
    this.body.addEventListener('postStep', this.updateMesh.bind(this));
}; // end _init

PhysicalEntity.prototype.setMesh = function(mesh)
{
    this.mesh = mesh;

    // We require a rotation quaternion, as we're using physics.
    this.mesh.rotationQuaternion = this.babylon.Quaternion.RotationYawPitchRoll(
        this.mesh.rotation.y,
        this.mesh.rotation.x,
        this.mesh.rotation.z
    );
};

PhysicalEntity.prototype.updateMesh = function()
{
    if(this.mesh && this.body)
    {
        this.mesh.position.copyFrom(this.body.position);
        this.mesh.rotationQuaternion.copyFrom(this.body.quaternion);
    } // end if
}; // end updateMesh

// ---------------------------------------------------------------------------------------------------------------------

module.exports = PhysicalEntity;

angular.module('rfi-client.behaviors').factory('PhysicalEntity', [
    'babylon',
    'PhysicsService',
    function(babylon, physics)
    {
        return function(entityDef, controller)
        {
            var physical = new PhysicalEntity(entityDef, controller);
            physical._init(babylon, physics);

            return physical
        };
    }
]);

// ---------------------------------------------------------------------------------------------------------------------
