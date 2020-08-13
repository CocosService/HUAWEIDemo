const hasAuth = huawei && huawei.AGC && huawei.AGC.auth && huawei.AGC.auth.switchAuthType ? true : false;
cc.Class({
  extends: cc.Component,

  properties: {
    BtnItem: cc.Prefab,
    scrollContent: cc.Node,
  },


  start() {
    if (!hasAuth) return;
    this._auth = huawei.AGC.auth;
    let usedProviders = JSON.parse(this._auth.getSupportAuthType());
    console.log(usedProviders);
    for (var key in this._auth.AuthProvider) {
      let value = this._auth.AuthProvider[key]
      if (typeof usedProviders.find(e => e === value) !== 'undefined') {
        let prefab = cc.instantiate(this.BtnItem);
        prefab.getComponent('BtnItem').init(key, () => {
          this._auth.loginAuthType = value;
          this.returnClick();
        });
        this.scrollContent.addChild(prefab);
      }
    }
  },


  returnClick() {
    cc.director.loadScene('auth');
  },

  onDestroy() {},


  // update (dt) {},
});