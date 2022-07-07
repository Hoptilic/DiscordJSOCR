# ocr-space-api-alt2

Allow to access [ORC.SPACE API](https://ocr.space/ocrapi) to send images and get the embedded text.

More Details: https://ocr.space/ocrapi.

**IMPORTANT**:

The OCR is provided by [OCR.SPACE](https://ocr.space/). I don't have anything with them, I just want to help reworking and sharing this library.

## Main changes

1. The original library was using [request](https://github.com/request/request#readme), but since it's deprecated, I saw the necessity to migrate from it. Now I'm currently using [axios](https://github.com/axios/axios#readme) to perform the request.

2. Since [axios](https://github.com/axios/axios#readme) doesn't support `form data` request, I've used [query-string](https://github.com/sindresorhus/query-string#readme).

## Installation

### First - Register and Get your API key

Get you API key at this [link](https://ocr.space/ocrapi). Just follow their steps.

### Second - Install npm package

```console
  npm i ocr-space-api-alt2
```

```console
  yarn add ocr-space-api-alt2
```

## Usage example

You can see and example at the folder [`example`](/example/example.js).

```javascript
const ocrSpaceApi = require('ocr-space-api-alt2')

const options =  { 
  apikey: '<YOUR API KEY HERE>',
  filetype: 'png',
  verbose: true,
  url: `${__dirname}/loveText.jpg`
}

const getText = async () => {
  try {
    const result = await ocrSpaceApi(options)

    console.log({ result })
  } catch (error) {
    console.error(error)
  }
}

getText()
```

### Options

The available options are an adaptation from the [docs](https://ocr.space/ocrapi#post).

| key | Value | Description |
|--|--|--|
| apikey | [Required] - String <br/> API key from OCR space API| Get you API key at this [link](https://ocr.space/ocrapi). |
| url | [Required] - String <br/> | Url that points to file you want to get its text from. It can be a url (starting in http), a base64 image or a local file |
| language | [Optional] - String <br/> Arabic=ara<br/> Bulgarian=bul<br/> Chinese(Simplified)=chs<br/> Chinese(Traditional)=cht<br/> Croatian = hrv<br/> Czech = cze<br/> Danish = dan<br/> Dutch = dut<br/> English = eng<br/> Finnish = fin<br/> French = fre<br/> German = ger<br/> Greek = gre<br/> Hungarian = hun<br/> Korean = kor<br/> Italian = ita<br/> Japanese = jpn<br/> Polish = pol<br/> Portuguese = por<br/> Russian = rus<br/> Slovenian = slv<br/> Spanish = spa<br/> Swedish = swe<br/> Turkish = tur | Language used for OCR. If no language is specified, English `eng` is taken as default.<br/><br/> IMPORTANT: The language code has always `3-letters` (not 2). So it is "eng" and not "en".<br/><br/> [Engine2](https://ocr.space/ocrapi#ocrengine) has automatic Western language detection, so this value will be ignored. |
| isOverlayRequired |	[Optional] - Boolean | 	Default = `False`<br/> If true, returns the coordinates of the bounding boxes for each word. If false, the OCR'ed text is returned only as a text block (this makes the JSON reponse smaller). Overlay data can be used, for example, to show [text over the image](https://ocr.space/english). |
| filetype | [Optional] - String <br/> Available values: PDF, GIF, PNG, JPG, TIF, BMP | Overwrites the automatic file type detection based on [content-type](https://ocr.space/ocrapi#contenttype). Supported image file formats are png, jpg (jpeg), gif, tif (tiff) and bmp. For document ocr, the api supports the Adobe PDF format. Multi-page TIFF files are supported. |
| detectOrientation | [Optional] - Boolean | If set to true, the api autorotates the image correctly and sets the `TextOrientation` parameter in the JSON response. If the image is not rotated, then TextOrientation=0, otherwise it is the degree of the rotation, e. g. "270". |
| isCreateSearchablePdf | [Optional] - Boolean | Default = `False` <br/> If true, API generates a [searchable PDF](https://ocr.space/ocrapi#searchablepdf). This parameter automatically sets isOverlayRequired = true. |
| isSearchablePdfHideTextLayer | [Optional] - Boolean | Default = `False`. <br/> If true, the text layer is hidden (not visible). |
| scale | [Optional] - Boolean | Default = `False`. <br/>If set to true, the api does some internal upscaling. This can improve the OCR result significantly, especially for low-resolution PDF scans. Note that the [front page demo](https://ocr.space/) uses scale=true, but the API uses scale=false by default. See also this [OCR forum post](https://forum.ui.vision/t/difference-between-online-ocr-and-ocr-api/980/2). |
| isTable | [Optional] - Boolean | If set to true, the OCR logic makes sure that the parsed text result is always returned line by line. This switch is recommended for [table OCR](https://ocr.space/tablerecognition), [receipt OCR](https://ocr.space/receiptscanning), invoice processing and all other type of input documents that have a table like structure. |
| OCREngine | [Optional] - Number <br/> Available values: 1, 2 | Engine 1 is default. See [OCR Engines](https://ocr.space/ocrapi#ocrengine). |
| verbose | [Optional] - Boolean | Wether or not you want the full response from de OCR API or just the text that was gotten. |

## Authors

- **Denis** - _Initial Work_ - _Initial Documentation_ - [dennnisk](https://github.com/dennnisk).
- **Anthony Luzquiños** - _Rework_ - [AnthonyLzq](https://github.com/AnthonyLzq).

**Important**

This package was not fully tested, and every contribution will be appreciated.
