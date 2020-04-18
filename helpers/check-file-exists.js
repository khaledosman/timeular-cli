const fs = require('fs')

const checkFileExists = async file => {
  // Check if the file exists in the current directory.
  return new Promise(resolve => {
    fs.stat(file, (err) => {
      resolve(!err)
    })
  })
}

module.exports.checkFileExists = checkFileExists
