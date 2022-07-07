const fs = require('fs')
const axios = require('axios').default
const FormData = require('@postman/form-data')

const OCR_SPACE_DEFAULT_API = 'https://api.ocr.space/parse/image'

/**
 * @param {string} image
 * @returns {'url'|'base64Image'|'file'} file type (url, base 64 image or other file type)
 */
const detectInput = image => {
  if (image.startsWith('http')) return 'url'
  if (image.startsWith('data')) return 'base64Image'

  return 'file'
}

/**
 * @param {OCRSpaceApiOptions} options available options for the OCR SPACE API
 * @returns {Promise<OCRApiResponse|string>} result
 */
const sendRequestToOcrSpace = async options => {
  const {
    apiKey,
    url,
    language,
    isOverlayRequired,
    filetype,
    detectOrientation,
    isCreateSearchablePdf,
    isSearchablePdfHideTextLayer,
    scale,
    isTable,
    OCREngine,
    verbose
  } = options

  if (!apiKey) throw new Error('apiKey must be provided!')

  if (!url) throw new Error('The image (or pdf) url is mandatory!')
  if (typeof url !== 'string') throw new Error('The url must be a string!')

  const data = new FormData()
  const inputType = detectInput(url)

  switch (inputType) {
    case 'file':
      data.append('file', fs.createReadStream(url))
      break
    case 'url':
    case 'base64Image':
      data.append(inputType, url)
  }

  language && data.append('language', language || 'eng')
  isOverlayRequired &&
    data.append('isOverlayRequired', String(isOverlayRequired))
  filetype && data.append('filetype', filetype)
  detectOrientation &&
    data.append('detectOrientation', String(detectOrientation))
  isCreateSearchablePdf &&
    data.append('isCreateSearchablePdf', String(isCreateSearchablePdf))
  isSearchablePdfHideTextLayer &&
    data.append(
      'isSearchablePdfHideTextLayer',
      String(isSearchablePdfHideTextLayer)
    )
  scale && data.append('scale', String(scale))
  isTable && data.append('isTable', String(isTable))
  OCREngine && data.append('OCREngine', String(OCREngine))

  const result = await axios.post(OCR_SPACE_DEFAULT_API, data, {
    headers: {
      apikey: apiKey,
      ...data.getHeaders()
    },
    method: 'post',
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    responseType: 'json'
  })

  if (verbose) return result.data
  else return result.data.ParsedResults[0].ParsedText
}

module.exports = sendRequestToOcrSpace

/**
 * @typedef {Object} OCRSpaceApiOptions
 * @property {string} apiKey
 * @property {string|undefined} url path to the local image, pdf or url
 * @property {fs.ReadStream|undefined} file
 * @property {string|undefined} base64Image
 * @property {'ara'|'chs'|'cht'|'hrv'|'cze'|'dan'|'dut'|'eng'|'fin'|'fre'|'ger'|'gre'|'hun'|'kor'|'ita'|'jpn'|'pol'|'por'|'rus'|'slv'|'spa'|'swe'|'tur'|undefined} language
 * @property {boolean|undefined} isOverlayRequired
 * @property {'PDF'|'GIF'|'PNG'|'JPG'|'TIF'|'BMP'|undefined} filetype
 * @property {boolean|undefined} detectOrientation
 * @property {boolean|undefined} isCreateSearchablePdf
 * @property {boolean|undefined} isSearchablePdfHideTextLayer
 * @property {boolean|undefined} scale
 * @property {boolean|undefined} isTable
 * @property {1|2|undefined} OCREngine
 * @property {boolean|undefined} verbose
 */

/**
 * @typedef {Object} OCRApiResponse
 * @property {ParsedResult[]} ParsedResults
 * @property {number} OCRExitCode
 * @property {boolean} IsErroredOnProcessing
 * @property {string} ProcessingTimeInMilliseconds
 * @property {string} SearchablePDFURL
 * @property {string|undefined} ErrorMessage
 * @property {string|undefined} ErrorDetails
 */

/**
 * @typedef {Object} ParsedResult
 * @property {Object} TextOverlay
 * @property {Line[]} TextOverlay.Lines
 * @property {boolean} TextOverlay.HasOverlay
 * @property {string|null} TextOverlay.Message
 * @property {string} TextOverlay.TextOrientation
 * @property {number} TextOverlay.FileParseExitCode
 * @property {string} TextOverlay.ParsedText
 * @property {string} TextOverlay.ErrorMessage
 * @property {string} TextOverlay.ErrorDetails
 */

/**
 * @typedef {Object} Line
 * @property {Word[]} Words
 * @property {number} MaxHeight
 * @property {number} MinTop
 */

/**
 * @typedef {Object} Word
 * @property {string} WordText
 * @property {number} Left
 * @property {number} Top
 * @property {number} Height
 * @property {number} Width
 */
