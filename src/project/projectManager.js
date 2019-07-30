const jsonfile = require('jsonfile')
const fs = require("fs");
import logger from "../logger/logger"
let project = {
    path: null,
    locked: false,
    info: {
        name: null,
        author: null,
        version: null,
        blocks: []
    }
}

export default {
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
            if (info.name == undefined || info.version == undefined || info.blocks == undefined) {
                //Missing must require info
                logger.warn("Could not load project,because it missing name, version or blocks!");
                return "MISSING_INFO"
            }
            project.info = info;
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
        for(let block of project.info.blocks){
            if(block == name){
                project.info.blocks.splice(index,1);
            }
            index++;
        }
        this.writeTofile();
        //同时删除文件
        if(fs.existsSync(this.getProjectPath() + '/blocks/' + name + '.block')){
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
        fs.writeFileSync(this.getProjectPath() + '/blocks/' + name + '.block', '');

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
                fs.renameSync(this.getProjectPath() + '/blocks/' + name + '.block',this.getProjectPath() + '/blocks/' + newname + '.block')
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
    }


}