/* eslint-disable no-console */
import express from 'express';
import next from 'next';
import auth from '../auth/auth';
import proxyMiddleware from 'http-proxy-middleware';
import dotenv from 'dotenv';
import { IncomingMessage, ServerResponse } from 'http';

dotenv.config();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const env = process.env.NODE_ENV;
const dev = env !== 'production';
const app = next({
  dir: '.', // base directory where everything is, could move to src later
  dev,
});

const handle = app.getRequestHandler();

// hook up routes to the routes exposed by the proxy
const devProxy = {
  '/user': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
  '/login': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
  '/logout': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
  '/callback': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
};

let server: any;
app
  .prepare()
  .then(() => {
    server = express();

    // Set up the proxy.
    if (dev && devProxy) {
      Object.entries(devProxy).forEach(([key, value]) => {
        server.use(proxyMiddleware(key, value));
      });
    }

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all('*', (req: IncomingMessage, res: ServerResponse) =>
      handle(req, res),
    );

    server.listen(port, (err: Error) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on port ${port} [${env}]`);
    });
  })
  .catch(err => {
    console.log('An error occurred, unable to start the server');
    console.log(err);
  });
