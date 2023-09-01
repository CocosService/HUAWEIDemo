import { _decorator, Button, Component, director, instantiate, Label, Node, Prefab, ProgressBar } from 'cc';
import { global, LockType, RoomType } from './hw_gobe_global_data';
import { GameSceneType } from './frame_sync';
import { setRoomType, sleep } from './gobe_util';
//@ts-ignore
import { PlayerInfo, RecvFromServerInfo, RoomInfo, UpdateCustomPropertiesResponse, UpdateCustomStatusResponse } from '../../cs-huawei/hwgobe/GOBE/GOBE';
import { RoomUserItem } from './room_user_item';
import { Console } from '../../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('GobeRoom')
export class GobeRoom extends Component {
    @property({ type: Console })
    console: Console = null!;

    @property(Label)
    roomNameEditBox: Label = null;
    @property(Label)
    roomIdEditBox: Label = null;
    @property(Label)
    isOwnerEditBox: Label = null;

    //放置的位置
    @property(RoomUserItem)
    selfPlayer: RoomUserItem = null;
    @property(RoomUserItem)
    otherPlayer: RoomUserItem = null;

    @property(Button)
    startGameBtn: Button;
    @property(Button)
    exitRoomBtn: Button;
    @property(Button)
    removeOtherPlaBtn: Button;
    @property(Button)
    delRoomBtn: Button;


    @property(Button)
    enableReadyBtn: Button;
    @property(Button)
    cancelReadyBtn: Button;

    @property(Button)
    setRoomIsLockBtn: Button;
    @property(Button)
    setRoomNotLockBtn: Button;


    @property(Node)
    loadingTip: Node = null;
    @property(Label)
    isLockText: Label = null;

    isLock = LockType.UnLocked;

    // 是否是加载状态
    isLoadingStatus = false;


    //eve
    private _onJoinEve = (playerInfo: PlayerInfo) => this.onJoining(playerInfo);
    private _onLeaveEve = (playerInfo: PlayerInfo) => this.onLeaving(playerInfo);
    private _onDismissEve = () => this.onDismiss()
    private _onUpdateCustomStatusEve = (playerInfo: UpdateCustomStatusResponse) => this.onUpdateCustomStatus(playerInfo);
    private _onUpdateCustomPropertiesEve = (playerInfo: UpdateCustomPropertiesResponse) => this.onUpdateCustomProperties(playerInfo);
    private _onRoomPropertiesChangeEve = (roomInfo: RoomInfo) => this.onRoomPropertiesChange(roomInfo);
    private _onDisconnectEve = (playerInfo: PlayerInfo) => this.onDisconnect(playerInfo);
    private _onConnectEve = (playerInfo) => this.onConnect(playerInfo);
    private _onStartFrameSyncEve = () => this.onStartFrameSync();
    private _onRecvFromServerEve = (receiveFromServerInfo) => this.onReceiveFromGameServer(receiveFromServerInfo);


    start () {
        if (global.room.isSyncing) {
            this.onDirectStartFrameSync();
        }
        global.room.onJoin(this._onJoinEve);
        global.room.onLeave(this._onLeaveEve);
        global.room.onDismiss(this._onDismissEve);
        global.room.onUpdateCustomStatus(this._onUpdateCustomStatusEve);
        global.room.onUpdateCustomProperties(this._onUpdateCustomPropertiesEve);
        global.room.onRoomPropertiesChange(this._onRoomPropertiesChangeEve)
        global.room.onDisconnect(this._onDisconnectEve); // 断连监听
        global.room.onConnect(this._onConnectEve);
        // SDK 开始帧同步
        global.room.onStartFrameSync(this._onStartFrameSyncEve);
        global.room.onRecvFromServer(this._onRecvFromServerEve);
    }

    protected onDestroy (): void {
        global.room.onJoin.off(this._onJoinEve);
        global.room.onLeave.off(this._onLeaveEve);
        global.room.onDismiss.off(this._onDismissEve);
        global.room.onUpdateCustomStatus.off(this._onUpdateCustomStatusEve);
        global.room.onUpdateCustomProperties.off(this._onUpdateCustomPropertiesEve);
        global.room.onRoomPropertiesChange.off(this._onRoomPropertiesChangeEve)
        global.room.onDisconnect.off(this._onDisconnectEve); // 断连监听
        global.room.onConnect.off(this._onConnectEve);
        // SDK 开始帧同步
        global.room.onStartFrameSync.off(this._onStartFrameSyncEve);
        global.room.onRecvFromServer.off(this._onRecvFromServerEve);
    }


    update () {
        //模拟进度
        this.mockLoadingProgress();
    }


    onDirectStartFrameSync () {
        global.room.players.forEach(function (player) {
            if (global.playerId == player.playerId) {
                if (player.customPlayerProperties != null && player.customPlayerProperties == "watcher") {
                    global.gameSceneType = GameSceneType.FOR_WATCHER;
                    director.loadScene("gobe_game");
                    return;
                }
            }
        });
        global.gameSceneType = GameSceneType.FOR_GAME;
        director.loadScene("gobe_game");
    }


    // 设置开始按钮
    setStartBtn (active: boolean,) {
        this.startGameBtn.node.active = active;
    }

    // 设置离开按钮
    setExitRoomBtn (active: boolean) {
        this.exitRoomBtn.node.active = active;
    }

    // 设置踢人按钮
    setKickBtn (active: boolean) {
        this.removeOtherPlaBtn.node.active = active;
    }

    // 设置解散按钮
    setDismissBtn (active: boolean) {
        this.delRoomBtn.node.active = active;
    }


    /**
     * 设为锁定
    */
    setRoomIsLock () {
        this.isLock = LockType.Locked;
        if (global.room && global.room.ownerId === global.room.playerId) {
            global.room.updateRoomProperties({ isLock: 1 });
        }
    }
    /**
     * 设为不锁定
    */
    setRoomNotLock () {
        this.isLock = LockType.UnLocked;
        if (global.room && global.room.ownerId === global.room.playerId) {
            global.room.updateRoomProperties({ isLock: 0 });
        }
    }


    /**
     * 解散房间
    */
    delRoom () {
        this.console.log(`正在解散房间`);
        global.client.dismissRoom().then((client) => {
            // 退出房间成功
            this.console.log("解散房间成功");
            global.roomType = RoomType.NULL;
            global.client = client;
            director.loadScene("gobe_hall");
        }).catch((e) => {
            // 退出房间失败
            this.console.log("提示", "解散房间失败", e);
        });
    }

    /**
     * 踢人
    */
    removeOtherPla () {
        let playerId = "";
        global.room.players.forEach(function (player) {
            if (player.playerId != global.room.ownerId) {
                playerId = player.playerId;
            }
        });
        global.room.removePlayer(playerId).then(() => {
            // 踢人成功
            this.console.log("踢人成功");
            this.initRoomView();
        }).catch((e) => {
            // 踢人失败
            this.console.log("提示", "踢人失败", e);
        });
    }

    /**
     * 退出房间
    */
    exitRoom () {
        this.console.log(`正在退出房间`);
        global.client.leaveRoom().then((client) => {
            // 退出房间成功
            this.console.log("退出房间成功");
            global.roomType = RoomType.NULL;
            global.client = client;
            director.loadScene("gobe_hall");
        }).catch((e) => {
            // 退出房间失败
            this.console.log("提示", "退出房间失败", e);
        });
    }

    /**
     * 准备就绪
    */
    ready () {
        let ready = 1;
        global.player.updateCustomStatus(ready);
    }

    /**
     * 取消准备
    */
    cancelReady () {
        let unready = 0;
        global.player.updateCustomStatus(unready);
    }

    /**
     * 开始游戏
    */
    startGame () {
        this.console.log(`开始游戏`);
        global.room.update()
            .then((room) => {
                let hasUserNotReady: boolean = false;
                room.players.forEach(function (player) {
                    if (player.customPlayerStatus == 0) {
                        hasUserNotReady = true;
                        return;
                    }
                });
                if (hasUserNotReady) {
                    this.console.log("提示", "还有玩家未准备，请稍后！");
                } else {
                    // 全部加载完毕则开始帧同步
                    global.room.startFrameSync().then(() => {
                        // 开始帧同步成功
                        this.console.log("开始帧同步成功");
                    }).catch((e) => {
                        // 开始帧同步失败
                        this.console.log("提示", "开始帧同步失败", e);
                    });
                }
            });
    }




    //事件--------------
    onJoining (playerInfo: PlayerInfo) {
        this.console.log("有用户加入房间");
        // 加入房间后，设置好房间类型
        setRoomType(RoomType.OneVOne);
        this.initRoomView()
    }


    onLeaving (playerInfo: PlayerInfo) {
        this.console.log("有用户离开房间");
        if (global.playerId != playerInfo.playerId) {
            this.initRoomView();
        } else {
            global.roomType = RoomType.NULL;
            director.loadScene("gobe_hall");
        }
    }

    onDismiss () {
        this.console.log("被踢出房间")
        global.room = null;
        global.roomType = RoomType.NULL;
        director.loadScene("gobe_hall");
    }


    //修改自定义状态回调
    onUpdateCustomStatus (playerInfo: UpdateCustomStatusResponse) {
        this.console.log('玩家 ' + playerInfo.playerId + ' 修改准备状态为 ' + playerInfo.customStatus);
        let isReady = playerInfo.customStatus === 1;
        this.enableReadyBtn.node.active = !isReady;
        this.cancelReadyBtn.node.active = isReady;
        this.setExitRoomBtn(!isReady)
        //item ui
        this.selfPlayer.setReadyStatus(isReady);
        this.initRoomView();
    }


    // 修改自定义属性回调
    onUpdateCustomProperties (playerInfo: UpdateCustomPropertiesResponse) {
        this.console.log("onUpdateCustomProperties", playerInfo)
    }
    // 修改房间属性回调
    onRoomPropertiesChange (roomInfo: RoomInfo) {
        this.console.log('onRoomPropertiesChange ' + JSON.stringify(roomInfo));
        this.isLockText.string = "是否锁定房间：" + (roomInfo.isLock == 1);
    }

    onConnect (playerInfo: PlayerInfo) {
        if (playerInfo.playerId === global.playerId) {
            global.isConnected = true;
            this.console.log("自己上线了");
        } else {
            this.console.log("房间内其他玩家上线了，playerId:" + playerInfo.playerId);
        }
        this.initRoomView()
    }

    async onDisconnect (playerInfo: PlayerInfo) {
        if (playerInfo.playerId === global.playerId) {
            global.isConnected = false;
            this.console.log("玩家掉线，playerId : " + playerInfo.playerId);
            if (global.isTeamMode) {
                director.loadScene("gobe_hall");
            } else {
                // 没有超过重连时间，就进行重连操作
                while (!global.isConnected) {
                    // 2秒重连一次，防止并发过大游戏直接卡死
                    await sleep(2000).then();
                    await global.room.reconnect();
                }
            }
        } else {
            this.console.log("房间内其他玩家掉线，playerInfo : ", playerInfo);
        }

        this.initRoomView()
    }

    onStartFrameSync () {
        this.startLoading();
    }


    startLoading () {
        // 加载过程中不允许解散、退出、踢人操作
        this.setDismissBtn(false);
        this.setKickBtn(false);
        this.setExitRoomBtn(false);
        this.setStartBtn(false);
        this.cancelReadyBtn.getComponent(Button).interactable = false;

        this.roomNameEditBox.string = "";
        this.roomIdEditBox.string = "";
        this.isLoadingStatus = true;
        this.loadingTip.active = true;
    }


    // 接收实时服务器消息
    onReceiveFromGameServer (data: RecvFromServerInfo) {
        let self = this;
        if (data.msg) {
            let parseMsg = JSON.parse(data.msg);
            let progress = parseMsg.progress;
            let playerId = parseMsg.playerId;
            if (progress) {
                // 此处要区分玩家，针对不同玩家渲染独立的progressBar
                if (playerId === global.client.room.ownerId) {
                    this.selfPlayer.updateProgress(progress);
                } else {
                    this.otherPlayer.updateProgress(progress);
                }
            }
        }

        // 检测是否都已加载完毕
        if (this.selfPlayer.progress === 1 &&
            this.otherPlayer.progress === 1) {
            this.isLoadingStatus = false;
            global.gameSceneType = GameSceneType.FOR_GAME;
            director.loadScene("gobe_game");
        }
    }



    //私有方法--------------

    //模拟进度
    mockLoadingProgress () {
        if (this.isLoadingStatus == false) {
            return;
        }
        let increment = 0.1;
        let progress = this.selfPlayer.progress
        progress = (progress + increment > 1) ? 1 : progress + increment;
        global.client.room.sendToServer(JSON.stringify({
            playerId: global.client.playerId,
            type: "Progress",
            progress
        }));
    }


    initRoomView () {
        if (global.room) {
            global.room.update()
                .then(() => this.setRoomView())
                .catch((error) => {
                    if (error.code && error.code === 101005) {
                        director.loadScene("gobe_match");
                    }
                });
        }
    }

    setRoomView () {
        //先重置
        this.selfPlayer.setUserInfo(null, false);
        this.otherPlayer.setUserInfo(null, false);

        const roomInfo = global.room;
        const selfIsOwner = roomInfo.ownerId === global.playerId;

        this.isOwnerEditBox.string = "是否是房间主：" + (selfIsOwner ? "是" : "否");
        this.isLockText.string = "房间是否锁定：" + (roomInfo.isLock == 1);
        this.roomNameEditBox.string = "房间名：" + (roomInfo.roomName || "");
        this.roomIdEditBox.string = "房间id：" + (roomInfo.roomId || "");


        //非房主的准备状态
        let notOwnerReadyStateValue: number = 0;
        //房主准备状态
        let ownerIsReady: number = 0;
        roomInfo.players.forEach((player: PlayerInfo) => {
            if (player.playerId === global.playerId) {
                this.selfPlayer.setUserInfo(player, roomInfo.ownerId === player.playerId);
            } else {
                this.otherPlayer.setUserInfo(player, roomInfo.ownerId === player.playerId);
            }
            if (player.playerId != roomInfo.ownerId) {
                notOwnerReadyStateValue = player.customPlayerStatus;
            } else {
                ownerIsReady = player.customPlayerStatus;
            }
        });
        this.loadingTip.active = this.isLoadingStatus;


        //设置按钮状态
        this.initDefaultBtn(
            selfIsOwner,
            roomInfo.players.length,
            ownerIsReady === 1,
            notOwnerReadyStateValue === 1,
        );
    }

    // 初始化默认按钮
    initDefaultBtn (selfIsOwner: boolean, playerCount: number, ownerIsReady: boolean, notOwnerIsReady: boolean) {
        // 房间只有一人时，肯定为房主
        if (playerCount === 1) {
            this.enableReadyBtn.node.active = !ownerIsReady;
            this.cancelReadyBtn.node.active = ownerIsReady;
            // 房主有开始按钮，但人没齐时不注册监听，不响应
            this.setStartBtn(false);
            // 一开始只有房主，默认不显示踢人按钮
            this.setKickBtn(false);
            // 房主才有解散按钮，只在按钮存在即可解散，即有响应
            this.setDismissBtn(true)
            // 房主和非房主均有离开按钮
            this.setExitRoomBtn(true);
            // 房主显示是否锁定房间
            this.setRoomIsLockBtn.node.active = true;
            this.setRoomNotLockBtn.node.active = true;
        } else {
            // 房间有两人时，得看是初始化房主还是非房主的界面
            if (selfIsOwner) {
                this.enableReadyBtn.node.active = !ownerIsReady;
                this.cancelReadyBtn.node.active = ownerIsReady;
                // 房主显示是否锁定房间
                this.setRoomIsLockBtn.node.active = true;
                this.setRoomNotLockBtn.node.active = true;
                // 加载状态时，非房主肯定是已准备状态
                if (this.isLoadingStatus) {
                    this.setStartBtn(false);
                    this.setKickBtn(false);
                    this.setDismissBtn(false);
                    this.setExitRoomBtn(false);
                } else {
                    // 非加载状态时，要看非房主的准备状态
                    this.setStartBtn(notOwnerIsReady);
                    this.setKickBtn(true);
                    this.setDismissBtn(true);
                    this.setExitRoomBtn(true);
                }
            } else {
                // 非房主
                this.enableReadyBtn.node.active = !notOwnerIsReady;
                this.cancelReadyBtn.node.active = notOwnerIsReady;
                // 非房主不显示是否锁定房间
                this.setRoomIsLockBtn.node.active = false;
                this.setRoomNotLockBtn.node.active = false;
                this.setStartBtn(false);
                this.setKickBtn(false);
                this.setDismissBtn(false);
                this.setExitRoomBtn(!notOwnerIsReady);
            }
        }
    }
}

