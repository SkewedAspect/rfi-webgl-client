// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of entityman.js.
//
// @module entityman.js
// ---------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var Promise = require('bluebird');

// ---------------------------------------------------------------------------------------------------------------------

function EntityManagerFactory($injector, socket, avatar, sceneMan, physics)
{
    function EntityManager()
    {
        // Start the physics engine
        physics.start();

        this.entities = {};

        // Mapping between server name and our factory name
        this.behaviors = {
            './behaviors/ship': 'ShipEntity'
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
            return Promise.resolve(this.entities[entityDef.id]);
        }
        else
        {
            // We instantiate the behavior class as the entity. This way, internally, behaviors can simply use `this` to
            // refer to the entity, as opposed to having to pass the entity into the behaviors.
            var BehaviorFactoryName = this.behaviors[entityDef.behavior];
            var entity = $injector.get(BehaviorFactoryName)(entityDef, socket);

            // Add the newly created entity to our list of entities.
            this.entities[entity.id] = entity;

            if(entityDef.model)
            {
                console.debug('loading model:', entityDef.model);
                return sceneMan.loadMesh(entityDef.model.name, entityDef.model.file)
                    .then(function(mesh)
                    {
                        entity.setMesh(mesh);

                        console.debug('Entity added successfully!', entity);
                        return entity;
                    });
            }
            else
            {
                return Promise.resolve(entity);
            }// end if
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

        return Promise.resolve();
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
        this.create(entityDef).then(function(entity)
        {
            avatar.inhabitEntity(entity);
        });
    }; // end _handleInhabit

    EntityManager.prototype._handleUpdate = function(message)
    {
        if(message.id in this.entities)
        {
            //console.log('applying update:', message);
            _.merge(this.entities[message.id], message);
        }
        else
        {
            console.error('Update for unknown entity:', message.id);
        } // end if
    }; // end _handleUpdate

    EntityManager.prototype._handleDestroy = function(message)
    {
        console.error('Destroy Not Implemented! Message:', message);
    }; // end _handleDestroy

    return new EntityManager();
} // end EntityManagerFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('EntityManager', [
        '$injector',
        'SocketService',
        'AvatarService',
        'SceneManager',
        'PhysicsService',
        EntityManagerFactory
    ]);

// ---------------------------------------------------------------------------------------------------------------------