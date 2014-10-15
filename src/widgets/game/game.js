// ---------------------------------------------------------------------------------------------------------------------
// Implements the Three.js canvas element.
//
// @module game.js
// ---------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var Promise = require('bluebird');

// ---------------------------------------------------------------------------------------------------------------------

function GameCanvasFactory($window, Loader, keySvc)
{
    function GameCanvasController()
    {
    } // end GameCanvasController

    // -----------------------------------------------------------------------------------------------------------------

    function GameCanvasLink(scope, elem, attrs, controller)
    {
        // Setup the keybinding service
        keySvc.init(elem[0]);

        // Prepare the dom element.
        elem.addClass('game-canvas');
        //elem.append(controller.renderer.domElement);

        // Listen for window resize events.
        //$window.addEventListener('resize', controller.resize.bind(controller, elem));

        // Call resize to get the correct initial size.
        //setTimeout(controller.resize.bind(controller, elem), 250);

        // Kick off the render loop.
        //controller.render();
    } // end GameCanvasLink

    // -----------------------------------------------------------------------------------------------------------------

    return {
        restrict: 'E',
        link: GameCanvasLink,
        template: '<div id="game" contenteditable="true"></div>',
        controller: GameCanvasController,
        replace: true
    }
} // end GameCanvasFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.widgets').directive('gameCanvas', [
    '$window',
    'Loader',
    'KeyBindingService',
    GameCanvasFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
