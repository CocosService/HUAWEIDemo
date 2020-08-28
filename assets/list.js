cc.Class({
  extends: cc.Component,

  properties: {
    BtnItem: cc.Prefab,
    scrollContent: cc.Node,
    list: [cc.Class({
      name: 'list-item',
      properties: {
        sceneName: cc.String,
        scene: cc.SceneAsset,
      }
    })],
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start() {
    this.list.forEach((item) => {
      if (this.checkAbility(item.sceneName)) {
        let prefab = cc.instantiate(this.BtnItem);
        prefab.getComponent('BtnItem').init(item.sceneName, item.scene);
        this.scrollContent.addChild(prefab)
      }
    });
  },

  /**
   * 判断某个功能是否开启
   * @param sceneName
   */
  checkAbility(sceneName) {
    let turnOn = false;
    sceneName = sceneName.toLowerCase();
    switch (sceneName) {
      case 'analytics':
        turnOn = !!(huawei.hms && huawei.hms.analytics && huawei.hms.analytics.analyticsService);
        break;
      case 'applinking':
        turnOn = !!(huawei.agc && huawei.agc.applinking && huawei.agc.applinking.appLinkingService);
        break;
      case 'appmessaging':
        turnOn = !!(huawei.agc && huawei.agc.appmessaging && huawei.agc.appmessaging.appMessagingService);
        break;
      case 'crash':
        turnOn = !!(huawei.agc && huawei.agc.crash && huawei.agc.crash.CrashService);
        break;
      case 'location':
        turnOn = !!(huawei.hms && huawei.hms.location && huawei.hms.location.locationService);
        break;
      case 'apms':
        turnOn = !!(huawei && huawei.agc && huawei.agc.apms && huawei.agc.apms.apmsService && huawei.agc.apms.apmsService.support);
        break;
      case 'remoteconfig':
        turnOn = !!(huawei && huawei.agc && huawei.agc.rc && huawei.agc.rc.rcService && huawei.agc.rc.rcService.support);
        break;
      case 'auth':
        turnOn = !!(huawei && huawei.agc && huawei.agc.auth && huawei.agc.auth.authService && huawei.agc.auth.authService.support);
        break;
      default:
        break;
    }
    return turnOn;
  }
  // update (dt) {},
});