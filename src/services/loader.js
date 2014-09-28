// --------------------------------------------------------------------------------------------------------------------
// Loader service
//
// @module src/services/loader
// --------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var Promise = require('bluebird');

// --------------------------------------------------------------------------------------------------------------------

function LoaderService()
{
    function Loader(scene, options)
    {
        this.scene = scene;
        this.options = options = options || {};

        this.manager = options.loadingManager ||
            new THREE.LoadingManager(options.onLoad, options.onProgress, options.onError);
    } // end Loader

    Object.defineProperty(Loader.prototype, 'imageLoader', {get: function()
    {
        this._imageLoader = this._imageLoader || new THREE.ImageLoader(this.manager);
        return this._imageLoader;
    }}); // end Loader#imageLoader

    Object.defineProperty(Loader.prototype, 'colladaLoader', {get: function()
    {
        if(!this._colladaLoader)
        {
            this._colladaLoader = new THREE.ColladaLoader(this.manager);
            this._colladaLoader.options.convertUpAxis = true;
        } // end if
        return this._colladaLoader;
    }}); // end Loader#colladaLoader

    Object.defineProperty(Loader.prototype, 'objLoader', {get: function()
    {
        this._objLoader = this._objLoader || new THREE.OBJLoader(this.manager);
        return this._objLoader;
    }}); // end Loader#objLoader

    Loader.prototype.loadImage = function(url, options)
    {
        options = options || {};
        return new Promise(function(resolve, reject)
        {
            this.imageLoader.load(url, function(image)
            {
                var texture = new THREE.Texture();

                // Assign options
                _.assign(texture, _.pick(options,
                    'mapping', 'wrapS', 'wrapT', 'magFilter', 'minFilter', 'format', 'type', 'anisotropy',
                    'generateMipmaps', 'flipY', 'unpackAlignment', 'premultiplyAlpha', 'onUpdate'
                ));

                // {Array.<int>} options.repeat (`[repeatU, repeatV]`)
                if(options.repeat) { texture.repeat.set.apply(texture.repeat, options.repeat); }

                texture.image = image;
                resolve(texture);
            }); // end imageLoader.load callback
        }); // end Promise callback
    }; // end Loader#loadImage

    Loader.prototype.loadSkybox = function(urls, options)
    {
        options = options || {};
        var self = this;
        return new Promise(function(resolve, reject)
        {
            //var textureCube = THREE.ImageUtils.loadTextureCube(urls, null, onLoad, reject);
            var textureCube = THREE.ImageUtils.loadTextureCube(urls);
            console.log("HERE", self.scene);
            onLoad();

            function onLoad()
            {
                var shader = THREE.ShaderLib["cube"];

                var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
                uniforms['tCube'].value = textureCube;

                var material = new THREE.ShaderMaterial({
                    fragmentShader: shader.fragmentShader,
                    vertexShader: shader.vertexShader,
                    uniforms: uniforms,
                    depthWrite: false,
					side: THREE.BackSide
                });

                var model = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);

                if(self.scene && !options.detached)
                {
                    self.scene.add(model);
                    console.log("Added skybox to scene.");
                } // end if

                // Loaded!
                resolve(model);
            }; // end onLoad
        }); // end Promise callback
    }; // end Loader#loadSkybox

    Loader.prototype.loadCollada = function(url, options)
    {
        return this.loadModel(this.colladaLoader, url, options, function(c) { return c.scene; });
    }; // end Loader#loadCollada

    Loader.prototype.loadOBJ = function(url, options)
    {
        return this.loadModel(this.objLoader, url, options);
    }; // end Loader#loadOBJ

    Loader.prototype.loadModel = function(loader, url, options, getModel)
    {
        options = options || {};
        getModel = getModel || function(m) { return m; };
        var self = this;
        return new Promise(function(resolve, reject)
        {
            _.defaults(options, self.options);

            // Load from the given URL.
            loader.load(url, function(model)
            {
                model = getModel(model);
                if(options.texture || options.startAnimations)
                {
                    // Traverse the object tree, if any options require it.
                    model.traverse(function(child)
                    {
                        if(options.texture)
                        {
                            child.material.map = options.texture;
                        } // end if

                        if(options.startAnimations && child instanceof THREE.SkinnedMesh)
                        {
                            new THREE.Animation(child, child.geometry.animation).play();
                        } // end if
                    }); // end model.traverse callback
                } // end if

                if(options.scale)
                {
                    model.scale.x = model.scale.y = model.scale.z = options.scale;
                    model.updateMatrix();
                } // end if

                if(self.scene && !options.detached)
                {
                    self.scene.add(model);
                } // end if

                // Loaded!
                resolve(model);
            }); // end onLoaded
        }); // end Promise callback
    }; // end Loader#loadModel

    return Loader;
} // end LoaderService

// --------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('Loader', LoaderService);

// --------------------------------------------------------------------------------------------------------------------
