// ---------------------------------------------------------------------------------------------------------------------
// Behavior for entities affected by physics
//
// @module physical
// ---------------------------------------------------------------------------------------------------------------------

function PhysicalEntityFactory(babylon, rfiPhysics, utils, physics, BaseEntity)
{
    function PhysicalEntity()
    {
        BaseEntity.apply(this, arguments);

        this.body = physics.engine.addBody({ mass: 1 });

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
            targetLinearVelocity: {
                get: function() { return this.targetVelocityController.targetLinearVelocity; },
                set: function(linVel)
                {
                    this.targetVelocityController.targetLinearVelocity.x = linVel.x;
                    this.targetVelocityController.targetLinearVelocity.y = linVel.y;
                    this.targetVelocityController.targetLinearVelocity.z = linVel.z;
                }
            },
            targetAngularVelocity: {
                get: function() { return this.targetVelocityController.targetAngularVelocity; },
                set: function(angVel)
                {
                    this.targetVelocityController.targetAngularVelocity.x = angVel.x;
                    this.targetVelocityController.targetAngularVelocity.y = angVel.y;
                    this.targetVelocityController.targetAngularVelocity.z = angVel.z;
                }
            },
            position: {
                get: function(){ return this.body.position;},
                set: function(pos){ this.body.position.set(pos.x, pos.y, pos.z); }
            },
            orientation: {
                get: function(){ return this.body.quaternion; },
                set: function(orientation){ this.body.quaternion.set(orientation.x, orientation.y, orientation.z, orientation.w); }
            }
        });

        // Register our update mesh function to the event that fires after physics has completed
        this.body.addEventListener('postStep', this.updateMesh.bind(this));
    } // end PhysicalEntity

    utils.inherits(PhysicalEntity, BaseEntity);

    PhysicalEntity.prototype.setMesh = function(mesh)
    {
        this.mesh = mesh;

        // We require a rotation quaternion, as we're using physics.
        this.mesh.rotationQuaternion = babylon.Quaternion.RotationYawPitchRoll(
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

    return PhysicalEntity;
} // end PhysicalEntityFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.behaviors').factory('PhysicalEntity', [
    'babylon',
    'rfi-physics',
    'utils',
    'PhysicsService',
    'BaseEntity',
    PhysicalEntityFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
