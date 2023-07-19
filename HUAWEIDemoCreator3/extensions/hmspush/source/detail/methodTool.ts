import { TaskOption } from 'editor-build-helper/@types/service/ifs';
import *  as fs from 'fs';
import path from "path";
import { Constant } from './constant';

//方法工具类
export class MethodTool {
    //从一个文件的路径 获取文件扩展名
    public static getFilePathExtension (path: string): string {
        if (path == null || path.length == 0) {
            return "";
        }
        let suffix = path.substring(path.lastIndexOf(".") + 1);
        return suffix;
    }

    //从一个文件的路径 获取文件所在文件夹 带下划线
    public static getFilePathAtFolder (path: string): string {
        if (path == null || path.length == 0) {
            return "";
        }
        let folderPath = path.substring(0, path.lastIndexOf("/") + 1);
        return folderPath;
    }

    //从一个文件的路径 获取文件名 :hasExtension 是否需要带后缀
    public static getFileName (path: string, hasExtension: boolean = false): string {
        if (path == null || path.length == 0) {
            return "";
        }
        if (hasExtension == true) {
            var pos1 = path.lastIndexOf('/');
            var pos2 = path.lastIndexOf('\\');
            var pos = Math.max(pos1, pos2)
            if (pos < 0) {
                return path;
            }
            else {
                return path.substring(pos + 1);
            }
        } else {
            var pos1 = path.lastIndexOf('/')
            var pos2 = path.lastIndexOf('\\')
            var pos = Math.max(pos1, pos2)
            if (pos < 0) {
                return path;
            }
            else {
                let tempPath = path.substring(pos + 1);
                return tempPath.substring(0, tempPath.lastIndexOf("."));
            }
        }
    }
}



/**
 * 拷贝文件夹中所有的文件到目标文件夹，递归
 * fromPath:源路径
 * tarPath:目标路径
*/
export function copyDirectoryAllFile (fromPath: string, tarPath: string) {
    //目标文件是否存在
    if (fs.existsSync(tarPath) == false) {
        fs.mkdirSync(tarPath);
    }
    //原始文件夹是否存在
    if (fs.existsSync(fromPath) == false) {
        ccService.csLogger.error("fromPath == null,原始文件夹路径不存在,fromPath:" + fromPath);
        return;
    }
    // ccService.csLogger.log("src:" + src + ", dest:" + dest);
    // 拷贝新的内容进去
    var dirs = fs.readdirSync(fromPath);
    dirs.forEach(function (item) {
        var item_path = path.join(fromPath, item);
        var temp = fs.statSync(item_path);
        //是文件
        if (temp.isFile()) {
            // ccService.csLogger.log("Item Is File:" + item);
            fs.copyFileSync(item_path, path.join(tarPath, item));
        }
        //是目录
        else if (temp.isDirectory()) {
            // ccService.csLogger.log("Item Is Directory:" + item);
            copyDirectoryAllFile(item_path, path.join(tarPath, item));
        }
    });
}



/**
 * 删除文件夹中所有的文件，递归，不删除 tarPath
 * fromPath:跟路径
*/
export function removeDirectoryAllFile (tarPath: string, removeRootDir: boolean) {
    //原始文件夹是否存在
    if (fs.existsSync(tarPath) == false) {
        ccService.csLogger.error("path == null :" + tarPath);
        return;
    }
    // ccService.csLogger.log("src:" + src + ", dest:" + dest);
    // 拷贝新的内容进去
    var dirs = fs.readdirSync(tarPath);
    dirs.forEach(function (item) {
        var item_path = path.join(tarPath, item);
        var temp = fs.statSync(item_path);
        //是文件
        if (temp.isFile()) {
            // ccService.csLogger.log("Item Is File:" + item);
            fs.rmSync(item_path);
        }
        //是目录
        else if (temp.isDirectory()) {
            // ccService.csLogger.log("Item Is Directory:" + item);
            removeDirectoryAllFile(item_path, true);
        }
    });

    //是否删除传入的根目录
    if (removeRootDir == true) {
        fs.rmdirSync(tarPath);
    }
}


/**
 * http git 请求
*/
export function ajaxGet (url: string, query: any, succCb: Function, failCb: Function, isJson: boolean) {
    // 拼接url加query
    if (query) {
        var parms = formatParams(query);
        url += '?' + parms;
        // ccService.csLogger.log('-------------',url);
    }

    // 1、创建对象
    let ajax = new XMLHttpRequest();
    // 2、建立连接
    // true:请求为异步  false:同步
    ajax.open("GET", url, true);
    // ajax.setRequestHeader("Origin",STATIC_PATH); 

    // ajax.setRequestHeader("Access-Control-Allow-Origin","*");   
    // // 响应类型    
    // ajax.setRequestHeader('Access-Control-Allow-Methods', '*');    
    // // 响应头设置    
    // ajax.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type');  
    // ajax.withCredentials = true;
    // 3、发送请求
    ajax.send(null);
    // 4、监听状态的改变
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            if (ajax.status === 200) {
                // 用户传了回调才执行
                // isJson默认值为true，要解析json
                if (isJson === undefined) {
                    isJson = true;
                    ccService.csLogger.warn("isJson == null");
                }
                if (isJson) {
                    let jsonTextInfo: string = ajax.responseText;
                    if (ajax.responseText == null || ajax.responseText == "") {
                        jsonTextInfo = "{}";
                    }
                    //解析后的json
                    let jsonParseInfo: any = null;
                    try {
                        jsonParseInfo = JSON.parse(jsonTextInfo);
                    } catch (error) {
                        ccService.csLogger.error("JSON.parse() error err:" + error);
                        failCb && failCb(Constant.CHECK_AUTH_ERROR_MSG.Err_JsonParseErr);
                        return;
                    }
                    succCb && succCb(jsonParseInfo);
                } else {
                    succCb && succCb(ajax.responseText);
                }
            } else {
                // 请求失败
                failCb && failCb(Constant.CHECK_AUTH_ERROR_MSG.Err_HttpStateErr);
            }
        }
    }
}

/**
 * 用于 http 请求。把{}参数 转换为
*/
export function formatParams (data: any): string {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".", ""));
    return arr.join("&");
}



/**
 * sdk用鉴权网络请求
 * succCb:成功回调 返回的
 * failCb:失败回调 错误码 Constant.CHECK_AUTH_ERROR_CODE
*/
export async function checkAuth (service_id: string, succCb: Function, failCb: Function) {
    //是否登陆
    let islogin = await ccService.csEditor.isLogin();
    if (islogin == false) {
        failCb && failCb(Constant.CHECK_AUTH_ERROR_MSG.Err_NoLogin);
        return;
    }
    //是否有接口
    // @ts-ignore
    if (ccService.csProtocol.getServiceUserInfo == null) {
        failCb && failCb(Constant.CHECK_AUTH_ERROR_MSG.Err_NoAuthApi);
        return;
    }
    //是否启用
    let enable = await isServiceEnabled(service_id);
    //回调
    if (enable == true) {
        succCb && succCb();
    } else {
        failCb && failCb(Constant.CHECK_AUTH_ERROR_MSG.Err_NoAuth);
    }
}


/**
 * 服务是否启用
*/
async function isServiceEnabled (service_id: string) {
    // ccService.csLogger.log(`service id is:${service_id}`)
    if (!service_id) return false;
    // @ts-ignore
    const info = await ccService.csProtocol.getServiceUserInfo(service_id);
    // ccService.csLogger.log(`service user info:${JSON.stringify(info)}`)
    if (info) return info.enable;
    return false;
}

