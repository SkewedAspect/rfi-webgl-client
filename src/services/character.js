// ---------------------------------------------------------------------------------------------------------------------
// Character service
//
// @module character.js
// ---------------------------------------------------------------------------------------------------------------------

function CharacterService()
{
    this.character = undefined;
}


// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('character', [CharacterService]);

// ---------------------------------------------------------------------------------------------------------------------