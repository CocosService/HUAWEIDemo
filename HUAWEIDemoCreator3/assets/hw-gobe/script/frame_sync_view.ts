import { _decorator, Button, Component, input, Label, Node, Prefab } from 'cc';
import { CmdType, frames, frameSyncPlayerInitList, frameSyncPlayerList, GameSceneType, updatePlayerData } from './frame_sync';
import { GameCanvas } from './game_canvas';

const { ccclass, property } = _decorator;

@ccclass('FrameSyncView')
export class FrameSyncView extends Component {

    @property(Button)
    stopFrameButton: Button = null;

    @property(Button)
    upButton: Button = null;

    @property(Button)
    downButton: Button = null;

    @property(Button)
    leftButton: Button = null;

    @property(Button)
    rightButton: Button = null;

    @property(Button)
    recordLeaveBtnButton: Button = null;

    @property(GameCanvas)
    gameCanvas: GameCanvas = null;

    public onStopFrameButtonClickEve: () => any = null;
    public onUpButtonClickEve: () => any = null;
    public onDownButtonClickEve: () => any = null;
    public onLeftButtonClickEve: () => any = null;
    public onRightButtonClickEve: () => any = null;
    public onRecordLeaveButtonClick: () => any = null;

    removeAllListener () {
        this.onStopFrameButtonClickEve = null;
        this.onUpButtonClickEve = null;
        this.onDownButtonClickEve = null;
        this.onLeftButtonClickEve = null;
        this.onRightButtonClickEve = null;
        this.onRecordLeaveButtonClick = null;
    }



    setEnableButtons (isEnabled: boolean) {
        this.stopFrameButton.node.active = isEnabled;
    }


    setButtons (type: GameSceneType, isOwner = false) {
        this.upButton.node.active = type == GameSceneType.FOR_GAME;
        this.downButton.node.active = type == GameSceneType.FOR_GAME;
        this.leftButton.node.active = type == GameSceneType.FOR_GAME;
        this.rightButton.node.active = type == GameSceneType.FOR_GAME;
        this.stopFrameButton.node.active = type == GameSceneType.FOR_GAME && isOwner;
        this.recordLeaveBtnButton.node.active = type == GameSceneType.FOR_RECORD;
    }


    start () {
        frames.forEach(frame => {
            this.runFrame(frame);
        });
    }

    /**
     * 更新player节点 实体
    */
    updatePlayerNode () {
        this.gameCanvas.refreshPlayers(frameSyncPlayerList.players);
    }

    onStopFrameBtnClick () {
        this.onStopFrameButtonClickEve && this.onStopFrameButtonClickEve();
    }

    onRecordLeaveBtnClick () {
        this.onRecordLeaveButtonClick && this.onRecordLeaveButtonClick();
    }

    onUpButtonTouchStart () {
        this.onUpButtonClickEve && this.onUpButtonClickEve();
    }

    onDownButtonTouchStart () {
        this.onDownButtonClickEve && this.onDownButtonClickEve();
    }

    onLeftButtonTouchStart () {
        this.onLeftButtonClickEve && this.onLeftButtonClickEve();
    }

    onRightButtonTouchStart () {
        this.onRightButtonClickEve && this.onRightButtonClickEve();
    }


    /**
     * 运行帧
    */
    runFrame (frame: GOBE.ServerFrameMessage) {
        if (frame.frameInfo && frame.frameInfo.length > 0) {
            frame.frameInfo.forEach(frameItem => {
                let frameData: string[] = frameItem.data;
                if (frameData && frameData.length > 0) {
                    frameData.forEach(data => {
                        let obj = JSON.parse(data);
                        switch (obj.cmd) {
                            case CmdType.planeFly:
                                // console.log('------receive planeFly frame----' + JSON.stringify(obj));
                                updatePlayerData(obj.playerId, obj.x, obj.y, obj.hp, obj.direction);
                                this.gameCanvas.updatePlayerData(frameSyncPlayerList.players);
                                break;
                            // no default
                        }
                    });
                }
            });
        }
    }

    // 处理实时消息
    processServerInfo (serverInfo: GOBE.RecvFromServerInfo) {
        if (serverInfo.msg) {
            console.log('----收到实时消息----' + serverInfo.msg);
        }
    }


}
