import { _decorator, Component, loader, director, CCString, EventTarget, EditBox, Node, Button, Label, instantiate, Prefab } from 'cc';
import { Console } from '../prefabs/console';
import { AudioMsgBar } from './audio_msg_bar';
const { ccclass, property } = _decorator;

/**
 * 华为游戏多媒体
*/
@ccclass('Hwmmsdk')
export class Hwmmsdk extends Component {
    @property({ type: Console })
    console: Console = null!;

    @property(Node)
    startBtnArr: Node = null;
    @property(Node)
    realTimeVoice: Node = null;
    @property(Node)
    imAudioMsg: Node = null;
    @property(Node)
    imAudioToText: Node = null;


    //两个初始化按钮
    @property(Button)
    selectUserAInitBtn: Button = null;
    @property(Button)
    selectUserBInitBtn: Button = null;



    //是否是房主
    @property(Label)
    lbIsHomeowner: Label = null;
    //实时语音界面的几个按钮需要动态修改按钮字
    //禁言用户-
    @property(Button)
    forbidPlayerBtn: Button = null;
    //解禁用户-
    @property(Button)
    notForbidPlayerBtn: Button = null;
    //屏蔽玩家-语音
    @property(Button)
    mutePlayerBtn: Button = null;
    //取消屏蔽玩家-语音
    @property(Button)
    notMutePlayerBtn: Button = null;

    //临时语音消息id
    private _curAudioMsgIndex = 0;
    @property(Prefab)
    audioMsgBarPrefab: Prefab = null;
    @property(Node)
    audioMsgBarParentNode: Node = null;



    //模拟用户A/B
    private _selfOpenId: string = null;
    //小队房间ID
    private _teamRoomId: string = "T1";
    private nationalRoomId: string = "N1";
    //IM聊天-文本消息-群组管理
    private groupChannelId: string = "G1";



    private mmsdkService: typeof huawei.game.mmsdk.mmsdkService = (typeof huawei ===
        'undefined'
        ? null
        : huawei?.game?.mmsdk?.mmsdkService)!;


    onEnable () {
        this.lbIsHomeowner.string = "房主信息：无"
        this.enterStartBtnPanel();
        //其他玩家加入房间 小队房间/国战房间
        huawei.game.mmsdk.mmsdkService.on(huawei.game.mmsdk.API_EVENT_LIST.onPlayerOnlineCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log("有其他用户加入房间，信息如下");
            this.console.log(result);
        })
        //有其他玩家离开房间
        huawei.game.mmsdk.mmsdkService.on(huawei.game.mmsdk.API_EVENT_LIST.onPlayerOfflineCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log("有其他用户离开房间，信息如下");
            this.console.log(result);
        })

        //开启/关闭玩家自身麦克风成功后，房间内其他玩家通过次接口收到信息
        huawei.game.mmsdk.mmsdkService.on(huawei.game.mmsdk.API_EVENT_LIST.onRemoteMicroStateChangedCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log("有其他用户开关麦克风，信息如下");
            this.console.log(result);
        })
        //房主身份 禁言/解禁指定玩家 或 禁言/解禁全部玩家
        huawei.game.mmsdk.mmsdkService.on(huawei.game.mmsdk.API_EVENT_LIST.onForbiddenByOwnerCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log("房主 禁言/解禁指定玩家或全部玩家，信息如下");
            this.console.log(result);
        })
        //消息接收
        huawei.game.mmsdk.mmsdkService.on(huawei.game.mmsdk.API_EVENT_LIST.onRecvMsgCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log("有其他用户发送了文本消息，信息如下");
            this.console.log(result);
        })
        //检测发言用户
        huawei.game.mmsdk.mmsdkService.on(huawei.game.mmsdk.API_EVENT_LIST.onSpeakersDetectionCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log("获得当前发言玩家,信息如下");
            this.console.log(result);
        })
        // huawei.game.mmsdk.mmsdkService.on(huawei.game.mmsdk.API_EVENT_LIST.onSpeakersDetectionExCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
        //     this.console.log("获得当前发言玩家信息如下");
        //     this.console.log(result);
        // })
    }

    onDisable () {
        huawei.game.mmsdk.mmsdkService.off(huawei.game.mmsdk.API_EVENT_LIST.onPlayerOnlineCallback);
        huawei.game.mmsdk.mmsdkService.off(huawei.game.mmsdk.API_EVENT_LIST.onPlayerOfflineCallback);
        huawei.game.mmsdk.mmsdkService.off(huawei.game.mmsdk.API_EVENT_LIST.onRemoteMicroStateChangedCallback);
        huawei.game.mmsdk.mmsdkService.off(huawei.game.mmsdk.API_EVENT_LIST.onForbiddenByOwnerCallback);
        huawei.game.mmsdk.mmsdkService.off(huawei.game.mmsdk.API_EVENT_LIST.onRecvMsgCallback);
        huawei.game.mmsdk.mmsdkService.off(huawei.game.mmsdk.API_EVENT_LIST.onSpeakersDetectionCallback);
        // huawei.game.mmsdk.mmsdkService.off(huawei.game.mmsdk.API_EVENT_LIST.onSpeakersDetectionExCallback);
    }


    /**
     * 申请权限
    */
    requestPermissions () {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.requestPermissionsCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        this.mmsdkService.requestPermissions(true, "需要开启权限才能使用此功能", "去开启");
    }


    //选择自己是用户A（区分2个用户，方便测试）
    public selectUserAInit () {
        this._selfOpenId = "A";
        this._init();
    }

    //选择自己是用户B（区分2个用户，方便测试）
    public selectUserBInit () {
        this._selfOpenId = "B";
        this._init();
    }


    /**
     * 初始化 创建实例
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-engine-android-0000001193958984
    */
    private _init () {
        if (this._selfOpenId == null) {
            this.console.log("请先点击按钮选择是用户A 还是用户B");
            return;
        }
        this.console.log("正在初始化,请稍后,请勿重复点击...");
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.initCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log("以用户 " + this._selfOpenId + " 初始化完毕,结果如下");
            this.console.log(result);
            if (result.code == huawei.game.mmsdk.StatusCode.success) {
                //禁用初始化按钮
                this.selectUserAInitBtn.node.active = false;
                this.selectUserBInitBtn.node.active = false;
                //修改一下某些界面的按钮的字
                //禁言用户-
                this.forbidPlayerBtn.node.getComponentInChildren(Label).string = "（仅房主）禁言用户" + (this._selfOpenId == "A" ? "B" : "A");
                //解禁用户-
                this.notForbidPlayerBtn.node.getComponentInChildren(Label).string = "（仅房主）解禁用户" + (this._selfOpenId == "A" ? "B" : "A");

                //屏蔽玩家-语音
                this.mutePlayerBtn.node.getComponentInChildren(Label).string = "屏蔽玩家" + (this._selfOpenId == "A" ? "B" : "A") + "语音";
                //取消屏蔽玩家-语音
                this.notMutePlayerBtn.node.getComponentInChildren(Label).string = "取消屏蔽玩家" + (this._selfOpenId == "A" ? "B" : "A") + "语音";

                //关闭监听发言玩家
                this.disableSpeakersDetection(false);
            }
        })
        let info = {
            openId: this._selfOpenId,//仅测试，这里要填写用户实际的openId
            agcAppId: "106022889",
            agcClientId: "875101003169398784",
            agcClientSecret: "FA5074F8DBB0A2AC9C10231E53B95FB788EBAE401AFD06473EDA1FB1E0FC0320",
            agcApiKey: "DAEDANyB5hJ50PQTNRfXKOy9EXhF6xoxjWOSgmpyaU9W3sFWM4B/kgEH3LqDfXwznJg1GiRsUU0QQ5ABrzb0AeMvXJpSEO7btM7a6Q==",
            logEnable: true,
            logSize: 10240,
            countryCode: "CN",
            useSign: false,
            sign: "",
            nonce: "",
            timeStamp: "",
        }
        this.mmsdkService.init(info);
    }

    //转到主菜单
    public enterStartBtnPanel () {
        this.startBtnArr.active = true;//
        this.realTimeVoice.active = false;
        this.imAudioMsg.active = false;
        this.imAudioToText.active = false;
    }

    //转到实时语音界面
    public enterRealTimeVoiceRoom () {
        this.startBtnArr.active = false;
        this.realTimeVoice.active = true;//
        this.imAudioMsg.active = false;
        this.imAudioToText.active = false;
    }
    //转到语音消息界面
    public enterAudioMsgRoom () {
        this.startBtnArr.active = false;
        this.realTimeVoice.active = false;
        this.imAudioMsg.active = true;//
        this.imAudioToText.active = false;
    }
    //转到声音转文本界面
    public enterAudioToText () {
        this.startBtnArr.active = false;
        this.realTimeVoice.active = false;
        this.imAudioMsg.active = false;
        this.imAudioToText.active = true;//
    }


    /**
     * 销毁实例
    */
    public destroyEngine () {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onDestroyCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
            if (result.code == huawei.game.mmsdk.StatusCode.success) {
                //再次启用初始化按钮
                this.selectUserAInitBtn.node.active = true;
                this.selectUserBInitBtn.node.active = true;
            }
        })
        huawei.game.mmsdk.mmsdkService.destroy();
    }


    //实时语音---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 加入小队房间
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-joinroom-roomid-android-0000001268934473
     */
    public joinTeamRoom (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onJoinTeamRoomCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
            //主动获取一次房间信息
            if (result.code == huawei.game.mmsdk.StatusCode.success) {
                this.getRoom(false);
            }
        })
        huawei.game.mmsdk.mmsdkService.joinTeamRoom(this._teamRoomId);
    }

    //demo 未使用 仅做示例
    /**
     * 加入国战房间 在国战房间中，玩家分为指挥官和群众两种角色。加入房间时，玩家可根据roleType(1表示指挥官，2表示群众)选择自身角色
     */
    //指挥官
    private joinNationalRoom_1 (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onJoinNationalRoomCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.joinNationalRoom(this.nationalRoomId, 1);
    }
    //demo 未使用 仅做示例
    //群众
    private joinNationalRoom_2 (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onJoinNationalRoomCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.joinNationalRoom(this.nationalRoomId, 2);
    }

    //demo 未使用 仅做示例
    /**
     * 切换房间
     * 前提条件:玩家至少已加入两个房间。
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-switchroom-android-0000001215529668
     */
    private _switchRoom (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onSwitchRoomCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.switchRoom("xxxxxxxx");
    }

    //demo 未使用 仅做示例
    /**
     * 转让房主身份，前提：玩家为房主身份，且房间中已有其他玩家。
     * 原房主无需离开房间，转让房主给其他玩家
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-transferowner-android-0000001271687137
     */
    private _transferOwner (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onTransferOwnerCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.transferOwner("xxxxxxxx", "xxxxxxxx");
    }

    /**
     * 获取指定房间信息
     */
    public getRoom (showLogToPanel: boolean = true): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.getRoomCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            if (showLogToPanel) {
                this.console.log(result);
            }
            //设置ui房主房主信息
            if (result.code == huawei.game.mmsdk.StatusCode.success) {
                this.lbIsHomeowner.string = "房主信息:" + (result.data.ownerId == this._selfOpenId ? "是房主" : "不是房主") + ` (ownerId = ${result.data.ownerId})`;
            }
        })
        huawei.game.mmsdk.mmsdkService.getRoom(this._teamRoomId);
    }

    /**
     * 离开房间
     * 普通玩家离开房间时，参数ownerId传null或空字符串即可。
     * 房主离开房间时，参数ownerId传null或空字符串，则表示随机指定新房主。
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-leaveroom-android-0000001233098849
     */
    public leaveRoom (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onLeaveRoomCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
            //获取一下房间信息
            this.getRoom(false);
        })
        huawei.game.mmsdk.mmsdkService.leaveRoom(this._teamRoomId, null);
    }

    /**
     * 设置麦克风状态
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-enablemic-android-0000001197485354
     */
    public enableMic (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.enableMicCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.enableMic(true);
    }
    public disableMic (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.enableMicCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.enableMic(false);
    }



    /**
     * 禁言/解禁指定玩家
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-forbidplayer-android-0000001242285225
     *
     *   roomId      房间ID
     *   openId      玩家ID
     *   isForbidden true表示禁言,false表示解禁
     */
    //禁言
    public forbidPlayer (roomId: string, openId: string, isForbidden: boolean): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onForbidPlayerCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        let tarOpenId = this._selfOpenId == "A" ? "B" : "A";
        huawei.game.mmsdk.mmsdkService.forbidPlayer(this._teamRoomId, tarOpenId, true);
    }
    //解禁
    public notForbidPlayer (roomId: string, openId: string, isForbidden: boolean): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onForbidPlayerCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        let tarOpenId = this._selfOpenId == "A" ? "B" : "A";
        huawei.game.mmsdk.mmsdkService.forbidPlayer(this._teamRoomId, tarOpenId, false);
    }


    /**
     * 禁言/解禁其他全部玩家
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-forbidplayer-android-0000001242285225
     *
     *   roomId      房间ID
     *   isForbidden true表示禁言,false表示解禁
     */
    //禁言全部
    public forbidAllPlayers (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onForbidAllPlayersCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.forbidAllPlayers(this._teamRoomId, true);
    }
    //解禁全部
    public notForbidAllPlayers (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onForbidAllPlayersCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.forbidAllPlayers(this._teamRoomId, false);
    }


    /**
     * 屏蔽/打开指定玩家语音
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-muteplayer-android-0000001197645332
     *
     *  roomId  房间ID
     *  openId  玩家ID
     *  isMuted true表示屏蔽语音,false表示取消屏蔽
     */
    //屏蔽
    public mutePlayer (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onMutePlayerCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        let tarOpenId = this._selfOpenId == "A" ? "B" : "A";
        huawei.game.mmsdk.mmsdkService.mutePlayer(this._teamRoomId, tarOpenId, true);
    }
    //取消屏蔽
    public notmutePlayer (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onMutePlayerCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        let tarOpenId = this._selfOpenId == "A" ? "B" : "A";
        huawei.game.mmsdk.mmsdkService.mutePlayer(this._teamRoomId, tarOpenId, false);
    }


    /**
     * 屏蔽/打开其他全部玩家语音
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-muteplayer-android-0000001197645332
     *
     *  roomId  房间ID
     *  isMuted true表示屏蔽语音,false表示取消屏蔽
     */
    //屏蔽
    public muteAllPlayers (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onMuteAllPlayersCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        let tarOpenId = this._selfOpenId == "A" ? "B" : "A";
        huawei.game.mmsdk.mmsdkService.muteAllPlayers(this._teamRoomId, true);
    }

    //取消屏蔽
    public notMuteAllPlayers (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onMuteAllPlayersCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        let tarOpenId = this._selfOpenId == "A" ? "B" : "A";
        huawei.game.mmsdk.mmsdkService.muteAllPlayers(this._teamRoomId, false);
    }


    /**
     * 获取当前发言玩家列表
     * 开启音量回调，并通过音量回调接口获取当前发言玩家ID列表以及对应的音量分贝。
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-enablespeakersdetection-android-0000001242224953
     *
     *  roomId   房间ID
     *  interval 当前发言玩家列表回调的时间间隔,有效值范围为[100, 10000],单位: 毫秒,当传入0时,即关闭音量回调
     */
    public enableSpeakersDetection (): void {
        huawei.game.mmsdk.mmsdkService.enableSpeakersDetection(this._teamRoomId, 1000);
        this.console.log("已开启监听发言玩家列表变化");
    }

    public disableSpeakersDetection (showLogToPanel: boolean = true): void {
        huawei.game.mmsdk.mmsdkService.enableSpeakersDetection(this._teamRoomId, 0);
        if (showLogToPanel) {
            this.console.log("已关闭监听发言玩家列表变化");
        }
    }


    //注意：3D音效 和 范围语音 代码仅做示例

    //实时语音-3D音效 
    /**
     * 初始化3d音效 返回值为0则表示成功，返回值为错误码则表示失败。
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gamemme-gmme-gamemediaengine-android-0000001238323625#section1685641114101
     */
    public initSpatialSound () {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.initSpatialSoundCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.initSpatialSound();
    }

    /**
     * 开启/关闭3D音效 返回值为0则表示成功，返回值为错误码则表示失败。
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gamemme-gmme-gamemediaengine-android-0000001238323625#section1496016465103
     *
     */
    public enableSpatialSound () {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.enableSpatialSoundCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.enableSpatialSound("XXXX", true);
    }

    /**
     * 设置语音接收范围
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gamemme-gmme-gamemediaengine-android-0000001238323625#section35878131182
     */
    public setAudioRecvRange () {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.setAudioRecvRangeCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.setAudioRecvRange(10);
    }


    /**
     * 更新自身位置 返回值为0则表示成功，返回值为错误码则表示失败。
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gamemme-gmme-gamemediaengine-android-0000001238323625#section11572124810519
     */
    public updateSelfPosition () {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.updateSelfPositionCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.updateSelfPosition(1, 2, 3);
    }

    /**
     * 更新其他玩家位置 返回值为0则表示成功，返回值为错误码则表示失败。
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gamemme-gmme-gamemediaengine-android-0000001238323625#section3976836369
     */
    public updateRemotePosition () {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.updateRemotePositionCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.updateRemotePosition("XXXX", 1, 2, 3);
    }

    /**
     * 清理其他玩家位置 返回值为0则表示成功，返回值为错误码则表示失败。
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gamemme-gmme-gamemediaengine-android-0000001238323625#section185619282094
     */
    public clearRemotePlayerPosition () {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.clearRemotePlayerPositionCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.clearRemotePlayerPosition("XXXX");
    }
    /**
     * 清理其他所有玩家的位置信息 返回值为0则表示成功，返回值为错误码则表示失败。
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gamemme-gmme-gamemediaengine-android-0000001238323625#section859216551087
     */
    public clearAllRemotePositions () {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.clearAllRemotePositionsCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.clearAllRemotePositions();
    }


    /**
     * 查询3D音效开启状态  true：已开启  false：已关闭
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gamemme-gmme-gamemediaengine-android-0000001238323625#section188399396116
     */
    public isEnableSpatialSound () {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.isEnableSpatialSoundCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.isEnableSpatialSound("XXXX");
    }

    /**
     * 加入范围语音房间
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gamemme-gmme-gamemediaengine-android-0000001238323625#section55155121859
     */
    public joinRangeRoom () {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onJoinRangeRoomCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.joinRangeRoom("XXXX");
    }


    //IM聊天-文本消息-群组管理---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 加入临时群组
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-joingroupchannel-android-0000001372297610
     *
     *  channelId 自定义的群组ID
     */
    public joinGroupChannel (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onJoinChannelCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.joinGroupChannel(this.groupChannelId);
    }

    /**
     * 离开群组
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-leavechannel-android-0000001422217617
     *
     *  channelId 自定义的群组ID
     */
    public leaveChannel (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onLeaveChannelCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.leaveChannel(this.groupChannelId);
    }

    /**
     * 获取群组信息
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-getchannelinfo-android-0000001422457597
     *
     * @param channelId 自定义的群组ID
     */
    public getChannelInfo (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.getChannelInfoCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.getChannelInfo(this.groupChannelId);
    }

    //IM聊天-文本消息-消息管理
    /**
     * 发送消息
     *
     *  recvId  接受者ID, 单聊时传入OpenId，群聊时传入ChannelId
     *  content 文本字符串
     *  type    1表示单聊, 2表示群聊
     */
    public sendTextMsg (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onSendMsgCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        let msg = "这是一条测试消息，现在时间为：" + this.getNowDate();
        huawei.game.mmsdk.mmsdkService.sendTextMsg(this.groupChannelId, msg, 2);
    }

    // 格式化日对象
    private getNowDate () {
        var date = new Date();
        var sign2 = ":";
        var year = date.getFullYear() // 年
        var month = date.getMonth() + 1; // 月
        var day = date.getDate(); // 日
        var hour = date.getHours(); // 时
        var minutes = date.getMinutes(); // 分
        var seconds = date.getSeconds() //秒
        return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
    }

    //IM聊天-语音消息
    /**
     * 录制语音
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-record-play-audio-msg-android-0000001550814805
     */
    public startRecordAudioMsg (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.startRecordAudioMsgCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
            if (result.code == huawei.game.mmsdk.StatusCode.success) {
                console.log("startRecordAudioMsg filePath:" + result.data?.filePath);
            }
        })
        huawei.game.mmsdk.mmsdkService.startRecordAudioMsg();
    }

    //IM聊天-语音消息（stopRecordAudioMsg） 当前录制的语音文件地址
    private curRecordAudioFilePath: string = null;

    /**
     * 停止录制
    */
    public stopRecordAudioMsg (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onRecordAudioMsgCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
            if (result.code == huawei.game.mmsdk.StatusCode.success) {
                console.log("stopRecordAudioMsg filePath" + result.data?.filePath);
                console.log("stopRecordAudioMsg code" + result.data?.code);
                console.log("stopRecordAudioMsg msg" + result.data?.msg);
                //记录
                this.curRecordAudioFilePath = result.data?.filePath;
            }
        })
        huawei.game.mmsdk.mmsdkService.stopRecordAudioMsg();
    }


    /**
     * 上传音频文件到游戏多媒体服务器
     *
     *  filePath  音频文件的待上传路径
     *  msTimeOut 超时时间, 单位：ms, 取值范围[3000, 7000]
     */
    public uploadAudioMsgFile (): void {
        if (this.curRecordAudioFilePath == null) {
            this.console.error("请先录制语音，完成后再进行上传");
            return;
        }
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onUploadAudioMsgFileCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
            //加到本地列表
            if (result.code == huawei.game.mmsdk.StatusCode.success) {
                if (result.data.code == 0) {
                    this._curAudioMsgIndex++;

                    let filePath = result.data.filePath;
                    let fileId = result.data.fileId;
                    let code = result.data.code;
                    let msg = result.data.msg;
                    let nodeBar = instantiate(this.audioMsgBarPrefab);
                    this.audioMsgBarParentNode.addChild(nodeBar);

                    let sc = nodeBar.getComponent(AudioMsgBar);
                    sc.init(this.console, this._curAudioMsgIndex, filePath, fileId);
                }
            }
        })
        huawei.game.mmsdk.mmsdkService.uploadAudioMsgFile(this.curRecordAudioFilePath, 5000);
    }



    //IM聊天-语音消息-语音转文本

    /**
     * 开始录音
     * 注意：如果语音小于10秒则录音时中间有停顿则会自动转换为文本无需主动调用 stopRecordAudioToText
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-voicetotext-android-0000001256141451#section124212225298
     *
     * @param language 语言编码 只支持zh和en_US两种
     */
    public startRecordAudioToText (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.startRecordAudioToTextCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            // this.consolePanel.log(result);
            this.console.log("正在录音,请说话...")
        })
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onVoiceToTextCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.startRecordAudioToText("zh");
    }

    /**
     * 停止录音 语音内容将自动转写成文本内容
     */
    private _stopRecordAudioToText (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onVoiceToTextCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this.console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.stopRecordAudioToText();
    }


}
