// This file is the entry point for Vercel Serverless Functions
// This file is the entry point for Vercel Serverless Functions
const serverBundle = require('../server/index');

// If the server exports an object with { app, server }, we use app.
// If it exports the server (http.Server), we use that.
// Most reliable for Vercel is the Express app instance.
module.exports = serverBundle.app || serverBundle;

