// ---------------------------------------------------------------------------------------------------------------------
// ChatService
//
// @module chatService
// ---------------------------------------------------------------------------------------------------------------------

function ChatServiceFactory(ngToast, socketSvc, errorSvc)
{
    function ChatService()
    {
        this.rooms = [];
    } // end ChatService

    // -----------------------------------------------------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------------------------------------------------

    ChatService.prototype.joinRoom = function(room)
    {
        var self = this;
        return socketSvc.makeRequest('join room', { room: room })
            .then(function(response)
            {
                console.log('joined room:', room);
                self.rooms.push(room);
            })
            .catch(errorSvc.RequestDenied, function(error)
            {
                console.warn("Failed to join room '%s':", room, error.message);

                ngToast.create({
                    content: "Failed to join room '" + room + "': " + error.message,
                    className: 'danger',
                    dismissButton: true
                });
            });
    }; // end joinRoom

    ChatService.prototype.leaveRoom = function(room)
    {
        var self = this;
        return socketSvc.makeRequest('leave room', { room: room })
            .then(function(response)
            {
                console.log('left room:', room);
                self.rooms = _.remove(self.rooms, room);
            })
            .catch(errorSvc.RequestDenied, function(error)
            {
                console.warn("Failed to leave room '%s':", room, error.message);

                ngToast.create({
                    content: "Failed to leave room '" + room + "': " + error.message,
                    className: 'danger',
                    dismissButton: true
                });
            });
    }; // end joinRoom

    ChatService.prototype.sendMessage = function(room, message)
    {
        return socketSvc.makeRequest('chat message', { room: room, message: message })
            .catch(errorSvc.RequestDenied, function(error)
            {
                console.warn("Failed to send message to room '%s':", room, error.message);

                ngToast.create({
                    content: "Failed to send message to room '" + room + "': " + error.message,
                    className: 'danger',
                    dismissButton: true
                });
            });
    }; // end sendMessage

    //TODO: Does sending a command to a room make sense? Probably, but not always?
    ChatService.prototype.sendCommand = function(room, command)
    {
        return socketSvc.makeRequest('chat command', { room: room, command: command })
            .catch(errorSvc.RequestDenied, function(error)
            {
                console.warn("Failed to send command to room '%s':", room, error.message);

                ngToast.create({
                    content: "Failed to send command to room '" + room + "': " + error.message,
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
    'ngToast',
    'SocketService',
    'ErrorService',
    ChatServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------