import { _decorator, Component, loader, director, CCString, EventTarget } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

/**
 * 华为游戏多媒体
*/
@ccclass('Hwmmsdk')
export class Hwmmsdk extends Component {
    @property({ type: Console })
    consolePanel: Console = null!;


    private mmsdkService: typeof huawei.game.mmsdk.mmsdkService = (typeof huawei ===
        'undefined'
        ? null
        : huawei?.game?.mmsdk?.mmsdkService)!;


    onEnable () {
        this.mmsdkService.on(huawei.game.mmsdk.API_EVENT_LIST.debugApiResult, (res: huawei.game.mmsdk.ApiCbResult) => {
            this.consolePanel && this.consolePanel.log("[debug]" + res.toString());
        });
    }

    onDisable (): void {
        this.mmsdkService.off(huawei.game.mmsdk.API_EVENT_LIST.debugApiResult);
    }



}
