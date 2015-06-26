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
                        message: ""
                    };

                    $scope.showWindow = true;
                });
        });

        socketSvc.on('chat message', function(payload)
        {
            console.log('got message:', payload);
            $scope.state[$scope.state.activeRoom].history.push(payload);
        });

        // -------------------------------------------------------------------------------------------------------------

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