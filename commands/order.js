'use strict'

const argv = require('minimist')(process.argv.slice(2))
const got = require('got')
const FormData = require('form-data')

const { checkConfig, getToken } = require('./store')

const logger = require('../lib/logger')

async function order () {
  try {
    checkConfig()
    const token = getToken()
    const baseUrl = 'https://deft-cove-227620.appspot.com/api'
    let { zipcode, subtotal } = argv

    // Validate that the zipcode is a valid number, it can be passed as string or int.
    if (isNaN(zipcode) || typeof zipcode === "boolean") {
      throw new Error('The zipcode value is invalid')
    }

    // Validate that the subtotal is a valid number, it can be passed as string or int.
    if (isNaN(subtotal) || typeof subtotal === "boolean") {
      throw new Error('The subtotal value is invalid')
    }

    zipcode = zipcode.toString()
    subtotal = subtotal.toString()

    const taxResponse = await got(`${baseUrl}/tax?zipcode=${zipcode}`, {
      headers: {
        Authorization: `Basic ${token}`
      }
    })

    const tax = JSON.parse(taxResponse.body)

    const taxTotal = parseFloat(subtotal) * (parseFloat(tax.tax_rate) / 100)
    const total = parseFloat(subtotal) + taxTotal

    const form = new FormData()
    form.append('zipcode', zipcode)
    form.append('tax_rate', tax.tax_rate)
    form.append('sub_total', parseFloat(subtotal).toFixed(2))
    form.append('tax_total', parseFloat(taxTotal).toFixed(2))
    form.append('total', parseFloat(total).toFixed(2))

    const orderResponse = await got.post(`${baseUrl}/order`, {
      headers: {
        Authorization: `Basic ${token}`
      },
      body: form
    })

    const order = JSON.parse(orderResponse.body)
    if (order.status_code > 0) {
      throw new Error(order.status_message)
    }

    logger.success(`Success: ${order.status_message} with status_code ${order.status_code}`)
  } catch (err) {
    logger.error(`There was an error creating the order: ${err.message}`)
    process.exit(1)
  }
}

module.exports = order
