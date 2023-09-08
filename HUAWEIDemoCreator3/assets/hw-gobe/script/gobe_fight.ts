import { _decorator, color, Component, director, find, instantiate, Label, Node, Prefab, Sprite } from 'cc';
import { clearFrames, CmdType, Direction, frameSyncPlayerList, GameSceneType, pushFrames, addPlayerFromData, Team } from './frame_sync';
import { global } from './hw_gobe_global_data';
import { FrameSyncView } from './frame_sync_view';
import config from './config';
import { Console } from '../../prefabs/console';
import { sleep } from './gobe_util';

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
    public syncRoomPropTask: number = null;


    onEnable () {
        //回放模式
        if (global.gameSceneType == GameSceneType.FOR_RECORD) {
            this.gameIdLabel.string = "房间ID:" + global.recordRoomInfo.roomId;
            this.playerIdLabel.string = "玩家Id:" + global.playerId;

            this.frameSyncView.onRecordLeaveButtonClick = () => this._onQuitButtonClick();
            this.frameSyncView.setButtons(GameSceneType.FOR_RECORD);
        }
        //游戏模式
        else {
            console.log("是否处于帧同步：" + global.room.isSyncing);

            // 设置文本标签
            this.gameIdLabel.string = "房间ID:" + global.room.roomId;
            this.playerIdLabel.string = "玩家Id:" + global.playerId;

            //ui按钮事件
            this.frameSyncView.onUpButtonClickEve = () => this._sendPlaneFlyFrame(Direction.up);
            this.frameSyncView.onDownButtonClickEve = () => this._sendPlaneFlyFrame(Direction.down);
            this.frameSyncView.onLeftButtonClickEve = () => this._sendPlaneFlyFrame(Direction.left);
            this.frameSyncView.onRightButtonClickEve = () => this._sendPlaneFlyFrame(Direction.right);
            this.frameSyncView.onStopFrameButtonClickEve = () => this._onStopFrameButtonClick();
            this.frameSyncView.onExitRoomButtonClick = () => this._onExitRoomButtonClick();

            this.frameSyncView.setButtons(global.gameSceneType, global.playerId === global.room.ownerId);

            // 房主定时同步roomInfo中的customRoomProperties
            if (global.room.isSyncing && global.playerId === global.room.ownerId) {
                this.syncRoomPropTask = setInterval(() => {
                    let roomProperties: any = null;
                    if (global.room.customRoomProperties && global.room.customRoomProperties.length > 0) {
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

            //判断房间人数是否不满足游戏. 是否就1个人，退出房间
            if (global.room.players.length <= 1) {
                this.console.log('当前房间人数不满足游戏，即将离开房间');
                this.scheduleOnce(() => {
                    global.client.leaveRoom()
                        .then(() => {
                            this.console.log("onJoin room.players.length <= 1 leaveRoom success");
                        });
                    director.loadScene("gobe_hall");
                }, 2)
            }
        }

        //初始化角色
        this._initPlayerData();
        //更新到view
        this.frameSyncView.updatePlayerNode();

        //上报数据 仅游戏模式
        if (global.gameSceneType == GameSceneType.FOR_GAME) {
            this._reportPlayerInfo();
        }
    }




    onDisable () {
        //移除ui按钮监听
        this.frameSyncView.removeAllListener();
        //清除记录的帧
        clearFrames();
        //清除定时任务
        if (this.syncRoomPropTask) {
            clearInterval(this.syncRoomPropTask);
            this.syncRoomPropTask = null;
        }
    }


    //房间信息更新监听
    //https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gameobe-room-js-0000001192950624#section591542849
    onRoomPropertiesChange (roomInfo: GOBE.RoomInfo) {
        // this.console.log('onRoomPropertiesChange ' + JSON.stringify(roomInfo));
    }


    //请求补帧失败监听
    //https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gameobe-room-js-0000001192950624#section059433420611
    onRequestFrameError (err: GOBE.GOBEError) {
        console.error('请求补帧失败,err', err);
        this.console.log(global.client.room.update().then((room) => { this.console.log("room:", room) }))
        if (err.code === 10002) {
            // 补帧失败，重置帧ID后重新补帧
            let roomProp = JSON.parse(global.room.customRoomProperties);
            if (roomProp.curFrameId) {
                global.room.resetRoomFrameId(roomProp.curFrameId);
            }
        }
    }



    // SDK发送运动帧消息
    private _sendPlaneFlyFrame (dir: Direction) {
        //简单判断，如果帧池内太多处于追帧情况 则暂停发送命令
        if (global.isRequestFrameStatus || global.unhandleFrames.length >= 10) {
            let add = global.unhandleFrames.length >= 10 ? (" 剩余帧数：" + global.unhandleFrames.length) : "";
            this.console.log("当前正在追帧,请稍后再操作" + add);
            return;
        }
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
            // this.console.log('sendPlaneFlyFrame:' + frameData);
            global.room.sendFrame(frameData);
        }
        catch (e) {
            this.console.log('sendPlaneFlyFrame err: ', e);
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



    // 停止游戏按钮点击
    private _onStopFrameButtonClick () {
        global.room.stopFrameSync()
            .then(() => {
                //停止同步玩家信息
                if (this.syncRoomPropTask) {
                    clearInterval(this.syncRoomPropTask);
                    this.syncRoomPropTask = null;
                }
            }).catch((e) => {
                // 停止帧同步失败
                this.console.log("停止帧同步失败", e);
            });
    }

    // 退出回放
    private _onQuitButtonClick () {
        global.gameSceneType = GameSceneType.FOR_NULL;
        frameSyncPlayerList.players = [];
        this.frameSyncView.updatePlayerNode();
        global.recordRoomInfo = null;
        director.loadScene("gobe_hall");
    }

    //离开房间
    private _onExitRoomButtonClick () {
        global.client.leaveRoom()
            .then(() => {
                this.console.log("退出房间成功");
                global.gameSceneType = GameSceneType.FOR_NULL;
                director.loadScene("gobe_hall");
            }).catch((e) => {
                this.console.log("退出房间失败", e);
            });
    }


    // 接收（帧同步）帧广播消息
    onRecvFrame (frame: GOBE.RecvFrameMessage) {
        // 本次接收帧存入“未处理帧”数组中,只负责接收,不处理数据
        global.unhandleFrames = global.unhandleFrames.concat(frame);
        // console.log("onRecvFrame:", frame);
    }



    /**
     * 按游戏帧率处理接收到的帧
     */
    update () {
        // 处理帧广播消息
        if (global.unhandleFrames.length > 0) {
            if (global.gameSceneType == GameSceneType.FOR_RECORD) {
                this._receiveFrameHandle(global.unhandleFrames[0]);
                global.unhandleFrames.shift();
            }
            else {
                // 未处理的帧如果大于1,表示补帧
                if (global.unhandleFrames.length > 1) {
                    if (global.isRequestFrameStatus != true) {
                        global.isRequestFrameStatus = true;
                        console.warn("切换为 补帧 状态");
                    }
                    for (let i = 0; i < config.handleFrameRate; i++) {
                        if (global.unhandleFrames[0]) {
                            this._receiveFrameHandle(global.unhandleFrames[0]);
                            global.curHandleFrameId = global.unhandleFrames[0].currentRoomFrameId;
                            global.unhandleFrames.shift();
                        }
                    }
                } else {
                    // 正常处理
                    if (global.isRequestFrameStatus == true) {
                        global.isRequestFrameStatus = false;
                        console.warn("切换为 非补帧 状态");
                    }
                    this._receiveFrameHandle(global.unhandleFrames[0]);
                    global.unhandleFrames.shift();
                }
            }
        }
    }

    onStopFrameSync () {
        this.console.log("SDK广播--停止帧同步");
        frameSyncPlayerList.players = [];
        this.frameSyncView.updatePlayerNode();
        // 清空帧数据
        global.unhandleFrames = [];

        global.curHandleFrameId = 0;

        // 清空roomProperties
        if (global.room.ownerId === global.client.playerId) {
            global.room.updateRoomProperties({ customRoomProperties: "" });
        }

        //发送结束
        global.client.room.sendToServer(JSON.stringify({
            playerId: global.client.playerId,
            type: "GameEnd",
            value: 0
        }));
    }

    onDismiss () {
        this.console.log("SDK广播--解散被房间");
        global.gameSceneType = GameSceneType.FOR_NULL;
        director.loadScene("gobe_hall");
    }

    onLeave (playerInfo: GOBE.PlayerInfo) {
        this.console.log("SDK广播--有人离开房间");
        // 重新计算房间内的人员信息
        let players = [];
        frameSyncPlayerList.players.forEach(function (player) {
            if (player.playerId != playerInfo.playerId) {
                players.push(player);
            }
        });
        frameSyncPlayerList.players = players;
        this.frameSyncView.updatePlayerNode();

        //如果房间只有自己了则也要离开房间
        if (players.length == 1) {
            this.console.log("当前房间人数太少，不满足对战条件，即将离开房间");
            this.scheduleOnce(() => {
                global.gameSceneType = GameSceneType.FOR_NULL;
                global.client.leaveRoom()
                    .then(() => {
                        this.console.log("离开房间成功");
                        director.loadScene("gobe_hall");
                    }).catch((e) => {
                        this.console.log("离开退出房间失败", e);
                        director.loadScene("gobe_hall");
                    });
            }, 2)
        }
    }

    /**
     * 接收帧处理
     * @param frame
     * @private
     */
    private _receiveFrameHandle (frame: GOBE.RecvFrameMessage) {
        // console.log("收到帧数据:", frame);
        // 处理帧内容
        if (frame.frameInfo && frame.frameInfo.length > 0) {
            if (frame.frameInfo[0].playerId !== "0") {
                //记录帧
                pushFrames(frame);
                //运行帧
                this.frameSyncView.runFrame(frame);
            }
        }
    }

    /**
     * 初始化player
    */
    private _initPlayerData () {
        let roomInfo: GOBE.Room = null;
        if (global.gameSceneType == GameSceneType.FOR_RECORD) {
            roomInfo = global.recordRoomInfo;
        }
        else {
            roomInfo = global.room;
        }

        //先重置 在 addPlayerFromData 内会添加
        frameSyncPlayerList.players = [];


        let hasTeamId = null;
        roomInfo.players.forEach((p) => {
            if (roomInfo.ownerId === p.playerId) {
                // 如果是房主
                hasTeamId = p.teamId;
                return;
            }
        });


        let roomProp = null;
        if (roomInfo?.customRoomProperties && roomInfo?.customRoomProperties.length > 0) {
            roomProp = JSON.parse(roomInfo.customRoomProperties);
        }

        //队伍匹配
        if (hasTeamId) {
            roomInfo.players.forEach((p) => {
                if (roomProp?.frameSyncPlayerArr && roomProp?.frameSyncPlayerArr.length > 0) {
                    let item = roomProp.frameSyncPlayerArr.find(item => item.playerId === p.playerId);
                    if (item) {
                        addPlayerFromData(item.playerId, item.x, item.y, item.direction, null);
                    } else {
                        this.console.error("roomProp.frameSyncPlayerArr.find null, addPlayer error")
                    }
                } else {
                    if (hasTeamId === p.teamId) {
                        addPlayerFromData(
                            p.playerId,
                            global.TeamAPlayer1StartPos.x,
                            global.TeamAPlayer1StartPos.y,
                            Direction.right,
                            Team.A,
                        );
                    } else {
                        addPlayerFromData(
                            p.playerId,
                            global.TeamBPlayer1StartPos.x,
                            global.TeamBPlayer1StartPos.y,
                            Direction.left,
                            Team.B,
                        );
                    }
                }
            });
        }
        //房间匹配
        else {
            roomInfo.players.forEach((p) => {
                if (roomProp?.frameSyncPlayerArr && roomProp?.frameSyncPlayerArr.length > 0) {
                    let item = roomProp.frameSyncPlayerArr.find(item => item.playerId === p.playerId);
                    if (item) {
                        addPlayerFromData(item.playerId, item.x, item.y, item.direction, null);
                    }
                    else {
                        this.console.error("roomProp.frameSyncPlayerArr.find null, addPlayer error")
                    }
                }
                else {
                    if (roomInfo.ownerId == p.playerId) {
                        addPlayerFromData(
                            p.playerId,
                            global.TeamAPlayer1StartPos.x,
                            global.TeamAPlayer1StartPos.y,
                            Direction.right,
                            null,
                        );
                    } else {
                        addPlayerFromData(
                            p.playerId,
                            global.TeamBPlayer1StartPos.x,
                            global.TeamBPlayer1StartPos.y,
                            Direction.left,
                            null,
                        );
                    }
                }
            });
        }
    }

    //如果是房主 开始时上报各个玩家起始位置信息
    private _reportPlayerInfo () {
        if (global.playerId != global.room.ownerId) {
            return;
        }
        let playerInfoArr = [];
        frameSyncPlayerList.players.forEach((player) => {
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
                players: frameSyncPlayerList.players
            },
        });
        global.room.sendFrame(frameData);
    }



}

