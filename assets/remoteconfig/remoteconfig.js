const hasRemoteConfig = huawei && huawei.AGC && huawei.AGC.remoteConfig && huawei.AGC.remoteConfig.fetch ? true : false;
cc.Class({
  extends: cc.Component,

  properties: {
    console: require('Console'),
  },

  start() {
    if (!hasRemoteConfig) return;
    this._remoteConfig = huawei.AGC.remoteConfig;
    this._remoteConfig.setRemoteConfigListener((retCode, msg) => this.console.log("RemoteConfig", `${retCode}: ${msg}`))
  },

  fetchAndApply() {
    hasRemoteConfig && this._remoteConfig.fetchAndApply();
    this.console.log('Remote Config', 'Fetch config from remote and apply config!');
  },

  getValues() {
    let values = hasRemoteConfig ? this._remoteConfig.getMergedAll() : null;
    this.console.log('Remote Config', 'Get all configs : ' + JSON.stringify(values));
  },

  getValueForKey() {
    let value = hasRemoteConfig ? this._remoteConfig.getValueAsString('test') : null;
    this.console.log('Remote Config', 'Get config by key : test, value :' + value);
  },

  returnClick() {
    cc.director.loadScene('list');
  },

  onDestroy() {},


  // update (dt) {},
});