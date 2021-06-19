const express = require('express');
const routes = express.Router();

const cveService = require('./services/cve');

routes.route('/cve/:id')
  .get(cveService.getCveById);

module.exports = routes;
