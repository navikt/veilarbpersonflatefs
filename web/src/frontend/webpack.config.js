var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const DEBUG = process.env.NODE_ENV !== 'production';
const PRODUCTION = process.env.NODE_ENV === 'production';

const OUTPUT_DIRECTORY = '../main/webapp/js/';

const RULES = [
    {
        test: /\.jsx?/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: ['babel-loader', 'eslint-loader'],
    },
    {
        test: /\.svg$/,
        use: {
            loader: 'url-loader',
            options: {'noquotes': true}
        }
    },
    {
        test: /\.less$/,
        use: [
            'style-loader',
            {loader: 'css-loader', options: { importLoaders: 1 } },
            'less-loader'
        ]
    }
];

const LOADERS = [
    {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
            plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
        }
    }
];

const PLUGINS = [
    new HtmlWebpackPlugin({
        template: PRODUCTION ? 'index.html' : 'dev-index.html'
    }),
    new webpack.DllReferencePlugin({
        context: '.',
        manifest: require([OUTPUT_DIRECTORY, 'vendor-manifest.json'].join(''))
    })
];

const PRODUCTION_PLUGINS = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        mangle: false,
        sourcemap: false
    }),
];


module.exports = {
    name: 'app',
    context: __dirname,
    devtool: DEBUG ? 'inline-sourcemap' : false,
    entry:  './app/index.jsx',
    module: {
        rules: RULES,
        loaders: LOADERS
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    },
    externals: {
        'Personoversikt': 'PersonoversiktRoot',
        'react': 'React'
    },
    output: {
        path: '../main/webapp/',
        filename: 'js/scripts.min.js',
        publicPath: '/veilarbpersonflatefs/'
    },
    plugins: DEBUG ? PLUGINS : [].concat(PLUGINS, PRODUCTION_PLUGINS)
};
