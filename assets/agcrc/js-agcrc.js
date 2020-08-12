(function () {
  let _global = globalThis || global || window || self;
  _global.huawei = _global.huawei || {};
  huawei.AGC = huawei.AGC || {};
  huawei.AGC.remoteConfig = huawei.AGC.remoteConfig || {};
  huawei.AGC.remoteConfig.RemoteConfigRetCode = {
    FETCH_SUCCESS: 1000,
    FETCH_FAILED: 1100
  }
  huawei.AGC.remoteConfig.RemoteConfigSource = {
    STATIC: 0,
    DEFAULT: 1,
    REMOTE: 2
  }
  huawei.AGC.remoteConfig.setRemoteConfigListener = (listener) => {
    if (typeof listener !== 'function') throw new TypeError("the listener not be Function");
    huawei.AGC.remoteConfig.listener = listener;
  };
  if (!_global.jsb || !jsb.reflection) return;
  // Only Android support AGC Remote Config
  if (cc.sys.os === cc.sys.OS_ANDROID) {
    let cls_ServiceAGCRemoteConfig = "org/cocos2dx/javascript/service/ServiceAGCRemoteConfig";
    huawei.AGC.remoteConfig.fetchAndApply = (intervalSeconds = -1) => {
      jsb.reflection.callStaticMethod(cls_ServiceAGCRemoteConfig, "fetchAndApply", "(J)V", intervalSeconds);
    }
    huawei.AGC.remoteConfig.fetch = (intervalSeconds = -1) => {
      jsb.reflection.callStaticMethod(cls_ServiceAGCRemoteConfig, "fetch", "(J)V", intervalSeconds);
    }
    huawei.AGC.remoteConfig.applyLastFetched = () => {
      jsb.reflection.callStaticMethod(cls_ServiceAGCRemoteConfig, "applyLastFetched", "()V");
    }
    huawei.AGC.remoteConfig.getValueAsBoolean = (key) => {
      return jsb.reflection.callStaticMethod(cls_ServiceAGCRemoteConfig, "getValueAsBoolean", "(Ljava/lang/String;)Z", key);
    }
    huawei.AGC.remoteConfig.getValueAsDouble = (key) => {
      return jsb.reflection.callStaticMethod(cls_ServiceAGCRemoteConfig, "getValueAsDouble", "(Ljava/lang/String;)F", key);
    }
    huawei.AGC.remoteConfig.getValueAsLong = (key) => {
      return jsb.reflection.callStaticMethod(cls_ServiceAGCRemoteConfig, "getValueAsLong", "(Ljava/lang/String;)I", key);
    }
    huawei.AGC.remoteConfig.getValueAsString = (key) => {
      return jsb.reflection.callStaticMethod(cls_ServiceAGCRemoteConfig, "getValueAsString", "(Ljava/lang/String;)Ljava/lang/String;", key);
    }
    huawei.AGC.remoteConfig.getMergedAll = () => {
      return JSON.parse(jsb.reflection.callStaticMethod(cls_ServiceAGCRemoteConfig, "getMergedAll", "()Ljava/lang/String;"));
    }
    huawei.AGC.remoteConfig.getSource = (key) => {
      return jsb.reflection.callStaticMethod(cls_ServiceAGCRemoteConfig, "getSource", "(Ljava/lang/String;)I", key);
    }
    huawei.AGC.remoteConfig.clearAll = () => {
      jsb.reflection.callStaticMethod(cls_ServiceAGCRemoteConfig, "clearAll", "()V");
    }
    huawei.AGC.remoteConfig.setDeveloperMode = (isDeveloperMode) => {
      jsb.reflection.callStaticMethod(cls_ServiceAGCRemoteConfig, "setDeveloperMode", "(Z)V", isDeveloperMode);
    }
    huawei.AGC.remoteConfig.onRemoteConfigResult = (retCode, msg) => {
      huawei.AGC.remoteConfig.listener && huawei.AGC.remoteConfig.listener(retCode, msg);
    };
  }
})();