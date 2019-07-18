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

        if (info != null) {
            if (info.name == undefined || info.version == undefined) {
                //Missing must require info
                logger.warn("Could not load project,because it missing name or version!");
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
    writeTofile(){
        if (project.locked) {
            return "PROJECT_LOCKED";
        }
        if(this.getProjectPath()==null){
            logger.warn("Can't write project info into file,because the path is null!");
            return "PATH_LOST";
        }
        jsonfile.writeFileSync(this.getProjectPath()+'/info.json',project.info)
    }

}