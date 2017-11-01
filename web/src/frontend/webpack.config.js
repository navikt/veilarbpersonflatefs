const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

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
        loader: ExtractTextPlugin.extract({
            use: [{
                loader: 'css-loader'
            }, {
                loader: 'less-loader',
                options: {
                    globalVars: {
                        coreModulePath: "'./../../../node_modules/'",
                        nodeModulesPath: "'./../../../node_modules/'"
                    }
                }
            }]
        })
    },
    { test: /\.tsx?$/, use: "awesome-typescript-loader" },
];

const PLUGINS = [
    new ExtractTextPlugin('css/index.css'),
    new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }
    }),
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
    stats: {
        children: false
    },
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
