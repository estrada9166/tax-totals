'use strict'

const chalk = require('chalk')

function error (msg) {
  console.error(chalk.red(msg))
}

function success (msg) {
  console.log(chalk.green(msg))
}

module.exports = {
  error: error,
  success: success
}
