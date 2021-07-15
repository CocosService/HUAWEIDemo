cc.Class({
  extends: cc.Component,

  properties: {
    console: require('Console'),
  },

  start() {
    const savedGamePluginEnabled = cc.sys.localStorage.getItem('agcAPMSGamePluginEnabled');
    if (savedGamePluginEnabled == null)
      this.gamePluginEnabled = true; // Will be toggled to false at the first time.
    else
      this.gamePluginEnabled = savedGamePluginEnabled === 'true' ? true : false;

    this.hasAPMS = huawei && huawei.agc && huawei.agc.apms && huawei.agc.apms.apmsService && huawei.agc.apms.apmsService.support ? true : false;
    if (!this.hasAPMS) return;
    this.apmsGame = huawei.agc.apms.game;
    this.apmsGameService = this.apmsGame.apmsGameService;
    // Start the service of APM Game Plugin.
    this.apmsGameService.start();
    this.console.log('start the service of APM Game Plugin');
  },

  startLoadingScene() {
    if (!this.hasAPMS) return;
    this.scene = 'Game';
    const gameAttribute = new this.apmsGame.GameAttribute(this.scene, this.apmsGame.LoadingState.LOADING);
    this.apmsGameService.startLoadingScene(gameAttribute);
    this.console.log('startLoadingScene, scene:', gameAttribute.scene, 'loadingState:', gameAttribute.loadingState);
  },

  stopLoadingScene() {
    if (!this.hasAPMS) return;
    if (!this.ensureScene()) return;
    this.apmsGameService.stopLoadingScene(this.scene);
    this.console.log('stopLoadingScene, scene:', this.scene);
  },

  setCurrentGameAttribute() {
    if (!this.hasAPMS) return;
    if (!this.ensureScene()) return;
    const gameAttribute = new this.apmsGame.GameAttribute(this.scene, this.apmsGame.LoadingState.LOADED);
    this.apmsGameService.setCurrentGameAttribute(gameAttribute);
    this.console.log('change current loadingState to:', gameAttribute.loadingState);
  },

  setReportMinRate() {
    if (!this.hasAPMS) return;
    const reportMinRate = 5;
    this.apmsGameService.setReportMinRate(reportMinRate);
    this.console.log('set report rate to:', reportMinRate, 'minute(s)');
  },

  toggleEnableGamePlugin() {
    if (!this.hasAPMS) return;
    this.gamePluginEnabled = !this.gamePluginEnabled;
    this.apmsGameService.enableGamePlugin(this.gamePluginEnabled);
    cc.sys.localStorage.setItem('agcAPMSGamePluginEnabled', this.gamePluginEnabled + '');
    this.console.log('Toogle enable game plugin:', this.gamePluginEnabled);
  },

  ensureScene() {
    if (!this.scene) {
      this.console.log('please click the startLoadingScene button first');
      return false;
    }
    return true;
  },

  returnClick() {
    cc.director.loadScene('apms');
  },

  onDestroy() {
    if (!this.hasAPMS) return;
    // Stop the service of APM Game Plugin.
    this.apmsGameService.stop();
  },
});
