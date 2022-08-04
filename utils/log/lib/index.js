'use strict';

const log = require('npmlog');
log.level = process.env.LOG_LEVEL || 'info';
log.heading = 'wang';
// log.headingStyle = {fg: 'white', bg: 'black'}
log.addLevel('success', 2000, {fg: 'green', bold: true});

module.exports = log;
