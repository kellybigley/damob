module.exports = function (grunt) {

    //instead of loadNpmTasks, load all dev dependencies from the package.json
    require('load-grunt-tasks')(grunt);

    var VERSION_REGEXP = /\bv(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?\b/i;

    grunt.initConfig({
        config: {
            source: "src",
            out: "build"
        },
        //Clean (delete) files and folders
        clean: {
            release: ['<%=config.out %>']
        },
        less: {
            release: {
                options: {
                    paths: [
                        "<%= config.source%>/less"
                    ]
                },
                files: [{
                    expand: true,
                    cwd: "<%= config.source%>/less",
                    src: "*.less",
                    ext: ".css",
                    dest: "<%= config.source%>/css"
                }]
            }
        },
        //Copy the source files into the destination location
        copy: {
            main: {
                files: [
                    {expand: true, src: ["bower_components/**"], dest: "<%=config.out%>/"},
                    {expand: true, cwd: "src", src: ["**"], dest: "<%=config.out%>/"}
                ]
            }
        },
        replace: {
            index: {
                src: './src/index.html',
                dest: '<%=config.out%>/index.html',
                replacements: [
                    {
                        from: 'src="../bower_components/',
                        to: 'src="bower_components/'
                    },
                    {
                        from: 'href="../bower_components/',
                        to: 'href="bower_components/'
                    }
                ]
            },
            config: {
                src: './src/js/main.js',
                dest: '<%=config.out%>/js/main.js',
                replacements: [
                    {
                        from: 'http://smartsitedev/atl',
                        to: '..'
                    }
                ]
            },
            galleryimages: {
                src: './src/js/components/gallery.html',
                dest: '<%=config.out%>/js/components/gallery.html',
                replacements: [
                    {
                        from: 'http://smartsitedev/atl',
                        to: '..'
                    }
                ]
            }
        },
        watch: {
            options: {
                livereload: 35729                
            },
            build: {
                files: ['./src/less/**/*.less', './src/js/**/*.js', './src/js/**/*.json', './src/js/**/*.html',
                './src/index.html'],
                tasks: ['build']
            }
        },
        connect: {
            options: {
                hostname: 'localhost',
                livereload: 35729,
                base: './'
            },
            build: {
                options: {    
                    port: 12345,         
                    open: {
                        target: 'http://localhost:12345/build/'
                    }
                }
            }
        }
    });
    grunt.registerTask('build', [
        "clean",
        "less",
        "copy",
        "replace:index"
    ]);
    grunt.registerTask('run', [
        'build', 
        'connect:build', 
        'watch:build'
    ]);
    grunt.registerTask('deploy', [
        "clean",
        "less",
        "copy",
        "replace"
    ]);
    grunt.registerTask('default', ['build']);
};