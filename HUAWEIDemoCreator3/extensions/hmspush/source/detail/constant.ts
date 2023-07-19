//sdk常量定义
export class Constant {
    //sdk内的资源的bundle名称
    public static SDK_BUNDLE_NAME = "tao_bao_avatar_res";
    //鉴权检测url
    public static readonly checkAuthUrl = "https://www.baidu.com";
    //鉴权检测 返回的数据是否是json
    public static readonly checkAuthRetDataIsJson = false;
    //项目中的 记录appid的信息
    public static readonly projectAppidFileName = "tao_bao_appId.json";

    //sdk内的资源的bundle名称
    public static CHECK_AUTH_ERROR_MSG = {
        Err_NoLogin: "鉴权失败！请登录您的Cocos开发者帐户后重试",
        Err_HttpStateErr: "鉴权失败！网络错误,请稍后重试",
        Err_JsonParseErr: "鉴权失败！鉴权数据解析失败,请稍后重试",
        Err_NoAuth: "鉴权失败！此账号无使用权限,请授权后使用",
        Err_NoAuthApi: "鉴权失败！编辑器版本太低,请升级编辑器版本,(getServiceUserInfo不存在).",
    }

}