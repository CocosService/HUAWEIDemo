import { Service } from "editor-build-helper/@types/service/ifs";

// Service 结构
// {
//     "service_id": "550",
//     "service_name": "TaoBao Avatar SDK",
//     "service_icon": "https://download.cocos.org/CocosUdcTest/eae7e71577/2ca4c4d8a7914f9daa58c00598016540.jpg",
//     "service_desc": "帮助开发者在开发淘宝小游戏时，加载淘宝人生的虚拟角色形象，播放角色动画，减少游戏或软件开发的工作量，提升用户体验。\n",
//     "service_title": "帮助淘宝小游戏在游戏场景中，加载淘宝人生的虚拟人物形象及播放人物动画",
//     "service_guide_url": "https://test-service.cocos.com/document/zh/taobaoavatar.html",
//     "service_sample_url": "",
//     "service_dev_url": "",
//     "service_type": "4",
//     "service_type_zh": "绑定账号&后台开通",
//     "support_platform": [
//         "淘宝小程序创意互动"
//     ],
//     "package_download_url": "https://download.cocos.org/CocosUdcTest/plugins/service-taobaoavatar/1.0.0.zip",
//     "package_version_desc": "<p>first version</p>",
//     "service_component_name": "service-taobaoavatar",
//     "package_versions": [
//         "1.0.0"
//     ],
//     "build_platform": [],
//     "require_verify": 0,
//     "service_price": "",
//     "service_protocol": "",
//     "service_group": "",
//     "service_group_id": "",
//     "not_service": false,
//     "enable": false,
//     "hovered": true
// }

export interface PanelParam {
    game: Game,
    service: Service,
    param: ParamType
}
export interface PanelThis {
    template: string;
    style: string;
    $: { app: string | HTMLElement };
    vm: Vue,
    ready: (info: PanelParam | any) => any;
    canClose: (info: any) => Promise<boolean>;
    close: () => any;
    beforeOpenService: (arg: any) => Promise<boolean>;
    afterOpenService: (arg: any) => Promise<void>;
    failureOpenService: (arg: { service: Service, reason: any }) => any;
    beforeClickGotoLink: (url: string) => Promise<boolean>;
}

/**
 * 用户在插件面板输入的appid数据
*/
export interface ProjectAppIdInfo {
    appId: string;          //appid
    des: string;            //描述
    sdkVersion: string;     //sdk版本号
}
