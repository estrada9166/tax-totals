#!/usr/bin/env node

'use strict'

const program = require('commander')
const order = require('../commands/order')
const { config } = require('../commands/store')

program
  .version('0.0.1')
  .option('--zipcode', 'Zipcode to get the proper tax rate.')
  .option('--subtotal', 'Subtotal to calculate total cost with tax rate.')
  .option('--token', 'Authorization token to request api.')

program
  .command('order [zipcode] [subtotal]')
  .description('Tax, verify, and return a given order.')
  .action(order)

program
  .command('config [token]')
  .description('Set the used token to make HTTP requests.')
  .action(config)

program.on('--help', function () {
  console.log('')
  console.log('Examples:')
  console.log('  $ tax-totals order --zipcode=46523 --subtotal=1534.00')
})

// If there are no arguments, show the help.
if (!process.argv.slice(2).length) {
  program.outputHelp()
  process.exit(1)
}

program.parse(process.argv)

module.exports = program