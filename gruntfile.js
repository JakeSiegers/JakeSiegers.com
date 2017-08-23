module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            compressJs: {
                src : 'js/src/*.js',
                dest : 'js/js.min.js'
            }
        },
        csso: {
            compressCss: {
                src : 'css/src/*.css',
                dest : 'css/style.min.css'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-csso');

    // Default task(s).
    grunt.registerTask('default', ['uglify','csso']);
};