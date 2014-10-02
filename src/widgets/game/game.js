// ---------------------------------------------------------------------------------------------------------------------
// Implements the Three.js canvas element.
//
// @module game.js
// ---------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var Promise = require('bluebird');

function GameCanvasFactory($window, Loader, keySvc)
{
    function GameCanvasController()
    {
        this.scene = new THREE.Scene();
        this.loader = new Loader(this.scene);
        this.camera = new THREE.PerspectiveCamera(75, $window.innerWidth/$window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.camera.rotation.y = 45;

        this.skyScene = new THREE.Scene();
        this.skyLoader = new Loader(this.skyScene);
        this.skyCamera = new THREE.PerspectiveCamera(75, $window.innerWidth/$window.innerHeight, 1, 100);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.autoClear = false;

        this.scene.add(new THREE.AmbientLight(0xffffff));

        var pointLight = new THREE.PointLight(0xffffff, 2);
        pointLight.position.z = 20;
        pointLight.position.y = 20;
        pointLight.position.x = 20;
        this.scene.add(pointLight);
    } // end GameCanvasController

    GameCanvasController.prototype.renderCallback = function()
    {
        if(this.spun)
        {
            this.spun.rotation.x += 0.01;
            this.spun.rotation.y += 0.01;
        } // end if

        this.camera.rotation.y += 0.0001;
        this.camera.position.z = 5 * Math.cos(this.camera.rotation.y);
        this.camera.position.x = 5 * Math.sin(this.camera.rotation.y);
    }; // end renderCallback

    GameCanvasController.prototype.resize = function(elem)
    {
        var width = elem[0].clientWidth;
        var height = elem[0].clientHeight;

        // Set the renderer's size
        this.renderer.setSize(width, height);

        // Fix the cameras' perspectives.
        this.skyCamera.aspect = this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.skyCamera.updateProjectionMatrix();
    }; // end resize

    GameCanvasController.prototype.render = function()
    {
        requestAnimationFrame(this.render.bind(this));

        if(this.renderCallback)
        {
            this.renderCallback();
        } // end if

        this.skyCamera.rotation.copy(this.camera.rotation);
        this.renderer.render(this.skyScene, this.skyCamera);

        this.renderer.render(this.scene, this.camera);
    }; // end render

    // -----------------------------------------------------------------------------------------------------------------

    function GameCanvasLink(scope, elem, attrs, controller)
    {
        // Setup the keybinding service
        keySvc.init(elem[0]);

        // Prepare the dom element.
        elem.addClass('game-canvas');
        elem.append(controller.renderer.domElement);

        // Listen for window resize events.
        $window.addEventListener('resize', controller.resize.bind(controller, elem));

        // Call resize to get the correct initial size.
        setTimeout(controller.resize.bind(controller, elem), 250);

        // Kick off the render loop.
        controller.render();

        var prefix = '/models/stars/purplenebula_2048_';
        var textureURLs = [
            prefix + 'right1.png',
            prefix + 'left2.png',
            prefix + 'top3.png',
            prefix + 'bottom4.png',
            prefix + 'front5.png',
            prefix + 'back6.png',
        ];

        Promise.all([
            controller.loader.loadCollada('/models/ares/ares.dae', {scale: 0.02}),
            controller.skyLoader.loadSkybox(textureURLs)
        ])
        .spread(function(ares, skybox)
        {
            var reflectionCube = skybox.material.uniforms['tCube'].value;

            ares.traverse(function(child)
            {
                if(child.material)
                {
                    console.log(child.material);
                    _.forEach(child.material.materials || [], function(subMat)
                    {
                        var avgSpecularRGB = (subMat.specular.r + subMat.specular.g + subMat.specular.b) / 3;
                        _.assign(subMat, {
                            ambient: subMat.color,
                            //color: 0x000000,
                            envMap: reflectionCube,
                            //combine: THREE.MixOperation,
                            //reflectivity: avgSpecularRGB
                        });
                    }); // end _.forEach iterator
                } // end if
            }); // end ares.traverse callback

            controller.spun = ares;
        });
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
