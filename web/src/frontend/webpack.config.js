var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const DEBUG = process.env.NODE_ENV !== 'production';
const PRODUCTION = process.env.NODE_ENV === 'production';

const OUTPUT_DIRECTORY = '../main/webapp/js/';

const PLUGINS = [
    new HtmlWebpackPlugin({
        template: PRODUCTION ? 'index.html' : 'dev-index.html'
    }),
    new webpack.DllReferencePlugin({
        context: '.',
        manifest: require([OUTPUT_DIRECTORY, 'vendor-manifest.json'].join(''))
    })
];

if (PRODUCTION) {
    PLUGINS.concat([
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ])
}

module.exports = {
    name: 'app',
    context: __dirname,
    devtool: DEBUG ? 'inline-sourcemap' : false,
    entry:  './app/index.jsx',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
                }
            }
        ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    },
    externals: {
        'Personoversikt': 'PersonoversiktRoot',
    },
    output: {
        path: '../main/webapp/',
        filename: 'js/scripts.min.js',
        publicPath: '/veilarbpersonflatefs/'
    },
    plugins: PLUGINS
};
