import Axios from 'axios'

export const getBlob = async (url) => {
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

export const setTypeInBase64 = (base64, type) => {
  return base64.replace(/^data:.+;base64,/, `data:${type};base64,`)
}

export const forceDownload = async (url, fileName) => {
  const tag = document.createElement('a')
  tag.href = url
  tag.setAttribute('download', '')
  tag.setAttribute('title', fileName)
  tag.target = '_blank'
  document.body.appendChild(tag)
  tag.click()
  document.body.removeChild(tag)
}
