
const startTask = (name) => {
    const gutil = require('gulp-util');
    gutil.log('Starting', "'" + gutil.colors.cyan(name) + "'...");
    return new Date();
};

const endTask = (name, start) => {
    const gutil = require('gulp-util');
    const time = parseFloat((new Date() - start) / 1000).toFixed(2);
    gutil.log('Finished', "'" + gutil.colors.cyan(name) + "'", 'after', gutil.colors.magenta(time + ' s'));
};

module.exports = {
    startTask,
    endTask
};