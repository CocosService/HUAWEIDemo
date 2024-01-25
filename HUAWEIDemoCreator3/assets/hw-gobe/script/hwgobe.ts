import { _decorator, Component, loader, director, CCString, EventTarget, EditBox, Node, Button, Label, instantiate, Prefab, AssetManager, Asset, profiler, sys, error } from 'cc';
import { Console } from '../../prefabs/console';
import { HwGobeGlobalData, global } from './hw_gobe_global_data';
import config from './config';
import { isInited, mockOpenId } from './gobe_util';
const { ccclass, property } = _decorator;


/**
 * 华为联机对战
*/
@ccclass('HwGOBE')
export class HwGOBE extends Component {
    @property({ type: Console })
    console: Console;
    @property({ type: Asset })
    cerPath: Asset;

    onEnable() {
        // GOBE.Logger.level = GOBE.LogLevel.INFO;
        profiler.hideStats();
        console.log("this.cerPath.nativeUrl:" + this.cerPath?.nativeUrl);
    }
    onDisable() {
    }


    //openId = A
    public initSDKWithOpenIdA() {
        this._initSDK("A");
    }
    //openId = B
    public initSDKWithOpenIdB() {
        this._initSDK("B");
    }


    /**
     * 初始化sdk
    */
    private _initSDK(openId: string) {
        if (isInited()) {
            director.loadScene("gobe_hall");
            return;
        }

        let clientConfig = {
            appId: config.gameId,
            openId: openId,
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            appVersion: '1.10.111',
        };

        if (sys.Platform.ANDROID === sys.platform) {
            if (this.cerPath == null) {
                this.console.error("请把 cs-huawei/hwgobe/GOBE/endpoint-cert.cer 文件挂载到 hwgobe 场景的 Canvas 脚本的 cerPath 上");
                return;
            }
            clientConfig = Object.assign(clientConfig, {
                platform: GOBE.PlatformType.ANDROID,
                cerPath: this.cerPath.nativeUrl,
            })
        }

        //存储 playerName
        global.playerName = clientConfig.openId;

        try {
            global.client = new GOBE.Client(clientConfig);
        } catch (error) {
            this.console.error(error);
            return;
        }
        global.client.onInitResult((resultCode) => {
            if (resultCode === GOBE.ErrorCode.COMMON_OK) {
                global.playerId = global.client.playerId;
                if (global.client.lastRoomId) {
                    //方式1 退出旧房间
                    // global.client.leaveRoom()
                    //     .then(() => {
                    //         console.log("leaveRoom success");
                    //     })
                    //     .catch((err) => {
                    //         console.log("leaveRoom success");
                    //     })

                    //方式2 尝试进入上一次的房间
                    global.client.joinRoom(global.client.lastRoomId,
                        { customPlayerStatus: 0, customPlayerProperties: "" })
                        .then((room) => {
                            //是否就1个人，退出房间
                            if (room.players.length <= 1) {
                                global.client.leaveRoom().then(() => {
                                    console.log("onInitResult room.players.length <= 1 leaveRoom success");
                                });
                                director.loadScene("gobe_hall");
                                return;
                            }
                            console.log("加入旧房间成功");
                            global.room = room;
                            global.player = room.player;
                            // 重置帧id
                            //标志需要重置房间帧同步起始帧id
                            global.needResetRoomFrameId = true;
                            director.loadScene("gobe_room");
                        }).catch((e) => {
                            console.log("加入旧房间失败", e);
                            //离开上次房间
                            global.client.leaveRoom().then(() => {
                                console.log("leaveRoom success");
                            });
                        });
                }
                director.loadScene("gobe_hall");
            } else {
                console.log('init failed');
            }
        });

        this.console.log("正在初始化");
        global.client.init()
            .catch((e) => {
                this.console.log("初始化失败，请重新刷新页面", e);
            });
        this._statistics();
    }
    
    private _statistics() {
        let params = {
            "appType": "hwsdk",
            "reportType": "Start",
            "sdkName" : "hwgobe",
            "appId": config.gameId,
            "time" : Date.now(),
            "version": "1.0.0_13.8.1.300", 
        }
        fetch("https://k.cocos.org/", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then((response: Response) => {
            return response.text()
        }).then((value) => {
            console.log(value);
        })
    }


}
