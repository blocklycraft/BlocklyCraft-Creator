const Downloader = require("filedownloader");
const {app} = require('electron').remote;
let fs = require("fs");
let unzip = require("unzip");

export default {
    buildPlugin(path){

    },
    genJavaScript(path){

    },
    genJar(path){
        //主要工作:mvn package
        let shell = require('shelljs');
        if(shell.which('mvn')){
            //用户没有安装maven,下载一个maven.....

        }

    },
    genPluginYml(path){

    },
    checkMaven(){

    },
    checkJava(){

    },
    downloadMaven(callback){
        setTimeout(function (){
            const Dl = new Downloader({
                url: "https://mirrors.tuna.tsinghua.edu.cn/apache/maven/maven-3/3.6.1/binaries/apache-maven-3.6.1-bin.zip",
                saveTo:app.getPath("userData"),
                saveAs:"apache-maven-3.6.1-bin.zip",
                resume:true
            }).on("progress", progress => callback({status:"process",proecess:progress}))
            .on("end", ()=> callback({status:"finish"}))
            .on("error", ()=> callback({status:"error"}))
            .on("start", ()=> callback({status:"start"}))

        },0)
    },
    unZipMaven(callback){
        setTimeout(function (){
            //明天继续....
        },0)
    }
    
}