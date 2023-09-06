import { _decorator, Component, director, Node } from 'cc';
import { GobeFightReady } from './gobe_fight_ready';
import { GobeFight } from './gobe_fight';
import { FightRoomState, global } from './hw_gobe_global_data';
import { GameSceneType } from './frame_sync';
import { Console } from '../../prefabs/console';

const { ccclass, property } = _decorator;

@ccclass('GobeRoom')
export class GobeRoom extends Component {

    //当前的状态，准备或战斗
    private _curRoomState: FightRoomState = null;

    @property({ type: Console })
    console: Console = null;

    //准备界面
    @property(GobeFightReady)
    readyPanel: GobeFightReady = null;

    //游戏界面
    @property(GobeFight)
    fightPanel: GobeFight = null;

    //游戏界面
    @property(Node)
    gameOverPanel: Node = null;



    private _onConnect = (playerInfo: GOBE.PlayerInfo) => this.onConnect(playerInfo);
    private _onJoin = (playerInfo: GOBE.PlayerInfo) => this.onJoin(playerInfo);
    private _onLeave = (playerInfo: GOBE.PlayerInfo) => this.onLeave(playerInfo);
    private _onDismiss = () => this.onDismiss()
    private _onUpdateCustomProperties = (playerInfo: GOBE.UpdateCustomPropertiesResponse) => this.onUpdateCustomProperties(playerInfo);
    private _onRoomPropertiesChange = (roomInfo: GOBE.RoomInfo) => this.onRoomPropertiesChange(roomInfo);
    private _onDisconnect = (playerInfo: GOBE.PlayerInfo) => this.onDisconnect(playerInfo);

    private _onStartFrameSync = () => this.onStartFrameSync();
    private _onRecvFromServer = (serverInfo: GOBE.RecvFromServerInfo) => this.onRecvFromServer(serverInfo);
    private _onRecvFrame = (frame) => this.onRecvFrame(frame);
    private _onStopFrameSync = () => this.onStopFrameSync();
    private _onRequestFrameError = (err) => this.onRequestFrameError(err);

    protected onEnable (): void {
        //是否是战斗回放
        if (global.gameSceneType == GameSceneType.FOR_RECORD) {
            this._curRoomState = FightRoomState.Fight;
        } else {
            this._curRoomState = FightRoomState.Ready;
        }
        if (global.room.isSyncing) {
            console.warn("房间已经处于帧同步模式 TODO");
        }

        //根据房间状态显示对应的面板
        this.readyPanel.node.active = this._curRoomState == FightRoomState.Ready;
        this.fightPanel.node.active = this._curRoomState == FightRoomState.Fight;

        if (global.room) {
            global.room.onJoin(this._onJoin);
            global.room.onLeave(this._onLeave);
            global.room.onDismiss(this._onDismiss);
            global.room.onUpdateCustomProperties(this._onUpdateCustomProperties);
            global.room.onRoomPropertiesChange(this._onRoomPropertiesChange)
            global.room.onDisconnect(this._onDisconnect);
            global.room.onConnect(this._onConnect);

            global.room.onStartFrameSync(this._onStartFrameSync);
            global.room.onRecvFromServer(this._onRecvFromServer);
            global.room.onRecvFrame(this._onRecvFrame);
            global.room.onStopFrameSync(this._onStopFrameSync);
            global.room.onRequestFrameError(this._onRequestFrameError);
        }
    }


    protected onDisable (): void {
        if (global.room) {
            global.room.onJoin.off(this._onJoin);
            global.room.onLeave.off(this._onLeave);
            global.room.onDismiss.off(this._onDismiss);
            global.room.onUpdateCustomProperties.off(this._onUpdateCustomProperties);
            global.room.onRoomPropertiesChange.off(this._onRoomPropertiesChange)
            global.room.onDisconnect.off(this._onDisconnect);
            global.room.onConnect.off(this._onConnect);

            global.room.onStartFrameSync.off(this._onStartFrameSync);
            global.room.onRecvFromServer.off(this._onRecvFromServer);
            global.room.onRecvFrame.off(this._onRecvFrame);
            global.room.onStopFrameSync.off(this._onStopFrameSync);
            global.room.onRequestFrameError.off(this._onRequestFrameError);

            //移除所有事件监听
            global.room.removeAllListeners();
        }
    }

    /**
     * 游戏结束离开
    */
    gameEndExitBtnClick () {
        global.gameSceneType = GameSceneType.FOR_NULL;
        director.loadScene("gobe_hall");
    }



    onConnect (playerInfo: GOBE.PlayerInfo) {
        if (this._curRoomState == FightRoomState.Ready) {
            this.readyPanel.onConnect(playerInfo);
        } else {
            this.fightPanel.onConnect(playerInfo);
        }
    }

    onJoin (playerInfo: GOBE.PlayerInfo) {
        if (this._curRoomState == FightRoomState.Ready) {
            this.readyPanel.onJoin(playerInfo);
        } else {
            this.fightPanel.onJoin(playerInfo);
        }
    }

    onLeave (playerInfo: GOBE.PlayerInfo) {
        if (this._curRoomState == FightRoomState.Ready) {
            this.readyPanel.onLeave(playerInfo);
        } else {
            this.fightPanel.onLeave(playerInfo);
        }
    }

    onDismiss () {
        if (this._curRoomState == FightRoomState.Ready) {
            this.readyPanel.onDismiss();
        } else {
            this.fightPanel.onDismiss();
        }
    }

    onUpdateCustomProperties (playerInfo: GOBE.UpdateCustomPropertiesResponse) {
        if (this._curRoomState == FightRoomState.Ready) {
            this.readyPanel.onUpdateCustomProperties(playerInfo);
        } else {
            console.error("onUpdateCustomProperties curRoomState error");
        }
    }

    onRoomPropertiesChange (roomInfo: GOBE.RoomInfo) {
        if (this._curRoomState == FightRoomState.Ready) {
            this.readyPanel.onRoomPropertiesChange(roomInfo);
        } else {
            console.error("onRoomPropertiesChange curRoomState error");
        }
    }

    onDisconnect (playerInfo: GOBE.PlayerInfo) {
        if (this._curRoomState == FightRoomState.Ready) {
            this.readyPanel.onDisconnect(playerInfo);
        } else {
            this.fightPanel.onDisconnect(playerInfo);
        }
    }

    //开始帧同步
    onStartFrameSync () {
        this._curRoomState == FightRoomState.Fight
        //根据房间状态显示对应的面板
        this.readyPanel.node.active = false;
        this.fightPanel.node.active = true;
    }

    onRecvFromServer (serverInfo: GOBE.RecvFromServerInfo) {
        if (this._curRoomState == FightRoomState.Ready) {
            this.readyPanel.onRecvFromServer(serverInfo);
        } else {
            this.fightPanel.onRecvFromServer(serverInfo);
        }
    }

    onRecvFrame (frame: any) {
        if (this._curRoomState == FightRoomState.Ready) {
            console.error("onRecvFrame curRoomState error");
        } else {
            this.fightPanel.onRecvFrame(frame);
        }
    }

    onStopFrameSync () {
        if (this._curRoomState == FightRoomState.Ready) {
            console.error("onStopFrameSync curRoomState error");
        } else {
            this.fightPanel.onStopFrameSync();
        }
    }

    onRequestFrameError (err: any) {
        if (this._curRoomState == FightRoomState.Ready) {
            console.error("onRequestFrameError curRoomState error");
        } else {
            this.fightPanel.onRequestFrameError(err);
        }
    }
}

