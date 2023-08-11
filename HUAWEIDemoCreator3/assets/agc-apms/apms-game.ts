import { _decorator, Component, director, sys } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

/**
 *  弃用
*/
@ccclass('APMSGame')
export class APMSGame extends Component {
    // @property({ type: Console })
    // console: Console = null!;

    // gamePluginEnabled = true; // Will be toggled to false at the first time.
    // scene = 'Game';

    // private apmsGame: typeof huawei.agc.apms.game = (typeof huawei ===
    // 'undefined'
    //     ? null
    //     : huawei?.agc?.apms?.game)!;

    // private apmsGameService: typeof huawei.agc.apms.game.apmsGameService = (typeof huawei ===
    // 'undefined'
    //     ? null
    //     : huawei?.agc?.apms?.game?.apmsGameService)!;

    // start() {
    //     const savedGamePluginEnabled = sys.localStorage.getItem(
    //         'agcAPMSGamePluginEnabled'
    //     );
    //     if (savedGamePluginEnabled != null)
    //         this.gamePluginEnabled =
    //             savedGamePluginEnabled === 'true' ? true : false;

    //     // Start the service of APM Game Plugin.
    //     this.apmsGameService.start();
    //     this.console.log('start the service of APM Game Plugin');
    // }

    // startLoadingScene() {
    //     const gameAttribute = new this.apmsGame.GameAttribute(
    //         this.scene,
    //         this.apmsGame.LoadingState.LOADING
    //     );
    //     this.apmsGameService.startLoadingScene(gameAttribute);
    //     this.console.log(
    //         'startLoadingScene, scene:',
    //         gameAttribute.scene,
    //         'loadingState:',
    //         gameAttribute.loadingState
    //     );
    // }

    // stopLoadingScene() {
    //     this.apmsGameService.stopLoadingScene(this.scene);
    //     this.console.log('stopLoadingScene, scene:', this.scene);
    // }

    // setCurrentGameAttribute() {
    //     const gameAttribute = new this.apmsGame.GameAttribute(
    //         this.scene,
    //         this.apmsGame.LoadingState.LOADED
    //     );
    //     this.apmsGameService.setCurrentGameAttribute(gameAttribute);
    //     this.console.log(
    //         'change current loadingState to:',
    //         gameAttribute.loadingState
    //     );
    // }

    // setReportMinRate() {
    //     const reportMinRate = 5;
    //     this.apmsGameService.setReportMinRate(reportMinRate);
    //     this.console.log('set report rate to:', reportMinRate, 'minute(s)');
    // }

    // toggleEnableGamePlugin() {
    //     this.gamePluginEnabled = !this.gamePluginEnabled;
    //     this.apmsGameService.enableGamePlugin(this.gamePluginEnabled);
    //     sys.localStorage.setItem(
    //         'agcAPMSGamePluginEnabled',
    //         this.gamePluginEnabled + ''
    //     );
    //     this.console.log('Toogle enable game plugin:', this.gamePluginEnabled);
    // }

    // onDestroy() {
    //     // Stop the service of APM Game Plugin.
    //     this.apmsGameService.stop();
    // }

    // goBack() {
    //     director.loadScene('apms');
    // }
}
