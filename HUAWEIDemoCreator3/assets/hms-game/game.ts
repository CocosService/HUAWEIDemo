import { _decorator, Component, loader, director, CCString, EventTarget } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

/**
 * 华为游戏
*/
@ccclass('Game')
export class Game extends Component {
    @property({ type: Console })
    consolePanel: Console = null!;


    private game: typeof huawei.hms.game.gameService = (typeof huawei ===
        'undefined'
        ? null
        : huawei?.hms?.game?.gameService)!;


    onEnable () {
        this.game.on(huawei.hms.game.API_EVENT_LIST.debugApiResult, (res: huawei.hms.game.ApiCbResult) => {
            if (this.consolePanel) {
                this.consolePanel.log("[debug]" + res.toString());
                this.consolePanel.log("\n");
            } else {
                console.error("console panel == null");
            }
        }, this, false);
    }

    onDisable (): void {
        this.game.off(huawei.hms.game.API_EVENT_LIST.debugApiResult);
    }



}
