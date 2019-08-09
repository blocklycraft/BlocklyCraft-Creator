const fs = require("fs");
const jsonfile = require('jsonfile')
const {shell} = require('electron').remote
const yaml = require("js-yaml");
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
    buildPlugin(path, callback) {

    },
    genJavaScript(path, callback) {

    },
    genJar(path, callback) {
        //主要工作:mvn package
        let info = projectInfo(path)
        if (info == null) {
            callback('[CHECK]Invaild project!',false)
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
        let child = cmd.exec(mvn + " package", { async: true, encoding: encodeing,env:env }, (code, stdout, stderr) => {
            if (code != 0) {
                callback("[ERROR]Build failed!",false);
                return;
            } else {
                callback("[INFO]Build Success!",true);
                shell.showItemInFolder(path + "/target/" + info.name + "-" + info.version + ".jar")
            }
        })
        child.stdout.on('data', function (data) {
            callback('[MAVEN]' + data)
        })


    },
    genPluginYml(path,callback) {
        //根据项目信息生成plugin.yml
        let info = projectInfo(path)
        if (info == null) {
            callback('[CHECK]Invaild project!',false)
            return false;
        }
        let pluginYml = {}
        pluginYml['name'] = info['name'];
        pluginYml['version'] = info['version'];
        pluginYml['main'] = info['package']+".PluginMain"
        if(info['author']!=undefined){
            pluginYml['author'] = info['author'];
        }
        if(info['commands']!=[]){
            pluginYml['commands'] = {}
            for(let command of info['commands']){
                pluginYml['commands'][command.command] = {
                    permission:command.permission
                }
            }
        }
        if(info['permissions']!=[]){
            pluginYml['permissions'] = {}
            for(let permission of info['permissions']){
                pluginYml['permissions'][permission.permission] = {
                    default:permission.default
                }
            }
        }
        let yml = yaml.dump(pluginYml)
        fs.writeFileSync(path + '/src/main/resources/plugin.yml',yml);
    },
    checkJava() {
        return process.env['JAVA_HOME'] != undefined
    },

}