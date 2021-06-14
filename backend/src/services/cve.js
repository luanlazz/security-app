const axios = require('axios')

module.exports = {
  async getCveById(req, res) {
    const idParam = req.params.id
    const cod = idParam.replace(/(^CVE)(\ |\-)([0-9]{4})(\ |\-)([0-9]{4,})/gm, '$1-$3-$5')
    if (!/^CVE-[0-9]{4}-[0-9]{4,}/gm.test(cod)) {
      return res.status(404).send('Código inválido, por favor confira e tente novamente')
    }
    const url = `${process.env.URL_API_CIRCL}/${cod}`

    axios.get(url)
      .then(response => {
        if (!response.data) {
          res.status(204).send()
        } else {
          const { cwe, id, cvss, impact, msbulletin, references, summary } = response.data
          res.status(200).json({
            cwe,
            id,
            cvss,
            impact,
            msbulletin,
            references,
            summary
          })
        }
      })
      .catch(err => {
        res.status(500).send('Ocorreu um erro na consulta, tente novamente mais tarde')
      })
  }
}