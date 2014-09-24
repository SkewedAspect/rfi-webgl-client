// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of entityman.js.
//
// @module entityman.js
// ---------------------------------------------------------------------------------------------------------------------

function EntityManager(socket)
{
    console.log('sup?');

    // Listen for incoming messages
    socket.on('create', this._handleCreate.bind(this));
    socket.on('inhabit', this._handleInhabit.bind(this));
    socket.on('update', this._handleUpdate.bind(this));
    socket.on('destroy', this._handleDestroy.bind(this));
} // end EntityManager

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