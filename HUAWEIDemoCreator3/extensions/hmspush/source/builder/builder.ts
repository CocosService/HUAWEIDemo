
import { BuildResult, ParamType, ServiceConfigInfo, TaskOption } from 'editor-build-helper/@types/service/ifs';
import { Constant } from '../detail/constant';
import { checkAuth } from "../detail/methodTool";
import { TaoBaoHook } from "./hooks/hook_taobao";
import { WebHook } from "./hooks/hook_web";
import { WechatGameHook } from './hooks/hook_wechatgame';

// 当 Creator 启动预览（模拟器、浏览器）时，会触发此函数，编辑器预览时不会触发，此时向项目的 settings => jsList 中插入部分自定义脚本
// export async function onSettings (params: ParamType, previewType: "browser" | "simulator", insertJS: (js: string) => void) {
// }

//服务名
const SERVICE_NAME = "service-taobaoavatar";

//使用的引擎版本号
const CocosEngineVersions = {
    _3_6_3: "3.6.3",
    _3_7_0: "3.7.0"
}

export async function onAfterBuild (options: TaskOption, result: BuildResult) {
    //获取服务
    let thisService: ServiceConfigInfo = getService(options)!;
    if (thisService == null) {
        return;
    }

    //获取参数信息
    let paramInfo: ParamType = thisService.params;

    //未启动插件
    if (thisService.enable == false) {
        return;
    }
    //调试数据
    // console.warn(result);

    //对编辑器版本进行区分，判断平台是否支持构建
    //@ts-ignore
    if (result.settings.CocosEngine != CocosEngineVersions._3_6_3 && result.settings.CocosEngine != CocosEngineVersions._3_7_0) {
        ccService.csEditor.dialogMsgBox("error", "淘宝形象SDK不支持此版本的编辑器,请使用其他版本");
        console.warn("淘宝形象SDK未对此版本的编辑器进行适配,请使用3.7.0版本的编辑器");
    }

    //当前构建的平台，判断平台是否允许构建
    let platform: string = "";
    //@ts-ignore
    if (result.settings.CocosEngine == CocosEngineVersions._3_6_3) {
        platform = result.settings.platform;
        //@ts-ignore
    } else if (result.settings.CocosEngine == CocosEngineVersions._3_7_0) {
        //@ts-ignore
        platform = result.settings.engine.platform;
    }

    if (platform !== "taobao-creative-app" && platform !== "web-desktop" && platform !== "web-mobile" && platform !== "wechatgame") {
        console.error("不支持的平台：" + platform)
        return;
    }

    //是否输入了appid
    if (platform === "taobao-creative-app") {
        let inputAppId: string = paramInfo.appId;
        if (inputAppId == null || inputAppId.length <= 0) {
            ccService.csEditor.dialogMsgBox("error", "淘宝形象服务已开启,构建前请前往服务面板填写AppId!");
            console.error("淘宝形象服务已开启,构建前请前往服务面板填写AppId!");
            return;
        }
    }
    //再次鉴权
    checkAuth(
        thisService.service_id,
        () => {
            //执行任务
            doTask(platform, options, result, thisService, paramInfo);
        },
        (errMsg: string) => {
            ccService.csEditor.dialogMsgBox("error", errMsg);
            console.error(errMsg);
        }
    )
}


/**
 * 执行构建任务
*/
function doTask (platform: string, options: TaskOption, result: BuildResult, thisService: ServiceConfigInfo, paramInfo: ParamType) {
    let isOk: boolean = false;
    if (platform === "taobao-creative-app") {
        isOk = TaoBaoHook.doTask(options, result, thisService, paramInfo);
    } else if (platform === "web-desktop" || platform === "web-mobile") {
        isOk = WebHook.doTask(options, result, thisService, paramInfo);
    } else if (platform === "wechatgame") {
        isOk = WechatGameHook.doTask(options, result, thisService, paramInfo);
    } else {
        console.error("TODO: doTask other platform:" + platform);
    }
    if (isOk == true) {
        console.log("TAOBAO Avatar SDK 构建任务执行成功!");
    } else {
        console.error("TAOBAO Avatar SDK 构建任务执行失败,详情见编辑器内log信息!");
    }
}


/**
 * 获取服务
*/
function getService (options: TaskOption) {
    const serviceConfigs = options.packages["cocos-service"].services;
    const srvConfig = serviceConfigs.find((info) => info.service_component_name === SERVICE_NAME);
    // ccService.csLogger.log(`srvConfig:${JSON.stringify(srvConfig)}`)
    return srvConfig;
}
