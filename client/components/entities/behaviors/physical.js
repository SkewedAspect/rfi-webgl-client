// ---------------------------------------------------------------------------------------------------------------------
// Behavior for entities affected by physics
//
// @module physical
// ---------------------------------------------------------------------------------------------------------------------

function PhysicalEntityFactory(babylon, rfiPhysics, utils, physics, BaseEntity)
{
    function degreesToRadians(degrees)
    {
            return degrees * (Math.PI / 180);
    } // end degreesToRadians

    function PhysicalEntity()
    {
        BaseEntity.apply(this, arguments);

        // Create a target velocity controller
        this.targetVelocityController = new rfiPhysics.TargetVelocityController(this.body, {
            maxLinearThrust: {
                x: this.maxSpeed.x,
                y: this.maxSpeed.y,
                z: this.maxSpeed.z
            },
            linearTargetVelocityScaling: {
                x: this.maxSpeed.x,
                y: this.maxSpeed.y,
                z: this.maxSpeed.z
            },
            linearResponsiveness: {
                x: this.linearResponsiveness.x,
                y: this.linearResponsiveness.y,
                z: this.linearResponsiveness.z
            },

            maxAngularThrust: {
                x: this.turnRate,
                y: this.turnRate,
                z: this.turnRate
            },
            angularTargetVelocityScaling: {
                x: this.turnRate,
                y: this.turnRate,
                z: this.turnRate
            },
            angularResponsiveness: {
                x: this.angularResponsiveness.x,
                y: this.angularResponsiveness.y,
                z: this.angularResponsiveness.z
            }
        });

        // Register our update mesh function to the event that fires after physics has completed
        this.body.addEventListener('postStep', this.updateMesh.bind(this));
    } // end PhysicalEntity

    utils.inherits(PhysicalEntity, BaseEntity);

    Object.defineProperties(PhysicalEntity.prototype, {
        body: {
            get: function()
            {
                if(!this._body)
                {
                    this._body = physics.engine.addBody({ mass: 1 });
                } // end if
                return this._body;
            }
        },

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
        },
        turnRate: {
            get: function(){ return this._turnRate; },
            set: function(rate){ this._turnRate = degreesToRadians(rate); }
        }
    });

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
