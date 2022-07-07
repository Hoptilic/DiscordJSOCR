/* eslint-disable node/no-path-concat */
const ocrSpaceApi = require('../lib')

const options = {
  apiKey: 'helloworld',
  filetype: 'jpg',
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
