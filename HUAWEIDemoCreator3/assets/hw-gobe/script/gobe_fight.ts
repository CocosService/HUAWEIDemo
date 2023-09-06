import { _decorator, color, Component, director, find, instantiate, Label, Node, Prefab, Sprite } from 'cc';
import { clearFrames, CmdType, Direction, frameSyncPlayerInitList, frameSyncPlayerList, GameSceneType, pushFrames, addPlayerFromData, Team } from './frame_sync';
import { global } from './hw_gobe_global_data';
import { FrameSyncView } from './frame_sync_view';
import config from './config';
import { sleep } from './gobe_util';
import { Console } from '../../prefabs/console';
import { RecvFrameMessage } from '../../cs-huawei/hwgobe/GOBE/GOBE';
const { ccclass, property } = _decorator;
@ccclass('GobeFight')
export class GobeFight extends Component {
    @property({ type: Console })
    console: Console = null!;

    @property(Label)
    gameIdLabel: Label = null;

    @property(Label)
    playerIdLabel: Label = null;

    @property(FrameSyncView)
    frameSyncView: FrameSyncView = null;


    // 房主定时同步玩家信息任务
    public syncRoomPropTask = null;


    onEnable () {
        //回放模式
        if (global.gameSceneType == GameSceneType.FOR_RECORD) {
            this.gameIdLabel.string = "房间ID:" + global.recordRoomInfo.roomId;
            this.playerIdLabel.string = "玩家Id:" + global.playerId;
            this.frameSyncView.setButtons(GameSceneType.FOR_RECORD);
            this.frameSyncView.onRecordLeaveButtonClick = () => this.onQuitButtonClick();
        }
        //游戏模式
        else {
            // 设置文本标签
            this.gameIdLabel.string = "房间ID:" + global.room.roomId;
            this.playerIdLabel.string = "玩家Id:" + global.playerId;

            //ui按钮事件
            this.frameSyncView.onUpButtonClickEve = () => this._sendPlaneFlyFrame(Direction.up);
            this.frameSyncView.onDownButtonClickEve = () => this._sendPlaneFlyFrame(Direction.down);
            this.frameSyncView.onLeftButtonClickEve = () => this._sendPlaneFlyFrame(Direction.left);
            this.frameSyncView.onRightButtonClickEve = () => this._sendPlaneFlyFrame(Direction.right);
            this.frameSyncView.onStopFrameButtonClickEve = () => this._onStopFrameButtonClick();
            this.frameSyncView.setButtons(global.gameSceneType, global.playerId === global.room.ownerId);
            // 房主上报各个玩家起始位置信息
            this._reportPlayerInfo();
            // 房主定时同步roomInfo中的customRoomProperties任务
            if (global.room.isSyncing && global.playerId === global.room.ownerId) {
                this.syncRoomPropTask = setInterval(() => {
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
                            frameSyncPlayerArr: frameSyncPlayerList.players,
                            curFrameId: global.curHandleFrameId
                        }
                    }
                    global.room.updateRoomProperties({ customRoomProperties: JSON.stringify(roomProperties) });
                }, 1000);
            }
        }
    }

    onDisable () {
        this.frameSyncView.removeAllListener();
        clearFrames();
    }



    //开始时上报各个玩家起始位置信息
    private _reportPlayerInfo () {
        // 如果是房主，上报公共参数以及所有玩家初始位置
        if (global.playerId != global.room.ownerId) {
            return;
        }

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
        global.room.sendToServer(JSON.stringify(data));
        let frameData: string = JSON.stringify({
            cmd: CmdType.syncRoomInfo,
            roomInfo: {
                roomId: global.room.roomId,
                ownerId: global.room.ownerId,
                players: frameSyncPlayerInitList.players
            },
        });
        global.room.sendFrame(frameData);

    }


    //请求补帧失败监听
    //https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gameobe-room-js-0000001192950624#section059433420611
    onRequestFrameError (err: GOBE.GOBEError) {
        if (err.code === 10002) {
            // 重置帧id
            let roomProp = JSON.parse(global.room.customRoomProperties);
            if (roomProp.curFrameId) {
                global.room.resetRoomFrameId(roomProp.curFrameId);
                this.console.log('已重置frameId-----------------------------------');
            }
        }
    }



    // 停止游戏按钮点击
    private _onStopFrameButtonClick () {
        global.room.stopFrameSync()
            .then(() => {
                //停止同步玩家信息
                if (this.syncRoomPropTask) {
                    clearInterval(this.syncRoomPropTask);
                }
            }).catch((e) => {
                // 停止帧同步失败
                this.console.log("提示", "停止帧同步失败", e);
            });
    }

    // SDK发送运动帧消息
    private _sendPlaneFlyFrame (dir: Direction) {
        try {
            let player = frameSyncPlayerList.players.find((p) => p.playerId == global.playerId);
            if (!player) {
                return;
            }
            // 如果飞机在飞行边界，且机头朝向边界，无法继续前进
            if (!this._planeCanFly(player.x, player.y, player.direction, dir)) {
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
    private _planeCanFly (x: number, y: number, curDir: Direction, tarDir: Direction) {
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




    // 退出回放
    onQuitButtonClick () {
        global.gameSceneType = GameSceneType.FOR_NULL;
        frameSyncPlayerInitList.players = [];
        frameSyncPlayerList.players = [];
        this.frameSyncView.updatePlayerNode();
        global.recordRoomInfo = null;
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
        if (playerInfo.playerId === global.playerId) {
            this.console.log("自己掉线");
            global.gameSceneType = GameSceneType.FOR_NULL;
            director.loadScene("gobe_hall");
        }
    }

    // 接收帧广播消息
    onRecvFrame (frame) {
        // 本次接收帧存入“未处理帧”数组中,只负责接收,不处理数据
        global.unhandleFrames = global.unhandleFrames.concat(frame);
    }

    // 接收实时服务器消息
    onRecvFromServer (data: GOBE.RecvFromServerInfo) {
        this.console.log('onReceiveFromServer:' + JSON.stringify(data));
        global.unProcessedServerInfo = global.unProcessedServerInfo.concat(data);
        //解析数据
        let res = JSON.parse(data.msg);
        if (res.type === "GameEnd") {
            this.console.log("游戏结束 TODO");
            //展示游戏结界面
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
                this.frameSyncView.processServerInfo(global.unProcessedServerInfo[0]);
                global.unProcessedServerInfo.shift();
            }
        }
    }

    onStopFrameSync () {
        this.console.log("SDK广播--停止帧同步");
        frameSyncPlayerList.players = [];
        this.frameSyncView.updatePlayerNode();

        frameSyncPlayerInitList.players = [];
        // 清空帧数据
        global.unhandleFrames = [];
        // 清空roomProperties
        if (global.room.ownerId === global.client.playerId) {
            global.room.updateRoomProperties({ customRoomProperties: '' });
        }


        global.curHandleFrameId = 0;

        this.console.log(`正在退出房间`);
        global.client.leaveRoom()
            .then(() => {
                // 退出房间成功
                this.console.log("退出房间成功");
                global.gameSceneType = GameSceneType.FOR_NULL;
                director.loadScene("gobe_hall");
            }).catch((e) => {
                // 退出房间失败
                this.console.log("提示", "退出房间失败", e);
                global.gameSceneType = GameSceneType.FOR_NULL;
                director.loadScene("gobe_hall");
            });
    }

    onDismiss () {
        this.console.log("SDK广播--解散被房间");
        global.gameSceneType = GameSceneType.FOR_NULL;
        director.loadScene("gobe_hall");
    }

    onLeave (playerInfo: GOBE.PlayerInfo) {
        this.console.log("SDK广播--离开房间");
        // 重新计算房间内的人员信息
        let players = [];
        frameSyncPlayerList.players.forEach(function (player) {
            if (player.playerId != playerInfo.playerId) {
                players.push(player);
            }
        });
        frameSyncPlayerList.players = players;
        this.frameSyncView.updatePlayerNode();
    }

    /**
     * 接收帧处理
     * @param frame
     * @private
     */
    private receiveFrameHandle (frame: RecvFrameMessage) {
        // console.log("收到帧数据:", frame);
        // 处理帧内容
        if (frame.frameInfo && frame.frameInfo.length > 0) {
            if (frame.frameInfo[0].playerId !== "0") {
                pushFrames(frame);
                //创建player
                if (frame.currentRoomFrameId === 1) {
                    //初始化角色
                    this._initPlayerData();
                    //更新到view
                    this.frameSyncView.updatePlayerNode();
                }
                //运行帧
                this.frameSyncView.runFrame(frame);
            }
        }
    }

    /**
     * 初始化player
    */
    private _initPlayerData () {
        let roomInfo = null;
        if (global.gameSceneType == GameSceneType.FOR_RECORD) {
            roomInfo = global.recordRoomInfo;
        }
        else {
            roomInfo = global.room;
        }
        frameSyncPlayerList.players = [];
        let ownerTeamId = null;
        roomInfo.players.forEach((p) => {
            if (roomInfo.ownerId === p.playerId) {
                // 如果是房主
                ownerTeamId = p.teamId;
                return;
            }
        });

        if (ownerTeamId) {
            let roomProp = null;
            if (roomInfo?.customRoomProperties) {
                roomProp = JSON.parse(roomInfo.customRoomProperties);
            }
            //2人
            roomInfo.players.forEach((p) => {
                if (roomProp?.frameSyncPlayerArr) {
                    let item = roomProp.frameSyncPlayerArr.find(item => item.playerId === p.playerId);
                    addPlayerFromData(item.playerId, item.x, item.y, item.direction, null, item.robotName);
                } else {
                    if (ownerTeamId === p.teamId) {
                        addPlayerFromData(
                            p.playerId,
                            global.redPlayer1StartPos.x,
                            global.redPlayer1StartPos.y,
                            Direction.right,
                            Team.A,
                            p.robotName
                        );
                    } else {
                        addPlayerFromData(
                            p.playerId,
                            global.yellowPlayer1StartPos.x,
                            global.yellowPlayer1StartPos.y,
                            Direction.left,
                            Team.B,
                            p.robotName
                        );
                    }
                }
            });
        } else {
            console.error("selectTeamId == null TODO")
        }
    }


    onJoin (playerInfo: GOBE.PlayerInfo) {
        this.console.log("重连成功");
        if (playerInfo.playerId === global.playerId) {
            this.console.log("重连加入玩家id:" + playerInfo.playerId);
            //获取房间最新信息
            global.room.update()
                .then((room) => {
                    let isInRoom = this._getSelfIsInRoom(room);
                    if (isInRoom == true) {
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



    /**
     * 获取自己是否在房间内
    */
    private _getSelfIsInRoom (room: GOBE.Room): boolean {
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

