const path = require('path')
const fs = require('fs')
const package = require('./package.json')

function getFilterFilesPath(directoryList) {
	function _getFilterFilesPath(dir) {
		let result = []
		const dirPath = path.resolve(__dirname, dir)
		const files = fs.readdirSync(dirPath)

		files.forEach(file => {
			const filePath = dir + '/' + file
			if (fs.statSync(filePath).isDirectory()) {
				result = result.concat(_getFilterFilesPath(filePath))
			} else {
				return result.push(filePath)
			}
		})
		return result
	}

	let result = []
	directoryList.forEach((dir) => {
		result = result.concat(_getFilterFilesPath(dir))
	})
	return result
}

const filesPath = getFilterFilesPath([
	'./example/dev-bundle',
]).filter((filePath) => {
	return filePath.endsWith('.html')
})

fs.writeFileSync('./index.html', `
  <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${package.name}</title>
      <style>
        a {
          display: inline-block;
          margin-bottom: 10px;
        }
      </style>
    </head>

    <body>
      ${filesPath.map((filePath) => {
	return `<div><a href="${filePath}" target="_blank">${filePath}</a></div>`
}).join('')
	}
    </body>
  </html>
`)
