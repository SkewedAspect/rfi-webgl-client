// ---------------------------------------------------------------------------------------------------------------------
/// SceneManager - Manages BabylonJS scenes
///
/// @module sceneman.js
// ---------------------------------------------------------------------------------------------------------------------

function SceneManagerFactory($rootScope, _, utils, babylon, Promise, EventEmitter, Loader)
{
    /**
     * The SceneManager is intended to be the single API for working with BabylonJS's scene and asset loader. It handles
     * all of the boilerplate required.
     *
     * @constructor
     */
    function SceneManager()
    {
        EventEmitter.call(this);
        this.meshes = {};
    } // end SceneManager

    utils.inherits(SceneManager, EventEmitter);

    // -----------------------------------------------------------------------------------------------------------------
    // Public
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Sets the element that we will render into. This element must be a `<canvas>`, and is assumed to have already been
     * created by the time this is called.
     *
     * @param {Element} elem - The canvas element for us to render into.
     */
    SceneManager.prototype.setRenderTarget = function(elem)
    {
        this.canvas = elem;
        this.engine = new babylon.Engine(elem, true);
        this.loader = new Loader(this.engine);
    }; // end setRenderTarget

    /**
     * Creates a skybox, and sets up any and all special rendering callbacks required.
     *
     * @param {string} baseFileName - This is the base file name of the images to use for the skybox. It is assumed to
     * be relative to our static files path. The actual files are assumed to have the following extensions:
     *   - '_right1.png'
     *   - '_top3.png'
     *   - '_front5.png'
     *   - '_left2.png'
     *   - '_bottom4.png'
     *   - '_back6.png'
     *
     * See the `Loader` for more information.
     *
     * @returns {Promise<*>} Returns a promise that is resolved once the loader creates the skybox.
     */
    SceneManager.prototype.createSkybox = function(baseFileName)
    {
        var self = this;

        if(!this.loader)
        {
            return Promise.reject(new Error("Must set a render target before attempting to load a skybox."));
        }
        else
        {
            //TODO: There may be more work required here. We are currently reparenting the skybox's position to the
            // camera's position. We also need to change it's render order, and possibly turn off depth buffer clearing.
            return this.loader.createSkybox(this.currentScene, baseFileName);
        } // end if
    }; // end createSkybox

    /**
     * Retrieves a mesh instance for the given meshName, and modelPath. If the mesh has already been loaded, we retrieve
     * it from an internal cache, and return a new instance of the mesh. If it has not been loaded, we expect modelPath
     * to exist, and then we load the mesh, and store it.
     *
     * @param {string} meshName - The name of the mesh to create an instance of. If `""`, modelPath is required, and all
     * meshes in the model will be loaded. (These meshes will not be cached, and will be loaded every time.)
     *
     * @param {string} modelPath - The path to the model, relative to our static files path.
     *
     * @returns {Promise<Mesh>} Returns a promise that resolves with the new mesh instance.
     */
    SceneManager.prototype.loadMesh = function(meshName, modelPath)
    {
        var self = this;

        if(arguments.length == 1)
        {
            modelPath = meshName;
            meshName = "";
        } // end if

        if(!_.isEmpty(meshName) && meshName in this.meshes)
        {
            return Promise.resolve(this.meshes[meshName])
                .then(function(mesh)
                {
                    var instance = mesh.createInstance();

                    // Instances reset their parent's renderingGroupId, so we need to fix it.
                    instance.renderingGroupId = 1;

                    return instance;
                });
        }
        else
        {
            return this.loader.loadMesh(this.currentScene, meshName, modelPath)
                .then(function(loaded)
                {
                    // We only support loading a single mesh at a time
                    var mesh = loaded.meshes[0];

                    // We put all meshes (except skyboxes) in rendering group 1.
                    mesh.renderingGroupId = 1;

                    if(!_.isEmpty(meshName))
                    {
                        self.meshes[meshName] = mesh;
                    } // end if

                    return mesh;
                });
        } // end if
    }; // end loadMesh

    /**
     * Loads a scene by path.
     *
     * @param {string} scenePath - A path to the `.babylon` file for the scene. This is assumed to be relative to our
     * static content directory.
     *
     * @returns {Promise<undefined>} Returns a promise that resolves once the scene is loaded, and considers itself
     * 'ready'.
     */
    SceneManager.prototype.loadScene = function(scenePath)
    {
        var scenePromise;
        var self = this;

        if(!scenePath)
        {
            // Create an empty scene
            scenePromise = Promise.resolve(new babylon.Scene(this.engine));
        }
        else
        {
            scenePromise = this.loader.loadScene(scenePath);
        } // end if

        return scenePromise.then(function(scene)
        {
            // Set our current scene
            self.currentScene = scene;

            // Let anyone who cares know we've changed scenes
            $rootScope.$broadcast('scene loaded');

            // We always create a camera for the player's perspective.
            self.playerCamera = new babylon.ArcRotateCamera("PlayerCamera", 0, 0, 100, babylon.Vector3.Zero(),
                self.currentScene);

            // Stop binding to keyboard keys
            self.playerCamera.keysUp = [];
            self.playerCamera.keysDown = [];
            self.playerCamera.keysLeft = [];
            self.playerCamera.keysRight = [];

            return new Promise(function(resolve)
            {
                // Resolve once the scene's ready
                self.currentScene.executeWhenReady(function()
                {
                    resolve();
                });
            });
        });
    }; // end loadScene

    /**
     * Starts the render loop. Broadcasts `"engine started"` on the root scope.
     */
    SceneManager.prototype.startEngine = function()
    {
        $rootScope.$broadcast("engine started");
        this.engine.runRenderLoop(this._renderLoop.bind(this));
    }; // end startEngine

    /**
     * Stops the render loop. Broadcasts `"engine stopped"` on the root scope.
     */
    SceneManager.prototype.stopEngine = function()
    {
        $rootScope.$broadcast("engine stopped");
        this.engine.stopRenderLoop();
    }; // end stopEngine

    // -----------------------------------------------------------------------------------------------------------------
    // Private
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * The render loop. Fires events `before render` and `after render`.
     *
     * @private
     */
    SceneManager.prototype._renderLoop = function()
    {
        this.emit('before render');
        this.currentScene.render();
        this.emit('after render');
    }; // end _renderLoop

    // -----------------------------------------------------------------------------------------------------------------

    return new SceneManager();
} // end SceneManagerFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('SceneManager', [
    '$rootScope',
    'lodash',
    'utils',
    'babylon',
    'bluebird',
    'eventemitter2',
    'Loader',
    SceneManagerFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
