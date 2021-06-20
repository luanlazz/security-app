const cveService = require('../service/cve');

module.exports = {
  async getCveById(req, res) {
    const idCve = req.params.id;

    try {
      const result = await cveService.getCveById(idCve);
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
};
