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
            'dist/vendor/babylonjs/babylon.1.14.js',
            'dist/vendor/Keypress/keypress.js',
            'dist/vendor/socket.io-client/socket.io.js',

            // Compiled files to be tested
            'dist/js/rfi-client.js',

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