'use strict'

module.exports = core;

const semver = require('semver');
const colors = require('colors/safe')
const pkg = require('../package.json');
const log = require('@wang-cli-dev/log');
const constant = require('./const');

function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
  } catch (e) {
    log.error(e.message);
  }
}

function checkPkgVersion() {
  // console.log(pkg.version);
  // log();
  log.info('cli', pkg.version)
}

function checkNodeVersion() {
  const currentVersion = process.version;

  const lowestVersion = constant.LOWEST_NODE_VERSION;

  if (semver.gte(lowestVersion, currentVersion)) {
    throw new Error(colors.red(`wang-cli 需要安装${lowestVersion} 以上版本的 Node.js`))
  }
  console.log(process.version);
}
