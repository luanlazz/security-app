const express = require('express');
const routes = express.Router();

const cveService = require('./services/cve');
const cvssService = require('./services/cvss');

routes.route('/cve/:id')
  .get(cveService.getCveById);

routes.route('/cvss')
  .post(cvssService.calculateCvss);

module.exports = routes;
