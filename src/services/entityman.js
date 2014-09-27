// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of entityman.js.
//
// @module entityman.js
// ---------------------------------------------------------------------------------------------------------------------

function EntityManager(socket)
{
    this.entities = {};
    this.socket = socket;

    // Because browserify can't support dynamic requires (https://github.com/substack/node-browserify/issues/377), we
    // are forced to use literal strings, and build a map of the server's behavior string, and ours.
    this.behaviors = {
        './behaviors/ship': require('../behaviors/ship')
    };

    // Listen for incoming messages
    socket.on('create entity', this._handleCreate.bind(this));
    socket.on('inhabit entity', this._handleInhabit.bind(this));
    socket.on('update entity', this._handleUpdate.bind(this));
    socket.on('destroy entity', this._handleDestroy.bind(this));
} // end EntityManager

/**
 * Creates a new entity from the entity definition.
 *
 * @param {object} entityDef - A definition for the entity.
 */
EntityManager.prototype.create = function(entityDef)
{
    // We instantiate the behavior class as the entity. This way, internally, behaviors can simply use `this` to
    // refer to the entity, as opposed to having to pass the entity into the behaviors.
    var BehaviorClass = this.behaviors[entityDef.behavior];
    var entity = new BehaviorClass(entityDef, this.socket);

    // Add the newly created entity to our list of entities.
    this.entities[entity.id] = entity;

    console.debug('Entity added successfully!', entity);
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

EntityManager.prototype._handleCreate = function(entity)
{
    if(entity.id in this.entities) {
        console.error('Attempting to add an entity("%s") that already exists. Ignoring message.', entity.id);
    }
    else
    {
        this.create(entity);
    } // end if
}; // end _handleCreate

EntityManager.prototype._handleInhabit = function(message)
{
    console.error('Inhabit Entity Not Implemented! Message:', message);
}; // end _handleInhabit

EntityManager.prototype._handleUpdate = function(message)
{
    console.error('Update Not Implemented! Message:', message);
}; // end _handleUpdate

EntityManager.prototype._handleDestroy = function(message)
{
    console.error('Destroy Not Implemented! Message:', message);
}; // end _handleDestroy

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('EntityManager', ['socket', EntityManager]);

// ---------------------------------------------------------------------------------------------------------------------