const Papa = require('papaparse')

export const jsonToCsv = async (json) => {

    Papa.parse(url, {
      download: true,
      header: true,
      complete: (results) => {
        resolve(parseCsv(results['data']));
      }
    })
}

export const jsonToCsv = async (json) => {

    Papa.parse(url, {
      download: true,
      header: true,
      complete: (results) => {
        resolve(parseCsv(results['data']));
      }
    })
}