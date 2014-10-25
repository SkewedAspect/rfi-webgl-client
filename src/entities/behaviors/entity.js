// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of entity.js.
//
// @module entity.js
// ---------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');

// ---------------------------------------------------------------------------------------------------------------------

function BaseEntity(entityDef, controller)
{
    this.controller = controller;

    // Merge the definition with our instance
    _.merge(this, entityDef);
} // end BaseEntity

// ---------------------------------------------------------------------------------------------------------------------

module.exports = BaseEntity;

angular.module('rfi-client.behaviors').factory('BaseEntity', function()
{
    return function(entityDef, controller)
    {
        return new BaseEntity(entityDef, controller);
    };
});

// ---------------------------------------------------------------------------------------------------------------------