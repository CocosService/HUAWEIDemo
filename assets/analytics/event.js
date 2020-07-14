cc.Class({
    extends: cc.Component,

    properties: {
        console: require('Console'),
    },


    start() {
        this.customEventIdx = 0;
        window._demoEvent = this;
    },
    returnClick() {
        cc.director.loadScene('analytics');
    },

    /**
     * 参照网址进行配置
     * https://developer.huawei.com/consumer/cn/doc/development/HMS-Guides/event_description
     */
    startLevel() {
        let type = huawei.HMS.HAEventType;
        let param = huawei.HMS.HAParamType;
        let params = {};
        params[param.LEVELNAME] = 'wzm666';
        huawei.HMS.analytics.onEvent(type.STARTLEVEL, params);
        this.console.log('onEvent', type.STARTLEVEL, 'params is', JSON.stringify(params));
    },

    completeLevel() {
        let type = huawei.HMS.HAEventType;
        let param = huawei.HMS.HAParamType;
        let params = {};
        params[param.LEVELNAME] = 'wzm666';
        params[param.RESULT] = 'success';
        huawei.HMS.analytics.onEvent(type.COMPLETELEVEL, params);
        this.console.log('onEvent', type.COMPLETELEVEL, 'params is', JSON.stringify(params));
    },

    onEvent() {
        let eventName = 'myEvent';
        let params = {
            idx: this.customEventIdx++,
            name: 'wzm',
            age: 18,
            others: {
                stature: 199,
                six: 'six six six'
            }
        };
        huawei.HMS.analytics.onEvent(eventName, params);
        this.console.log('onEvent', eventName, 'params is', JSON.stringify(params));
    }
    // update (dt) {},
});
