const webpack = require('webpack');
const path = require('path');
const { exec } = require('child_process');

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

const MODE = process.env.MODE || 'development';
const ANALYZER = process.env.ANALYZER;

const IS_SERVER = global.IS_SERVER = true;

global.window = {
    IS_SERVER,
    MODE,
    addEventListener() {}, // eslint-disable-line no-empty-function
};
/*
https://github.com/facebook/create-react-app/issues/3199
We'll figure something out soon. Sorry about that. This was the biggest release we ever did, there's also a new website we're launching today, and between all that there's a few kinks we still need to iron out.
*/
global.requestAnimationFrame = function(callback) {

    setTimeout(callback, 0);

};

const {
    PATH_TO_BUNDLE,
    PATH_TO_PUBLIC,
    PATH_TO_SHARED,
    PATH_TO_SCREENS,
} = require('./globals/index.js');

const isDevelope = MODE !== 'production';
const isProduction = MODE === 'production';

exec(`rm -fr ${PATH_TO_BUNDLE}/*`, (err, stdout, stderr) => { // eslint-disable-line no-unused-vars

    if (err) {

        console.err(err); // eslint-disable-line no-console
        return;

    }

});

const recursiveIssuer = (m) => {

    if (m.issuer) {

        return recursiveIssuer(m.issuer);

    } else if (m.name) {

        return m.name;

    } else {

        return false;

    }

};

const createWebpackConfig = () => {

    const config = {
        mode: MODE,
        plugins: [],
        devtool: isProduction ? '' : 'inline-source-map',
        module: {
            rules: [],
        },
        optimization: {},
    };

    config.entry = {
        index: path.join(__dirname, 'client', 'index'),
        routes: path.join(PATH_TO_SHARED, 'routes'),
    };

    config.output = {
        filename: '[name].[hash].js',
        path: PATH_TO_BUNDLE,
        publicPath: PATH_TO_PUBLIC,
        libraryTarget: 'umd',
        umdNamedDefine: true,
    };

    config.optimization.splitChunks = {
        cacheGroups: {
            indexStyles: {
                name: 'index',
                test: (m, c, entry = 'index') =>
                    m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
                chunks: 'all',
                enforce: true,
            },
        },
    };

    // PATH_TO_SHARED,
    // PATH_TO_SCREENS,

    config.plugins.push(new webpack.DefinePlugin({
        ROOTDIR: JSON.stringify(__dirname),
        MODE: JSON.stringify(MODE),
        screens: PATH_TO_SCREENS,
        shared: PATH_TO_SHARED,
    }));

    config.plugins.push(new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].[hash].css',
        chunkFilename: '[id].css',
    }));

    if (isProduction) {

        config.plugins.push(new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.(js|css)$/,
            minRatio: 0.8,
        }));

        config.plugins.push(new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|css|gif)$/,
        }));

        config.optimization.minimizer = [new TerserPlugin({
            terserOptions: {
                output: {
                    comments: false,
                },
            },
        }), new OptimizeCssAssetsPlugin({})];

    }

    if (ANALYZER) {

        config.plugins.push(new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            generateStatsFile: true,
            statsOptions: { source: false },
        }));

    }

    config.resolve = {
        extensions: [
            '.js', '.json', '.css', '.scss',
        ],
        alias: {
            root: __dirname,
            shared: PATH_TO_SHARED,
            screens: PATH_TO_SCREENS,
            glb$: path.resolve(__dirname, 'globals', 'index.js'),
        },
    };

    config.module.rules.push({
        test: /\.js$/,
        loaders: ['cache-loader', 'babel-loader'],
        exclude: /(node_modules|bower_components)/,
    });

    config.module.rules.push({
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    modules: true,
                    sourceMap: isDevelope,
                    localIdentName: '[local]__[hash:base64:5]',
                },
            }, {
                loader: 'sass-loader',
                options: {
                    sourceMap: isDevelope,
                    sourceMapContents: isDevelope },
            },
        ],
    });

    config.module.rules.push({
        test: /\.(jpe?g|png|gif|svg|ttf|eot|woff|woff2)$/i,
        use: {
            loader: 'file-loader',
            query: {
                name: '[name].[hash].[ext]',
            },
        },
    });

    return config;

};

module.exports = () => [
    createWebpackConfig(),
];
