module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            compressJs: { //why do I need to name this subtask?!?
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

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-csso');

    grunt.registerTask('default', ['uglify','csso']);
};