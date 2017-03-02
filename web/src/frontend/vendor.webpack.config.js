var webpack = require('webpack');

const DEBUG = process.env.NODE_ENV !== 'production';

const PRODUCTION_PLUGINS = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        mangle: false,
        sourcemap: false
    }),
];

const LIBRARIES = {
    'react': 'React',
    'redux': 'Redux',
    'redux-thunk': 'ReduxThunk',
    'react-redux': 'ReactRedux'
};

module.exports = Object.keys(LIBRARIES).map((key) => ({
        context: __dirname,
        devtool: DEBUG ? 'inline-sourcemap' : false,
        entry:  key,
        resolve: {
            extensions: ['.js']
        },
        output: {
            path: '../main/webapp/',
            filename: `js/${key}.min.js`,
            library: LIBRARIES[key]
        },
        plugins: DEBUG ? [] : PRODUCTION_PLUGINS
    })
);
