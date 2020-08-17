cc.Class({
    extends: cc.Component,

    properties: {
        console: require('Console'),
    },


    start() {
        this.crashState = true;
        window._demoCrash = this;
    },
    returnClick() {
        cc.director.loadScene('list');
    },

    toggleCrashCollection() {
        this.console.log('enableCrashCollection invoke with state:', this.crashState);
         huawei.agc.crash.CrashService.enableCrashCollection(this.crashState);
        this.crashState = !this.crashState;
    },

    testJavaCrash() {
        let time = 5;
        this.console.log('app will crash in ', time, ' seconds, please restart the app and wait for a while and then check the crash at AGC website at last');
        this.scheduleOnce(() => {
             huawei.agc.crash.CrashService.testIt();

        }, time);
    },

    testNativeCrash() {
        let time = 5;
        this.console.log('app will crash in ', time, ' seconds, please restart the app and wait for a while and then check the crash at AGC website at last');
        this.scheduleOnce(() => {
            crashTest && crashTest();
        }, time);
    },
    // update (dt) {},
});
