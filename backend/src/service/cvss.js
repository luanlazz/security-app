const cvss = require('cvss');

module.exports = {
  calculateCvss(body) {
    const { vector } = body

    if (!/^CVSS:3\.0(\/[A-Z]{0,3}:[A-Z])*/gm.test(vector)) {
      throw new Error('Vetor inválido, por favor confira e tente novamente.');
    }

    return cvss.getAll(vector);
  },
};
