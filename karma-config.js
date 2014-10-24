//----------------------------------------------------------------------------------------------------------------------
// Karma unit test configuration
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(config)
{
    config.set({
        files: [
            'dist/vendor/angularjs/angular.min.js',
            'dist/vendor/**/*.js',

            // Compiled files to be tested
            'dist/js/rfi-client.js',

            // Tests
            'tests/**/*.spec.js'
        ],
        frameworks: ['jasmine'],
        browsers: ['Chrome'],   //TODO: We probably should test in Firefox as well
        reporters: ['spec'],
        singleRun: true
    });
}; // end module.exports

//----------------------------------------------------------------------------------------------------------------------