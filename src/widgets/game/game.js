// ---------------------------------------------------------------------------------------------------------------------
// Implements the Three.js canvas element.
//
// @module game.js
// ---------------------------------------------------------------------------------------------------------------------

function GameCanvasFactory($window)
{
    function GameCanvasController()
    {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, $window.innerWidth/$window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();

        //===================================================================
        //TODO: This is for demo purposes only!

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        var cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

        this.camera.position.z = 5;

        this.renderCallback = function()
        {
            cube.rotation.x += 0.1;
            cube.rotation.y += 0.1;
        }; // end renderCallback

        //===================================================================
    } // end GameCanvasController

    GameCanvasController.prototype.resize = function(elem)
    {
        var width = elem[0].clientWidth;
        var height = elem[0].clientHeight;

        // Set the renderer's size
        this.renderer.setSize(width, height);

        // Fix the camera's perspective
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }; // end resize

    GameCanvasController.prototype.render = function()
    {
        requestAnimationFrame(this.render.bind(this));

        if(this.renderCallback)
        {
            this.renderCallback();
        } // end if

        this.renderer.render(this.scene, this.camera);
    }; // end render

    // -----------------------------------------------------------------------------------------------------------------

    function GameCanvasLink(scope, elem, attrs, controller)
    {
        // Prepare the dom element
        elem.addClass('game-canvas');
        elem.append(controller.renderer.domElement);

        // Listen for window resize events
        $window.addEventListener('resize', function()
        {
            controller.resize(elem);
        });

        // Call resize to get the correct initial size
        setTimeout(function()
        {
            controller.resize(elem);
        }, 250);

        // Kick off the render loop
        controller.render();
    } // end GameCanvasLink

    // -----------------------------------------------------------------------------------------------------------------

    return {
        restrict: 'E',
        link: GameCanvasLink,
        controller: GameCanvasController
    }
} // end GameCanvasFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.widgets').directive('gameCanvas', ['$window', GameCanvasFactory]);

// ---------------------------------------------------------------------------------------------------------------------