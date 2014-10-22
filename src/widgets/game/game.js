// ---------------------------------------------------------------------------------------------------------------------
// Implements the Three.js canvas element.
//
// @module game.js
// ---------------------------------------------------------------------------------------------------------------------
/* global angular: true */

function GameCanvasFactory($window, $timeout, babylon, Loader, keySvc)
{
    var isSupported = babylon.Engine.isSupported();

    function GameCanvasController($scope)
    {
        $scope.isSupported = isSupported;
    } // end GameCanvasController

    // -----------------------------------------------------------------------------------------------------------------

    function GameCanvasLink(scope, elem)//, attrs, controller
    {
        var canvas, engine, loader;

        if(isSupported)
        {
            console.log("Setting up canvas.");

            canvas = elem.children('canvas');
            console.log('canvas:', canvas);

            $timeout(function()
            {
                engine = new babylon.Engine(canvas[0], true);

                loader = new Loader(engine);

                /*
                loader.loadScene("scene.babylon")
                    .then(function()
                        {
                            return loader.loadMesh("models/ares/ares.babylon");
                        });
                */
                loader.loadMesh("models/ares/ares.babylon")
                    .then(function()
                        {
                            return loader.createSkybox("models/stars/purplenebula_2048");
                        })
                //loader.createSkybox("models/stars/purplenebula_2048")
                    .then(function()
                        {
                            console.log("Loading completed.");

                            loader.startShit(canvas[0], function(camParams)
                            {
                                scope.$apply(function()
                                {
                                    scope.camera = camParams;
                                });
                            });
                        },
                        function(error)
                        {
                            console.error("Error loading:", error);
                        });

                // Listen for window resize events.
                $window.addEventListener('resize', engine.resize.bind(engine));
            });
        } // end if

        // Setup the keybinding service
        keySvc.init(elem[0]);

        // Prepare the dom element.
        elem.addClass('game-canvas');
        //elem.append(controller.renderer.domElement);

        // Call resize to get the correct initial size.
        //setTimeout(controller.resize.bind(controller, elem), 250);

        // Kick off the render loop.
        //controller.render();
    } // end GameCanvasLink

    // -----------------------------------------------------------------------------------------------------------------

    return {
        restrict: 'E',
        scope: true,
        link: GameCanvasLink,
        template: '<div id="game" contenteditable="true"><canvas></canvas>' +
            '<div class="stats">Camera: alpha = {{ camera.alpha }}; beta = {{ camera.beta }}; radius = {{ camera.radius }}</div>' +
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
    'Loader',
    'KeyBindingService',
    GameCanvasFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
