import { _decorator, Button, Component, input, Label, Node, Prefab } from 'cc';
import { cloudsList, CmdType, colliderEventMap, destroyedBulletSet, frames, frameSyncPlayerInitList, frameSyncPlayerList, GameSceneType, setDefaultFrameState, updatePlayerData } from './frame_sync';
import { global, RoomType } from './hw_gobe_global_data';
import { GameCanvas } from './game_canvas';
import { BulletData } from './gobe_util';

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
    fireButton: Button = null;

    @property(Button)
    leaveButton: Button = null;

    @property(Button)
    quitButton: Button = null;

    @property(GameCanvas)
    gameCanvas: GameCanvas = null;

    public onStopFrameButtonClick: () => any = null;
    public onUpButtonClick: () => any = null;
    public onDownButtonClick: () => any = null;
    public onLeftButtonClick: () => any = null;
    public onRightButtonClick: () => any = null;
    public onFireButtonClick: () => any = null;
    public onLeaveButtonClick: () => any = null;
    public onQuitButtonClick: () => any = null;

    removeAllListener () {
        this.onStopFrameButtonClick = null;
        this.onUpButtonClick = null;
        this.onDownButtonClick = null;
        this.onLeftButtonClick = null;
        this.onRightButtonClick = null;
        this.onFireButtonClick = null;
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
        this.fireButton.node.active = isEnabled;
        this.leaveButton.node.active = !isEnabled;
        this.quitButton.node.active = !isEnabled;
    }

    setButtons (type: GameSceneType, isOwner = false) {
        this.upButton.node.active = type == GameSceneType.FOR_GAME;
        this.downButton.node.active = type == GameSceneType.FOR_GAME;
        this.leftButton.node.active = type == GameSceneType.FOR_GAME;
        this.rightButton.node.active = type == GameSceneType.FOR_GAME;
        this.fireButton.node.active = type == GameSceneType.FOR_GAME;
        this.stopFrameButton.node.active = type == GameSceneType.FOR_GAME && isOwner;
        this.leaveButton.node.active = type == GameSceneType.FOR_WATCHER;
        this.quitButton.node.active = type == GameSceneType.FOR_RECORD;
    }

    start () {
        switch (global.gameSceneType) {
            case GameSceneType.FOR_RECORD:
                this.quitButton.node.on(Node.EventType.TOUCH_START, this.onQuitButtonClickCallback, this);
                break;
            case GameSceneType.FOR_WATCHER:
                this.leaveButton.node.on(Node.EventType.TOUCH_START, this.onLeaveButtonClickCallback, this);
                break;
            case GameSceneType.FOR_GAME:
                // 绘制玩家
                this.gameCanvas.setPlayers(frameSyncPlayerList.players);
                // 停止帧同步按钮监听
                this.stopFrameButton.node.on(Node.EventType.TOUCH_START, this.onStopFrameButtonClickCallback, this);
                // 攻击按钮监听
                this.fireButton.node.on(Node.EventType.TOUCH_START, this.onFireButtonClickCallback, this);
                // 上下左右按钮按下监听
                this.upButton.node.on(Node.EventType.TOUCH_START, this.onUpButtonTouchStart, this);
                this.downButton.node.on(Node.EventType.TOUCH_START, this.onDownButtonTouchStart, this);
                this.leftButton.node.on(Node.EventType.TOUCH_START, this.onLeftButtonTouchStart, this);
                this.rightButton.node.on(Node.EventType.TOUCH_START, this.onRightButtonTouchStart, this);

                break;
            // no default
        }
        this.reCalcFrameState();
    }

    update (dt) {
        // 绘制玩家
        this.gameCanvas.setPlayers(frameSyncPlayerList.players);
        // 绘制小云朵
        this.gameCanvas.setClouds(cloudsList.clouds, dt);
    }

    onStopFrameButtonClickCallback () {
        this.stopFrameButton.interactable && this.onStopFrameButtonClick && this.onStopFrameButtonClick();
    }

    onLeaveButtonClickCallback () {
        this.leaveButton.interactable && this.onLeaveButtonClick && this.onLeaveButtonClick();
    }

    onQuitButtonClickCallback () {
        this.leaveButton.interactable && this.onQuitButtonClick && this.onQuitButtonClick();
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

    onFireButtonClickCallback () {
        this.fireButton.interactable && this.onFireButtonClick && this.onFireButtonClick();
    }

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
                                console.log('------receive planeFly frame----' + JSON.stringify(obj));
                                updatePlayerData(obj.playerId, obj.x, obj.y, obj.hp, obj.direction);
                                break;
                            case CmdType.bulletFly:
                                console.log('------receive bulletFly frame----' + JSON.stringify(obj));
                                this.updateBullet(obj);
                                break;
                            case CmdType.bulletDestroy:
                                console.log('------receive bulletDestroy frame----' + JSON.stringify(obj));
                                this.gameCanvas.destroyBullet(obj.bulletId);
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
            let sInfo = JSON.parse(serverInfo.msg);
            if (sInfo && sInfo.type == 'Collide') {
                // 如果缓存中有碰撞事件，则清理缓存
                if (colliderEventMap.get(sInfo.bulletId)) {
                    console.log('----前后端状态一致---');
                    colliderEventMap.delete(sInfo.bulletId);
                }
                // 若缓存中没有碰撞事件，则回滚
                else {
                    colliderEventMap.clear();
                    destroyedBulletSet.clear();
                    let frameId = global.curHandleFrameId > global.rollbackFrameCount ?
                        global.curHandleFrameId - global.rollbackFrameCount : 1;
                    console.log(`---------回滚${global.rollbackFrameCount}帧---------`);
                    global.room.resetRoomFrameId(frameId);
                    global.isRequestFrameStatus = true;
                }
            }
        }
    }

    reCalcFrameState () {
        setDefaultFrameState();
        frames.forEach(frame => {
            this.calcFrame(frame);
        });
    }

    // 刷新子弹
    updateBullet (obj) {
        let bullet: BulletData = {
            playerId: obj.playerId,
            bulletId: obj.bulletId,
            x: obj.x,
            y: obj.y,
            direction: obj.direction,
            needDestroy: false
        }
        this.gameCanvas.setBullet(bullet);
    }
}
