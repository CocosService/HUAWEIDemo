"use strict";
var huawei;
(function (huawei) {
    let agc;
    (function (agc) {
        let rc;
        (function (rc) {
            let RemoteConfigRetCode;
            (function (RemoteConfigRetCode) {
                RemoteConfigRetCode[RemoteConfigRetCode["FETCH_SUCCESS"] = 1000] = "FETCH_SUCCESS";
                RemoteConfigRetCode[RemoteConfigRetCode["FETCH_FAILED"] = 1100] = "FETCH_FAILED";
            })(RemoteConfigRetCode = rc.RemoteConfigRetCode || (rc.RemoteConfigRetCode = {}));
            let RemoteConfigSource;
            (function (RemoteConfigSource) {
                RemoteConfigSource[RemoteConfigSource["STATIC"] = 0] = "STATIC";
                RemoteConfigSource[RemoteConfigSource["DEFAULT"] = 1] = "DEFAULT";
                RemoteConfigSource[RemoteConfigSource["REMOTE"] = 2] = "REMOTE";
            })(RemoteConfigSource = rc.RemoteConfigSource || (rc.RemoteConfigSource = {}));
            class AGCRCBaseService {
                static callStaticMethod(...args) {
                    return jsb.reflection.callStaticMethod(...args);
                }
            }
            rc.AGCRCBaseService = AGCRCBaseService;
            class AGCRCService extends AGCRCBaseService {
                constructor() {
                    super(...arguments);
                    this.cls_ServiceAGCRemoteConfig = "org/cocos2dx/javascript/service/ServiceAGCRemoteConfig";
                    this.listener = null;
                }
                setRemoteConfigListener(listener) {
                    this.listener = listener;
                }
                fetchAndApply(intervalSeconds = -1) {
                    AGCRCService.callStaticMethod(this.cls_ServiceAGCRemoteConfig, "fetchAndApply", "(J)V", intervalSeconds);
                }
                fetch(intervalSeconds = -1) {
                    AGCRCService.callStaticMethod(this.cls_ServiceAGCRemoteConfig, "fetch", "(J)V", intervalSeconds);
                }
                applyLastFetched() {
                    AGCRCService.callStaticMethod(this.cls_ServiceAGCRemoteConfig, "applyLastFetched", "()V");
                }
                getValueAsBoolean(key) {
                    return AGCRCService.callStaticMethod(this.cls_ServiceAGCRemoteConfig, "getValueAsBoolean", "(Ljava/lang/String;)Z", key);
                }
                getValueAsDouble(key) {
                    return AGCRCService.callStaticMethod(this.cls_ServiceAGCRemoteConfig, "getValueAsDouble", "(Ljava/lang/String;)F", key);
                }
                getValueAsLong(key) {
                    return AGCRCService.callStaticMethod(this.cls_ServiceAGCRemoteConfig, "getValueAsLong", "(Ljava/lang/String;)I", key);
                }
                getValueAsString(key) {
                    return AGCRCService.callStaticMethod(this.cls_ServiceAGCRemoteConfig, "getValueAsString", "(Ljava/lang/String;)Ljava/lang/String;", key);
                }
                getMergedAll() {
                    return JSON.parse(AGCRCService.callStaticMethod(this.cls_ServiceAGCRemoteConfig, "getMergedAll", "()Ljava/lang/String;"));
                }
                getSource(key) {
                    return AGCRCService.callStaticMethod(this.cls_ServiceAGCRemoteConfig, "getSource", "(Ljava/lang/String;)I", key);
                }
                clearAll() {
                    AGCRCService.callStaticMethod(this.cls_ServiceAGCRemoteConfig, "clearAll", "()V");
                }
                setDeveloperMode(isDeveloperMode) {
                    AGCRCService.callStaticMethod(this.cls_ServiceAGCRemoteConfig, "setDeveloperMode", "(Z)V", isDeveloperMode);
                }
                onRemoteConfigResult(retCode, msg) {
                    this.listener && this.listener(retCode, msg);
                }
                ;
            }
            rc.AGCRCService = AGCRCService;
            rc.rcService = new AGCRCService();
            rc.rcService.support = typeof jsb !== 'undefined' && cc.sys.os === cc.sys.OS_ANDROID;
        })(rc = agc.rc || (agc.rc = {}));
    })(agc = huawei.agc || (huawei.agc = {}));
})(huawei || (huawei = {}));
