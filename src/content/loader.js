// ---------------------------------------------------------------------------------------------------------------------
// The Loader loads content.
//
// @module src/content/loader.js
// ---------------------------------------------------------------------------------------------------------------------
/* global angular: true */

function LoaderFactory(babylon)
{
    var Promise = require('bluebird');

    function doProgress()//progress)
    {
        //TODO: (progress);
    } // end doProgress

    function Loader(engine)
    {
        this.engine = engine;
        this.rootURL = "/";
        this.skyboxExtensions = [
            //'_right1.png', // px
            //'_left2.png', // nx
            //'_top3.png', // py
            //'_bottom4.png', // ny
            //'_front5.png', // pz
            //'_back6.png', // nz
            '_right1.png', // px
            '_top3.png', // py
            '_front5.png', // pz
            '_left2.png', // nx
            '_bottom4.png', // ny
            '_back6.png', // nz
        ];
    } // end Loader

    Object.defineProperty(Loader.prototype, 'currentScene', {
        get: function()
        {
            if(!this._currentScene)
            {
                this._currentScene = new babylon.Scene(this.engine);
            } // end if
            return this._currentScene;
        }, // end get
        set: function(scene)
        {
            this._currentScene = scene;
        } // end set
    });

    Loader.prototype.loadScene = function(fileName)
    {
        var self = this;

        return new Promise(function(resolve)
        {
            babylon.SceneLoader.Load(self.rootURL, fileName, self.engine, resolve, doProgress);
        })
        .tap(function(newScene)
        {
            console.log("New scene %j loaded; setting current scene.", fileName);
            self.currentScene = newScene;
        });
    }; // end loadScene

    Loader.prototype.loadMesh = function(fileName, meshesNames)
    {
        var self = this;

        return new Promise(function(resolve)
        {
            babylon.SceneLoader.ImportMesh(meshesNames, self.rootURL, fileName, self.currentScene,
                function(meshes, particleSystems)
                {
                    resolve({meshes: meshes, particleSystems: particleSystems});
                },
                doProgress
            );
        })
        .tap(function(loaded)
        {
            console.log("%s meshes and %s particle systems loaded.",
                loaded.meshes.length, loaded.particleSystems.length);
        });
    }; // end loadMesh

    Loader.prototype.createSkybox = function(baseFileName)
    {
        var self = this;

        return new Promise(function(resolve)
        {
            var skybox = babylon.Mesh.CreateBox("skyBox", 1000.0, self.currentScene);

            var skyboxMaterial = new babylon.StandardMaterial("skyBox", self.currentScene);

            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.diffuseColor = new babylon.Color3(0, 0, 0);
            skyboxMaterial.specularColor = new babylon.Color3(0, 0, 0);

            skyboxMaterial.reflectionTexture = new babylon.CubeTexture(baseFileName,
                self.currentScene, self.skyboxExtensions, true);
            skyboxMaterial.reflectionTexture.coordinatesMode = babylon.Texture.SKYBOX_MODE;

            skybox.material = skyboxMaterial;

            resolve(skybox);
        });
    }; // end createSkybox

    Loader.prototype.startShit = function(canvas, cameraParamsCB)
    {
        var self = this;

        return new Promise(function(resolve)
        {
            var camera = self.camera = new babylon.ArcRotateCamera("Camera", 0, 0, 100, babylon.Vector3.Zero(), self.currentScene);

            self.sun = new babylon.PointLight("Omni0", new babylon.Vector3(60, 100, 10), self.currentScene);

            if(cameraParamsCB)
            {
                var lastAlpha = camera.alpha, lastBeta = camera.beta, lastRadius = camera.radius;
                self.currentScene.registerBeforeRender(function()
                {
                    if(lastAlpha != camera.alpha || lastBeta != camera.beta || lastRadius != camera.radius)
                    {
                        lastAlpha = camera.alpha;
                        lastBeta = camera.beta;
                        lastRadius = camera.radius;

                        cameraParamsCB({alpha: lastAlpha, beta: lastBeta, radius: lastRadius});
                    } // end if
                });
            } // end if

            self.currentScene.executeWhenReady(function()
            {
                // Attach camera to canvas inputs
                self.currentScene.activeCamera.attachControl(canvas);

                // Once the scene is loaded, just register a render loop to render it
                self.engine.runRenderLoop(function()
                {
                    self.currentScene.render();
                });

                resolve();
            });
        });
    }; // end startShit

    return Loader;
} // end LoaderFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('Loader', ['babylon', LoaderFactory]);

// ---------------------------------------------------------------------------------------------------------------------
