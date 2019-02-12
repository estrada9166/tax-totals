'use strict'

const path = require('path')
const { expect } = require('chai')
const { spawnSync } = require('child_process')


const { getToken } = require('../commands/store')

const dirPath = path.join(__dirname, '..', 'bin', 'tax-totals.js')

describe('Pogram tests', () => {
  describe('#Program', () => {
    it('Should show the help information', () => {
      const program = spawnSync('node', [dirPath], {
        stdio: 'pipe',
        encoding: 'utf-8'
      })
      
      expect(program.output[1].includes('--help')).to.be.true
      expect(program.output[1].includes('$ tax-totals order --zipcode=46523 --subtotal=1534.00')).to.be.true
    })
  })

  describe('#Config', () => {
    it('Should show error if the token is missing', () => {
      const program = spawnSync('node', [dirPath, 'config'], {
        stdio: 'pipe',
        encoding: 'utf-8'
      })
  
      expect(program.output[2]).to.be.eq('The token is required to config!\n')
    })

    it('Should save the token', () => {
      const program = spawnSync('node', [dirPath, 'config', '--token', 'abc123'], {
        stdio: 'pipe',
        encoding: 'utf-8'
      })
  
      expect(program.output[1]).to.be.eq('The configuration has been saved\n')

      const token = getToken()
      expect(token).to.be.eq('abc123')
    })
  })
  
  describe('#Order', () => {
    it('Should show an error on the console if the zipcode is missing', () => {
      const program = spawnSync('node', [dirPath, 'order'], {
        stdio: 'pipe',
        encoding: 'utf-8'
      })
  
      expect(program.output[2]).to.be.eq('There was an error creating the order: The zipcode value is invalid\n')
    })
  
    it('Should show an error on the console if the zipcode is invalid', () => {
      const program = spawnSync('node', [dirPath, 'order', '--zipcode', 'invalid'], {
        stdio: 'pipe',
        encoding: 'utf-8'
      })
  
      expect(program.output[2]).to.be.eq('There was an error creating the order: The zipcode value is invalid\n')
    })
  
    it('Should show an error on the console if the subtotal is invalid', () => {
      const program = spawnSync('node', [dirPath, 'order', '--zipcode', '75093','--subtotal', '1a'], {
        stdio: 'pipe',
        encoding: 'utf-8'
      })
  
      expect(program.output[2]).to.be.eq('There was an error creating the order: The subtotal value is invalid\n')
    })
  
    it('Should show an error on the console if the subtotal value is missing', () => {
      const program = spawnSync('node', [dirPath, 'order', '--zipcode', '75093','--subtotal'], {
        stdio: 'pipe',
        encoding: 'utf-8'
      })
  
      expect(program.output[2]).to.be.eq('There was an error creating the order: The subtotal value is invalid\n')
    })
  })
})

