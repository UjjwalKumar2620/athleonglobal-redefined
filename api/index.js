// api/index.js
// Vercel Serverless Entry Point with serverless-http wrapper
const serverless = require('serverless-http');
const app = require('../Backend/server');

// Wrap the Express app with serverless-http and export the handler
module.exports = serverless(app);
