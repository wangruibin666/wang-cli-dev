"use strict";

const Package = require("@wang-cli-dev/package");

function exec() {
  const pkg = new Package();
  console.log(process.env.CLI_TARGET_PATH);
  console.log(process.env.CLI_HOME_PATH);
}

module.exports = exec;
