const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const DEBUG = process.env.NODE_ENV !== 'production';
const PRODUCTION = process.env.NODE_ENV === 'production';

const LIBRARIES = {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'redux' : 'Redux',
    'redux-thunk' : 'ReduxThunk',
    'react-redux': 'ReactRedux'
};

const RULES = [
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
    },
    { test: /\.tsx?$/, use: "awesome-typescript-loader" },
    { enforce: "pre", test: /\.js$/, use: "source-map-loader" },
];

const PLUGINS = [
    new HtmlWebpackPlugin({
        template: 'index.html',
        hash: true
    }),
    new CopyWebpackPlugin(
        Object.keys(LIBRARIES).map(library => {
            return {
                from: path.join(__dirname, `node_modules/${library}/dist/${library}.min.js`),
                to: path.join(__dirname, `../main/webapp/js/${library}.min.js`)
            }
        }), {
            copyUnmodified: true
        })
];

const PRODUCTION_PLUGINS = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
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
    entry:  './app/index.tsx',
    module: {
        rules: RULES
    },
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx']
    },
    externals: Object.assign({
        'Personoversikt': 'PersonoversiktRoot',
        'Aktivitetsplan': 'AktivitetsplanRoot'
    }, LIBRARIES),
    output: {
        path: __dirname + '/../main/webapp/',
        filename: 'js/scripts.min.js',
        publicPath: '/veilarbpersonflatefs/'
    },
    plugins: DEBUG ? PLUGINS : [].concat(PLUGINS, PRODUCTION_PLUGINS)
};
