var webpack = require('webpack'),
    ReloadPlugin = require('webpack-reload-plugin'),
    path = require('path'),
    ChunkManifestPlugin = require('chunk-manifest-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    WebpackNotifierPlugin = require('webpack-notifier'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

/**
 * optimist has been depracted. Find an alternative? minimist?  
 */
var argv = require('optimist')
    .alias('r', 'release').default('r', false)
    .argv;

/**
 * Useful variables
 */
var cwd = process.cwd();
var DEBUG = !argv.release;
var isDevServer = process.argv.join('').indexOf('webpack-dev-server') > -1;
var version = require(path.resolve(cwd, 'package.json')).version;
var reloadHost = "0.0.0.0";
var npmRoot = __dirname + "/node_modules";
var appDir = __dirname + "/app";

var entry = ["./app/ts/bootstrap"]

if (isDevServer) {
    entry.unshift("webpack-dev-server/client?http://" + reloadHost + ":8080");
}

function makeConfig(options)    {
    return {
        cache: true,
        debug: true,
        verbose: true,
        displayErrorDetails: true,
        displayReasons: true,
        displayChunks: true,
        context: __dirname,
        entry: {
            app: entry,
            vendor: './app/ts/vendor.ts'
        },
        stats: {
            colors: true,
            reasons: DEBUG
        },
        devtool: 'source-map',
        recordsPath: path.resolve('.webpack.json'),
        devServer: {
            inline: true,
            colors: true,
            contentBase: path.resolve(cwd, "build"),
            publicPath: "/"
        },
        output: {
            path: path.resolve(cwd, "build"),
            filename: "[name].js",
            publicPath: "/",
            chunkFilename: "[id].bundle.js",

            // Hot Module Replacement settings:
            hotUpdateMainFilename: "updates/[hash].update.json",
            hotUpdateChunkFilename: "updates/[hash].[id].update.js"
        },
        plugins: [
            new webpack.IgnorePlugin(/spec\.js$/),
            new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js', minChunks: Infinity }),
            new webpack.optimize.CommonsChunkPlugin({ name: 'common', filename: 'common.js', minChunks: 2, chunks: ['app', 'vendor'] }),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            }),
            new ExtractTextPlugin("styles.css"),
            new webpack.DefinePlugin({
                VERSION: JSON.stringify(version),
                ENV: JSON.stringify(options.env)
            }),
            new HtmlWebpackPlugin({
                template: path.join(appDir, "index.html"),
            }),
            new ReloadPlugin(isDevServer ? 'localhost' : ''),
            new WebpackNotifierPlugin({
                title: "Jisc AppStore App"
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    'API_ROOT': JSON.stringify(process.env.API_ROOT || 'http://localhost:8888/'),
                    'CURATION_ROOT': JSON.stringify(process.env.CURATION_ROOT || 'https://curation-staging.data.alpha.jisc.ac.uk/'),
                    'S3_ROOT': JSON.stringify(process.env.S3_ROOT || 'https://s3-eu-west-1.amazonaws.com/jisc-store-resources/'),
                    'IDP_MEMBERS': JSON.stringify(process.env.IDP_MEMBERS || 'https://microservice.data.alpha.jisc.ac.uk:1337/idps')
                }
            })
        ],
        resolveLoader: {
            root: path.join(__dirname, 'node_modules'),
            modulesDirectories: ['node_modules'],
            fallback: path.join(__dirname, "node_modules")
        },
        resolve: {
            root: [path.resolve(cwd)],
            modulesDirectories: [
                'node_modules', 'app', 'app/ts', '.'
            ],
            extensions: ["", ".ts", ".js", ".json", ".css"],
            alias: {
                'app': 'app',
                'scripts': npmRoot,
                jquery: "jquery/src/jquery"
            },
        },
        module: {
            // preLoaders: [
            //     { test: /\.ts$/, loader: "tslint" }
            // ],
            loaders: [
                { test: /\.(png|jp?g|gif)$/, loaders: ["url", "image"] },
                { test: /\.json$/, loader: 'json' },
                { test: /^(?!.*\.min\.css$).*\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap") },
                { test: /\.scss$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap'] },
                //                { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader" },
                { test: /\.html$/, loader: "html" },
                { test: /\.ts$/, loader: 'ts', exclude: [/test/, /node_modules/] },
                { test: /vendor\/.*\.(css|js)/, loader: 'file-loader?name=[path][name].[ext]', exclude: [/node_modules/] },
                {
                    test: /\.(woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    //                    loader: "file-loader"
                    loader: "url-loader"
                },
                {
                    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "url-loader"
                }
                // ,
                // {
                //     test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/,
                //     loader: "imports?this=>window"
                // },
                // {
                //     test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/,
                //     loader: "imports?define=>false"
                // }
            ],
            noParse: [
                /\.min\.js/,
                /vendor[\/\\].*?\.(js|css)$/
            ]
        }/*,
        tslint: {
            emitErrors: false,
            failOnHint: false
        }*/
    }
}

var config = makeConfig(argv)

console.log(require('util').inspect(config, { depth: 10 }))
module.exports = config;