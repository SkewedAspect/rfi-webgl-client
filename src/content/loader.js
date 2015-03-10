// ---------------------------------------------------------------------------------------------------------------------
// The Loader loads content.
//
// @module src/content/loader.js
// ---------------------------------------------------------------------------------------------------------------------
/* global angular: true */

function LoaderFactory(babylon, Promise, path)
{
    function doProgress(progress)
    {
        //TODO: Do something useful with progress.
        console.log('Progress:', progress);
    } // end doProgress

    function Loader(engine)
    {
        this.engine = engine;
        this.rootURL = "/";
        this.skyboxExtensions = [
            '_right1.png',  // px
            '_top3.png',    // py
            '_front5.png',  // pz
            '_left2.png',   // nx
            '_bottom4.png', // ny
            '_back6.png'    // nz
        ];
    } // end Loader

    Loader.prototype.loadScene = function(fileName)
    {
        var self = this;

        return new Promise(function(resolve)
        {
            babylon.SceneLoader.Load(self.rootURL, fileName, self.engine, resolve, doProgress);
        })
        .tap(function(newScene)
        {
            console.log("New scene '%j' loaded.", fileName);
        });
    }; // end loadScene

    Loader.prototype.loadMesh = function(scene, meshesNames, fileName)
    {
        var self = this;

        return new Promise(function(resolve)
        {
            var file = path.basename(fileName);
            var filePath = self.rootURL + path.dirname(fileName) + '/';
            babylon.SceneLoader.ImportMesh(meshesNames, filePath, file, scene,
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

    Loader.prototype.createSkybox = function(scene, baseFileName)
    {
        var self = this;

        return new Promise(function(resolve)
        {
            var skybox = babylon.Mesh.CreateBox("skyBox", 1000.0, scene);

            var skyboxMaterial = new babylon.StandardMaterial("skyBox", scene);

            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.diffuseColor = new babylon.Color3(0, 0, 0);
            skyboxMaterial.specularColor = new babylon.Color3(0, 0, 0);

            skyboxMaterial.reflectionTexture = new babylon.CubeTexture(baseFileName,
                scene, self.skyboxExtensions, true);
            skyboxMaterial.reflectionTexture.coordinatesMode = babylon.Texture.SKYBOX_MODE;

            // This keeps the mesh a fixed distance from the camera.
            skybox.infiniteDistance = true;

            skybox.material = skyboxMaterial;

            resolve(skybox);
        });
    }; // end createSkybox

    return Loader;
} // end LoaderFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('Loader', [
    'babylon',
    'bluebird',
    'path',
    LoaderFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
