import { _decorator, Button, Component, input, Label, Node, Prefab } from 'cc';
import { CmdType, frames, frameSyncPlayerInitList, frameSyncPlayerList, GameSceneType, setDefaultFrameState, updatePlayerData } from './frame_sync';
import { global, RoomType } from './hw_gobe_global_data';
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
    watcherLeaveButton: Button = null;

    @property(Button)
    recordLeaveBtnButton: Button = null;

    @property(GameCanvas)
    gameCanvas: GameCanvas = null;

    public onStopFrameButtonClick: () => any = null;
    public onUpButtonClick: () => any = null;
    public onDownButtonClick: () => any = null;
    public onLeftButtonClick: () => any = null;
    public onRightButtonClick: () => any = null;
    public onLeaveButtonClick: () => any = null;
    public onQuitButtonClick: () => any = null;

    removeAllListener () {
        this.onStopFrameButtonClick = null;
        this.onUpButtonClick = null;
        this.onDownButtonClick = null;
        this.onLeftButtonClick = null;
        this.onRightButtonClick = null;
        this.onLeaveButtonClick = null;
        this.onQuitButtonClick = null;
    }



    setEnableButtons (isEnabled: boolean) {
        this.stopFrameButton.node.active = isEnabled;
    }

    setWatcherButtons (isEnabled: boolean) {
        this.upButton.node.active = isEnabled;
        this.downButton.node.active = isEnabled;
        this.leftButton.node.active = isEnabled;
        this.rightButton.node.active = isEnabled;
        this.watcherLeaveButton.node.active = !isEnabled;
        this.recordLeaveBtnButton.node.active = !isEnabled;
    }

    setButtons (type: GameSceneType, isOwner = false) {
        this.upButton.node.active = type == GameSceneType.FOR_GAME;
        this.downButton.node.active = type == GameSceneType.FOR_GAME;
        this.leftButton.node.active = type == GameSceneType.FOR_GAME;
        this.rightButton.node.active = type == GameSceneType.FOR_GAME;
        this.stopFrameButton.node.active = type == GameSceneType.FOR_GAME && isOwner;
        this.watcherLeaveButton.node.active = type == GameSceneType.FOR_WATCHER;
        this.recordLeaveBtnButton.node.active = type == GameSceneType.FOR_RECORD;
    }

    start () {
        this.reCalcFrameState();
    }

    update (dt) {
        // 绘制玩家
        this.gameCanvas.setPlayers(frameSyncPlayerList.players);
    }

    onStopFrameBtnClick () {
        this.stopFrameButton.interactable && this.onStopFrameButtonClick && this.onStopFrameButtonClick();
    }

    onWatcherLeaveBtnClick () {
        this.watcherLeaveButton.interactable && this.onLeaveButtonClick && this.onLeaveButtonClick();
    }

    onRecordLeaveBtnClick () {
        this.watcherLeaveButton.interactable && this.onQuitButtonClick && this.onQuitButtonClick();
    }

    onUpButtonTouchStart () {
        this.upButton.interactable && this.onUpButtonClick && this.onUpButtonClick();
    }

    onDownButtonTouchStart () {
        this.downButton.interactable && this.onDownButtonClick && this.onDownButtonClick();
    }

    onLeftButtonTouchStart () {
        this.leftButton.interactable && this.onLeftButtonClick && this.onLeftButtonClick();
    }

    onRightButtonTouchStart () {
        this.rightButton.interactable && this.onRightButtonClick && this.onRightButtonClick();
    }


    /**
     * 计算帧
    */
    calcFrame (frame: GOBE.ServerFrameMessage) {
        if (frame.currentRoomFrameId === 1) {
            setDefaultFrameState();
        }
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

    reCalcFrameState () {
        setDefaultFrameState();
        frames.forEach(frame => {
            this.calcFrame(frame);
        });
    }
}
