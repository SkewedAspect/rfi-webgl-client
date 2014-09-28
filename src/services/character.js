// ---------------------------------------------------------------------------------------------------------------------
// Character service
//
// @module character.js
// ---------------------------------------------------------------------------------------------------------------------

function CharacterServiceFactory()
{
    function CharacterService()
    {
        this.character = undefined;
    } // end CharacterService

    return new CharacterService();
} // end CharacterServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('CharacterService', [CharacterServiceFactory]);

// ---------------------------------------------------------------------------------------------------------------------
