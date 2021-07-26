import Axios from 'axios'

export const getFile = async (url) => {
  return await Axios.get(`${url}`, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Headers': '*'
    },
    responseType: 'blob',
    crossDomain: true
  })
}

