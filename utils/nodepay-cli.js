#!/usr/bin/env node

const _argv = require('yargs')
  .usage('Usage: yarn cli <command> [options]')
  .commandDir('commands')
  .demandCommand()
  .showHelp()
  .argv
