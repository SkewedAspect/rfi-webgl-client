// ---------------------------------------------------------------------------------------------------------------------
// The Avatar Service tracks which entity is currently the player's avatar, and gives us an API for injecting state
// changes, like movement, etc.
//
// @module avatar.js
// ---------------------------------------------------------------------------------------------------------------------

function AvatarServiceFactory($rootScope, sceneMan)
{
    function AvatarService(){}

    AvatarService.prototype.inhabitEntity = function(entity)
    {
        this.entity = entity;

        sceneMan.playerCamera.target = entity.mesh;

        $rootScope.$broadcast('avatar changed');
    }; // end inhabitEntity

    return new AvatarService();
} // end AvatarServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('AvatarService', ['$rootScope', 'SceneManager', AvatarServiceFactory]);

// ---------------------------------------------------------------------------------------------------------------------