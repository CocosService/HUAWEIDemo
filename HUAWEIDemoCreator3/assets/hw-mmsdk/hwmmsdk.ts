import { _decorator, Component, loader, director, CCString, EventTarget } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

/**
 * 华为游戏多媒体
*/
@ccclass('Hwmmsdk')
export class Hwmmsdk extends Component {
    @property({ type: Console })
    consolePanel: Console = null!;


    private mmsdkService: typeof huawei.game.mmsdk.mmsdkService = (typeof huawei ===
        'undefined'
        ? null
        : huawei?.game?.mmsdk?.mmsdkService)!;


    onEnable () {
    }

    onDisable () {
    }


    /**
     * 申请权限
    */
    requestPermissions () {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.requestPermissionsCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.consolePanel.log(result);
        })
        this.mmsdkService.requestPermissions(true, "需要开启权限才能使用此功能", "去开启");
    }


    /**
     * 初始化
    */
    init () {
        this.consolePanel.log("正在初始化,请稍后...");
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.initCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.consolePanel.log(result);
        })
        let info = {
            openId: "abcd123321asasas",
            agcAppId: "106022889",
            agcClientId: "875101003169398784",
            agcClientSecret: "FA5074F8DBB0A2AC9C10231E53B95FB788EBAE401AFD06473EDA1FB1E0FC0320",
            agcApiKey: "DAEDANyB5hJ50PQTNRfXKOy9EXhF6xoxjWOSgmpyaU9W3sFWM4B/kgEH3LqDfXwznJg1GiRsUU0QQ5ABrzb0AeMvXJpSEO7btM7a6Q==",
            gameSecret: "",
            logEnable: true,
            logSize: 10240,
            countryCode: "CN",
        }
        this.mmsdkService.init(info);
    }

}
