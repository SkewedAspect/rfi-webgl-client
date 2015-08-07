// ---------------------------------------------------------------------------------------------------------------------
// ChatWindow
//
// @module chat.js
// ---------------------------------------------------------------------------------------------------------------------

function ChatWindowFactory(_, chatSvc)
{
    function ChatWindowController($scope)
    {
        $scope.showWindow = false;

        Object.defineProperties($scope, {
            activeRoom: {
                get: function(){ return _.filter(this.rooms, { active: true })[0]; }
            },
            rooms: {
                get: function(){ return chatSvc.rooms; }
            }
        });

        // -------------------------------------------------------------------------------------------------------------

        $scope.$on('successful login', function()
        {
            chatSvc.joinRoom('general')
                .then(function()
                {
                    $scope.setActive('general');
                    $scope.showWindow = true;

                    // Join a second room
                    return chatSvc.joinRoom('foobar');
                });
        });

        // -------------------------------------------------------------------------------------------------------------

        $scope.setActive = function(roomName)
        {
            // Clear active rooms
            _.each($scope.rooms, function(room){ room.active = false; });

            // Set active room
            var room = _.find($scope.rooms, { name: roomName });
            (room || {}).active = true;
            (room || {}).unread = 0;
        }; // end setActive

        $scope.send = function()
        {
            //TODO: Parse messages to support commands
            chatSvc.sendMessage($scope.activeRoom.name, $scope.activeRoom.message)
                .then(function()
                {
                    $scope.activeRoom.message = "";
                });
        }; // end send
    } // end ChatWindowController

    return {
        restrict: 'E',
        scope: true,
        templateUrl: "/ui/chat/chat.html",
        controller: ['$scope', ChatWindowController]
    };
} // end ChatWindowFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.widgets').directive('chatWindow', [
    'lodash',
    'ChatService',
    ChatWindowFactory
]);

// ---------------------------------------------------------------------------------------------------------------------