import { _decorator, Component, director, sys } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('Analytics')
export class Analytics extends Component {
    @property({ type: Console })
    console: Console = null!;


    private logLevel: huawei.hms.analytics.LOG_LEVEL | null = null;

    start () {
        this.console.log(
            'please exec command: \
"adb shell setprop debug.huawei.hms.analytics.app package_name" \
to enable the debug mode at the first time'
        );
        this.setLogLevel(null, 'Debug');
    }

    enableLog () {
        if (this.logLevel) {
            huawei.hms.analytics.AnalyticsTools.enableLog(this.logLevel);
        } else {
            huawei.hms.analytics.AnalyticsTools.enableLog();
        }
        this.console.log(`enable log`);
    }

    setLogLevel (event: Event | null, levelStr?: string) {
        const LOG_LEVEL = huawei.hms.analytics.LOG_LEVEL;

        switch (levelStr) {
            case 'Default':
                this.logLevel = null;
                break;
            case 'Debug':
                this.logLevel = LOG_LEVEL.debug;
                break;
            case 'Info':
                this.logLevel = LOG_LEVEL.info;
                break;
            case 'Warn':
                this.logLevel = LOG_LEVEL.warn;
                break;
            case 'Error':
                this.logLevel = LOG_LEVEL.error;
                break;
            default:
                this.console.error(`Unknown log level: ${levelStr}`);
                return;
        }
    }


    //打开/关闭华为服务器对您上报的最终用户个人数据的接收
    setAnalyticsEnabled () {
        huawei.hms.analytics.analyticsService.setAnalyticsEnabled(true);
        this.console.log('setAnalyticsEnabled');
    }

    setAnalyticsDisabled () {
        huawei.hms.analytics.analyticsService.setAnalyticsEnabled(false);
        this.console.log('setAnalyticsDisabled');
    }



    setReportPolicies () {
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

    setSessionDuration () {
        const value = 1000 * 60 * 60;
        huawei.hms.analytics.analyticsService.setSessionDuration(value);
        this.console.log('setSessionDuration', value, 'ms');
    }

    setUserId () {
        const userId = 'wzm666';
        huawei.hms.analytics.analyticsService.setUserId(userId);
        this.console.log('setUserId', userId);
    }

    setUserProfile () {
        const name = 'profile1';
        const value = 'wzm666';
        huawei.hms.analytics.analyticsService.setUserProfile(name, value);
        this.console.log('setUserProfile', name, value);
    }

    deleteUserProfile () {
        const name = 'profile1';
        huawei.hms.analytics.analyticsService.setUserProfile(name, null);
        this.console.log('deleteUserProfile', name);
    }

    setPushToken () {
        // TODO: this token is for test only.
        const token = 'wzm666';
        huawei.hms.analytics.analyticsService.setPushToken(token);
        this.console.log('setPushToken', token);
    }

    setMinActivitySessions () {
        const value = 1000 * 60 * 60;
        huawei.hms.analytics.analyticsService.setMinActivitySessions(value);
        this.console.log('setMinActivitySessions', value, 'ms');
    }

    clearCachedData () {
        huawei.hms.analytics.analyticsService.clearCachedData();
        this.console.log('clearCachedData', 'invoke');
    }

    getAAID () {
        huawei.hms.analytics.analyticsService.getAAID();
        huawei.hms.analytics.analyticsService.once(
            huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_AAID,
            (result) => {
                this.console.log('getAAID');
                this.printAnalyticsResult(result);
            }
        );
    }

    getUserProfiles () {
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

    //自定义进入页面事件，需要在调用本接口后调用pageEnd接口配对使用。
    pageStart () {
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

    //自定义退出页面事件，需要在调用本接口前先调用pageStart接口配对使用。
    pageEnd () {
        const value = 'page_wzm';
        huawei.hms.analytics.analyticsService.pageEnd(value);
        this.console.log('pageEnd', 'pageName=', value);
    }


    customEvent () {
        director.loadScene('analytics-custom-event');
    }








    //2023.7.11 add

    /**
     * 设置是否限制数据分析能力
    */
    toggleRestrictionEnabled () {
        huawei.hms.analytics.analyticsService.setRestrictionEnabled(
            !huawei.hms.analytics.analyticsService.isRestrictionEnabled()
        );
        this.console.log(
            'isRestrictionEnabled',
            huawei.hms.analytics.analyticsService.isRestrictionEnabled()
        );
    }


    private _curCollectAdsIdEnabled = false;
    /**
     * 设置是否允许采集广告标识符
    */
    toggleCollectAdsIdEnabled () {
        this._curCollectAdsIdEnabled = !this._curCollectAdsIdEnabled;
        huawei.hms.analytics.analyticsService.setCollectAdsIdEnabled(this._curCollectAdsIdEnabled);
        this.console.log(
            'toggleCollectAdsIdEnabled',
            this._curCollectAdsIdEnabled
        );
    }

    /**
     * 获取是否限制数据共享。
     */
    getIsRestrictionShared () {
        huawei.hms.analytics.analyticsService.isRestrictionShared();
        huawei.hms.analytics.analyticsService.once(huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.IS_RESTRICTION_SHARED, (result) => {
            this.console.log(
                'isRestrictionShared',
                JSON.stringify(result)
            );
        })
    }

    private _curIsRestrictionShared = false;
    /**
     * 设置是否限制数据共享。
     */
    toggleSetRestrictionShared () {
        this._curIsRestrictionShared = !this._curIsRestrictionShared;
        huawei.hms.analytics.analyticsService.setRestrictionShared(this._curIsRestrictionShared);
        this.console.log('toggleSetRestrictionShared', this._curIsRestrictionShared);
    }


    /**
     * 添加默认事件参数，默认事件参数将被添加到除自动采集事件之外的所有事件中，默认事件参数与事件参数同名时，使用事件参数。
    */
    addDefaultEventParams () {
        let info = {
            platform: 'windows',
            os: 'win10',
        }
        huawei.hms.analytics.analyticsService.addDefaultEventParams(info);
        this.console.log('addDefaultEventParams', JSON.stringify(info));
    }


    setWXOpenId () {
        huawei.hms.analytics.analyticsService.setWXOpenId("testWXOpenId1");
        this.console.log('setWXOpenId:testWXOpenId1');
    }

    setWXUnionId () {
        huawei.hms.analytics.analyticsService.setWXUnionId("testWXUnionId1");
        this.console.log('setWXUnionId:testWXUnionId1');
    }

    setWXAppId () {
        huawei.hms.analytics.analyticsService.setWXAppId("testWXAppId1");
        this.console.log('setWXAppId:testWXAppId1');
    }

    setChannel () {
        huawei.hms.analytics.analyticsService.setChannel("AppGallery");
        this.console.log('setChannel:AppGallery');
    }

    private _curSetPushTokenCollectionEnabled = false;
    /**
     * 设置是否允许采集pushToken。
    */
    setPushTokenCollectionEnabled () {
        this._curSetPushTokenCollectionEnabled = !this._curSetPushTokenCollectionEnabled;
        huawei.hms.analytics.analyticsService.setPushTokenCollectionEnabled(this._curSetPushTokenCollectionEnabled);
        this.console.log('setPushTokenCollectionEnabled', this._curSetPushTokenCollectionEnabled);
    }

    private _curSetPropertyCollection = false;
    /**
     * 设置是否允许采集系统属性，支持关闭和开启userAgent属性是否采集。
    */
    togglePropertyCollection () {
        this._curSetPropertyCollection = !this._curSetPropertyCollection;
        huawei.hms.analytics.analyticsService.setPropertyCollection("userAgent", this._curSetPropertyCollection);
        this.console.log('setPropertyCollection', this._curSetPropertyCollection);
    }

    /**
     * 设置自定义Referrer 该接口仅第一次调用生效。
    */
    setCustomReferrer () {
        huawei.hms.analytics.analyticsService.setCustomReferrer("customReferrer1");
        this.console.log('setCustomReferrer:customReferrer1');
    }

    /**
     * 获取当前数据上报的数据处理位置。
    */
    getDataUploadSiteInfo () {
        huawei.hms.analytics.analyticsService.getDataUploadSiteInfo();
        huawei.hms.analytics.analyticsService.once(huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_DATA_UPLOAD_SITE_INFO, (result) => {
            this.console.log('getDataUploadSiteInfo', JSON.stringify(result));
        });
    }

    private printAnalyticsResult (result: huawei.hms.analytics.AnalyticsResult) {
        this.console.log('code:', result.code);
        this.console.log('originData:', result.originData);
        if (result.errMsg) this.console.log('errMsg:', result.errMsg);
        if (result.data) this.console.log('data:', result.data);
    }
}
