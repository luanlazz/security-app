const cvss = require('cvss');

module.exports = {
  calculateCvss(body) {
    // TODO: Falta validação de entrada
    const vector = 'CVSS:3.0' + Object.keys(body).reduce((accumulator, key) => {
      return body[key] ? accumulator + `/${key}:${body[key]}` : accumulator;
    }, '').toUpperCase();

    return cvss.getAll(vector);
  },
};
