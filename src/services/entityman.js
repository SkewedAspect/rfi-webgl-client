// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of entityman.js.
//
// @module entityman.js
// ---------------------------------------------------------------------------------------------------------------------

function EntityManagerFactory(socket, avatar)
{
    function EntityManager()
    {
        this.entities = {};

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
        if(entityDef.id in this.entities)
        {
            console.error('Attempting to add an entity("%s") that already exists. Ignoring message.', entityDef.id);
        }
        else
        {
            // We instantiate the behavior class as the entity. This way, internally, behaviors can simply use `this` to
            // refer to the entity, as opposed to having to pass the entity into the behaviors.
            var BehaviorClass = this.behaviors[entityDef.behavior];
            var entity = new BehaviorClass(entityDef, socket);

            // Add the newly created entity to our list of entities.
            this.entities[entity.id] = entity;

            console.debug('Entity added successfully!', entity);

            return entity;
        } // end if
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

    EntityManager.prototype._handleCreate = function(entityDef)
    {
        this.create(entityDef);
    }; // end _handleCreate

    EntityManager.prototype._handleInhabit = function(entityDef)
    {
        var entity = this.create(entityDef);
        avatar.inhabitEntity(entity);
    }; // end _handleInhabit

    EntityManager.prototype._handleUpdate = function(message)
    {
        console.error('Update Not Implemented! Message:', message);
    }; // end _handleUpdate

    EntityManager.prototype._handleDestroy = function(message)
    {
        console.error('Destroy Not Implemented! Message:', message);
    }; // end _handleDestroy

    return new EntityManager();
} // end EntityManagerFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('EntityManager', [
        'SocketService',
        'AvatarService',
        EntityManagerFactory
    ]);

// ---------------------------------------------------------------------------------------------------------------------