//----------------------------------------------------------------------------------------------------------------------
// RFI Client Gruntfile.
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    // Project configuration.
    grunt.initConfig({
        project: {
            js: ['src/**/*.js'],
            less: ['src/less/**/*.less', 'src/widgets/**/*.less']
        },
        less: {
            sleekspace: {
                options: {
                    paths: ['static/vendor'],
                    compress: true
                },
                files: {
                    'dist/css/sleekspace.min.css': ['src/less/sleekspace/sleekspace.less']
                }
            },
            main: {
                options: {
                    paths: ['dist/vendor'],
                    compress: true
                },
                files: {
                    'dist/css/rfi-client.min.css': ['<%= project.less %>', '!src/less/sleekspace/**/*.less']
                }
            }
        },
        copy: {
            main: {
                files: [
                    { expand: true, cwd: 'src/widgets/', src:'**/*.html', dest:'dist/partials/' },
                    { expand: true, cwd: 'static/', src:'fonts/**/*.*', dest:'dist/' },
                    { expand: true, cwd: 'static/', src:'vendor/**/*.*', dest:'dist/' },
                    { expand: true, cwd: 'static/', src:'models/**/*.*', dest:'dist/' },
                    { expand: true, cwd: 'src/', src:'index.html', dest:'dist/' }
                ]
            }
        },
        browserify: {
            dist: {
                files: {
                    'dist/js/rfi-client.js': ['src/app.js', '<%= project.js %>']
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
                    base: 'dist'
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
