//----------------------------------------------------------------------------------------------------------------------
// RFI Client Gruntfile.
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    // Project configuration.
    grunt.initConfig({
        project: {
            js: ['client/**/*.js', '!client/vendor/**/*.js'],
            less: ['client/**/*.less', '!client/vendor/**/*.less']
        },
        less: {
            sleekspace: {
                options: {
                    paths: ['node_modules/bootstrap/less'],
                    compress: true
                },
                files: {
                    'client/css/sleekspace.min.css': ['client/less/sleekspace/sleekspace.less']
                }
            },
            main: {
                options: {
                    paths: ['client/vendor'],
                    compress: true
                },
                files: {
                    'client/css/rfi-client.min.css': ['<%= project.less %>', '!client/less/sleekspace/**/*.less']
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma-config.js'
            }
        },
        watch: {
            less: {
                files: ['<%= project.less %>'],
                tasks: ['less'],
                options: {
                    atBegin: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 2695,
                    base: 'client'
                }
            }
        }
    });

    // Grunt Tasks.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-karma');

    // Setup the build task.
    grunt.registerTask('build', ['less']);
    grunt.registerTask('test', ['build', 'karma:unit']);
    grunt.registerTask('devel', ['connect', 'watch']);
}; // module.exports

// ---------------------------------------------------------------------------------------------------------------------
