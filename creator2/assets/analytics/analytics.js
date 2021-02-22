cc.Class({
    extends: cc.Component,

    properties: {
        console: require('Console'),
    },

    start() {
        this.logStatus = true;
        this.console.log('please exec command adb shell setprop debug.huawei.hms.analytics.app package_name，first time to open debug mode');
    },

    enableLog(event, level) {
        if (level) {
            huawei.hms.analytics.AnalyticsTools.enableLog(parseInt(level));
        } else {
            huawei.hms.analytics.AnalyticsTools.enableLog();
        }
    },

    setAnalyticsEnabled() {
        huawei.hms.analytics.analyticsService.setAnalyticsEnabled(this.logStatus);
        this.console.log('setAnalyticsEnabled', this.logStatus);
        this.logStatus = !this.logStatus;
    },

    setReportPolicies() {
        let ReportPolicy = huawei.hms.analytics.ReportPolicy;
        let moveBackgroundPolicy = ReportPolicy.ON_MOVE_BACKGROUND_POLICY;
        let scheduledTimePolicy = ReportPolicy.ON_SCHEDULED_TIME_POLICY;
        scheduledTimePolicy.threshold = 600;
        huawei.hms.analytics.analyticsService.setReportPolicies(moveBackgroundPolicy, scheduledTimePolicy);
        this.console.log('setReportPolicies', 'Set ON_MOVE_BACKGROUND_POLICY');
        this.console.log('setReportPolicies', `Set ON_SCHEDULED_TIME_POLICY with threshold ${scheduledTimePolicy.threshold}`);
    },

    setUserId() {
        let userId = 'wzm666';
        huawei.hms.analytics.analyticsService.setUserId(userId);
        this.console.log('setUserId', userId);
    },

    setUserProfile() {
        let name = 'profile1';
        let value = 'wzm666';
        huawei.hms.analytics.analyticsService.setUserProfile(name, value);
        this.console.log('setUserProfile', name, value);
    },

    deleteUserProfile() {
        let name = 'profile1';
        huawei.hms.analytics.analyticsService.setUserProfile(name, null);
        this.console.log('deleteUserProfile', name);
    },

    setPushToken() {
        //todo: this token is just for test
        let token = 'wzm666';
        huawei.hms.analytics.analyticsService.setPushToken(token);
        this.console.log('setPushToken', token);
    },

    setMinActivitySessions() {
        let value = 1000 * 60 * 60;
        huawei.hms.analytics.analyticsService.setMinActivitySessions(value);
        this.console.log('setMinActivitySessions', value, 'ms');
    },

    setSessionDuration() {
        let value = 1000 * 60 * 60;
        huawei.hms.analytics.analyticsService.setSessionDuration(value);
        this.console.log('setSessionDuration', value, 'ms');
    },

    clearCachedData() {
        huawei.hms.analytics.analyticsService.clearCachedData();
        this.console.log('clearCachedData', 'invoke');
    },

    getAAID() {
        huawei.hms.analytics.analyticsService.getAAID();
        huawei.hms.analytics.analyticsService.once(huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_AAID, (result) => {
            this.console.log('getAAID', JSON.stringify(result));
        });
    },

    getUserProfiles() {
        huawei.hms.analytics.analyticsService.getUserProfiles();
        huawei.hms.analytics.analyticsService.once(huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_USER_PROFILES, (result) => {
            this.console.log('getUserProfiles', JSON.stringify(result));
        });
    },

    pageStart() {
        let value = 'page_wzm';
        huawei.hms.analytics.analyticsService.pageStart(value, value);
        this.console.log('pageStart', 'pageName=', value, 'pageClassOverride=', value);
    },

    pageEnd() {
        let value = 'page_wzm';
        huawei.hms.analytics.analyticsService.pageEnd(value);
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
