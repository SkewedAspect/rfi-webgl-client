//----------------------------------------------------------------------------------------------------------------------
// Karma unit test configuration
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(config)
{
    config.set({
        files: [
            'dist/vendor/angular/angular.min.js',
            'dist/vendor/angular-mocks/angular-mocks.js',
            'dist/vendor/angular-route/angular-route.js',
            'dist/vendor/babylonjs/babylon.2.0.js',
            'dist/vendor/Keypress/keypress.js',
            'dist/vendor/path/path.min.js',
            'dist/vendor/eventemitter2/lib/eventemitter2.js',
            'dist/vendor/bluebird/js/browser/bluebird.min.js',
            'dist/vendor/lodash/lodash.min.js',
            'dist/vendor/rfi-physics/dist/rfi-physics.js',
            'dist/vendor/socket.io-client/socket.io.js',

            // Compiled files to be tested
            'dist/js/rfi-client.min.js',

            // Tests
            'tests/**/*.spec.js'
        ],
        frameworks: ['jasmine'],
        browsers: ['Chrome', 'Firefox'],
        reporters: ['spec'],
        singleRun: true
    });
}; // end module.exports

//----------------------------------------------------------------------------------------------------------------------