import { _decorator, Component, director } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('Analytics')
export class Analytics extends Component {
    @property({ type: Console })
    console: Console = null!;

    private analyticsEnabled = true;

    start() {
        this.console.log(
            'please exec command: \
"adb shell setprop debug.huawei.hms.analytics.app package_name" \
to enable the debug mode at the first time'
        );
        this.enableLog(null, 'Debug');
    }

    enableLog(event: Event | null, level?: string) {
        const LOG_LEVEL = huawei.hms.analytics.LOG_LEVEL;

        let levelNum = undefined;
        switch (level) {
            case 'Debug':
                levelNum = LOG_LEVEL.debug;
                break;
            case 'Info':
                levelNum = LOG_LEVEL.info;
                break;
            case 'Warn':
                levelNum = LOG_LEVEL.warn;
                break;
            case 'Error':
                levelNum = LOG_LEVEL.error;
                break;
            default:
                this.console.error(`Unknown log level: ${level}`);
                return;
        }

        huawei.hms.analytics.AnalyticsTools.enableLog(levelNum);
        this.console.log(`enable log: ${level}`);
    }

    setReportPolicies() {
        const ReportPolicy = huawei.hms.analytics.ReportPolicy;
        const moveBackgroundPolicy = ReportPolicy.ON_MOVE_BACKGROUND_POLICY;
        const scheduledTimePolicy = ReportPolicy.ON_SCHEDULED_TIME_POLICY;
        scheduledTimePolicy.threshold = 600;
        huawei.hms.analytics.analyticsService.setReportPolicies(
            moveBackgroundPolicy,
            scheduledTimePolicy
        );
        this.console.log('setReportPolicies', 'Set ON_MOVE_BACKGROUND_POLICY');
        this.console.log(
            'setReportPolicies',
            `Set ON_SCHEDULED_TIME_POLICY with threshold ${scheduledTimePolicy.threshold}`
        );
    }

    setSessionDuration() {
        const value = 1000 * 60 * 60;
        huawei.hms.analytics.analyticsService.setSessionDuration(value);
        this.console.log('setSessionDuration', value, 'ms');
    }

    setUserId() {
        const userId = 'wzm666';
        huawei.hms.analytics.analyticsService.setUserId(userId);
        this.console.log('setUserId', userId);
    }

    setUserProfile() {
        const name = 'profile1';
        const value = 'wzm666';
        huawei.hms.analytics.analyticsService.setUserProfile(name, value);
        this.console.log('setUserProfile', name, value);
    }

    deleteUserProfile() {
        const name = 'profile1';
        huawei.hms.analytics.analyticsService.setUserProfile(name, null);
        this.console.log('deleteUserProfile', name);
    }

    setPushToken() {
        // TODO: this token is for test only.
        const token = 'wzm666';
        huawei.hms.analytics.analyticsService.setPushToken(token);
        this.console.log('setPushToken', token);
    }

    setMinActivitySessions() {
        const value = 1000 * 60 * 60;
        huawei.hms.analytics.analyticsService.setMinActivitySessions(value);
        this.console.log('setMinActivitySessions', value, 'ms');
    }

    clearCachedData() {
        huawei.hms.analytics.analyticsService.clearCachedData();
        this.console.log('clearCachedData', 'invoke');
    }

    getAAID() {
        huawei.hms.analytics.analyticsService.getAAID();
        huawei.hms.analytics.analyticsService.once(
            huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_AAID,
            (result) => {
                this.console.log('getAAID');
                this.printAnalyticsResult(result);
            }
        );
    }

    getUserProfiles() {
        huawei.hms.analytics.analyticsService.getUserProfiles();
        huawei.hms.analytics.analyticsService.once(
            huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME
                .GET_USER_PROFILES,
            (result) => {
                this.console.log('getUserProfiles');
                this.printAnalyticsResult(result);
            }
        );
    }

    pageStart() {
        const value = 'page_wzm';
        huawei.hms.analytics.analyticsService.pageStart(value, value);
        this.console.log(
            'pageStart',
            'pageName=',
            value,
            'pageClassOverride=',
            value
        );
    }

    pageEnd() {
        const value = 'page_wzm';
        huawei.hms.analytics.analyticsService.pageEnd(value);
        this.console.log('pageEnd', 'pageName=', value);
    }

    toggleAnalyticsEnabled() {
        huawei.hms.analytics.analyticsService.setAnalyticsEnabled(
            this.analyticsEnabled
        );
        this.console.log('toggleAnalyticsEnabled', this.analyticsEnabled);
        this.analyticsEnabled = !this.analyticsEnabled;
    }

    customEvent() {
        director.loadScene('analytics-custom-event');
    }

    private printAnalyticsResult(result: huawei.hms.analytics.AnalyticsResult) {
        this.console.log('code:', result.code);
        this.console.log('originData:', result.originData);
        if (result.errMsg) this.console.log('errMsg:', result.errMsg);
        if (result.data) this.console.log('data:', result.data);
    }
}
