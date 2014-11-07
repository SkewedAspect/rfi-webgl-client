// ---------------------------------------------------------------------------------------------------------------------
// Behavior for entities affected by physics
//
// @module physical
// ---------------------------------------------------------------------------------------------------------------------

var util = require('util');

var _ = require('lodash');
var rfiPhysics = require('rfi-physics');

var BaseEntity = require('./entity');

// ---------------------------------------------------------------------------------------------------------------------

function PhysicalEntity()
{
    BaseEntity.apply(this, arguments);
} // end PhysicalEntity

util.inherits(PhysicalEntity, BaseEntity);

PhysicalEntity.prototype._init = function(babylon, physics)
{
    this.babylon = babylon;
    this.physics = physics;
    this.engine = physics.engine;
    this.body = this.engine.addBody({ mass: 1 });

    // Create a target velocity controller
    this.targetVelocityController = new rfiPhysics.TargetVelocityController(this.body, {
        maxLinearThrust: {
            x: this.max_speed.x,
            y: this.max_speed.y,
            z: this.max_speed.z
        },
        linearTargetVelocityScaling: {
            x: this.max_speed.x,
            y: this.max_speed.y,
            z: this.max_speed.z
        },
        linearResponsiveness: {
            x: this.linear_responsiveness.x,
            y: this.linear_responsiveness.y,
            z: this.linear_responsiveness.z
        },

        maxAngularThrust: {
            x: this.turn_rate,
            y: this.turn_rate,
            z: this.turn_rate
        },
        angularTargetVelocityScaling: {
            x: this.turn_rate,
            y: this.turn_rate,
            z: this.turn_rate
        },
        angularResponsiveness: {
            x: this.angular_responsiveness.x,
            y: this.angular_responsiveness.y,
            z: this.angular_responsiveness.z
        }
    });

    Object.defineProperties(this, {
        targetAngularVelocity: {
            get: function() { return this.targetVelocityController.targetAngularVelocity; }.bind(this),
            set: function(angVel)
            {
                this.targetVelocityController.targetAngularVelocity.x = angVel.x;
                this.targetVelocityController.targetAngularVelocity.y = angVel.y;
                this.targetVelocityController.targetAngularVelocity.z = angVel.z;
            }.bind(this)
        },
        targetLinearVelocity: {
            get: function() { return this.targetVelocityController.targetLinearVelocity; }.bind(this),
            set: function(linVel)
            {
                this.targetVelocityController.targetLinearVelocity.x = linVel.x;
                this.targetVelocityController.targetLinearVelocity.y = linVel.y;
                this.targetVelocityController.targetLinearVelocity.z = linVel.z;
            }.bind(this)
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

            return physical;
        };
    }
]);

// ---------------------------------------------------------------------------------------------------------------------
