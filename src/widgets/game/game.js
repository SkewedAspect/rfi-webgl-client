// ---------------------------------------------------------------------------------------------------------------------
// Implements the Three.js canvas element.
//
// @module game.js
// ---------------------------------------------------------------------------------------------------------------------
/* global angular: true */

var Promise = require('bluebird');

// ---------------------------------------------------------------------------------------------------------------------

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
        this.sun = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), sceneMan.currentScene);
        this.sun.diffuse = new BABYLON.Color3(1, 1, 1);
        this.sun.specular = new BABYLON.Color3(1, 1, 1);
        this.sun.groundColor = new BABYLON.Color3(.3,.3,.3);
    }; // end canvasReady

    // -----------------------------------------------------------------------------------------------------------------

    function GameCanvasLink(scope, elem, attrs, controller)
    {
        if(isSupported)
        {
            console.log("Setting up canvas.");

            var canvas = elem.children('canvas');

            $timeout(function()
            {
                sceneMan.setRenderTarget(canvas[0]);
                sceneMan.loadScene()
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
                    })
                    .then(function()
                    {
                        console.log('loading asteroids...');
                        return Promise.all([
                            sceneMan.loadMesh("ScrappleJacks", "models/asteroids/ScrappleJacks.babylon").then(function(mesh)
                            {
                                mesh.position = new babylon.Vector3(300, 0, -250);
                                mesh.rotation = new babylon.Vector3(20, 5, 0);

                                sceneMan.playerCamera.target = mesh;
                                sceneMan.playerCamera.setPosition(new babylon.Vector3(0, 10, 0));
                            }),
                            sceneMan.loadMesh("ScrappleJacks", "models/asteroids/ScrappleJacks.babylon").then(function(mesh)
                            {
                                mesh.position = new babylon.Vector3(1000, 300, -250);
                                mesh.rotation = new babylon.Vector3(20, 20, 5);
                            }),
                            sceneMan.loadMesh("ScrappleJacks", "models/asteroids/ScrappleJacks.babylon").then(function(mesh)
                            {
                                mesh.position = new babylon.Vector3(1200, -500, -250);
                                mesh.rotation = new babylon.Vector3(3.3, 8.2, 65);
                            }),
                            sceneMan.loadMesh("ScrappleJacks", "models/asteroids/ScrappleJacks.babylon").then(function(mesh)
                            {
                                mesh.position = new babylon.Vector3(1200, -500, 450);
                                mesh.rotation = new babylon.Vector3(7, 80, 65);
                            }),
                            sceneMan.loadMesh("BigAssAssTeroid", "models/asteroids/BigAssAssTeroid.babylon").then(function(mesh)
                            {
                                mesh.position = new babylon.Vector3(300, 1200, 1200);
                                mesh.rotation = new babylon.Vector3(-3, 0.4, 0);
                                mesh.scaling = new babylon.Vector3(5, 5, 5);
                            }),
                            sceneMan.loadMesh("RustyGremlin", "models/asteroids/RustyGremlin.babylon").then(function(mesh)
                            {
                                mesh.position = new babylon.Vector3(-800, 500, 45);
                                mesh.rotation = new babylon.Vector3(7, -9, 65);
                            }),
                            sceneMan.loadMesh("BigAssAssTeroid", "models/asteroids/BigAssAssTeroid.babylon").then(function(mesh)
                            {
                                mesh.position = new babylon.Vector3(-3800, -1200, -350);
                                mesh.scaling = new babylon.Vector3(10, 10, 10);
                            })
                        ]);
                    });

                // Listen for window resize events.
                $window.addEventListener('resize', sceneMan.engine.resize.bind(sceneMan.engine));
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
