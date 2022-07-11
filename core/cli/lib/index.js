'use strict';


module.exports = core;
const path = require('path');
const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const Pkg = require('../package.json');
const log = require('@oh-cli-dev/log');
const constant = require('./const.js');

let args, config;
function core() {
    try {
        // cli 脚手架版本号
        checkPkgVersion();
        // 当前node版本号
        checkNodeVesion();
        // 检查当前启动用户是否为root
        checkRoot();
        // 检查用户主目录
        checkUserHome()
        // 检查入参
        checkInputArgs()
        // 检查环境变量
        checkEnv()
    } catch (error) {
        console.error(error.message)
    };
}

// 检查环境变量
function checkEnv() {
    const dotenv = require('dotenv');
    // 获取到本地的.env文件
    const dotenvPath = path.resolve(userHome, '.env');
    console.log(pathExists(dotenvPath));
    if (pathExists(dotenvPath)) {
        config = dotenv.config({
            path: dotenvPath
        })
    }
    log.verbose('环境变量', config)
}

// 检查入参数
function checkInputArgs() {
    const minimist = require('minimist');
    args = minimist(process.argv.slice(2))
    checkArgs(args);
}

function checkArgs() {
    if (args.debug) {
        process.env.LOG_LEVEL = 'verbose';
    } else {
        process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
    //log.verbose('debug', 'test debug log');
}

// 检查用户主目录是否存在
function checkUserHome() {
    // 直接可以获取到主目录 console.log(userHome); /Users/ohh
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前用户主目录不存在！'));
    }
}

// 检查当前启动项是否为root；如果是 进行降级
function checkRoot() {
    const rootCheck = require('root-check');
    rootCheck()
    console.log(process.getuid());
}
// 检查当前node版本
function checkNodeVesion() {
    // 获取到当前的版本号
    const currentNodeVersion = process.version;
    // 设置最小版本号
    const lowestNodeVersion = constant.LOWEST_NODE_VERSION;

    // 进行对比，小于最小版本号，报错
    if (!semver.gte(currentNodeVersion, lowestNodeVersion)) {
        throw new Error(colors.red(`oh-cli 需要安装 v${lowestNodeVersion} 以上版本的Node.js`))
    }
}
// 检查当前脚手架版本号
function checkPkgVersion() {
    log.info('cli', Pkg.version)
}