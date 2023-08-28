import { _decorator, Component, loader, director } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('APMS')
export class APMS extends Component {
    @property({ type: Console })
    console: Console = null!;

    private apms: typeof huawei.agc.apms.apmsService = (typeof huawei ===
        'undefined'
        ? null
        : huawei?.agc?.apms?.apmsService)!;
    private customTraceName = '';


    start () {
        this.customTraceName = '';
        //设置性能管理服务开关
        huawei.agc.apms.apmsService.enableCollection(true);
        //设置ANR监控开关
        huawei.agc.apms.apmsService.enableAnrMonitor(true);

    }


    httpPost (url: string, params?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) resolve(xhr);
            };
            xhr.open('POST', url, true);
            xhr.timeout = 5000;
            xhr.setRequestHeader(
                'Content-Type',
                'application/x-www-form-urlencoded'
            );
            xhr.send(params);
        });
    }

    httpGet (url: string, params?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) resolve(xhr);
            };
            xhr.open('GET', url, true);
            xhr.timeout = 5000;
            // xhr.setRequestHeader(
            //     'Content-Type',
            //     'application/x-www-form-urlencoded'
            // );
            xhr.send(params);
        });
    }

    setUserIdentifier () {
        const userIdentifier = 'dkjgdsjajkfashjdf';
        this.apms.setUserIdentifier(userIdentifier);
        this.console.log(`setUserIdentifier to ${userIdentifier}`);
    }

    startCustomTrace () {
        if (this.customTraceName !== '') return;
        this.customTraceName = 'customTrace1';
        this.apms.startCustomTrace(this.customTraceName);
        this.console.log('start custom trace, trace name : ' + this.customTraceName
        );
    }

    stopCustomTrace () {
        if (this.customTraceName === '') return;
        this.apms.stopCustomTrace(this.customTraceName);
        this.console.log('stop custom trace, trace name : ' + this.customTraceName
        );
        this.customTraceName = '';
    }

    networkMeasure () {
        let url = 'https://api.apiopen.top/api/getPinYin?text=你好啊';
        let networkMeasureId = this.apms.initNetworkMeasure(url, 'GET');
        this.console.log('start network measure, id : ' + networkMeasureId);

        this.console.log('GET: ' + url);

        //设置
        this.apms.putNetworkMeasureProperty(networkMeasureId, 'key1', 'value1');
        this.console.log(`1-put-key1 (${networkMeasureId}, 'key1', 'value1');`);

        this.apms.putNetworkMeasureProperty(networkMeasureId, 'key2', 'value2');
        this.console.log(`2-put-key2 (${networkMeasureId}, 'key2', 'value2');`);

        //获取
        this.console.log(`3-get-key1 (${this.apms.getNetworkMeasureProperty(networkMeasureId, 'key1')});`);

        this.console.log(`4-get-all (${JSON.stringify(this.apms.getNetworkMeasureProperties(networkMeasureId))});`);

        this.apms.removeNetworkMeasureProperty(networkMeasureId, 'key1');
        this.console.log(`5-remove-key1 (${networkMeasureId}`);

        this.console.log(`6-get-all (${JSON.stringify(
            this.apms.getNetworkMeasureProperties(networkMeasureId))});`
        );

        this.apms.startNetworkMeasure(networkMeasureId);
        this.httpGet(url).then((res) => {
            this.apms.setNetworkMeasureStatusCode(networkMeasureId, res.status);
            if (res.status >= 200 && res.status < 300) {
                this.console.log(JSON.parse(res.responseText));
            } else {
                this.console.log('HTTP get failed, status: ' + res.status);
            }

            this.apms.stopNetworkMeasure(networkMeasureId);
            this.console.log('stop network measure, id : ' + networkMeasureId
            );
        });
    }

    enterGameScene () {
        // director.loadScene('apms-game');
    }

    createApmsLog () {
        let suc = this.apms.createApmsLog();
        this.console.log(
            'createApmsLog',
            'suc : ' + suc
        );
    }

    //verbose | debug | info | warn | error
    setApmsLog () {
        let verbose = this.apms.setApmsLog("verbose", "TEST-LOG", "this is verbose");
        let debug = this.apms.setApmsLog("debug", "TEST-LOG", "this is debug");
        let info = this.apms.setApmsLog("info", "TEST-LOG", "this is info");
        let warn = this.apms.setApmsLog("warn", "TEST-LOG", "this is warn");
        let error = this.apms.setApmsLog("error", "TEST-LOG", "this is error");

        this.console.log(
            'setApmsLog',
            ' verbose : ' + verbose,
            ' debug : ' + debug,
            ' info : ' + info,
            ' warn : ' + warn,
            ' error : ' + error,
        );
    }


    grantApmsLog () {
        this.apms.grantApmsLog();
        this.console.log(
            'grantApmsLog',
        );
    }

    denyApmsLog () {
        this.apms.denyApmsLog();
        this.console.log(
            'denyApmsLog',
        );
    }


    flushApmsLog () {
        this.apms.flushApmsLog();
        this.console.log(
            'flushApmsLog',
        );
    }

    releaseApmsLog () {
        this.apms.releaseApmsLog();
        this.console.log(
            'releaseApmsLog',
        );
    }

    fetchApmsLog () {
        this.apms.once(
            huawei.agc.apms.API_EVENT_LIST.fetchApmsLogCallback,
            (result) => {
                this.console.log('fetchApmsLog', result);
            }
        );
        this.apms.fetchApmsLog();
    }



    setUserPrivacyAgreed () {
        this.apms.setUserPrivacyAgreed(true);
        this.console.log(
            'setUserPrivacyAgreed'
        );
    }

}
