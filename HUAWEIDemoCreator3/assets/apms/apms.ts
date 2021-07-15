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

    httpPost(url: string, params?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = loader.getXMLHttpRequest();
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

    start() {
        this.customTraceName = '';
    }

    setUserIdentifier() {
        const userIdentifier = '475f5afaxxxxx';
        this.apms.setUserIdentifier(userIdentifier);
        this.console.log('APMS', `setUserIdentifier to ${userIdentifier}`);
    }

    startCustomTrace() {
        if (this.customTraceName !== '') return;
        this.customTraceName = 'customTrace1';
        this.apms.startCustomTrace(this.customTraceName);
        this.console.log(
            'APMS',
            'start custom trace, trace name : ' + this.customTraceName
        );
    }

    stopCustomTrace() {
        if (this.customTraceName === '') return;
        this.apms.stopCustomTrace(this.customTraceName);
        this.console.log(
            'APMS',
            'stop custom trace, trace name : ' + this.customTraceName
        );
        this.customTraceName = '';
    }

    networkMeasure() {
        let url = 'https://api.apiopen.top/getJoke?page=1&count=2&type=video';
        let networkMeasureId = this.apms.initNetworkMeasure(url, 'POST');
        this.console.log(
            'APMS',
            'start network measure, id : ' + networkMeasureId
        );
        this.console.log('APMS', 'POST: ' + url);
        this.apms.putNetworkMeasureProperty(networkMeasureId, 'key1', 'value1');
        this.console.log(
            'APMS',
            'Auto Test: ' +
                "putNetworkMeasureProperty(networkMeasureId, 'key1', 'value1');"
        );
        this.apms.putNetworkMeasureProperty(networkMeasureId, 'key2', 'value2');
        this.console.log(
            'APMS',
            'Auto Test: ' +
                "putNetworkMeasureProperty(networkMeasureId, 'key2', 'value2');"
        );
        this.console.log(
            'APMS',
            'Auto Test: ' +
                "getNetworkMeasureProperty(networkMeasureId, 'key1'); -- " +
                this.apms.getNetworkMeasureProperty(networkMeasureId, 'key1')
        );
        this.console.log(
            'APMS',
            'Auto Test: ' +
                'getNetworkMeasureProperties(networkMeasureId); -- ' +
                JSON.stringify(
                    this.apms.getNetworkMeasureProperties(networkMeasureId)
                )
        );
        this.apms.removeNetworkMeasureProperty(networkMeasureId, 'key1');
        this.console.log(
            'APMS',
            'Auto Test: ' +
                "removeNetworkMeasureProperty(networkMeasureId, 'key1');"
        );
        this.console.log(
            'APMS',
            'Auto Test: ' +
                'getNetworkMeasureProperties(networkMeasureId); -- ' +
                JSON.stringify(
                    this.apms.getNetworkMeasureProperties(networkMeasureId)
                )
        );
        this.apms.startNetworkMeasure(networkMeasureId);
        this.httpPost(url).then((res) => {
            this.apms.setNetworkMeasureStatusCode(networkMeasureId, res.status);
            if (res.status >= 200 && res.status < 300) {
                this.console.log(JSON.parse(res.responseText));
            } else {
                this.console.log('HTTP post failed, status: ' + res.status);
            }

            this.apms.stopNetworkMeasure(networkMeasureId);
            this.console.log(
                'APMS',
                'stop network measure, id : ' + networkMeasureId
            );
        });
    }

    enterGameScene() {
        director.loadScene('apms-game');
    }
}
