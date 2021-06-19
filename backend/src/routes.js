const express = require('express');
const routes = express.Router();

const CvssController = require('./controller/CvssController');
const CveController = require('./controller/CveController');

routes.route('/cve/:id')
  .get(CveController.getCveById);

routes.route('/cvss')
  .post(CvssController.calculateCvss);

routes.route('/cvssByCVE/:id')
  .get(CvssController.calculateCvssByCVE);

module.exports = routes;
