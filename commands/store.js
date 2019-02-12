'use strict'

const ConfigStore = require('configstore')
const argv = require('minimist')(process.argv.slice(2))
const store = new ConfigStore('tax-totals', {})

const logger = require('../lib/logger')

function getToken () {
  return store.get('token')
}

function checkConfig () {
  if (!store.has('token')) {
    logger.error('please run "$ tax-totals config --token=<YOUR_TOKEN>" before use this command')
    process.exit(1)
  }
}

function config () {
  const { token } = argv

  if (!token) {
    logger.error('The token is required to config!')
    process.exit(1)
  }

  store.clear()
  store.set('token', token)
  logger.success('The configuration has been saved')
}

module.exports = {
  config,
  checkConfig,
  getToken
}
