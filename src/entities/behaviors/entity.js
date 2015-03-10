// ---------------------------------------------------------------------------------------------------------------------
// The base entity behavior.
//
// @module entity.js
// ---------------------------------------------------------------------------------------------------------------------

function BaseEntityFactory(_)
{
    function BaseEntity(entityDef, controller)
    {
        this.controller = controller;

        // Merge the definition with our instance
        _.merge(this, entityDef);
    } // end BaseEntity

    BaseEntity.prototype.setMesh = function(mesh)
    {
        this.mesh = mesh;
    }; // end setMesh

    return BaseEntity;
} // end BaseEntityFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.behaviors').factory('BaseEntity', [
    'lodash',
    BaseEntityFactory
]);

// ---------------------------------------------------------------------------------------------------------------------