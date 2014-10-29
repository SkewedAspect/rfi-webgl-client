// ---------------------------------------------------------------------------------------------------------------------
// The Avatar Service tracks which entity is currently the player's avatar, and gives us an API for injecting state
// changes, like movement, etc.
//
// @module avatar.js
// ---------------------------------------------------------------------------------------------------------------------

function AvatarServiceFactory($rootScope, babylon, sceneMan, inputMan)
{
    var rfiPhysics = require('rfi-physics');

    var engine = new rfiPhysics.PhysicsEngine();

    engine.loop();

    function updateMesh(mesh)
    {
        mesh.position.copyFrom(this.position);
        mesh.rotationQuaternion.copyFrom(this.quaternion);
    } // end updateMesh

    function AvatarService(){}

    AvatarService.prototype.inhabitEntity = function(entity)
    {
        this.entity = entity;

        // Set up camera
        sceneMan.playerCamera.target = entity.mesh;
        inputMan.enableMouseLook(); //TODO: This should eventually be done based on mouse binding, not always.

        entity.mesh.rotationQuaternion = new babylon.Quaternion();
        var body = engine.addBody({ mass: 100 });
        body.addEventListener('postStep', updateMesh.bind(body, entity.mesh));

        this.targetVelocity = new rfiPhysics.TargetVelocityController(body);

        // Focus our game element
        var elem = document.getElementById('game');
        elem.focus();

        $rootScope.$broadcast('avatar changed');

        this._registerCommands();
    }; // end inhabitEntity

    AvatarService.prototype._registerCommands = function()
    {
        var self = this;

        inputMan.onCommand('heading', function(event, heading)
        {
            self.targetVelocity.targetAngularVelocity.y += (heading / 10);
        });

        inputMan.onCommand('pitch', function(event, pitch)
        {
            self.targetVelocity.targetAngularVelocity.z += (pitch / 10);
        });

        inputMan.onCommand('roll', function(event, roll)
        {
            self.targetVelocity.targetAngularVelocity.x += (roll / 10);
        });
    };

    return new AvatarService();
} // end AvatarServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('AvatarService', [
    '$rootScope',
    'babylon',
    'SceneManager',
    'InputManager',
    AvatarServiceFactory]);

// ---------------------------------------------------------------------------------------------------------------------
