//----------------------------------------------------------------------------------------------------------------------
// Karma unit test configuration
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(config)
{
    config.set({
        files: [
            'client/vendor/angular/angular.min.js',
            'client/vendor/angular-mocks/angular-mocks.js',
            'client/vendor/angular-route/angular-route.js',
            'client/vendor/babylonjs/babylon.2.0.js',
            'client/vendor/Keypress/keypress.js',
            'client/vendor/path/path.min.js',
            'client/vendor/eventemitter2/lib/eventemitter2.js',
            'client/vendor/bluebird/js/browser/bluebird.min.js',
            'client/vendor/lodash/lodash.min.js',
            'client/vendor/rfi-physics/dist/rfi-physics.js',
            'client/vendor/socket.io-client/socket.io.js',

            // App files to be tested
            'client/app.js',
            'client/components/**/*.js',
            'client/ui/**/*.js',

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