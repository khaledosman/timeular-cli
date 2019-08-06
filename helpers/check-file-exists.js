const fs = require('fs')

async function checkFileExists (file) {
  // Check if the file exists in the current directory.
  return new Promise((resolve, reject) => {
    fs.stat(file, (err) => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}
module.exports.checkFileExists = checkFileExists
