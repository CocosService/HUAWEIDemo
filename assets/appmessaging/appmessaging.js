cc.Class({
    extends: cc.Component,

    properties: {
        console: require('Console'),
    },


    start() {
        this.crashState = true;
        window._demoAppMessaging = this;
        this.displayEnable = false;
        this.fetchEnable = false;

        this.console.log('首先去 AGC 后台，开通并配置应用内消息，才能测试本项目');
        this.console.log('测试需要添加 AAID 到 AGC 应用内消息后台才能开启调试模式');
        this.initListener();
    },

    initListener() {
        huawei.AGC.AppMessaging.appMessagingService.on(huawei.AGC.AppMessaging.AGC_APP_MESSAGING_LISTENER_NAME.ON_MESSAGE_DISMISS, (result) => {
            this.console.log('receive ON_MESSAGE_DISMISS', JSON.stringify(result));
        }, this);
        huawei.AGC.AppMessaging.appMessagingService.on(huawei.AGC.AppMessaging.AGC_APP_MESSAGING_LISTENER_NAME.ON_MESSAGE_CLICK, (result) => {
            this.console.log('receive ON_MESSAGE_CLICK', JSON.stringify(result));

        }, this);
        huawei.AGC.AppMessaging.appMessagingService.on(huawei.AGC.AppMessaging.AGC_APP_MESSAGING_LISTENER_NAME.ON_MESSAGE_DISPLAY, (result) => {
            this.console.log('receive ON_MESSAGE_DISPLAY', JSON.stringify(result));

        }, this);
    },
    onDestroy() {
        huawei.AGC.AppMessaging.appMessagingService.targetOff(this);
    },
    returnClick() {
        cc.director.loadScene('list');
    },

    getAAID() {
        this.console.log('当前应用AAID', huawei.AGC.AppMessaging.appMessagingService.getAAID());
    },

    setForceFetch() {
        huawei.AGC.AppMessaging.appMessagingService.setForceFetch();
    },

    setDisplayEnable() {
        huawei.AGC.AppMessaging.appMessagingService.setDisplayEnable(this.displayEnable);
        this.console.log('setDisplayEnable', this.displayEnable);
        this.displayEnable = !this.displayEnable;
    },

    setFetchMessageEnable() {
        huawei.AGC.AppMessaging.appMessagingService.setFetchMessageEnable(this.fetchEnable);
        this.console.log('setFetchMessageEnable', this.fetchEnable);
        this.fetchEnable = !this.fetchEnable;
    },

    isFetchMessageEnable() {
        this.console.log('isFetchMessageEnable', huawei.AGC.AppMessaging.appMessagingService.isFetchMessageEnable());
    },

    isDisplayEnable() {
        this.console.log('isDisplayEnable', huawei.AGC.AppMessaging.appMessagingService.isDisplayEnable());
    }

    // update (dt) {},
});
