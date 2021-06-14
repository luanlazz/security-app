const express = require('express')

const cveService = require('./services/cve')

const routes = express.Router()

routes.route('/cve')
  .get(cveService.getCveById)

module.exports = routes