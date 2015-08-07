// ---------------------------------------------------------------------------------------------------------------------
// ChatService
//
// @module chatService
// ---------------------------------------------------------------------------------------------------------------------

function ChatServiceFactory(_, ngToast, socketSvc, errorSvc)
{
    function ChatService()
    {
        var self = this;
        this.rooms = [];

        // Listen for incoming messages
        socketSvc.on('chat message', function(payload)
        {
            console.log('got message:', payload);

            var room = self.getRoom(payload.room);
            room.history.push(payload);

            if(!room.active)
            {
                room.unread = (room.unread || 0) + 1;
            } // end if
        });
    } // end ChatService

    // -----------------------------------------------------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------------------------------------------------

    ChatService.prototype.getRoom = function(roomName)
    {
        return _.find(this.rooms, { name: roomName });
    }; // end getRoom

    ChatService.prototype.joinRoom = function(roomName)
    {
        var self = this;
        return socketSvc.makeRequest('join room', { room: roomName })
            .then(function(response)
            {
                console.log('joined room:', roomName);

                // We store a nice little state object
                self.rooms.push({
                    name: roomName,
                    history: [],
                    message: "",
                    unread: 0,
                    active: false
                });
            })
            .catch(errorSvc.RequestDenied, function(error)
            {
                console.warn("Failed to join room '%s':", roomName, error.message);

                ngToast.create({
                    content: "Failed to join room '" + roomName + "': " + error.message,
                    className: 'danger',
                    dismissButton: true
                });
            });
    }; // end joinRoom

    ChatService.prototype.leaveRoom = function(roomName)
    {
        var self = this;
        return socketSvc.makeRequest('leave room', { room: roomName })
            .then(function(response)
            {
                console.log('left room:', roomName);
                self.rooms = _.remove(self.rooms, { name: roomName });
            })
            .catch(errorSvc.RequestDenied, function(error)
            {
                console.warn("Failed to leave room '%s':", roomName, error.message);

                ngToast.create({
                    content: "Failed to leave room '" + roomName + "': " + error.message,
                    className: 'danger',
                    dismissButton: true
                });
            });
    }; // end joinRoom

    ChatService.prototype.sendMessage = function(roomName, message)
    {
        return socketSvc.makeRequest('chat message', { room: roomName, message: message })
            .catch(errorSvc.RequestDenied, function(error)
            {
                console.warn("Failed to send message to room '%s':", roomName, error.message);

                ngToast.create({
                    content: "Failed to send message to room '" + roomName + "': " + error.message,
                    className: 'danger',
                    dismissButton: true
                });
            });
    }; // end sendMessage

    ChatService.prototype.sendCommand = function(roomName, command)
    {
        return socketSvc.makeRequest('chat command', { room: roomName, command: command })
            .catch(errorSvc.RequestDenied, function(error)
            {
                console.warn("Failed to send command to room '%s':", roomName, error.message);

                ngToast.create({
                    content: "Failed to send command to room '" + roomName + "': " + error.message,
                    className: 'danger',
                    dismissButton: true
                });
            });
    }; // end sendCommand

    // -----------------------------------------------------------------------------------------------------------------

    return new ChatService();
} // end ChatServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('ChatService', [
    'lodash',
    'ngToast',
    'SocketService',
    'ErrorService',
    ChatServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------