"use strict";

module.exports = core;

const path = require("path");
const semver = require("semver");
const colors = require("colors/safe");
const userHome = require("user-home");
const pathExistss = require("path-exists");
const pkg = require("../package.json");
const log = require("@wang-cli-dev/log");
const init = require("@wang-cli-dev/init");
const exec = require("@wang-cli-dev/exec");
const constant = require("./const");
const rootCheck = require("root-check");
const commander = require("commander");

let args;

const program = new commander.Command();

async function core() {
  try {
    await prepare();
    registerCommand();
  } catch (e) {
    log.error(e.message);
  }
}

async function prepare() {
  // checkPkgVersion();
  // checkNodeVersion();
  // checkRoot();
  // checkUserHome();
  // checkInputArgs();
  checkEnv();
  log.verbose("debug", "test debug log!");
  await checkGlobalUpdate();
}

function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage("<command> [options]")
    .version(pkg.version)
    .option("-d, --debug", "是否开启调试模式", false)
    .option("-tp, --targetPath <targetPath>", "是否指定本地调试文件路径", "");

  program
    .command("init [projectName]")
    .option("-f --force", "是否强制初始化项目")
    .action(exec);

  // 开启debug模式
  program.on("option:debug", function () {
    // console.log(program);
    if (this.opts().debug) {
      process.env.LOG_LEVEL = "verbose";
    } else {
      process.env.LOG_LEVEL = "info";
    }
    log.level = process.env.LOG_LEVEL;
    log.verbose("test");
  });
  // 指定targetPath
  program.on("option:targetPath", function () {
    process.env.CLI_TARGET_PATH = this.opts().targetPath;
  });
  // 未知命令监听
  program.on("command:*", function (obj) {
    const availableCommands = program.commands.map((cmd) => cmd.name());
    console.log(colors.red("未知的命令:" + obj[0]));
    if (availableCommands.length) {
      console.log(colors.red("可用命令为:" + availableCommands.join(",")));
    }
  });

  program.parse(process.argv);

  if (program.args && program.args.length < 1) {
    program.outputHelp();
    console.log();
  }
}
async function checkGlobalUpdate() {
  // 1.获取当前版本号和模块名
  const currentVersion = pkg.version;
  const npmName = pkg.name;

  // 2.调用npm API，获取所有版本号
  const {
    getNpmInfo,
    getNpmVersions,
    getNpmSemverVersion,
  } = require("@wang-cli-dev/get-npm-info");

  const data = await getNpmInfo(npmName);

  // 3.提取所有版本号，比对哪些版本号是大于当前版本号

  const versions = await getNpmVersions(npmName);

  const lastVersion = await getNpmSemverVersion(currentVersion, npmName);

  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(
      "更新提示",
      colors.yellow(
        `请手动更新${npmName}, 当前版本:${currentVersion}, 最新版本:${lastVersion}, 更新命令: npm install -g ${npmName}`
      )
    );
  }

  // 4.获取最新版本号，提示用户更新
}

function checkEnv() {
  const dotenv = require("dotenv");
  const dotenvPath = path.resolve(userHome, ".env");
  if (pathExistss(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    });
  }
  createDefaultConfig();
}
function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig["cliHome"] = path.joiin(userHome, process.env.CLI_HOME);
  } else {
    cliConfig["cliHome"] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig["cliHome"];
}
function checkUserHome() {
  if (!userHome || !pathExistss(userHome)) {
    throw new Error(colors.red("当前登录用户主目录不存在！"));
  }
}
function checkRoot() {
  rootCheck(); // 文件降级
  console.log(process.geteuid());
}

function checkPkgVersion() {
  // console.log(pkg.version);
  // log();
  log.info("cli", pkg.version);
}

function checkNodeVersion() {
  const currentVersion = process.version;

  const lowestVersion = constant.LOWEST_NODE_VERSION;

  if (semver.gte(lowestVersion, currentVersion)) {
    throw new Error(
      colors.red(`wang-cli 需要安装${lowestVersion} 以上版本的 Node.js`)
    );
  }
  console.log(process.version);
}
