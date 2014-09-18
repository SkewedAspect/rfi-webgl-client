//----------------------------------------------------------------------------------------------------------------------
// RFI Client Gruntfile.
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    // Project configuration.
    grunt.initConfig({
        project: {
            less: ['client/less/**/*.less', 'client/widgets/**/*.less']
        },
        less: {
            sleekspace: {
                options: {
                    paths: ['client/vendor'],
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

    // Setup the build task.
    grunt.registerTask('build', ['less']);
    grunt.registerTask('devel', ['connect', 'watch']);
}; // module.exports

// ---------------------------------------------------------------------------------------------------------------------
