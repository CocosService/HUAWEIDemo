cc.Class({
  extends: cc.Component,

  properties: {
    console: require('Console'),
  },

  start() {
    this.hasRemoteConfig = huawei && huawei.agc && huawei.agc.rc && huawei.agc.rc.rcService && huawei.agc.rc.rcService.support ? true : false;
    if (!this.hasRemoteConfig) return;
    this._remoteConfig = huawei.agc.rc.rcService;
    this._remoteConfig.setRemoteConfigListener((retCode, msg) => this.console.log("RemoteConfig", `${retCode}: ${msg}`))
  },

  fetchAndApply() {
    this.hasRemoteConfig && this._remoteConfig.fetchAndApply(0);
    this.console.log('Remote Config', 'Fetch config from remote and apply config!');
  },

  getValues() {
    let values = this.hasRemoteConfig ? this._remoteConfig.getMergedAll() : null;
    this.console.log('Remote Config', 'Get all configs : ' + JSON.stringify(values));
  },

  getValueForKey() {
    let value = this.hasRemoteConfig ? this._remoteConfig.getValueAsString('test') : null;
    this.console.log('Remote Config', 'Get config by key : test, value :' + value);
  },

  returnClick() {
    cc.director.loadScene('list');
  },

  onDestroy() {},


  // update (dt) {},
});