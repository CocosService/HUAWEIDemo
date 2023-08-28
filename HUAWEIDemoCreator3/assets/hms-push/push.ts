import { _decorator, Component, loader, director, CCString, EventTarget } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

/**
 * 华为推送isRestrictionEnabled
*/
@ccclass('Push')
export class Push extends Component {
    @property({ type: Console })
    consolePanel: Console = null!;

    @property
    appId: string = "";

    @property
    subjectId: string = "";


    private push: typeof huawei.hms.push.pushService = (typeof huawei ===
        'undefined'
        ? null
        : huawei?.hms?.push?.pushService)!;


    onEnable () {
    }

    onDisable (): void {
    }


    /**
     * 获取接入推送服务所需的Token。
    */
    getToken (): void {
        huawei.hms.push.pushService.once(huawei.hms.push.API_EVENT_LIST.getTokenCallback, (result: huawei.hms.push.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        huawei.hms.push.pushService.getToken(this.appId);
    }
    /**
     * 删除Token。
    */
    deleteToken (): void {
        huawei.hms.push.pushService.once(huawei.hms.push.API_EVENT_LIST.deleteTokenCallback, (result: huawei.hms.push.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        huawei.hms.push.pushService.deleteToken(this.appId);
    }
    /**
     * 获取接入推送服务所需的Token。
    */
    getTokenBySubjectId (): void {
        huawei.hms.push.pushService.once(huawei.hms.push.API_EVENT_LIST.getTokenBySubjectIdCallback, (result: huawei.hms.push.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        huawei.hms.push.pushService.getTokenBySubjectId(this.subjectId);
    }

    deleteTokenBySubjectId () {
        huawei.hms.push.pushService.once(huawei.hms.push.API_EVENT_LIST.deleteTokenBySubjectIdCallback, (result: huawei.hms.push.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        huawei.hms.push.pushService.deleteTokenBySubjectId(this.subjectId);
    }



    /**
     * 异步任务订阅主题
     * https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/hmsmessaging-0000001050255650#section1222313413551
    */
    setTag (): void {
        huawei.hms.push.pushService.once(huawei.hms.push.API_EVENT_LIST.setTagCallback, (result: huawei.hms.push.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        huawei.hms.push.pushService.setTag("tag1");
    }

    /**
     * 异步任务取消订阅主题
     * https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/hmsmessaging-0000001050255650#section7598115275611
    */
    delTag (): void {
        huawei.hms.push.pushService.once(huawei.hms.push.API_EVENT_LIST.delTagCallback, (result: huawei.hms.push.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        huawei.hms.push.pushService.delTag("tag1");
    }

    /**
     * 异步任务打开接收通知栏消息开关
     * 
    */
    turnOnPush (): void {
        huawei.hms.push.pushService.once(huawei.hms.push.API_EVENT_LIST.turnOnPushCallback, (result: huawei.hms.push.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        huawei.hms.push.pushService.turnOnPush();
    }

    /**
     * 异步任务关闭接收通知栏消息开关。
    */
    turnOffPush (): void {
        huawei.hms.push.pushService.once(huawei.hms.push.API_EVENT_LIST.turnOffPushCallback, (result: huawei.hms.push.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        huawei.hms.push.pushService.turnOffPush();
    }

    /**
     * 华为Push服务器通过HTTPS方式调用此接口给您的服务器推送上行消息。
     * params：json 序列化后的数据
    */
    sendMessage (): void {
        huawei.hms.push.pushService.once(huawei.hms.push.API_EVENT_LIST.sendMessageCallback, (result: huawei.hms.push.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)

        let params = {
            "messageId": "messageId" + Math.ceil(Math.random() * 100000),
            "messageType": "mType1",
            "collapseKey": "0",
            "sendMode": "1",
            "receiptMode": "1",
            "ttl": "10000",
            "key1": "value1",
            "key2": "value2",
            "key3": "value3"
        }
        let str = JSON.stringify(params);
        huawei.hms.push.pushService.sendMessage(str);
    }


    /**
     * 异步任务获取AAID
    */
    getAAID () {
        huawei.hms.push.pushService.once(huawei.hms.push.API_EVENT_LIST.getAAIDCallback, (result: huawei.hms.push.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        huawei.hms.push.pushService.getAAID();
    }



    /**
     * 删除本地生成的AAID与时间戳并同步删除已生成的与本AAID相关的所有Token。
    */
    deleteAAID () {
        huawei.hms.push.pushService.once(huawei.hms.push.API_EVENT_LIST.deleteAAIDCallback, (result: huawei.hms.push.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        huawei.hms.push.pushService.deleteAAID()
    }


    /**
     * 异步任务获取ODID
    */
    getOdid () {
        huawei.hms.push.pushService.once(huawei.hms.push.API_EVENT_LIST.getOdidCallback, (result: huawei.hms.push.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        huawei.hms.push.pushService.getOdid();
    }


    /**
     * 获取是否启用自动初始化功能。
    */
    isAutoInitEnabled () {
        let bol = huawei.hms.push.pushService.isAutoInitEnabled()
        this.consolePanel.log("isAutoInitEnabled succeed,value:", bol);
    }

    private _curAutoInitEnabled: boolean = false;
    /**
     * 设置自动初始化使能与否。
    */
    setAutoInitEnabled () {
        this._curAutoInitEnabled = !this._curAutoInitEnabled;
        huawei.hms.push.pushService.setAutoInitEnabled(this._curAutoInitEnabled);
        this.consolePanel.log("setAutoInitEnabled succeed,value:", this._curAutoInitEnabled);
    }



    /**
     * 判断当前终端设备是否支持帐号校验功能。
    */
    isSupportProfile () {
        let bol = huawei.hms.push.pushService.isSupportProfile();
        this.consolePanel.log("isSupportProfile succeed,value:", bol);
    }

    /**
     * 添加当前设备上该用户与应用的关系。
    */
    addProfile () {
        huawei.hms.push.pushService.once(huawei.hms.push.API_EVENT_LIST.addProfileCallback, (result: huawei.hms.push.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        let params = {
            "type": "CUSTOM_PROFILE",
            "profileId": "PROFILE_ID_001"
        }
        huawei.hms.push.pushService.addProfile(JSON.stringify(params));
    }

    /**
     * 清除当前设备上该用户与应用的关系。
    */
    deleteProfile () {
        huawei.hms.push.pushService.once(huawei.hms.push.API_EVENT_LIST.deleteProfileCallback, (result: huawei.hms.push.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        let params = {
            "profileId": "PROFILE_ID_001"
        }
        huawei.hms.push.pushService.deleteProfile(JSON.stringify(params));
    }


}
