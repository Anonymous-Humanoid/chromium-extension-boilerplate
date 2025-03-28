import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import fileSystem from 'fs-extra';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import ReactRefreshTypeScript from 'react-refresh-typescript';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import { ASSET_PATH, NODE_ENV, PORT } from './utils/env';

let alias: { [key: string]: string } = {};

// Loading env secrets
let secretsPath = path.join(__dirname, 'secrets.' + NODE_ENV + '.js');

if (fileSystem.existsSync(secretsPath)) {
    alias['secrets'] = secretsPath;
}

let fileExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'eot',
    'otf',
    'svg',
    'ttf',
    'woff',
    'woff2'
];

const IS_DEV_MODE = process.env.NODE_ENV !== 'production';

let options: webpack.Configuration = {
    mode: IS_DEV_MODE ? 'development' : 'production',
    devtool: IS_DEV_MODE ? 'cheap-module-source-map' : undefined,
    optimization: IS_DEV_MODE
        ? undefined
        : {
              minimize: true,
              minimizer: [
                  new TerserPlugin({
                      extractComments: false
                  })
              ]
          },
    entry: {
        // Required for hot module reloading
        hmr: `webpack-dev-server/client?http://localhost:${PORT}`,
        // react_hmr: 'react-hot-loader/patch',

        newtab: path.join(__dirname, 'src', 'pages', 'Newtab', 'index.tsx'),
        options: path.join(__dirname, 'src', 'pages', 'Options', 'index.tsx'),
        popup: path.join(__dirname, 'src', 'pages', 'Popup', 'index.tsx'),
        background: path.join(
            __dirname,
            'src',
            'pages',
            'Background',
            'index.ts'
        ),
        devtools: path.join(__dirname, 'src', 'pages', 'Devtools', 'index.ts'),
        panel: path.join(__dirname, 'src', 'pages', 'Panel', 'index.tsx'),
        contentScript: path.join(
            __dirname,
            'src',
            'pages',
            'Content',
            'index.ts'
        )
    },
    // @ts-expect-error TODO
    chromeExtensionBoilerplate: {
        notHotReload: ['background', 'contentScript', 'devtools']
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
        publicPath: ASSET_PATH
    },
    module: {
        rules: [
            {
                // look for .css or .scss files in the `src` directory
                test: /\.(css|scss)$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
                type: 'asset/resource',
                exclude: /node_modules/
                // loader: 'file-loader',
                // options: {
                //   name: '[name].[ext]',
                // },
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: /node_modules/
            },
            {
                // TS/TSX must come before JS/JSX
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('ts-loader'),
                        options: {
                            getCustomTransformers: () => ({
                                before: [
                                    IS_DEV_MODE && ReactRefreshTypeScript()
                                ].filter(Boolean)
                            }),
                            transpileOnly: IS_DEV_MODE
                        }
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'source-map-loader'
                    },
                    {
                        loader: require.resolve('babel-loader'),
                        options: {
                            plugins: [
                                IS_DEV_MODE &&
                                    require.resolve('react-refresh/babel')
                            ].filter(Boolean)
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: alias,
        extensions: fileExtensions
            .map((extension) => '.' + extension)
            .concat([
                '.ts',
                '.tsx', // TS(X) must come before JS(X)
                '.js',
                '.jsx',
                '.css'
            ])
    },
    plugins: [
        IS_DEV_MODE && new ReactRefreshWebpackPlugin({ overlay: false }),
        new CleanWebpackPlugin({ verbose: false }),
        new webpack.ProgressPlugin(),
        // expose and write the allowed env vars on the compiled bundle
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/manifest.json',
                    to: path.join(__dirname, 'build'),
                    force: true,
                    transform: function (content, _path) {
                        // TODO Description is missing
                        // generates the manifest file using the package.json informations
                        return Buffer.from(
                            JSON.stringify({
                                ...JSON.parse(content.toString()),
                                description:
                                    process.env.npm_package_description,
                                version: process.env.npm_package_version
                            })
                        );
                    }
                }
            ]
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/pages/Content/content.styles.css',
                    to: path.join(__dirname, 'build'),
                    force: true
                }
            ]
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/assets/img/icon-128.png',
                    to: path.join(__dirname, 'build'),
                    force: true
                }
            ]
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/assets/img/icon-64.png',
                    to: path.join(__dirname, 'build'),
                    force: true
                }
            ]
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/assets/img/icon-34.png',
                    to: path.join(__dirname, 'build'),
                    force: true
                }
            ]
        }),
        new HtmlWebpackPlugin({
            template: path.join(
                __dirname,
                'src',
                'pages',
                'Newtab',
                'index.html'
            ),
            filename: 'newtab.html',
            chunks: ['newtab'],
            cache: false
        }),
        new HtmlWebpackPlugin({
            template: path.join(
                __dirname,
                'src',
                'pages',
                'Options',
                'index.html'
            ),
            filename: 'options.html',
            chunks: ['options'],
            cache: false
        }),
        new HtmlWebpackPlugin({
            template: path.join(
                __dirname,
                'src',
                'pages',
                'Popup',
                'index.html'
            ),
            filename: 'popup.html',
            chunks: ['popup'],
            cache: false
        }),
        new HtmlWebpackPlugin({
            template: path.join(
                __dirname,
                'src',
                'pages',
                'Devtools',
                'index.html'
            ),
            filename: 'devtools.html',
            chunks: ['devtools'],
            cache: false
        }),
        new HtmlWebpackPlugin({
            template: path.join(
                __dirname,
                'src',
                'pages',
                'Panel',
                'index.html'
            ),
            filename: 'panel.html',
            chunks: ['panel'],
            cache: false
        })
    ].filter(Boolean),
    infrastructureLogging: {
        level: 'info'
    }
};

// Exported config must not be mutable
const CONFIG = options;

// Webpack >= 2.0.0 no longer allows custom properties in configuration
module.exports = CONFIG;
