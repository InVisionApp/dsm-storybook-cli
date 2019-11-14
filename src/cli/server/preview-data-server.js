'use strict';
const express = require('express');
const logger = require('../cli-logger');
const userMessages = require('../../user-messages');

// in-memory storage for data that is created by the build process and needs to be accessed by the local storybook preview
let storiesMetadata = null;

function start(data, options) {
  const app = express();
  const port = options.port;
  storiesMetadata = data;

  const corsProtocol = `http${options.storybookSecure ? 's' : ''}`;
  const corsPort = options.storybookPort;
  const allowedCorsOrigins = new Set(['localhost', '127.0.0.1'].map((host) => `${corsProtocol}://${host}:${corsPort}`));

  app.use(function(req, res, next) {
    /**
     * Security comment:
     * This server only runs on a developer's machine, serving story previews.
     * It is configured to only respond to JS requests originating from the storybook instance started by this CLI command.
     * both storybook TLS mode and port are specified given stadard storybook CLI arguments which are passed through to the process.
     * https://storybook.js.org/docs/configurations/cli-options/
     *
     */
    const origin = req.get('origin');

    if (origin && allowedCorsOrigins.has(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    } else {
      res.status(401).end();
    }
  });

  app.get('/sample-code-data', function(req, res) {
    res.send(storiesMetadata);
  });

  app.listen(port, function() {
    logger.info(userMessages.previewServerStarted(port));
  });
}

module.exports = {
  start
};
