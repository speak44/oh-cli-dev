'use strict';



const log = require('npmlog');
log.level = process.env.LOG_LEVEL ? proccess.env.LOG_LEVEL : 'info'; // 判断debug模式
log.heading = 'oh-cli'; // 修改前缀
log.addLevel('success', 2000, {fg: 'green', both: true}); // 添加自定义命令

module.exports = log;