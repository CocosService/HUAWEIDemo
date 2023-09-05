import { _decorator, color, Component, director, find, instantiate, Label, Node, Prefab, Sprite } from 'cc';
import { clearFrames, CmdType, Direction, frameSyncPlayerInitList, frameSyncPlayerList, GameSceneType, pushFrames, resetFrameSyncPlayerList } from './frame_sync';
import { global, RoomType } from './hw_gobe_global_data';
import { FrameSyncView } from './frame_sync_view';
import config from './config';
import { sleep } from './gobe_util';
import { Console } from '../../prefabs/console';
import { RecvFrameMessage } from '../../cs-huawei/hwgobe/GOBE/GOBE';
const { ccclass, property } = _decorator;
let framesId = 0;
@ccclass('GobeGame')
export class GobeGame extends Component {
    @property({ type: Console })
    console: Console = null!;

    @property(Label)
    gameIdLabel: Label = null;

    @property(Label)
    playerIdLabel: Label = null;


    // 初始化帧同步
    @property(FrameSyncView)
    public frameSyncView: FrameSyncView = null;

    @property(Node)
    gameOverPanel: Node = null;
    @property(Label)
    gameOverPanelTip: Label = null;

    // 机器人定时任务
    public robotIntervalTask = null;

    // 房主定时同步玩家信息任务
    public syncRoomPropTask = null;

    // 清理碰撞缓存事件任务
    public colliderEventTask = null;

    start () {
        if (global.gameSceneType == GameSceneType.FOR_RECORD) {
            this.setRecordRoomView();
        }
        else {
            this.initView();
            //事件
            this.onListener();
            // 房主上报各个玩家起始位置信息
            this.reportPlayerInfo();
            // 模拟机器人AI任务
            this.initRobotSchedule();
            // 房主定时同步roomInfo中的customRoomProperties任务
            this.initSyncRoomPropSchedule();
        }
    }


    protected onDestroy (): void {
        this.offListener();
    }



    initView () {
        this.setRoomView();
        //结束界面隐藏
        this.gameOverPanel.active = false;
    }

    private _onRecvFrameEve = (frame) => this.onReceiveFrame(frame);
    private _onStopFrameSyncEve = () => this.onStopFrameSync();
    private _onDismissEve = () => this.onDismiss();
    private _onLeaveEve = (playerInfo) => this.onLeave(playerInfo);
    private _onConnectEve = (playerInfo: GOBE.PlayerInfo) => this.onConnect(playerInfo);
    private _onDisconnectEve = (playerInfo: GOBE.PlayerInfo) => this.onDisconnect(playerInfo);
    private _onJoinEve = (playerInfo: GOBE.PlayerInfo) => this.onJoin(playerInfo);
    private _onRequestFrameErrorEve = (err) => this.onRequestFrameError(err);
    private _onRecvFromServerEve = (serverInfo: GOBE.RecvFromServerInfo) => this.onReceiveFromServer(serverInfo);

    onListener () {
        // 监听房间
        if (global.room) {
            global.room.onRecvFrame(this._onRecvFrameEve);
            global.room.onStopFrameSync(this._onStopFrameSyncEve);
            global.room.onDismiss(this._onDismissEve);
            global.room.onLeave(this._onLeaveEve);
            // 上线通知监听
            global.room.onConnect(this._onConnectEve);
            // 断线通知监听
            global.room.onDisconnect(this._onDisconnectEve);
            global.room.onJoin(this._onJoinEve); // 进行补帧
            global.room.onRequestFrameError(this._onRequestFrameErrorEve);// 补帧失败回调
            global.room.onRecvFromServer(this._onRecvFromServerEve);
        }
        //ui
        this.frameSyncView.onUpButtonClick = () => this.sendPlaneFlyFrame(Direction.up);
        this.frameSyncView.onDownButtonClick = () => this.sendPlaneFlyFrame(Direction.down);
        this.frameSyncView.onLeftButtonClick = () => this.sendPlaneFlyFrame(Direction.left);
        this.frameSyncView.onRightButtonClick = () => this.sendPlaneFlyFrame(Direction.right);
        this.frameSyncView.onStopFrameButtonClick = () => this.stopGame();
        this.frameSyncView.onLeaveButtonClick = () => this.watcherLeaveRoom();
        this.frameSyncView.setButtons(global.gameSceneType, global.playerId === global.room.ownerId);
    }

    offListener () {
        // 监听房间
        if (global.room) {
            global.room.onRecvFrame.off(this._onRecvFrameEve);
            global.room.onStopFrameSync.off(this._onStopFrameSyncEve);
            global.room.onDismiss.off(this._onDismissEve);
            global.room.onLeave.off(this._onLeaveEve);
            // 上线通知监听
            global.room.onConnect.off(this._onConnectEve);
            // 断线通知监听
            global.room.onDisconnect.off(this._onDisconnectEve);
            global.room.onJoin.off(this._onJoinEve); // 进行补帧
            global.room.onRequestFrameError.off(this._onRequestFrameErrorEve);// 补帧失败回调
            global.room.onRecvFromServer.off(this._onRecvFromServerEve);
        }
        //ui
        this.frameSyncView.removeAllListener();
    }



    /**
     * 游戏结束离开
    */
    gameEndExit () {
        if (!global.isTeamMode) {
            global.client.leaveRoom().then(() => {
                // 退出房间成功
                this.console.log("退出房间成功");
                global.roomType = RoomType.NULL;
                global.gameSceneType = GameSceneType.FOR_NULL;
                director.loadScene("gobe_hall");
            }).catch((e) => {
                // 退出房间失败
                this.console.log("提示", "退出房间失败", e);
            });
        } else {
            global.gameSceneType = GameSceneType.FOR_NULL;
            director.loadScene("gobe_hall");
        }
    }


    // 上报各个玩家起始位置信息
    reportPlayerInfo () {
        // 如果是房主，上报公共参数以及所有玩家初始位置
        if (global.playerId == global.room.ownerId) {
            let playerInfoArr = [];
            frameSyncPlayerInitList.players.forEach((player) => {
                let playerInfo = {
                    playerId: player.playerId,
                    position: {
                        x: player.x,
                        y: player.y,
                    },
                    direction: player.direction
                }
                playerInfoArr.push(playerInfo);
            });
            let data = {
                type: 'InitGame',
                playerArr: playerInfoArr
            }
            this.console.log('-----reportPlayerInfo----' + JSON.stringify(data));
            global.room.sendToServer(JSON.stringify(data));
            let frameData: string = JSON.stringify({
                cmd: CmdType.syncRoomInfo,
                roomInfo: {
                    roomId: global.room.roomId,
                    roomType: global.roomType,
                    ownerId: global.room.ownerId,
                    players: frameSyncPlayerInitList.players
                },
            });
            this.console.log('----syncRoomInfo---' + frameData);
            global.room.sendFrame(frameData);
        }
    }

    onRequestFrameError (err) {
        if (err.code === 10002) {
            // 重置帧id
            let roomProp = JSON.parse(global.room.customRoomProperties);
            if (roomProp.curFrameId) {
                global.room.resetRoomFrameId(roomProp.curFrameId);
                this.console.log('已重置frameId-----------------------------------');
            }
        }
    }

    initSyncRoomPropSchedule () {
        if (global.room.isSyncing && global.playerId === global.room.ownerId) {
            this.syncRoomPropTask = setInterval(this.syncRoomProp, 1_000);
        }
    }

    syncRoomProp () {
        let roomProperties;
        if (global.room.customRoomProperties) {
            roomProperties = {
                ...JSON.parse(global.room.customRoomProperties),
                frameSyncPlayerArr: frameSyncPlayerList.players,
                curFrameId: global.curHandleFrameId
            }
        }
        else {
            roomProperties = {
                roomType: global.roomType,
                frameSyncPlayerArr: frameSyncPlayerList.players,
                curFrameId: global.curHandleFrameId
            }
        }
        global.room.updateRoomProperties({ customRoomProperties: JSON.stringify(roomProperties) });
    }

    initRobotSchedule () {
        let robotArr = global.room.players.filter(player => player.isRobot === 1);
        if (global.room.isSyncing &&
            global.playerId === global.room.ownerId &&
            robotArr.length > 0) {
            this.robotIntervalTask = setInterval(this.mockRobotAI, 500, this, robotArr);
        }
    }

    mockRobotAI (self, robotArr) {
        robotArr.forEach(robot => self.mockRobotMove(robot.playerId));
    }

    mockRobotMove (playerId) {
        try {
            let player = frameSyncPlayerList.players.find(p => p.playerId === playerId);
            let newDir = player.direction;
            // 机器人过中线若干步长时，随时可能发生转向
            switch (player.direction) {
                case Direction.up:
                    if (player.y >= 300) {
                        newDir = this.selectRandomRotation([Direction.down, Direction.left, Direction.right]);
                    }
                    break;
                case Direction.down:
                    if (player.y <= 100) {
                        newDir = this.selectRandomRotation([Direction.up, Direction.left, Direction.right]);
                    }
                    break;
                case Direction.left:
                    if (player.x <= 100) {
                        newDir = this.selectRandomRotation([Direction.up, Direction.down, Direction.right]);
                    }
                    break;
                case Direction.right:
                    if (player.x >= 600) {
                        newDir = this.selectRandomRotation([Direction.up, Direction.down, Direction.left]);
                    }
                    break;
                // no default
            }
            let frame = {
                type: CmdType.planeFly,
                roomId: global.room.roomId,
                playerId: player.playerId,
                direction: newDir,
            };
            let frameData: string = JSON.stringify(frame);
            global.room.sendToServer(frameData);
        }
        catch (e) {
            this.console.log('mockRobotMove sendToServer err: ' + e);
        }
    }

    // 选择随机方向转向
    selectRandomRotation (dirArr) {
        return dirArr[Math.floor(Math.random() * dirArr.length)];
    }

    // 停止游戏
    stopGame () {
        this.stopFrameSync();
    }

    // SDK 停止帧同步
    stopFrameSync () {
        global.room.stopFrameSync().then(() => {
            // 帧同步停止后清理机器人任务
            if (this.robotIntervalTask) {
                clearInterval(this.robotIntervalTask);
            }
            //停止同步玩家信息
            if (this.syncRoomPropTask) {
                clearInterval(this.syncRoomPropTask);
            }
            if (this.colliderEventTask) {
                clearInterval(this.colliderEventTask);
            }
        }).catch((e) => {
            // 停止帧同步失败
            this.console.log("提示", "停止帧同步失败", e);
        });
    }

    // SDK 发送帧消息
    sendPlaneFlyFrame (dir: Direction) {
        try {
            let player = frameSyncPlayerList.players.find((p) => p.playerId == global.playerId);
            if (!player) {
                return;
            }
            // 如果飞机在飞行边界，且机头朝向边界，无法继续前进
            if (!this.planeCanFly(player.x, player.y, player.direction, dir)) {
                return;
            }
            let x: number = player.x;
            let y: number = player.y;
            switch (dir) {
                case Direction.up:
                    y = (player.y + global.planeStepPixel) > global.bgMaxY ? global.bgMaxY : player.y + global.planeStepPixel;
                    break;
                case Direction.down:
                    y = (player.y - global.planeStepPixel) < global.bgMinY ? global.bgMinY : player.y - global.planeStepPixel;
                    break;
                case Direction.left:
                    x = (player.x - global.planeStepPixel) < global.bgMinX ? global.bgMinX : player.x - global.planeStepPixel;
                    break;
                case Direction.right:
                    x = (player.x + global.planeStepPixel) > global.bgMaxX ? global.bgMaxX : player.x + global.planeStepPixel;
                    break;
            }
            let frameData: string = JSON.stringify({
                cmd: CmdType.planeFly,
                playerId: global.playerId,
                x,
                y,
                direction: dir,
            });
            this.console.log('sendPlaneFlyFrame:' + frameData);
            global.room.sendFrame(frameData);
        }
        catch (e) {
            this.console.log('sendPlaneFlyFrame err: ' + e);
        }
    }

    // 检测飞机是否能继续飞行
    planeCanFly (x: number, y: number, curDir: Direction, tarDir: Direction) {
        if (curDir == tarDir) {
            switch (curDir) {
                case Direction.up:
                    return y < global.bgMaxY;
                case Direction.down:
                    return y > global.bgMinY;
                case Direction.left:
                    return x > global.bgMinX;
                case Direction.right:
                    return x < global.bgMaxX;
                // no default
            }
        }
        return true;
    }

    // 检测飞机是否能发射子弹
    planeCanFlyOrFire (x: number, y: number, dir: Direction) {
        switch (dir) {
            case Direction.up:
                return y < global.bgMaxY;
            case Direction.down:
                return y > global.bgMinY;
            case Direction.left:
                return x > global.bgMinX;
            case Direction.right:
                return x < global.bgMaxX;
            // no default
        }
    }

    onDisable () {
        clearFrames();
        if (global.room) {
            global.room.removeAllListeners();
        }
    }

    setRoomView () {
        const roomInfo = global.room;
        // 设置文本标签
        this.gameIdLabel.string = "房间ID:" + roomInfo.roomId;
        this.playerIdLabel.string = "玩家Id:" + global.playerId;

        // 房间人数变化，重新计算帧
        if (roomInfo.players.length !== frameSyncPlayerList.players.length) {
            this.frameSyncView.reCalcFrameState();
        }
    }

    // 设置回放场景
    setRecordRoomView () {
        this.gameIdLabel.string = "房间ID:" + global.recordRoomInfo.roomId;
        this.playerIdLabel.string = "玩家Id:" + global.playerId;

        this.frameSyncView.setButtons(GameSceneType.FOR_RECORD);
        this.frameSyncView.onQuitButtonClick = () => this.quitRecord();
    }

    // 退出回放
    quitRecord () {
        global.gameSceneType = GameSceneType.FOR_NULL;
        frameSyncPlayerInitList.players = [];
        frameSyncPlayerList.players = [];
        global.recordRoomInfo = null;
        global.roomType = RoomType.NULL;
        director.loadScene("gobe_hall");
    }

    //重新连接
    onConnect (playerInfo: GOBE.PlayerInfo) {
        if (playerInfo.playerId === global.playerId) {
            global.isConnected = true;
            this.console.log("玩家在线了");
        } else {
            this.console.log("房间内其他玩家上线了，playerId:" + playerInfo.playerId);
        }
    }

    //断线
    onDisconnect (playerInfo: GOBE.PlayerInfo) {
        this.console.log("玩家掉线");
        if (playerInfo.playerId === global.playerId) {
            this.console.log("正在重连。。。");
            this.reConnect();
        }
    }


    /**
     * 接收帧处理
     * @param frame
     * @private
     */
    private receiveFrameHandle (frame: RecvFrameMessage) {
        // console.log("收到帧数据:", frame);
        framesId = frame.currentRoomFrameId;
        // 处理帧内容
        if (frame.frameInfo && frame.frameInfo.length > 0) {
            if (frame.frameInfo[0].playerId !== "0") {
                pushFrames(frame);
                this.frameSyncView.calcFrame(frame);
            }
        }
    }

    private receiveServerInfoHandle (serverInfo: GOBE.RecvFromServerInfo) {
        this.frameSyncView.processServerInfo(serverInfo);
    }

    // 接收帧广播消息
    onReceiveFrame (frame) {
        // 本次接收帧存入“未处理帧”数组中,只负责接收,不处理数据
        global.unhandleFrames = global.unhandleFrames.concat(frame);
    }

    // 接收实时服务器消息
    onReceiveFromServer (data: GOBE.RecvFromServerInfo) {
        this.console.log('onReceiveFromServer:' + JSON.stringify(data));

        global.unProcessedServerInfo = global.unProcessedServerInfo.concat(data);

        let res = JSON.parse(data.msg);
        if (res.type === "GameEnd") {
            this.gameOverPanelTip.string = res.result === 0 ? "结算正常" : "结算异常";
        }
    }

    /**
     * 按游戏帧率处理接收到的帧（每秒60次）
     */
    update () {
        // 处理帧广播消息
        if (global.unhandleFrames.length > 0) {
            if (global.gameSceneType == GameSceneType.FOR_RECORD) {
                this.receiveFrameHandle(global.unhandleFrames[0]);
                global.unhandleFrames.shift();
            }
            else {
                if (global.unhandleFrames.length > 1) {  // 未处理的帧如果大于1,表示补帧
                    global.isRequestFrameStatus = true;
                    for (let i = 0; i < config.handleFrameRate; i++) {
                        if (global.unhandleFrames[0]) {
                            this.receiveFrameHandle(global.unhandleFrames[0]);
                            global.curHandleFrameId = global.unhandleFrames[0].currentRoomFrameId;
                            global.unhandleFrames.shift();
                        }
                    }
                } else {  // 正常处理
                    global.isRequestFrameStatus = false;
                    this.receiveFrameHandle(global.unhandleFrames[0]);
                    global.unhandleFrames.shift();
                }
            }
        }
        // 处理实时消息
        if (global.unProcessedServerInfo.length > 0) {
            if (global.unProcessedServerInfo[0]) {
                this.receiveServerInfoHandle(global.unProcessedServerInfo[0]);
                global.unProcessedServerInfo.shift();
            }
        }
    }

    onStopFrameSync () {
        this.console.log("SDK广播--停止帧同步");
        frameSyncPlayerList.players = [];
        frameSyncPlayerInitList.players = [];
        // 清空帧数据
        global.unhandleFrames = [];
        // 清空roomProperties
        if (global.room.ownerId === global.client.playerId) {
            global.room.updateRoomProperties({ customRoomProperties: '' });
        }
        global.curHandleFrameId = 0;
        resetFrameSyncPlayerList();
        if (!global.isTeamMode) {
            // 上报结算结果0或1
            if (global.gameSceneType == GameSceneType.FOR_WATCHER) {
                this.watcherLeaveRoom();
            } else {
                global.client.room.sendToServer(JSON.stringify({
                    playerId: global.client.playerId,
                    type: "GameEnd",
                    value: Math.random() > 0.5 ? 1 : 0
                }));
                this.gameOverPanel.active = true;
                this.gameOverPanelTip.string = "正在结算。。。"
            }
        } else {
            this.leaveRoom(() => {
                global.gameSceneType = GameSceneType.FOR_NULL;
                director.loadScene("gobe_hall");
            }, () => {
                global.gameSceneType = GameSceneType.FOR_NULL;
                director.loadScene("gobe_hall");
            });

        }
    }

    onDismiss () {
        this.console.log("SDK广播--解散房间");
        global.gameSceneType = GameSceneType.FOR_NULL;
        director.loadScene("gobe_hall");
    }

    onLeave (playerInfo: GOBE.PlayerInfo) {
        this.console.log("SDK广播--离开房间");
        if (global.isTeamMode) {
            // 重新计算房间内的人员信息
            this.reCalPlayers(playerInfo);
        } else {
            director.loadScene("gobe_room");
        }
    }


    private leaveRoom (sucCb: Function = null, failCb: Function = null) {
        this.console.log(`正在退出房间`);
        global.client.leaveRoom()
            .then(() => {
                // 退出房间成功
                this.console.log("退出房间成功");
                global.roomType = RoomType.NULL;
                sucCb && sucCb();
            }).catch((e) => {
                // 退出房间失败
                this.console.log("提示", "退出房间失败", e);
                failCb && failCb();
            });
    }

    public watcherLeaveRoom () {
        this.console.log(`正在退出观战房间`);
        global.client.leaveRoom()
            .then(() => {
                this.console.log("退出观战房间成功");
                global.roomType = RoomType.NULL;
                global.player.updateCustomProperties("clear");
                global.gameSceneType = GameSceneType.FOR_NULL;
                director.loadScene("gobe_hall");
            }).catch((e) => {
                // 退出房间失败
                this.console.log("提示", "退出房间失败", e);
            });
    }

    /*
     * 重新计算房间内的人员信息
     * playerInfo 离开房间的人信息
     */
    private reCalPlayers (playerInfo: GOBE.PlayerInfo) {
        let players = [];
        frameSyncPlayerList.players.forEach(function (player) {
            if (player.playerId != playerInfo.playerId) {
                players.push(player);
            }
        });
        frameSyncPlayerList.players = players;
    }

    onJoin (playerInfo: GOBE.PlayerInfo) {
        this.console.log("重连成功");
        if (playerInfo.playerId === global.playerId) {
            this.console.log("重连加入玩家id:" + playerInfo.playerId);
            //获取房间最新信息
            global.room.update().then((room) => {
                let isInRoom = this.selfIsInRoom(room);
                if (isInRoom) {
                    this.console.log("TODO")
                } else {
                    global.gameSceneType = GameSceneType.FOR_NULL;
                    director.loadScene("gobe_hall");
                }
            }).catch((e) => {
                this.console.log("update err: " + e);
                director.loadScene("gobe_hall");
            });
        }
    }

    async reConnect () {
        // if (global.isTeamMode) {
        //     global.gameSceneType = GameSceneType.FOR_NULL;
        //     director.loadScene("gobe_hall");
        // } else {
        // 没有超过重连时间，就进行重连操作
        while (!global.isConnected) {
            // 1秒重连一次，防止并发过大游戏直接卡死
            await sleep(1000).then();
            global.room.reconnect().then(() => {
                this.console.log("reconnect success");
            }).catch((error) => {
                this.console.log("reconnect err");
            });
        }
        // }
    }

    selfIsInRoom (room: GOBE.Room): boolean {
        const players: GOBE.PlayerInfo[] = room.players;
        if (players) {
            for (let i = 0; i < players.length; ++i) {
                if (players[i].playerId === global.playerId) {
                    return true;
                }
            }
        }
        return false
    }
}

