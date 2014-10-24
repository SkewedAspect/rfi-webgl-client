// ---------------------------------------------------------------------------------------------------------------------
// Implements the Three.js canvas element.
//
// @module game.js
// ---------------------------------------------------------------------------------------------------------------------
/* global angular: true */

function GameCanvasFactory($window, $timeout, babylon, sceneMan, keySvc)
{
    var isSupported = babylon.Engine.isSupported();

    function GameCanvasController($scope)
    {
        $scope.isSupported = isSupported;
    } // end GameCanvasController

    GameCanvasController.prototype.canvasReady = function()
    {
        //TODO: This needs to be part of the scene we load. But, for now, hard-code this.
        this.sun = new babylon.PointLight("Omni0", new babylon.Vector3(60, 100, 10), sceneMan.currentScene);
    }; // end canvasReady

    // -----------------------------------------------------------------------------------------------------------------

    function GameCanvasLink(scope, elem, attrs, controller)
    {
        var canvas, engine;

        if(isSupported)
        {
            console.log("Setting up canvas.");

            canvas = elem.children('canvas');

            $timeout(function()
            {
                sceneMan.setRenderTarget(canvas[0]);
                sceneMan.loadScene()
                    .then(function()
                    {
                        return sceneMan.loadMesh("models/ares/ares.babylon");
                    })
                    .then(function()
                    {
                        return sceneMan.createSkybox("models/stars/purplenebula_2048");
                    })
                    .then(function()
                    {
                        console.log("Loading completed.");
                        sceneMan.startEngine();

                        // Let the controller know that the canvas is ready
                        controller.canvasReady();
                    },
                    function(error)
                    {
                        console.error("Error loading:", error);
                    });

                // Listen for window resize events.
                $window.addEventListener('resize', sceneMan.engine.resize.bind(engine));
            });
        } // end if

        // Setup the keybinding service
        keySvc.init(elem[0]);

        // Prepare the dom element.
        elem.addClass('game-canvas');
    } // end GameCanvasLink

    // -----------------------------------------------------------------------------------------------------------------

    return {
        restrict: 'E',
        scope: true,
        link: GameCanvasLink,
        template: '<div id="game" contenteditable="true">' +
            '<canvas></canvas>' +
            '<div class="error" ng-if="!isSupported">Your browser does not support WebGL! Go home!</div></div>',
        controller: ['$scope', GameCanvasController],
        replace: true
    };
} // end GameCanvasFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.widgets').directive('gameCanvas', [
    '$window',
    '$timeout',
    'babylon',
    'SceneManager',
    'KeyBindingService',
    GameCanvasFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
