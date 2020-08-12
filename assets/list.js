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
        turnOn = !!(huawei.HMS && huawei.HMS.Analytics && huawei.HMS.Analytics.analyticsService);
        break;
      case 'applinking':
        turnOn = !!(huawei.AGC && huawei.AGC.AppLinking && huawei.AGC.AppLinking.appLinkingService);
        break;
      case 'appmessaging':
        turnOn = !!(huawei.AGC && huawei.AGC.AppMessaging && huawei.AGC.AppMessaging.appMessagingService);
        break;
      case 'crash':
        turnOn = !!(huawei.AGC && huawei.AGC.Crash && huawei.AGC.Crash.CrashService);
        break;
      case 'location':
        turnOn = !!(huawei.HMS && huawei.HMS.Location && huawei.HMS.Location.locationService);
        break;
      case 'apms':
        turnOn = !!(huawei.AGC && huawei.AGC.apms && huawei.AGC.apms.enableCollection);
      case 'remoteconfig':
        turnOn = !!(huawei.AGC && huawei.AGC.remoteConfig && huawei.AGC.remoteConfig.fetch);
        break;
      default:
        break;
    }
    return turnOn;
  }

  // update (dt) {},
});