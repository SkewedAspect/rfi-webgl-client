// ---------------------------------------------------------------------------------------------------------------------
// ChatWindow
//
// @module chat.js
// ---------------------------------------------------------------------------------------------------------------------

function ChatWindowFactory(chatSvc, socketSvc)
{
    function ChatWindowController($scope)
    {
        $scope.showWindow = false;
        $scope.state = {
            activeRoom: 'general'
        };

        Object.defineProperties($scope, {
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
                    $scope.state['general'] = {
                        history: [],
                        message: "",
                        unread: 0
                    };

                    $scope.showWindow = true;
                });

            // Join a second room
            chatSvc.joinRoom('foobar')
                .then(function()
                {
                    $scope.state['foobar'] = {
                        history: [],
                        message: "",
                        unread: 0
                    };
                });
        });

        socketSvc.on('chat message', function(payload)
        {
            console.log('got message:', payload);

            if(!$scope.state[payload.room])
            {
                $scope.state[payload.room] = { history: [] }
            } // end if

            $scope.state[payload.room].history.push(payload);

            if(payload.room != $scope.state.activeRoom)
            {
                $scope.state[payload.room].unread = ($scope.state[payload.room].unread || 0) + 1;
            } // end if
        });

        // -------------------------------------------------------------------------------------------------------------

        $scope.setActive = function(room)
        {
            $scope.state.activeRoom = room;
            $scope.state[room].unread = 0;
        }; // end setActive

        $scope.send = function()
        {
            chatSvc.sendMessage($scope.state.activeRoom, $scope.state[$scope.state.activeRoom].message)
                .then(function()
                {
                    $scope.state[$scope.state.activeRoom].message = "";
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
    'ChatService',
    'SocketService',
    ChatWindowFactory
]);

// ---------------------------------------------------------------------------------------------------------------------