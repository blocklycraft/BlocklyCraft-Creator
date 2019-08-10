const jsonfile = require('jsonfile')
const fs = require("fs");
import logger from "../logger/logger"
let project = {
    path: null,
    locked: false,
    info: {}
}

export default {
    createProject(path, name) {
        //此方法不会更改当前打开的项目
        if (fs.existsSync(path)) {
            if (fs.lstatSync(path).isDirectory()) {
                if (fs.readdirSync(path).length != 0) {
                    console.log(fs.readdirSync(path).length)
                    //路径已经存在且不为空，不能创建项目
                    return false;
                }
            }
        } else {
            fs.mkdirSync(path);
        }

        let project_info = {
            name: name,
            version: '1.0.0',
            blocks: []
        }
        fs.writeFileSync(path + '/info.json', JSON.stringify(project_info))
        return true
    },
    getProjectPath() {
        return project.path;
    },
    openProject(path) {
        if (project.locked) {
            return "PROJECT_LOCKED";
        }
        this.unloadProject();

        //Now load project
        project.path = path;
        let result = this.loadProjectInfo();
        if (result != "SUCCESS") {
            //fallback
            this.unloadProject();

        }
        project.locked = false;
        return result;
    },
    getProjectInfo() {
        return project.info;
    },
    loadProjectInfo() {
        let json_p = project.path + '/info.json'
        if (!fs.existsSync(json_p)) {
            logger.warn("File not found:" + json_p);
            return "MISSING_INFO"
        }

        let info;
        try {
            info = jsonfile.readFileSync(json_p)
        } catch (e) {
            logger.error(e);
            return "MISSING_INFO"
        }

        if (info != null) {
            if (info.name == undefined || info.version == undefined || info.package == undefined) {
                //Missing must require info
                logger.warn("Could not load project,because it missing name, version or package!");
                return "MISSING_INFO"
            }
            project.info = info;
            this.fixUp()
            return "SUCCESS"
        }
        logger.warn("Could not load project,because it missing name or version!");
        return "MISSING_INFO"
    },
    unloadProject() {
        if (project.locked) {
            return "PROJECT_LOCKED";
        }
        project.locked = true;
        //First, unload current project
        //Make sure call this func after 'project-unload' event.
        project.path = null;
        project.info = {}
        project.locked = false;
        return "SUCCESS"
    },
    writeTofile() {
        if (project.locked) {
            return "PROJECT_LOCKED";
        }
        if (this.getProjectPath() == null) {
            logger.warn("Can't write project info into file,because the path is null!");
            return "PATH_LOST";
        }
        jsonfile.writeFileSync(this.getProjectPath() + '/info.json', project.info)
    },
    deleteBlock(name) {
        let index = 0;
        for (let block of project.info.blocks) {
            if (block == name) {
                project.info.blocks.splice(index, 1);
            }
            index++;
        }
        this.writeTofile();
        //同时删除文件
        if (fs.existsSync(this.getProjectPath() + '/blocks/' + name + '.block')) {
            fs.unlinkSync(this.getProjectPath() + '/blocks/' + name + '.block');
        }
    },
    addBlock(name) {
        let re = /^[\u4E00-\u9FA5A-Za-z0-9_\-]+$/
        if (!re.test(name)) {
            logger.warn("invaild name");
            return;
        }
        for (let block of project.info.blocks) {
            if (block == name) {
                logger.warn("Could not add block,beacuse is already exists!");
                return;
            }
        }
        //创建对应的文件
        this.mkdir()
        if (fs.existsSync(this.getProjectPath() + '/blocks/' + name + '.block')) {
            fs.unlinkSync(this.getProjectPath() + '/blocks/' + name + '.block');
        }
        fs.writeFileSync(this.getProjectPath() + '/blocks/' + name + '.block', '<xml></xml>');

        project.info.blocks.push(name);
        this.writeTofile();
    },
    renameBlock(name, newname) {
        let re = /^[\u4E00-\u9FA5A-Za-z0-9_\-]+$/
        if (!re.test(name)) {
            logger.warn("invaild name");
            return;
        }
        let index = 0;
        for (let block of project.info.blocks) {
            if (block == name) {
                project.info.blocks[index] = newname;
                //重命名对应文件
                fs.renameSync(this.getProjectPath() + '/blocks/' + name + '.block', this.getProjectPath() + '/blocks/' + newname + '.block')
            }
            index++;
        }

        this.writeTofile();
    },
    getBlockList() {
        return project.info.blocks;
    },
    mkdir() {
        if (!fs.existsSync(this.getProjectPath() + '/blocks')) {
            fs.mkdirSync(this.getProjectPath() + '/blocks');
        }
        if (!fs.existsSync(this.getProjectPath() + '/scripts')) {
            fs.mkdirSync(this.getProjectPath() + '/scripts');
        }
    },
    fixUp() {
        //修正项目信息中的错误(如字段缺失)
        if (project.info === {}) {
            //没打开项目....
            return;
        }
        if (project.info.blocks == undefined) {
            project.info.blocks = [];
        }
        if (project.info.commands == undefined) {
            project.info.commands = []
        }
        if (project.info.permissions == undefined) {
            project.info.permissions = []
        }
        if (project.info.package == undefined) {
            project.info.package = ''
        }
        this.writeTofile()
    },
    getCommands() {
        return project.info.commands;
    },
    getPermissions() {
        return project.info.permissions;
    },
    deleteCommand(command) {
        let index = 0;
        for (let cmd of project.info.commands) {
            if (cmd.command === command) {
                project.info.commands.splice(index, 1);
                break;
            }
            index++;
        }
        this.writeTofile()
    },
    deletePermission(permission) {
        let index = 0;
        for (let per of project.info.permissions) {
            if (per.permission === permission) {
                project.info.permissions.splice(index, 1);
                break;
            }
            index++;
        }
        this.writeTofile()
    },
    changeCommand(command, data) {
        let index = 0
        for (let cmd of project.info.commands) {
            if (cmd.command === command) {
                project.info.commands[index].command = data.command
                project.info.commands[index].permission = data.permission
                this.writeTofile()
                return;
            }
            index++;
        }
        //没有的话，新建喽
        this.addCommand(data)

    },
    changePermission(permission, data) {
        let index = 0
        for (let per of project.info.permissions) {
            if (per.permission === permission) {
                project.info.permissions[index].permission = data.permission;
                project.info.permissions[index].default = data.default;
                this.writeTofile()
                return
            }
            index++;
        }
        this.addPermission(data)

    },
    addCommand(command) {
        for (let cmd of project.info.commands) {
            if (command.command === cmd.command) {
                return;
            }
        }
        project.info.commands.push({command:command.command,permission:command.permission})
        this.writeTofile()
    },
    addPermission(permission) {
        for (let per of project.info.permissions) {
            if (permission.permission === per.permission) {
                return;
            }
        }
        project.info.permissions.push({permission:permission.permission,default:permission.default})
        this.writeTofile()
    }
}