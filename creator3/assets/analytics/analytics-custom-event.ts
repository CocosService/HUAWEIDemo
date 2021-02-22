import { _decorator, Component, Node, director } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('AnalyticsCustomEvent')
export class AnalyticsCustomEvent extends Component {
    @property({ type: Console })
    console: Console = null!;

    private customEventIdx = 0;

    start() {}

    goBack() {
        director.loadScene('analytics');
    }

    /**
     * 参照网址进行配置
     * https://developer.huawei.com/consumer/cn/doc/development/HMS-Guides/event_description
     */
    startLevel() {
        const eventType = huawei.hms.analytics.HAEventType;
        const paramType = huawei.hms.analytics.HAParamType;
        const params = {
            [paramType.LEVELNAME]: 'wzm666',
        };
        huawei.hms.analytics.analyticsService.onEvent(
            eventType.STARTLEVEL,
            params
        );
        this.console.log('onEvent', eventType.STARTLEVEL, 'params is', params);
    }

    completeLevel() {
        const eventType = huawei.hms.analytics.HAEventType;
        const paramType = huawei.hms.analytics.HAParamType;
        let params = {
            [paramType.LEVELNAME]: 'wzm666',
            [paramType.RESULT]: 'success',
        };
        huawei.hms.analytics.analyticsService.onEvent(
            eventType.COMPLETELEVEL,
            params
        );
        this.console.log('onEvent', paramType.COMMENTTYPE, 'params is', params);
    }

    customEvent() {
        const eventName = 'myEvent';
        const params = {
            idx: this.customEventIdx++,
            name: 'wzm',
            age: 18,
            others: {
                stature: 199,
                six: 'six six six',
            },
        };
        huawei.hms.analytics.analyticsService.onEvent(eventName, params);
        this.console.log('onEvent', eventName, 'params is', params);
    }
}
