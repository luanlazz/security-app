const cvss = require('cvss')

module.exports = {
  async calculateCvss(req, res) {
    const { body } = req

    const vector = 'CVSS:3.0' + Object.keys(body).reduce((accumulator, key) => {
      return body[key] ? accumulator + `/${key}:${body[key]}` : accumulator
    }, '').toUpperCase();

    const all = cvss.getAll(vector)

    res.status(200).json(all)
  }
}