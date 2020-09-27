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
        huawei.agc.crash.crashService.enableCrashCollection(this.crashState);
        this.crashState = !this.crashState;
    },

    testJavaCrash() {
        let time = 5;
        this.console.log('app will crash in ', time, ' seconds, please restart the app and wait for a while and then check the crash at AGC website at last');
        this.scheduleOnce(() => {
            huawei.agc.crash.crashService.testIt();

        }, time);
    },

    testNativeCrash() {
        let time = 5;
        this.console.log('app will crash in ', time, ' seconds, please restart the app and wait for a while and then check the crash at AGC website at last');
        this.scheduleOnce(() => {
            crashTest && crashTest();
        }, time);
    },

    setUserId() {
        const userId = 'HUAWEI_Crash_Demo'
        huawei.agc.crash.crashService.setUserId(userId);
    },

    log() {
        let logType = huawei.agc.crash.LOG;
        huawei.agc.crash.crashService.log(logType.DEBUG, 'debug log invoke');
        huawei.agc.crash.crashService.log(logType.INFO, 'info log invoke');
        huawei.agc.crash.crashService.log(logType.WARN, 'warn log invoke');
        huawei.agc.crash.crashService.log(logType.ERROR, 'error log invoke');
        huawei.agc.crash.crashService.log(logType.VERBOSE, 'verbose log invoke');
    },

    setCustomKey() {
        huawei.agc.crash.crashService.setCustomKey('floatKey', 123.11);
        huawei.agc.crash.crashService.setCustomKey('intKey', 123);
        huawei.agc.crash.crashService.setCustomKey('stringKey', 'crash');
        huawei.agc.crash.crashService.setCustomKey('boolKey', true);
    }
    // update (dt) {},
});
