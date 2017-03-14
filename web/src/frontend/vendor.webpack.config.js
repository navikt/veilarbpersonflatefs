var webpack = require('webpack');

const DEBUG = process.env.NODE_ENV !== "production";

const OUTPUT_DIRECTORY = '../main/webapp/js/';

const LIBS = [
    'react',
    'react-dom',
    'redux',
    'redux-thunk',
    'react-redux'
];

const PLUGINS = [
    new webpack.DllPlugin({
        path: [OUTPUT_DIRECTORY, "vendor-manifest.json"].join(''),
        name: 'vendor_dll'
    })
];

const PRODUCTION_PLUGINS = [
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
];

module.exports = {
    name: "vendor",
    context: __dirname,
    devtool: DEBUG ? "inline-sourcemap" : false,
    entry:  LIBS,
    resolve: {
        extensions: [".js"]
    },
    output: {
        path: OUTPUT_DIRECTORY,
        filename: "vendor.bundle.min.js",
        library: "vendor_dll"
    },
    plugins: DEBUG ? PLUGINS : [].concat(PLUGINS, PRODUCTION_PLUGINS)
};
