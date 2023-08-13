import { merge } from 'webpack-merge';
import { Configuration } from 'webpack';

import clientConfig from './webpack.client.config.js';
import serverConfig from './webpack.server.config.js';
import sharedConfig from './webpack.shared.config.js';

const configs: Configuration[] = [clientConfig, serverConfig];
const mergedConfigs: Configuration[] = configs.map((config) =>
  merge(sharedConfig, config),
);

export default mergedConfigs;
