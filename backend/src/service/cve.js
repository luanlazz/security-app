const axios = require('axios');

module.exports = {
  async getCveById(idCve) {
    // noinspection RegExpSingleCharAlternation
    const cod = idCve.toUpperCase().replace(/(^CVE)( |-)([0-9]{4})( |-)([0-9]{4,})/gm, '$1-$3-$5');

    if (!/^CVE-[0-9]{4}-[0-9]{4,}/gm.test(cod)) {
      throw new Error('Código inválido, por favor confira e tente novamente.');
    }

    const baseUrl = process.env.URL_API_CIRCL || 'https://cve.circl.lu/api/cve/';
    const url = `${baseUrl}/${cod}`;

    return axios.get(url)
      .then(response => {
        if (!response.data) {
          throw new Error('Código não encontrado, por favor verifique o código e tente novamente.');
        } else {
          const {cwe, id, cvss, impact, msbulletin, references, summary } = response.data;
          const cvssVector = response.data["cvss-vector"] || '';

          return {
            cwe,
            id,
            cvss,
            cvssVector,
            impact,
            msbulletin,
            references,
            summary
          };
        }
      })
      .catch(() => {
        throw new Error('Ocorreu um erro na consulta, tente novamente mais tarde');
      });
  }
};
