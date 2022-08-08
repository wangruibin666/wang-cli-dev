'use strict'

module.exports = core;

const path = require('path');
const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExistss = require('path-exists');
const pkg = require('../package.json');
const log = require('@wang-cli-dev/log');
const constant = require('./const');
const rootCheck = require('root-check');

let args;

function core() {
  try {
    // checkPkgVersion();
    // checkNodeVersion();
    // checkRoot();
    // checkUserHome();
    checkInputArgs();
    checkEnv();
    log.verbose('debug', 'test debug log');
  } catch (e) {
    log.error(e.message);
  }
}
function checkGlobalUpdate() {
  // 1.获取当前版本号和模块名
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // 2.调用npm API，获取所有版本号

  // 3.提取所有版本号，比对哪些版本号是大于当前版本号

  // 4.获取最新版本号，提示用户更新
}

function checkEnv() {
  const dotenv = require('dotenv');
  const dotenvPath = path.resolve(userHome, '.env');
  if (pathExistss(dotenvPath)) {
    dotenv.config({
      path: dotenvPath
    });
  }
  createDefaultConfig();
  log.verbose('环境变量', process.env.CLI_HOME_PATH)
  
}
function createDefaultConfig() {
  const cliConfig = {
    home: userHome
  };
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.joiin(userHome, process.env.CLI_HOME);
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
  }
  process.env.CLI_HOME_PATH = cliConfig['cliHome'];
}
function checkInputArgs() {
  const minimist = require('minimist');
  args = minimist(process.argv.slice(2));
  checkArgs();
}
function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose';
  } else {
    process.env.LOG_LEVEL = 'info';
  }
  log.level = process.env.LOG_LEVEL;
}
function checkUserHome() {
  if (!userHome || !pathExistss(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在！'));
  }
}
function checkRoot() {
  
  rootCheck(); // 文件降级
  console.log(process.geteuid());
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
