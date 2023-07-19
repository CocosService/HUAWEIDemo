import *  as fs from 'fs';
import path from "path";
import { Constant } from '../../detail/constant';
import { BuildResult, ParamType, ServiceConfigInfo, TaskOption } from 'editor-build-helper/@types/service/ifs';
import { removeDirectoryAllFile, copyDirectoryAllFile } from '../../detail/methodTool';
import { IOutputSettings } from '../../types/build-result';

export class TaoBaoHook {
    /**
     * 构建完成之后调用
    */
    public static doTask (options: TaskOption, result: BuildResult, thisService: ServiceConfigInfo, paramInfo: ParamType): boolean {
        // console.error("options  :" + JSON.stringify(options));
        //是否把资源放到remote文件夹
        let setTaobaoSdkResToRemote = paramInfo.useRemote;
        // console.error("setTaobaoSdkResToRemote:" + finalValue);
        //1.处理 setting.js
        let settingJsPath: string = result.paths.settings;
        let isSuccSetting = this.changeSettingJs(setTaobaoSdkResToRemote, settingJsPath);
        if (isSuccSetting == false) {
            return false;
        }
        //2.拷贝插件内的bundle资源
        let isSuccBundle = this.copyBundleRes(setTaobaoSdkResToRemote, result);
        if (isSuccBundle == false) {
            return false;
        }
        //3.处理发布后的load-module.js
        let isSuccChangeLoadModuleJs = this.changeLoadModuleJs(setTaobaoSdkResToRemote, result);
        if (isSuccChangeLoadModuleJs == false) {
            return false;
        }
        return true;
    };


    /**
     * 修改 setting.js
    */
    private static changeSettingJs (setTaobaoSdkResToRemote: boolean, settingJsPath: string): boolean {
        // console.log("setting.js path: " + settingJsPath);
        let strInfo = fs.readFileSync(settingJsPath, 'utf-8');

        //转换为配置类
        if (strInfo == null) {
            console.error("构建后的 setting.js 文件不存在");
            return false;
        }
        let settingData: IOutputSettings = JSON.parse(strInfo) as IOutputSettings;
        if (settingData == null) {
            console.error("JSON.parse err");
            return false;
        }

        //无论是选了远程还是本地 都要塞入bundle名称
        this.addBundleNameToSetting(settingData.assets.projectBundles);
        //修改 remote 数据
        if (setTaobaoSdkResToRemote == true) {
            this.addBundleNameToSetting(settingData.assets.remoteBundles);
        }

        //修改后覆盖setting.js文件
        let newSettingStr: string = JSON.stringify(settingData);
        fs.writeFileSync(settingJsPath, newSettingStr, { encoding: 'utf8' });
        // console.warn("sdk setting.js 文件处理完毕");
        return true;
    }

    /**
     * 往bundle数组内塞入bundle名称
    */
    private static addBundleNameToSetting (selectBundlesArg: string[]) {
        //修改参数数据（展示只做按照本地bundle处理）
        if (selectBundlesArg != null) {
            //一般不会存在sdk bundle 的名称
            if (selectBundlesArg.indexOf(Constant.SDK_BUNDLE_NAME) != -1) {
                console.error("项目bundle与淘宝形象SDK的bundle名称重复,请修改项目资源的bundle名称:" + Constant.SDK_BUNDLE_NAME);
            } else {
                selectBundlesArg.push(Constant.SDK_BUNDLE_NAME);
            }
        } else {
            console.error("setting Bundles arr == null");
        }
    }


    /**
     * 拷贝插件内的bundle资源到发布后的工程内
    */
    private static copyBundleRes (setTaobaoSdkResToRemote: boolean, result: BuildResult): boolean {
        //判断放资源的文件夹是否存在, 如果项目内没有bundle配置为远程或未配置服务器地址 remote 是不存在的
        let assetsPath = (setTaobaoSdkResToRemote == false ? result.paths.assets : result.paths.remote);
        if (fs.existsSync(assetsPath) == false) {
            fs.mkdirSync(assetsPath);
        }
        //拷贝sdk资源到构建后的文件夹内
        //插件内资源路径
        let fromPath = path.join(__dirname, "../../file_folder_root/taobao-creative-app/" + Constant.SDK_BUNDLE_NAME);
        //构建后，要把sdk资源放置到的路径  本地资源: assets/tao_bao_avatar_res 或者  远程包资源: assets/remote/tao_bao_avatar_res
        let tarPath = assetsPath + "/" + Constant.SDK_BUNDLE_NAME;
        // console.error("fromPath:" + fromPath);
        // console.error("tarPath:" + tarPath);
        //创建目标文件夹
        if (fs.existsSync(tarPath) == false) {
            fs.mkdirSync(tarPath);
        } else {
            //如果是首次构建后有此资源文件夹则说明sdk资源文件夹不适合
            //如果不是首次build
            console.error("构建后的文件夹不应该存在淘宝形象SDK资源,执行删除。路径:" + tarPath);
            //删除已经有的文件夹
            removeDirectoryAllFile(tarPath, false);
        }
        if (fs.existsSync(fromPath) == false) {
            console.error("sdk资源文件不存在,sdk损坏,需要重新安装 path:" + fromPath);
            return false;
        }
        //拷贝资源到目录
        copyDirectoryAllFile(fromPath, tarPath);

        //如果是发布到了remote下则需要把资源的 index.js 拷贝或移动到 构建后的src --> bundle-scripts --> tao_bao_avatar_res 下
        if (setTaobaoSdkResToRemote == true) {
            //index.js位置 从上面的 tarPath 内部获取
            let indexJsFilePath: string = tarPath + "/index.js";
            if (fs.existsSync(indexJsFilePath) == false) {
                console.error("拷贝后的bundle文件夹下不存在 index.js(注意md5) 文件 path:" + indexJsFilePath);
                return false;
            }
            //目标文件夹
            //先判断bundle-scripts是否存在
            if (fs.existsSync(result.paths.bundleScripts) == false) {
                fs.mkdirSync(result.paths.bundleScripts);
            }
            let bundle_scripts_sdk_bundle = result.paths.bundleScripts + "/" + Constant.SDK_BUNDLE_NAME;
            if (fs.existsSync(bundle_scripts_sdk_bundle) == false) {
                fs.mkdirSync(bundle_scripts_sdk_bundle);
            } else {
                //如果是首次构建后有此资源文件夹则说明sdk资源文件夹不适合
                //如果不是首次build
                console.error("构建后的文件夹不应该存在淘宝形象SDK资源的index.js,执行删除。路径:" + bundle_scripts_sdk_bundle);
                //删除已经有的文件夹
                removeDirectoryAllFile(bundle_scripts_sdk_bundle, false);
            }
            //拷贝文件到目标文件夹
            fs.copyFileSync(indexJsFilePath, bundle_scripts_sdk_bundle + "/index.js");
            //删除原路径下的文件
            fs.rmSync(indexJsFilePath);
        }
        return true;
    }


    /**
     * 拷贝插件内的bundle资源到发布后的工程内
    */
    private static changeLoadModuleJs (setTaobaoSdkResToRemote: boolean, result: BuildResult): boolean {
        let filePath = result.paths.dir + "/load-module.js";
        if (fs.existsSync(filePath) == false) {
            console.error("构建后的淘宝小游戏工程内不存在 load-module.js 文件 path:" + filePath);
            return false;
        }
        fs.appendFileSync(filePath, "\n" + "//形象SDK依赖的bundle");
        //本地模式
        if (setTaobaoSdkResToRemote == false) {
            fs.appendFileSync(filePath, "\n" + "require('./assets/" + Constant.SDK_BUNDLE_NAME + "/index.js');")
        }
        //远程模式 引用本地的资源的index.js(前提：处理好文件的index.js 文件)
        else {
            fs.appendFileSync(filePath, "\n" + "require('./src/bundle-scripts/" + Constant.SDK_BUNDLE_NAME + "/index.js');")
        }
        return true;
    }
}
