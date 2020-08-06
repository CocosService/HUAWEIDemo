cc.Class({
    extends: cc.Component,

    properties: {
        console: require('Console'),
    },


    start() {
        this.logStatus = true;
        this.console.log('首次调试，请在PC控制台输入 adb shell setprop debug.huawei.hms.analytics.app 应用的包名，打开调试模式');

    },

    enableLog(event, level) {
        if (level) {
            huawei.HMS.AnalyticsTools.enableLog(parseInt(level));
        } else {
            huawei.HMS.AnalyticsTools.enableLog();
        }
    },
    setAnalyticsEnabled() {
        huawei.HMS.analyticsService.setAnalyticsEnabled(this.logStatus);
        this.console.log('setAnalyticsEnabled', this.logStatus);
        this.logStatus = !this.logStatus;
    },

    setUserId() {
        let userId = 'wzm666';
        huawei.HMS.analyticsService.setUserId(userId);
        this.console.log('setUserId', userId);
    },

    setUserProfile() {
        let name = 'profile1';
        let value = 'wzm666';
        huawei.HMS.analyticsService.setUserProfile(name, value);
        this.console.log('setUserProfile', name, value);
    },

    setPushToken() {
        //todo:这个token仅做演示，正式token请跟进API获取
        let token = 'wzm666';
        huawei.HMS.analyticsService.setPushToken(token);
        this.console.log('setPushToken', token);
    },

    setMinActivitySessions() {
        let value = 1000 * 60 * 60;
        huawei.HMS.analyticsService.setMinActivitySessions(value);
        this.console.log('setMinActivitySessions', value, 'ms');
    },

    setSessionDuration() {
        let value = 1000 * 60 * 60;
        huawei.HMS.analyticsService.setSessionDuration(value);
        this.console.log('setSessionDuration', value, 'ms');
    },

    clearCachedData() {
        huawei.HMS.analyticsService.clearCachedData();
        this.console.log('clearCachedData', 'invoke');
    },

    getAAID() {
        huawei.HMS.analyticsService.getAAID();
        huawei.HMS.analyticsService.once(huawei.HMS.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_AAID, (result) => {
            this.console.log('getAAID', JSON.stringify(result));
        });
    },

    getUserProfiles() {
        huawei.HMS.analyticsService.getUserProfiles();
        huawei.HMS.analyticsService.once(huawei.HMS.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_USER_PROFILES, (result) => {
            this.console.log('getUserProfiles', JSON.stringify(result));
        });
    },

    pageStart() {
        let value = 'page_wzm';
        huawei.HMS.analyticsService.pageStart(value, value);
        this.console.log('pageStart', 'pageName=', value, 'pageClassOverride=', value);
    },

    pageEnd() {
        let value = 'page_wzm';
        huawei.HMS.analyticsService.pageEnd(value);
        this.console.log('pageEnd', 'pageName=', value);
    },

    pageCustomEvent() {
        cc.director.loadScene('event');
    },

    returnClick() {
        cc.director.loadScene('list');
    }
    // update (dt) {},
});
