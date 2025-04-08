import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { PORT } from './env';

// Do this as the first thing so that any code reading it knows the right env
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.ASSET_PATH = '/';

// Temporarily extending webpack config
type WebpackConfig = webpack.Configuration & {
    chromeExtensionBoilerplate?: { notHotReload?: string[] };
};

// Env-dependent imports
const config = require('../webpack.config') as WebpackConfig;

// TODO Move extraneous webpack configuration
const OPTIONS = config.chromeExtensionBoilerplate ?? {};
const EXCLUDE_ENTRIES_TO_HOT_RELOAD = OPTIONS.notHotReload ?? [];

// TODO This `as` statement is awful and presumptuous
const entry = (config.entry = (config.entry ?? {}) as Record<string, string>);

for (const entryName in entry) {
    if (!EXCLUDE_ENTRIES_TO_HOT_RELOAD.includes(entryName)) {
        // TODO Wait, this is already in our webpack config!
        config.entry[entryName] = [
            'webpack/hot/dev-server',
            `webpack-dev-server/client?hot=true&hostname=localhost&port=${PORT}`
        ].concat(entry[entryName]);
    }
}

// Removing extraneous webpack config
delete config.chromeExtensionBoilerplate;

const COMPILER = webpack(config as webpack.Configuration);

const SERVER = new WebpackDevServer(
    {
        https: false,
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
    COMPILER
);

// Running server
(async () => {
    await SERVER.start();
})().catch((err: unknown) => {
    console.error('Web server encountered an error:', err);
});
