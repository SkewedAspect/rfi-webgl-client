// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of entityman.js.
//
// @module entityman.js
// ---------------------------------------------------------------------------------------------------------------------

function EntityManager(socket)
{
    var entities = {};

    // Listen for incoming messages
    socket.on('create', this._handleCreate.bind(this));
    socket.on('inhabit', this._handleInhabit.bind(this));
    socket.on('update', this._handleUpdate.bind(this));
    socket.on('destroy', this._handleDestroy.bind(this));
} // end EntityManager

/**
 * Creates a new entity from the entity definition.
 *
 * @param {object} entityDef - A definition for the entity.
 */
EntityManager.prototype.create = function(entityDef)
{
    console.error('Not Implemented! EntityDef:', entityDef);
}; // end EntityManager

/**
 * Removed an entity from the simulation.
 *
 *  @param {String} entityID - The id of the entity to remove.
 */
EntityManager.prototype.remove = function(entityID)
{
    //TODO: We will want to unload any models we've loaded for this entity.
    delete this.entities[entityID];
}; // end EntityManager

// ---------------------------------------------------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------------------------------------------------

EntityManager.prototype._handleCreate = function(message)
{

    console.error('Not Implemented! Message:', message);
}; // end _handleCreate

EntityManager.prototype._handleInhabit = function(message)
{
    console.error('Not Implemented! Message:', message);
}; // end _handleInhabit

EntityManager.prototype._handleUpdate = function(message)
{
    console.error('Not Implemented! Message:', message);
}; // end _handleUpdate

EntityManager.prototype._handleDestroy = function(message)
{
    console.error('Not Implemented! Message:', message);
}; // end _handleDestroy

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('EntityManager', ['socket', EntityManager]);

// ---------------------------------------------------------------------------------------------------------------------