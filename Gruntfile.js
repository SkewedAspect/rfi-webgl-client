//----------------------------------------------------------------------------------------------------------------------
// RFI Client Gruntfile.
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    // Project configuration.
    grunt.initConfig({
        project: {
            js: ['src/**/*.js'],
            less: ['static/less/**/*.less', 'src/widgets/**/*.less']
        },
        less: {
            sleekspace: {
                options: {
                    paths: ['static/vendor'],
                    compress: true
                },
                files: {
                    'static/css/sleekspace.min.css': ['static/less/sleekspace/sleekspace.less']
                }
            },
            main: {
                options: {
                    paths: ['static/vendor'],
                    compress: true
                },
                files: {
                    'static/css/rfi-client.min.css': ['<%= project.less %>', '!static/less/sleekspace/**/*.less']
                }
            }
        },
        copy: {
            main: {
                files: [
                    { expand: true, cwd: 'src/widgets/', src:'**/*.html', dest:'static/partials/' }
                ]
            }
        },
        browserify: {
            dist: {
                files: {
                    'static/js/rfi-client.js': ['<%= project.js %>']
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
            },
            copy: {
                files: ['src/widgets/**/*.html'],
                tasks: ['copy'],
                options: {
                    atBegin: true
                }
            },
            browserify: {
                files: ['<%= project.js %>'],
                tasks: ['browserify'],
                options: {
                    atBegin: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 2695,
                    base: 'static'
                }
            }
        }
    });

    // Grunt Tasks.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-browserify');

    // Setup the build task.
    grunt.registerTask('build', ['less']);
    grunt.registerTask('devel', ['connect', 'watch']);
}; // module.exports

// ---------------------------------------------------------------------------------------------------------------------
