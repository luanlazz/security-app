const axios = require('axios');

module.exports = {
  async getCveById(req, res) {
    const idParam = req.params.id;
    // noinspection RegExpSingleCharAlternation
    const cod = idParam.replace(/(^CVE)( |-)([0-9]{4})( |-)([0-9]{4,})/gm, '$1-$3-$5');
    if (!/^CVE-[0-9]{4}-[0-9]{4,}/gm.test(cod)) {
      return res.status(404).send('Código inválido, por favor confira e tente novamente.');
    }
    const baseUrl = process.env.URL_API_CIRCL || 'https://cve.circl.lu/api/cve/';
    const url = `${baseUrl}/${cod}`;

    axios.get(url)
      .then(response => {
        if (!response.data) {
          res.status(204).send('Código não encontrado, por favor verifique o código e tente novamente.');
        } else {
          const {cwe, id, cvss, impact, msbulletin, references, summary} = response.data;
          res.status(200).json({
            cwe,
            id,
            cvss,
            impact,
            msbulletin,
            references,
            summary
          });
        }
      })
      .catch(() => {
        res.status(500).send('Ocorreu um erro na consulta, tente novamente mais tarde');
      });
  }
};
