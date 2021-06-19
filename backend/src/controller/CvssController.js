const cvssService = require('../service/cvss');
const cveService = require('../service/cve');

module.exports = {
  calculateCvss(req, res) {
    const {body} = req;

    try {
      const result = cvssService.calculateCvss(body);
      res.json(result);
    } catch (e) {
      res.status(400).send(e.message);
    }
  },

  async calculateCvssByCVE(req, res) {
    const idCve = req.params.id;

    try {
      const cve = await cveService.getCveById(idCve);
      const result = cvssService.calculateCvss({accumulator: `/${cve.cvssVector}` || ''});
      res.json(result);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
};
