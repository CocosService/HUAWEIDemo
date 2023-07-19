
import { file } from 'editor-build-helper';
import Vue from 'editor-build-helper/vue';
import *  as fs from 'fs';
import { Constant } from '../constant';
import path, { join } from 'path';
import { checkAuth, copyDirectoryAllFile, removeDirectoryAllFile } from '../methodTool';
import { ParamType } from 'editor-build-helper/@types/service/ifs';
import { PanelThis, PanelParam, ProjectAppIdInfo } from '../../types/service';

Vue.config.productionTip = false;
Vue.config.devtools = false;

//项目路径
const projectPath = ccService.csEditor.getProjectPath();
//资源所在根目录file_folder_root(打包后此文件会放到插件的根目录，不是dist内)
const sdkFileRootPath = "../../file_folder_root";

//是否处于初始化中，避免重复初始化
let isInInit: boolean = false;

export async function createVue (panel: PanelThis, info: PanelParam) {
    let vue = new Vue({
        el: panel.$.app,
        data: {
            paramList: info.param,
            appId: info.param.appId,
            useRemote: info.param.useRemote,
        },
        created () {
            //记录初始参数
            if (info.param != null) {
                this.paramList = info.param;
                if (this.paramList.appId == null) {
                    this.paramList.appId = "";
                }
                if (this.paramList.useRemote == null) {
                    this.paramList.useRemote = false;
                }
            }
            //事件监听
            addSaveEvent();
            //初始化数据
            this.appId = info.param.appId;
            this.useRemote = info.param.useRemote;

            //首次保存数据
            ccService.csEvent.emit('service:save-param', info.service.service_id, this.paramList);

            // console.log("-----service---", JSON.stringify(info.service))
        },
        methods: {
            //存储参数
            saveParam () {
                ccService.csEvent.emit('service:save-param', info.service.service_id, this.paramList);
            },
            onAppidConfirm (appIdStr: string) {
                this.appId = info.param.appId = appIdStr;
                //sdk版本号
                let versionStr: string = "";
                if (info.service.package_versions != null && info.service.package_versions.length > 0) {
                    versionStr = info.service.package_versions[0];
                }
                onAppidInputOver(appIdStr, versionStr);
                //保存数据
                this.saveParam();
                //刷新资源
                ccService.csEditor.requestMsg('asset-db', 'refresh-asset', 'db://assets');
            },
            onSelectRemoteConfirm (value: boolean) {
                this.useRemote = info.param.useRemote = value;
                onSelectRemoteChange(value);
                //保存数据
                this.saveParam();
            },
            run () {
                if (isInInit == true) {
                    ccService.csEditor.dialogMsgBox("error", "正在初始化，请勿重复点击");
                    console.error("正在初始化，请勿重复点击");
                    return;
                }
                isInInit = true;
                let versionStr: string = "";
                if (info.service.package_versions != null && info.service.package_versions.length > 0) {
                    versionStr = info.service.package_versions[0];
                }
                tryInitSdk(info.param, info.service.service_id, versionStr);
            },
        }
    })

    //修改界面上的值
    try {
        // @ts-ignore
        vue.$refs.appId.value = info.param.appId;
        // @ts-ignore
        vue.$refs.useRemote.value = info.param.useRemote;
    } catch (error) {
        console.error(error)
    }
    return vue;
}



/**
 * 点击初始化
*/
async function tryInitSdk (param: ParamType, service_id: string, sdkVersion: string) {
    checkAuth(
        service_id,
        () => {
            doTask(param.appId, sdkVersion);
        },
        (errMsg: string) => {
            ccService.csEditor.dialogMsgBox("error", errMsg);
            console.error(errMsg);
            isInInit = false;
        }
    )
}

/**
 * 执行任务
*/
async function doTask (appId: string, sdkVersion: string) {
    //初始化预览模板
    let succ1 = initPreviewTemplate();
    //拷贝sdk文件
    let succ2 = await copyScript();
    //写入appid json文件
    let succ3 = await createAppIdInfo(appId, sdkVersion);

    if (succ1 && succ2 && succ3) {
        //提示完成
        ccService.csEditor.dialogMsgBox("info", "初始化完毕!");
        console.log("初始化完毕!");
    } else {
        //提示
        ccService.csEditor.dialogMsgBox("error", "初始化失败,请查看提示信息!");
        console.error("初始化失败,请查看提示信息!");
    }

    isInInit = false;
}


/**
 * 添加保存事件监听
*/
function addSaveEvent () {
    ccService.csEvent.removeAllListeners("service:save-param");
    ccService.csEvent.on('service:save-param',
        (service_id: string, param: ParamType) => {
            //保存输入的参数
            ccService.csConfig.writeServiceParam(service_id, param);
            // console.log("保存数据：", param)
        })
}


/**
 * appid 输入完毕或者取消
*/
function onAppidInputOver (appIdStr: string, sdkVersion: string) {
    // ccService.csLogger.log("appId:" + appIdStr);
    //更新项目中的appid数据
    createAppIdInfo(appIdStr, sdkVersion);
}


/**
 * 勾选是否把资源发布到remote文件夹
*/
function onSelectRemoteChange (isSelect: boolean) {
    // ccService.csLogger.log("remote:" + isSelect);
}




//初始化预览模板
function initPreviewTemplate (): boolean {
    //与 assets 同级的 preview-template 目录 (tarPath:/Users/hsf/taobao_life_sdk)
    //项目工程是否存在 预览模板
    let previewTemplate = projectPath + "/preview-template";
    if (fs.existsSync(previewTemplate) == false) {
        fs.mkdirSync(previewTemplate);
    }
    //预览模板的资源文件夹
    let previewTemplateSdkResPath = previewTemplate + "/" + Constant.SDK_BUNDLE_NAME;
    if (fs.existsSync(previewTemplateSdkResPath) == false) {
        fs.mkdirSync(previewTemplateSdkResPath);
    } else {
        //清除文件夹和内部全部文件
        removeDirectoryAllFile(previewTemplateSdkResPath, true);
    }
    //拷贝sdk资源到预览模板文件夹
    //插件内预览模板资源路径
    let fromPath = path.join(__dirname, sdkFileRootPath + "/preview/" + Constant.SDK_BUNDLE_NAME);
    if (fs.existsSync(fromPath) == false) {
        ccService.csEditor.dialogMsgBox("error", "sdk资源文件不存在,sdk损坏,需要重新安装 path:" + fromPath);
        console.error("sdk资源文件不存在,sdk损坏,需要重新安装 path:" + fromPath);
        return false;
    }
    //拷贝资源到目录
    copyDirectoryAllFile(fromPath, previewTemplateSdkResPath);
    return true;
}


//拷贝代码到项目的 assets 下 tao_bao_avatar_sdk
async function copyScript (): Promise<boolean> {
    //assets 目录是否存在
    let assetsPath = projectPath + "/assets";
    if (fs.existsSync(assetsPath) == false) {
        ccService.csEditor.dialogMsgBox("error", "assets 目录为null");
        console.error("assets 目录为null");
        return false;
    }
    //sdk根目录文件夹是否存在
    let sdkRootPath = assetsPath + "/tao_bao_avatar_sdk";
    if (fs.existsSync(sdkRootPath) == true) {
        ccService.csEditor.dialogMsgBox("error", "项目根目录 assets 下已经存在 tao_bao_avatar_sdk 文件夹,请删除后再试!");
        console.error("项目根目录 assets 下已经存在 tao_bao_avatar_sdk 文件夹,请删除后再试!");
        return false;
    } else {
        fs.mkdirSync(sdkRootPath);
    }
    //拷贝sdk代码资源到项目中的 assets 下 tao_bao_avatar_sdk
    let fromPath = path.join(__dirname, sdkFileRootPath + '/sdk_package/tao_bao_avatar_sdk');
    if (fs.existsSync(fromPath) == false) {
        ccService.csEditor.dialogMsgBox("error", "sdk代码资源文件不存在,sdk损坏,需要重新安装 path:" + fromPath);
        console.error("sdk代码资源文件不存在,sdk损坏,需要重新安装 path:" + fromPath);
        return false;
    }
    //拷贝资源到目录
    copyDirectoryAllFile(fromPath, sdkRootPath);
    //刷新资源
    await ccService.csEditor.requestMsg('asset-db', 'refresh-asset', 'db://assets');
    return true;
}


/**
 * 创建/更新 一个默认的appid的文件
*/
async function createAppIdInfo (appIdStr: string, sdkVersion: string): Promise<boolean> {
    //项目路径
    let path = ccService.csEditor.getProjectPath();
    // console.log("项目路径 path:" + path);
    //assets目录是否存在
    let assetsPath = path + "/assets";
    if (fs.existsSync(assetsPath) == false) {
        ccService.csEditor.dialogMsgBox("error", "项目 assets 文件夹不存在 path:" + assetsPath);
        console.error("项目 assets 文件夹不存在 path:" + assetsPath);
        return false;
    }

    //resources目录是否存在 没有则创建
    let resourcesPath = assetsPath + "/resources";
    if (fs.existsSync(resourcesPath) == false) {
        fs.mkdirSync(resourcesPath);
    }

    //是否存在 appid 文件 (有则删除，重新创建)
    let projectAppidFile = resourcesPath + "/" + Constant.projectAppidFileName;
    if (fs.existsSync(projectAppidFile) == true) {
        fs.rmSync(projectAppidFile);
    }

    let info: ProjectAppIdInfo = {
        appId: appIdStr,                                    //appid
        des: "由 TAOBAO Avatar SDK 创建,请勿删除",             //描述
        sdkVersion: sdkVersion,                             //sdk版本号
    }

    fs.writeFileSync(projectAppidFile, JSON.stringify(info), "utf8");
    //刷新资源
    await ccService.csEditor.requestMsg('asset-db', 'refresh-asset', 'db://assets');
    return true;
}
