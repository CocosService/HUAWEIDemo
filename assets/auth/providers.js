cc.Class({
  extends: cc.Component,

  properties: {
    BtnItem: cc.Prefab,
    scrollContent: cc.Node,
  },


  start() {
    this.hasAuth = huawei && huawei.agc && huawei.agc.auth && huawei.agc.auth.authService && huawei.agc.auth.authService.support ? true : false;
    if (!this.hasAuth) return;
    this._auth = huawei.agc.auth.authService;
    let usedProviders = JSON.parse(this._auth.getSupportAuthType());
    console.log(usedProviders);
    for (var key in huawei.agc.auth.AuthProvider) {
      let value = huawei.agc.auth.AuthProvider[key]
      if (typeof usedProviders.find(e => e === value) !== 'undefined') {
        let prefab = cc.instantiate(this.BtnItem);
        prefab.getComponent('BtnItem').init(key, () => {
          this._auth.loginAuthType = value;
          this._auth.logout();
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