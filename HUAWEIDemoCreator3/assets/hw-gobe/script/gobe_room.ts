import { _decorator, Component, director, Label, Node } from 'cc';
import { GobeFightReady } from './gobe_fight_ready';
import { GobeFight } from './gobe_fight';
import { FightRoomState, global } from './hw_gobe_global_data';
import { GameSceneType } from './frame_sync';
import { Console } from '../../prefabs/console';
import { sleep } from './gobe_util';
import { GOBEError } from '../../cs-huawei/hwgobe/GOBE/GOBE';

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

    //重连次数
    private _curReconnectCount = 0;


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
        this._curReconnectCount = 0;
        //是否是战斗回放
        if (global.gameSceneType == GameSceneType.FOR_RECORD) {
            this._curRoomState = FightRoomState.Fight;
        } else {
            global.gameSceneType = GameSceneType.FOR_GAME;
            this._curRoomState = FightRoomState.Ready;
        }
        if (global.room && global.room.isSyncing) {
            console.log("房间已经处于帧同步模式");
            this._curRoomState = FightRoomState.Fight;
        }

        //根据房间状态显示对应的面板
        this._updatePanelShowState();

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

            //重置房间帧同步起始帧id
            if (global.needResetRoomFrameId == true) {
                global.needResetRoomFrameId = false;
                if (global.room.customRoomProperties && global.room.customRoomProperties.length > 0) {
                    try {
                        let roomProp = JSON.parse(global.room.customRoomProperties);
                        if (roomProp.curFrameId) {
                            this.console.log("重置房间帧同步起始帧id:" + roomProp.curFrameId);
                            global.room.resetRoomFrameId(roomProp.curFrameId);
                        }
                    } catch (error) {
                        console.error(error);
                        this.console.log("重置房间帧同步起始帧id:0");
                        global.room.resetRoomFrameId(0);
                    }
                } else {
                    this.console.log("重置房间帧同步起始帧id:0");
                    global.room.resetRoomFrameId(0);
                }
            }
        }
    }

    /**
     * 根据房间状态 更新面板显示
    */
    private _updatePanelShowState () {
        this.readyPanel.node.active = (this._curRoomState == FightRoomState.Ready);
        this.fightPanel.node.active = (this._curRoomState == FightRoomState.Fight);
        this.gameOverPanel.active = (this._curRoomState == FightRoomState.GameOver);
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

    /**
     * 加入房间监听
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gameobe-room-js-0000001192950624#section11321164309
    */
    onJoin (playerInfo: GOBE.PlayerInfo) {
        //重连后判断是否已经处于对战模式
        global.room.update()
            .then((room) => {
                //战斗模式下，判断房间人数是否不满足游戏. 是否就1个人，退出房间
                if (this._curRoomState == FightRoomState.Fight && global.room.players.length <= 1) {
                    this.console.log('当前房间人数不满足游戏，即将离开房间');
                    this.scheduleOnce(() => {
                        global.client.leaveRoom()
                            .then(() => {
                                this.console.log("onJoin room.players.length <= 1 leaveRoom success");
                            });
                        director.loadScene("gobe_hall");
                    }, 2)
                    return;
                }

                //刷新模块
                if (this._curRoomState == FightRoomState.Ready) {
                    this.readyPanel.onJoin(playerInfo);
                } else {
                    //none
                }

                if (playerInfo.playerId === global.playerId) {
                    this.console.log("玩家重连加入 id:" + playerInfo.playerId);
                    //自己是否还在房间
                    let isInRoom = this._getSelfIsInRoom(global.room);
                    //离开
                    if (isInRoom == false) {
                        global.gameSceneType = GameSceneType.FOR_NULL;
                        director.loadScene("gobe_hall");
                        return;
                    }
                }

                //判断本地为准备状态下，线上是否已经处于战斗模式
                if (this._curRoomState == FightRoomState.Ready && room.isSyncing == true) {
                    //模拟开始游戏
                    this.onStartFrameSync();
                } else if (this._curRoomState == FightRoomState.Fight && room.isSyncing == false) {
                    this.console.log("当前房间已经结束，即将离开房间");
                    this.scheduleOnce(() => {
                        global.client.leaveRoom()
                            .then(() => {
                                this.console.log("onJoin room.isSyncing == false leaveRoom success");
                            });
                        director.loadScene("gobe_hall");
                    }, 2)
                }
            }).catch((e) => {
                this.console.log("onJoin global.room.update err: ", e);
                this.scheduleOnce(() => {
                    global.client.leaveRoom()
                        .then(() => {
                            this.console.log("onJoin update error leaveRoom success");
                        });
                    director.loadScene("gobe_hall");
                }, 2)
            });
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
            this.fightPanel.onRoomPropertiesChange(roomInfo);
        }
    }



    //异常断开连接监听
    //https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gameobe-room-js-0000001192950624#section388281874
    async onDisconnect (playerInfo: GOBE.PlayerInfo) {
        if (playerInfo.playerId === global.playerId) {
            global.isConnected = false;
            this.console.log("自己掉线,准备重连");
            // 进行重连操作
            while (!global.isConnected && this.node.active == true && this._curReconnectCount <= global.maxReconnectCount) {
                await sleep(3000);
                //再次判断
                if (!global.isConnected) {
                    global.room.reconnect()
                        .then(() => {
                            this.console.log("reconnect success");
                            global.isConnected = true;
                            this._curReconnectCount = 0;
                        })
                        .catch((error: GOBEError) => {
                            this.console.log("reconnect err,", error);
                            //房间不存在
                            if (error.code == 101117) {
                                this.console.log("房间不存在，离开房间");
                                director.loadScene("gobe_hall");
                                return;
                            }
                            //是否达到最大重连次数
                            this._curReconnectCount++;
                            if (this._curReconnectCount >= global.maxReconnectCount) {
                                this.console.log("重连达到最大次数，离开房间");
                                //离开房间
                                global.client.leaveRoom()
                                    .then(() => {
                                        console.log("重连达到最大次数 离开房间成功");
                                    }).catch((e) => {
                                        console.log("重连达到最大次数 离开房间失败", e);
                                    });
                                director.loadScene("gobe_hall");
                            }
                        });
                }
            }
        } else {
            this.console.log("有其他玩家掉线");
        }
    }

    //websocket连接建立监听
    //https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gameobe-room-js-0000001192950624#section4981161272516
    onConnect (playerInfo: GOBE.PlayerInfo) {
        this.console.log("websocket连接建立");
        if (playerInfo.playerId === global.playerId) {
            global.isConnected = true;
        }
        this._curReconnectCount = 0;
    }

    //开始帧同步
    onStartFrameSync () {
        this._curRoomState = FightRoomState.Fight;
        this.readyPanel.setEnterGameWaitPanel(true);
        this.scheduleOnce(() => {
            this.readyPanel.setEnterGameWaitPanel(false);
            //根据房间状态显示对应的面板
            this._updatePanelShowState();
        }, 2)
    }

    //收到实时服务器消息广播监听。
    //https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gameobe-room-js-0000001192950624#section13162043144510
    onRecvFromServer (data: GOBE.RecvFromServerInfo) {
        this.console.log('onReceiveFromServer:' + JSON.stringify(data));
        //解析数据
        let res = JSON.parse(data.msg);
        if (res.type === "GameEnd") {
            this.console.log("游戏结束 res.result:" + res.result);
            let lbNode = this.gameOverPanel.getChildByName("tips");
            if (lbNode) {
                lbNode.getComponent(Label).string = (res.result === 1 ? "结算正常" : "结算异常");
            }
            this._curRoomState = FightRoomState.GameOver;
            //重置场景类型
            global.gameSceneType = GameSceneType.FOR_NULL;
            //根据房间状态显示对应的面板
            this._updatePanelShowState();
            //离开房间
            global.client.leaveRoom()
                .then(() => {
                    this.console.log("退出房间成功");
                }).catch((e) => {
                    this.console.log("退出房间失败", e);
                });
        } else {
            console.warn("TODO onRecvFromServer res.type:" + res.type);
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

