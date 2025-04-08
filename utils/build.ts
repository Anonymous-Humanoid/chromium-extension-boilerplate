import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import ZipPlugin from 'zip-webpack-plugin';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';

// Env-dependent imports
const CONFIG = require('../webpack.config') as webpack.Configuration;

// @ts-expect-error TODO Remove invalid config used by webserver
delete CONFIG.chromeExtensionBoilerplate;

// Zipping extension
const PACKAGE_INFO = JSON.parse(
    fs.readFileSync('package.json', 'utf-8')
) as object & { name: string; version: string };

// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
CONFIG.plugins = [...(CONFIG.plugins || [])].concat(
    new ZipPlugin({
        filename: `${PACKAGE_INFO.name}-${PACKAGE_INFO.version}.zip`,
        path: path.join(__dirname, '..', 'zip')
    })
);

webpack(CONFIG, function (err) {
    if (err) throw err;
});
