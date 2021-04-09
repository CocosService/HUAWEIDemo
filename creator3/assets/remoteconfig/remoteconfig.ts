import { _decorator, Component } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('RemoteConfig')
export class RemoteConfig extends Component {
    @property({ type: Console })
    console: Console = null!;

    start() {
        huawei.agc.rc.rcService.setRemoteConfigListener((retCode, msg) => {
            this.console.log('retCode:', retCode);
            this.console.log('msg:', msg);
        });
    }

    fetchAndApply() {
        const interval = 30;
        huawei.agc.rc.rcService.fetchAndApply(interval);
        this.console.log(
            `Fetch config from remote and apply config! interval: ${interval}s`
        );
    }

    getValues() {
        const values = huawei.agc.rc.rcService.getMergedAll();
        this.console.log('Get all configs:', values);
    }

    getValueByKey() {
        let key = 'test';
        let value: any = huawei.agc.rc.rcService.getValueAsString(key);
        this.console.log(`Get config by key: ${key}, value: ${value}`);
    }
}
