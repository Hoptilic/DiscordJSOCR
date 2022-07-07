export = sendRequestToOcrSpace

/**
 * @param {OCRSpaceApiOptions} options available options for the OCR SPACE API
 * @returns {Promise<OCRApiResponse|string>} result
 */
declare function sendRequestToOcrSpace(
  options: OCRSpaceApiOptions
): Promise<OCRApiResponse | string>

declare namespace sendRequestToOcrSpace {
  export { OCRSpaceApiOptions, OCRApiResponse, ParsedResult, Line, Word }
}

type OCRSpaceApiOptions = {
  apiKey: string
  /**
   * path to the local image, pdf or url
   */
  url: string | undefined
  file: import('fs').ReadStream | undefined
  base64Image: string | undefined
  language:
    | 'ara'
    | 'chs'
    | 'cht'
    | 'hrv'
    | 'cze'
    | 'dan'
    | 'dut'
    | 'eng'
    | 'fin'
    | 'fre'
    | 'ger'
    | 'gre'
    | 'hun'
    | 'kor'
    | 'ita'
    | 'jpn'
    | 'pol'
    | 'por'
    | 'rus'
    | 'slv'
    | 'spa'
    | 'swe'
    | 'tur'
    | undefined
  isOverlayRequired: boolean | undefined
  filetype: 'PDF' | 'GIF' | 'PNG' | 'JPG' | 'TIF' | 'BMP' | undefined
  detectOrientation: boolean | undefined
  isCreateSearchablePdf: boolean | undefined
  isSearchablePdfHideTextLayer: boolean | undefined
  scale: boolean | undefined
  isTable: boolean | undefined
  OCREngine: 1 | 2 | undefined
  verbose: boolean | undefined
}

type OCRApiResponse = {
  ParsedResults: ParsedResult[]
  OCRExitCode: number
  IsErroredOnProcessing: boolean
  ProcessingTimeInMilliseconds: string
  SearchablePDFURL: string
  ErrorMessage: string | undefined
  ErrorDetails: string | undefined
}

type ParsedResult = {
  TextOverlay: {
    Lines: Line[]
    HasOverlay: boolean
    Message: string | null
    TextOrientation: string
    FileParseExitCode: number
    ParsedText: string
    ErrorMessage: string
    ErrorDetails: string
  }
}

type Line = {
  Words: Word[]
  MaxHeight: number
  MinTop: number
}

type Word = {
  WordText: string
  Left: number
  Top: number
  Height: number
  Width: number
}
