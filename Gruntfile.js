module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            core: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true,
                    sourceMap: 'asmcrypto-core.js.map',
                    wrap: 'asmCrypto'
                },
                files: {
                    'asmcrypto-core.js': [
                        'src/utils.js',

                        'src/core/errors.js',
                        'src/core/aes.asm.js', 'src/core/aes.js', 'src/core/aes-cbc.js', 'src/core/aes-ccm.js',
                        'src/core/sha256.asm.js', 'src/core/sha256.js',
                        'src/core/hmac.js',
                        'src/core/pbkdf2.js',
                        'src/core/api.js'
                    ]
                }
            },

            full: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true,
                    sourceMap: 'asmcrypto.js.map',
                    wrap: 'asmCrypto'
                },
                files: {
                    'asmcrypto.js': [
                        'src/utils.js',

                        'src/core/errors.js',
                        'src/core/aes.asm.js', 'src/core/aes.js', 'src/core/aes-cbc.js', 'src/core/aes-ccm.js',
                        'src/core/sha256.asm.js', 'src/core/sha256.js',
                        'src/core/hmac.js',
                        'src/core/pbkdf2.js',
                        'src/core/api.js',

                        'src/webcrypto/errors.js',
                        'src/webcrypto/algorithms.js',
                        'src/webcrypto/worker.js',
                        'src/webcrypto/pool.js',
                        'src/webcrypto/webcrypto.js',
                        'src/webcrypto/api.js'
                    ]
                }
            }
        },

        clean: [
            'asmcrypto-core.js',
            'asmcrypto-core.js.map',
            'asmcrypto.js',
            'asmcrypto.js.map'
        ]
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['uglify:full']);
};
