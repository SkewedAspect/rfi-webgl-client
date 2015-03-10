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
                    paths: ['node_modules/bootstrap/less'],
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
        uglify: {
            dist: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true
                },
                files: {
                    'dist/js/rfi-client.min.js': ['src/app.js', '<%= project.js %>']
                }
            }
        },
        clean: ["dist"],
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
            },
            copy: {
                files: ['src/widgets/**/*.html'],
                tasks: ['copy'],
                options: {
                    atBegin: true
                }
            },
            uglify: {
                files: ['<%= project.js %>'],
                tasks: ['uglify'],
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
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Setup the build task.
    grunt.registerTask('build', ['clean', 'less', 'copy', 'uglify']);
    grunt.registerTask('test', ['build', 'karma:unit']);
    grunt.registerTask('devel', ['clean', 'connect', 'watch']);
}; // module.exports

// ---------------------------------------------------------------------------------------------------------------------
