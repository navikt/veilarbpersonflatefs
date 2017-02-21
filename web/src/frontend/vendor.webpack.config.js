const DEBUG = process.env.NODE_ENV !== "PRODUCTION";
var webpack = require('webpack');

const OUTPUT_DIRECTORY = '../main/webapp/js/';

const LIBS = [
    'react',
    'redux',
    'redux-thunk',
    'react-redux'
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
    plugins: [
        new webpack.DllPlugin({
            path: [OUTPUT_DIRECTORY, "vendor-manifest.json"].join(''),
            name: 'vendor_dll'
        }),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: DEBUG })
    ]

};