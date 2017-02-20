const DEBUG = process.env.NODE_ENV !== "PRODUCTION";
const PRODUCTION = process.env.NODE_ENV === "PRODUCTION";
var webpack = require('webpack');

const OUTPUT_DIRECTORY = '../main/webapp/js/';

var plugins = [new webpack.DllReferencePlugin({
    context: ".",
    manifest: require([OUTPUT_DIRECTORY, 'vendor-manifest.json'].join(''))
})];

if (PRODUCTION) {
    plugins.concat([
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ])
}

module.exports = {
    name: 'app',
    context: __dirname,
    devtool: DEBUG ? "inline-sourcemap" : false,
    entry:  "./app/index.jsx",
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
        "Personoversikt": "PersonoversiktRoot",
    },
    output: {
        path: "../main/webapp/js/",
        filename: "scripts.min.js"
    },
    plugins: plugins,
};
