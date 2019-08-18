/* eslint-disable standard/no-callback-literal */
import logger from '../logger/logger'

const fs = require('fs')
const jsonfile = require('jsonfile')
const { shell } = require('electron').remote
const yaml = require('js-yaml')
const { app } = require('electron').remote
const UglifyJS = require('electron').remote.require('uglify-js')

const mvn = 'mvn'
function projectInfo (path) {
  const projectInfo = path + '/info.json'
  if (!fs.existsSync(projectInfo)) {
    return null
  }
  let info
  try {
    info = jsonfile.readFileSync(projectInfo)
  } catch (e) {
    console.log(e)

    return null
  }
  if (info != null) {
    if (info.name === undefined || info.version === undefined || info.package === undefined) {
      // Missing must require info
      return null
    }
    return info
  }
  return null
}
export default {
  genJavaScript (path) {
    logger.info('[pluginBuilder]Starting generate script')
    const bundle = {}
    const librariesDir = app.getPath('userData') + '/libraries/'
    if (!fs.existsSync(app.getPath('userData') + '/libraries/')) {
      logger.error('[pluginBuilder]Libraries doesn \'t existing, I will quit!')
      return
    }
    let files = fs.readdirSync(librariesDir)
    files.forEach(function (item, index) {
      const stat = fs.lstatSync(librariesDir + item)
      if (stat.isDirectory() === true) {
        if (fs.existsSync(librariesDir + item + '/bundle.js')) {
          bundle[item] = fs.readFileSync(librariesDir + item + '/bundle.js', 'utf8')
        }
      }
    })
    if (bundle === {}) {
      return
    }

    const bundleCode = UglifyJS.minify(bundle, { mangle: false }).code

    // 打包积木代码
    const blocks = {}
    if (!fs.existsSync(path + '/scripts')) {
      logger.error('[pluginBuilder]script doesn \'t existing, I will quit!')
      return
    }
    files = fs.readdirSync(path + '/scripts')
    files.forEach(function (item, index) {
      const stat = fs.lstatSync(path + '/scripts/' + item)
      if (stat.isDirectory() === false) {
        // 获取扩展名
        var ext = item.substring(item.lastIndexOf('.') + 1, item.length)
        if (ext === 'js') {
          blocks[item] = fs.readFileSync(path + '/scripts/' + item, 'utf8')
        }
      }
    })
    if (blocks === {}) {
      return
    }
    console.log(UglifyJS.minify(blocks, { mangle: false }))
    const blockCode = UglifyJS.minify(blocks, { mangle: false }).code
    const jscode = bundleCode + '\n' + blockCode
    // 输出js文件
    fs.writeFileSync(path + '/src/main/resources/bundle.js', jscode)
  },
  genJar (path, callback) {
    // 主要工作:mvn package
    const info = projectInfo(path)
    if (info == null) {
      callback('[CHECK]Invaild project!', false)
      return false
    }
    const cmd = require('shelljs')
    const env = {}
    let encodeing = 'UTF-8'
    if (process.platform === 'win32') {
      encodeing = 'GBK'
    }
    cmd.cd(path)

    env['PLUGIN_NAME'] = info.name
    env['PLUGIN_VERSION'] = info.version
    env['PLUGIN_PACKAGE'] = info.package
    const child = cmd.exec(mvn + ' package', { async: true, encoding: encodeing, env: env }, (code, stdout, stderr) => {
      if (code !== 0) {
        logger.error('[pluginBuilder]Build failed, because the maven non-zero exited!')
        callback(false)
      } else {
        logger.info('[pluginBuilder]Build success!')
        callback(true)
        shell.showItemInFolder(path + '/target/' + info.name + '-' + info.version + '.jar')
      }
    })
    child.stdout.on('data', function (data) {
      logger.info('[pluginBuilder][MVN]' + data)
    })
  },
  genPluginYml (path, callback) {
    // 根据项目信息生成plugin.yml
    const info = projectInfo(path)
    if (info == null) {
      callback('[CHECK]Invaild project!', false)
      return false
    }
    const pluginYml = {}
    pluginYml['name'] = info['name']
    pluginYml['version'] = info['version']
    pluginYml['main'] = info['package'] + '.PluginMain'
    if (info['author'] !== undefined) {
      pluginYml['author'] = info['author']
    }
    if (info['commands'] !== []) {
      pluginYml['commands'] = {}
      for (const command of info['commands']) {
        pluginYml['commands'][command.command] = {
          permission: command.permission
        }
      }
    }
    if (info['permissions'] !== []) {
      pluginYml['permissions'] = {}
      for (const permission of info['permissions']) {
        pluginYml['permissions'][permission.permission] = {
          default: permission.default
        }
      }
    }
    const yml = yaml.dump(pluginYml)
    fs.writeFileSync(path + '/src/main/resources/plugin.yml', yml)
  },
  checkJava () {
    return process.env['JAVA_HOME'] !== undefined
  },
  check (path) {
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
