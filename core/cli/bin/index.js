#!/usr/bin/env node

const utils = require('@wang-cli-dev/utils')

const importLocal = require('import-local');
if (importLocal(__filename)) {
  require('npmlog').info('cli', '正在使用wang-cli本地')
} else {
  require('../lib/index')(process.argv.slice(2));
}

utils()
console.log(' hello wang-cli');