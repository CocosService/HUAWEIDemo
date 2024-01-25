import { _decorator, Component } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('RemoteConfig')
export class RemoteConfig extends Component {
    @property({ type: Console })
    console: Console = null!;

    start () {
    }

    setEnableCollectUserPrivacy() {
        huawei.agc.rc.rcService.once(huawei.agc.rc.API_EVENT_LIST.setEnableCollectUserPrivacy, (result: huawei.agc.rc.ApiCbResult) => {
            this.console.log(result);
        });
        huawei.agc.rc.rcService.setEnableCollectUserPrivacy(true);
    }

    fetchAndApply () {
        huawei.agc.rc.rcService.once(huawei.agc.rc.API_EVENT_LIST.fetchAndApplyCallback, (result: huawei.agc.rc.ApiCbResult) => {
            this.console.log(result);
        });
        const interval = 30;
        huawei.agc.rc.rcService.fetchAndApply(interval);
    }

    getMergedAll () {
        const values = huawei.agc.rc.rcService.getMergedAll();
        this.console.log("getMergedAll succeed:", values);
    }

    getValueByKey () {
        let key = 'test';
        let value: any = huawei.agc.rc.rcService.getValueAsString(key);
        this.console.log("getValueByKey succeed:", value);
    }


    getSource () {
        let key = 'test';
        let value: any = huawei.agc.rc.rcService.getSource(key);
        this.console.log("getSource succeed:", value);
    }

    setCustomAttributes () {
        huawei.agc.rc.rcService.once(huawei.agc.rc.API_EVENT_LIST.setCustomAttributesCallback, (result: huawei.agc.rc.ApiCbResult) => {
            this.console.log(result);
        });
        let map = {
            "testKey1": "testValue1",
            "testKey2": "testValue2",
            "testKey3": "testValue3",
        };
        huawei.agc.rc.rcService.setCustomAttributes(map);
    }


    getCustomAttributes () {
        let value: string = huawei.agc.rc.rcService.getCustomAttributes();
        this.console.log("getCustomAttributes succeed: ", value);
    }

}
