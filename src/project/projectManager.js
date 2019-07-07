const jsonfile = require('jsonfile')
const fs = require("fs");
import logger from "../logger/logger"
let project = {
    path: null,
    locked: false,

    info: {
        name: null,
        author: null,
        version: null
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
        console.dir(info)
        if (info != null) {
            if (info.name == undefined || info.version == undefined) {
                //Missing must require info
                logger.warn("Could not load project,because it missing name or version!");
                return "MISSING_INFO"
            }
            project.info.name = info.name;
            project.info.version = info.version;
            if (info.author != undefined) {
                project.info.author = info.author
            }
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
        //Make sure use this func after 'project-unload' event.
        project.path = null;
        project.info = {
            name: null,
            author: null,
            version: null
        }
        project.locked = false;
        return "SUCCESS"
    }

}