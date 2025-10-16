import path from 'node:path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

// Do this as the first thing so that any code reading it knows the right env
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Env-dependent imports
import config, { options } from './webpack.config';
import { PORT } from './env';

const notHotEntrypoints = options.notHotReload;
const hotDependencies = [
    'webpack/hot/dev-server',
    `webpack-dev-server/client?hot=true&hostname=localhost&port=${PORT}`
];

config.entry ??= {};

// TODO We could support `string | string[]` if we could convert it to a `webpack.EntryObject`. Full support follows
if (typeof config.entry !== 'object' || Array.isArray(config.entry)) {
    throw new TypeError("Currently unsupported Webpack 'entry' property type");
}

for (const entryName in config.entry) {
    if (!notHotEntrypoints.includes(entryName)) {
        let entry = config.entry[entryName];

        if (typeof entry === 'string' || Array.isArray(entry)) {
            entry = hotDependencies.concat(entry);
        } else {
            entry.dependOn ??= [];
            entry.dependOn = hotDependencies.concat(entry.dependOn);
        }

        config.entry[entryName] = entry;
    }
}

const compiler = webpack(config);
const server = new WebpackDevServer(
    {
        hot: true,
        liveReload: false,
        client: {
            webSocketTransport: 'sockjs'
        },
        webSocketServer: 'sockjs',
        host: 'localhost',
        port: PORT,
        static: {
            directory: path.join(__dirname, '../build')
        },
        devMiddleware: {
            publicPath: `http://localhost:${PORT}/`,
            writeToDisk: true
        },
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        allowedHosts: 'all'
    },
    compiler
);

// Running server
try {
    await server.start();
} catch (err: unknown) {
    console.error('Web server encountered an error:', err);
}
