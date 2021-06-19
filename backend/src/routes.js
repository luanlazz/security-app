const express = require('express')

const cveService = require('./services/cve')
const cvssService = require('./services/cvss')

const routes = express.Router()

routes.route('/cve/:id')
  .get(cveService.getCveById)

routes.route('/cvss')
  .post(cvssService.calculateCvss)

module.exports = routes