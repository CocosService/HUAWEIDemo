import { _decorator, Component, loader, director, CCString, EventTarget, EditBox, Node, Button, Label, instantiate, Prefab, AssetManager, Asset, profiler, sys } from 'cc';
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
    console: Console = null!;
    @property(Asset)
    cerPath: Asset = null;

    onEnable () {
        // GOBE.Logger.level = GOBE.LogLevel.INFO;
        profiler.hideStats();
        console.log("this.cerPath.nativeUrl:" + this.cerPath?.nativeUrl);
    }
    onDisable () {
    }

    //openId = A
    public initSDKWithOpenIdA () {
        this._initSDK("A");
    }
    //openId = B
    public initSDKWithOpenIdB () {
        this._initSDK("B");
    }


    /**
     * 初始化sdk
    */
    private _initSDK (openId: string = null) {
        if (isInited()) {
            this.console.log("SDK 已经初始化，无需重复操作");
            return;
        }

        let clientConfig = {
            appId: config.gameId,
            openId: openId != null ? openId : mockOpenId(), // 区别不同用户
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            // accessToken: this.accessTokenEdit.string,
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
        global.client.onInitResult((resultCode) => this.onInitResult(resultCode));
        this.console.log("正在初始化");
        global.client.init()
            .catch((e) => {
                // 鉴权失败
                this.console.log("提示", "初始化失败，请重新刷新页面", e);
            });
    }

    // 初始化监听回调
    onInitResult (resultCode: number) {
        if (resultCode === GOBE.ErrorCode.COMMON_OK) {
            global.playerId = global.client.playerId;
            if (global.client.lastRoomId) {
                //离开上次房间
                global.client.leaveRoom().then(() => {
                    console.log("leaveRoom success");
                });
            }
            director.loadScene("gobe_hall");
        } else {
            this.console.log('init failed');
        }
    }
}
