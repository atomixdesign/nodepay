#!/usr/bin/env node
process.env = { ...process.env, ...require('./config').globals }

const _argv = require('yargs')
  .usage('Usage: yarn cli <command> [options]')
  .commandDir('commands')
  .demandCommand()
  .help()
  .argv
