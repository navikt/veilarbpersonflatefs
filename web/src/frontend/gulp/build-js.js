const gutilPrint = require('./gutil-print.js');
const startTask = gutilPrint.startTask;
const endTask = gutilPrint.endTask;

const constants = require('./constants');
const OUTPUT_DIRECTORY = constants.OUTPUT_DIRECTORY;

const WATCHIFY_NAME = 'watchify rebundle';

const onError = function (err) {
    const gutil = require('gulp-util');
    gutil.beep();
    gutil.log("Error: [line " + err.lineNumber + "] " + err.message);
};

const isProduction = () => process.env.NODE_ENV === 'production';
const isDevelopment = () => process.env.NODE_ENV !== 'production';

const babelifyReact = function (file) {
    const babelify = require('babelify');
    return babelify(file);
};

function bundle(gulp, bundle, bundleFileName) {
    const gulpif = require('gulp-if');
    const buffer = require('vinyl-buffer');
    const uglify = require('gulp-uglify');
    const source = require('vinyl-source-stream');

    return bundle
        .bundle()
        .on('error', (err) => {
            onError(err);
            this.emit('end');
        })
        .pipe(source(bundleFileName))
        .pipe(gulpif(isProduction(), buffer()))
        .pipe(gulpif(isProduction(), uglify()))
        .on('error', (error) => {
            onError(error);
            process.exit(1);
        })
        .pipe(gulp.dest(OUTPUT_DIRECTORY + 'js/'));
}

function buildJs(gulp) {
    return () => {
        const browserify = require('browserify');
        var bundler = browserify('./app/index.jsx', {
            debug: isDevelopment(),
            extensions: ['.js', '.jsx'],
            fullPaths: isDevelopment()
        });
        return bundle(gulp, bundler.transform(babelifyReact), 'bundle.js');
    };
}

function buildJsWatchify(gulp) {
    return () => {
        const watchify = require('watchify');
        const browserify = require('browserify');

        const browserifyOpts = {
            debug: isDevelopment(),
            entries: ['./app/index.jsx'],
            cache: {},
            packageCache: {},
            fullPaths: isDevelopment(),
            extensions: ['.jsx', '.js']
        };

        var opts = Object.assign({}, watchify.args, browserifyOpts);
        var bundler = watchify(browserify(opts)).transform(babelifyReact);

        bundler
            .on('update', () => {
                const timer = startTask(WATCHIFY_NAME);

                return bundle(gulp, bundler, 'bundle.js')
                    .on('end', () => {
                        endTask(WATCHIFY_NAME, timer);
                    });
            });

        return bundle(gulp, bundler, 'bundle.js');
    };
}

module.exports = {
    buildJs: (gulp) => buildJs(gulp),
    buildJsWatchify: (gulp) => buildJsWatchify(gulp)
};
