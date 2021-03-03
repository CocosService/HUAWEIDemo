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
        this.currentLocation = huawei.agc.appmessaging.Location.CENTER;
        this.console.log('please open and config app message at AGC website first');
        this.console.log('need to add AAID to AGC website to open debug mode');
        this.initListener();
    },

    initListener() {
        huawei.agc.appmessaging.appMessagingService.on(huawei.agc.appmessaging.AGC_APP_MESSAGING_LISTENER_NAME.ON_MESSAGE_DISMISS, (result) => {
            this.console.log('receive ON_MESSAGE_DISMISS', JSON.stringify(result));
        }, this);
        huawei.agc.appmessaging.appMessagingService.on(huawei.agc.appmessaging.AGC_APP_MESSAGING_LISTENER_NAME.ON_MESSAGE_CLICK, (result) => {
            this.console.log('receive ON_MESSAGE_CLICK', JSON.stringify(result));
        }, this);
        huawei.agc.appmessaging.appMessagingService.on(huawei.agc.appmessaging.AGC_APP_MESSAGING_LISTENER_NAME.ON_MESSAGE_DISPLAY, (result) => {
            this.console.log('receive ON_MESSAGE_DISPLAY', JSON.stringify(result));
        }, this);

        huawei.agc.appmessaging.appMessagingService.on(huawei.agc.appmessaging.AGC_APP_MESSAGING_LISTENER_NAME.ON_MESSAGE_ERROR, (result) => {
            this.console.log('receive ON_MESSAGE_ERROR', JSON.stringify(result));
        }, this);
    },
    onDestroy() {
        huawei.agc.appmessaging.appMessagingService.targetOff(this);
    },
    returnClick() {
        cc.director.loadScene('list');
    },

    getAAID() {
        this.console.log('current AAID', huawei.agc.appmessaging.appMessagingService.getAAID());
    },

    setForceFetch() {
        huawei.agc.appmessaging.appMessagingService.setForceFetch();
    },

    setDisplayEnable() {
        huawei.agc.appmessaging.appMessagingService.setDisplayEnable(this.displayEnable);
        this.console.log('setDisplayEnable', this.displayEnable);
        this.displayEnable = !this.displayEnable;
    },

    setFetchMessageEnable() {
        huawei.agc.appmessaging.appMessagingService.setFetchMessageEnable(this.fetchEnable);
        this.console.log('setFetchMessageEnable', this.fetchEnable);
        this.fetchEnable = !this.fetchEnable;
    },

    isFetchMessageEnable() {
        this.console.log('isFetchMessageEnable', huawei.agc.appmessaging.appMessagingService.isFetchMessageEnable());
    },

    isDisplayEnable() {
        this.console.log('isDisplayEnable', huawei.agc.appmessaging.appMessagingService.isDisplayEnable());
    },
    setLocation() {
        let service = huawei.agc.appmessaging;
        let tips = 'CENTER';
        if (this.currentLocation === service.Location.BOTTOM) {
            this.currentLocation = service.Location.CENTER
        } else if (this.currentLocation === service.Location.CENTER) {
            this.currentLocation = service.Location.BOTTOM
            tips = 'BOTTOM';
        }
        this.console.log('set location to ', tips);
        service.appMessagingService.setDisplayLocation(this.currentLocation);
    }

    // update (dt) {},
});
