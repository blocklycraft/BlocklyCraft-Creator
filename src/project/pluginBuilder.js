const fs = require("fs");
const jsonfile = require('jsonfile')
const { shell } = require('electron').remote
const yaml = require("js-yaml");
const { app } = require("electron").remote;
let UglifyJS = require('electron').remote.require("uglify-js");

import logger from "../logger/logger";

let mvn = 'mvn'
function projectInfo(path) {
    let json_p = path + '/info.json'
    console.log(json_p)
    if (!fs.existsSync(json_p)) {
        return null
    }
    let info;
    try {
        info = jsonfile.readFileSync(json_p)
    } catch (e) {
        console.log(e)
        return null
    }
    if (info != null) {
        if (info.name == undefined || info.version == undefined || info.package == undefined) {
            //Missing must require info
            return null
        }
        return info
    }
    return null
}
export default {
    genJavaScript(path) {
        logger.info('[pluginBuilder]Starting generate script')
        let bundle = {};
        let libraries_dir = app.getPath("userData") + "/libraries/";
        if (!fs.existsSync(app.getPath("userData") + "/libraries/")) {
            logger.error('[pluginBuilder]Libraries doesn \'t existing, I will quit!')
            return;
        }
        let files = fs.readdirSync(libraries_dir);
        files.forEach(function (item, index) {
            let stat = fs.lstatSync(libraries_dir + item);
            if (stat.isDirectory() === true) {
                if (fs.existsSync(libraries_dir + item + "/bundle.js")) {
                    bundle[item] = fs.readFileSync(libraries_dir + item + "/bundle.js", "utf8")
                }
            }
        });
        if (bundle == {}) {
            return;
        }

        let bundle_code = UglifyJS.minify(bundle, { mangle: false }).code;

        //打包积木代码
        let blocks = {}
        if (!fs.existsSync(path + '/scripts')) {
            logger.error('[pluginBuilder]script doesn \'t existing, I will quit!')
            return;
        }
        files = fs.readdirSync(path + '/scripts');
        files.forEach(function (item, index) {
            let stat = fs.lstatSync(path + '/scripts/' + item);
            if (stat.isDirectory() === false) {
                //获取扩展名
                var ext = item.substring(item.lastIndexOf(".") + 1, item.length);
                if (ext === 'js') {
                    blocks[item] = fs.readFileSync(path + '/scripts/' + item, "utf8")
                }
            }
        });
        if (blocks == {}) {
            return;
        }
        console.log(UglifyJS.minify(blocks, { mangle: false }))
        let block_code = UglifyJS.minify(blocks, { mangle: false }).code;
        let jscode = bundle_code + '\n' + block_code;
        //输出js文件
        fs.writeFileSync(path + '/src/main/resources/bundle.js', jscode)

    },
    genJar(path, callback) {
        //主要工作:mvn package
        let info = projectInfo(path)
        if (info == null) {
            callback('[CHECK]Invaild project!', false)
            return false;
        }
        let cmd = require('shelljs');
        let env = {}
        let encodeing = 'UTF-8'
        if (process.platform === 'win32') {
            encodeing = 'GBK'
        }
        cmd.cd(path)

        env['PLUGIN_NAME'] = info.name;
        env['PLUGIN_VERSION'] = info.version;
        env['PLUGIN_PACKAGE'] = info.package;
        let child = cmd.exec(mvn + " package", { async: true, encoding: encodeing, env: env }, (code, stdout, stderr) => {
            if (code != 0) {
                logger.error('[pluginBuilder]Build failed, because the maven non-zero exited!')
                callback(false);
            } else {
                logger.info('[pluginBuilder]Build success!')
                callback(true);
                shell.showItemInFolder(path + "/target/" + info.name + "-" + info.version + ".jar")
            }
        })
        child.stdout.on('data', function (data) {
            logger.info('[pluginBuilder][MVN]' + data)
        })


    },
    genPluginYml(path, callback) {
        //根据项目信息生成plugin.yml
        let info = projectInfo(path)
        if (info == null) {
            callback('[CHECK]Invaild project!', false)
            return false;
        }
        let pluginYml = {}
        pluginYml['name'] = info['name'];
        pluginYml['version'] = info['version'];
        pluginYml['main'] = info['package'] + ".PluginMain"
        if (info['author'] != undefined) {
            pluginYml['author'] = info['author'];
        }
        if (info['commands'] != []) {
            pluginYml['commands'] = {}
            for (let command of info['commands']) {
                pluginYml['commands'][command.command] = {
                    permission: command.permission
                }
            }
        }
        if (info['permissions'] != []) {
            pluginYml['permissions'] = {}
            for (let permission of info['permissions']) {
                pluginYml['permissions'][permission.permission] = {
                    default: permission.default
                }
            }
        }
        let yml = yaml.dump(pluginYml)
        fs.writeFileSync(path + '/src/main/resources/plugin.yml', yml);
    },
    checkJava() {
        return process.env['JAVA_HOME'] != undefined
    },
    check(path) {
        if (!fs.existsSync(path + '/pom.xml')) {
            console.log(path + '/pom.xml')
            return false
        }
        if (!fs.existsSync(path + '/info.json')) {
            console.log(path + '/info.json')
            return false
        }
        if (!fs.existsSync(path + '/src/main/resources')) {
            console.log(path + '/src/main/resources')
            return false
        }
        return true

    }

}