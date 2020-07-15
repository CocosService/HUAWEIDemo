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
        huawei.AGC.AGConnectCrashService.enableCrashCollection(this.crashState);
        this.crashState = !this.crashState;
    },

    testJavaCrash() {
        let time = 5;
        this.console.log(time, '秒后程序崩溃，崩溃后请重启程序等候几秒，再去 AGC 后台查看崩溃日志');
        this.scheduleOnce(() => {
            huawei.AGC.AGConnectCrashService.testIt();

        }, time);
    },

    testNativeCrash() {
        let time = 5;
        this.console.log(time, '秒后程序崩溃，崩溃后请重启程序等候几秒，再去 AGC 后台查看崩溃日志');
        this.scheduleOnce(() => {
            crashTest && crashTest();
        }, time);
    },
    // update (dt) {},
});
