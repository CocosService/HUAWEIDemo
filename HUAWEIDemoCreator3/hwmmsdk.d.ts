declare const cc: any;
declare const JavascriptJavaBridge: any;
declare namespace huawei {
    namespace game {
        namespace mmsdk {
            /**
             * @en
             * Enum for analytics event listener.
             * @zh
             * 异步 API 调用的回调事件名称定义。
             */
            enum API_EVENT_LIST {
                requestPermissionsCallback = "requestPermissionsCallback",
                initCallback = "initCallback",
                getRoomCallback = "getRoomCallback",
                getChannelInfoCallback = "getChannelInfoCallback",
                startRecordAudioMsgCallback = "startRecordAudioMsgCallback",
                getAudioMsgFileInfoCallback = "getAudioMsgFileInfoCallback",
                startRecordAudioToTextCallback = "startRecordAudioToTextCallback",
                onJoinTeamRoomCallback = "onJoinTeamRoomCallback",
                onJoinNationalRoomCallback = "onJoinNationalRoomCallback",
                onSwitchRoomCallback = "onSwitchRoomCallback",
                onTransferOwnerCallback = "onTransferOwnerCallback",
                onLeaveRoomCallback = "onLeaveRoomCallback",
                onRemoteMicroStateChangedCallback = "onRemoteMicroStateChangedCallback",
                onForbidPlayerCallback = "onForbidPlayerCallback",
                onMutePlayerCallback = "onMutePlayerCallback",
                onForbidAllPlayersCallback = "onForbidAllPlayersCallback",
                onMuteAllPlayersCallback = "onMuteAllPlayersCallback",
                onSpeakersDetectionCallback = "onSpeakersDetectionCallback",
                onJoinChannelCallback = "onJoinChannelCallback",
                onLeaveChannelCallback = "onLeaveChannelCallback",
                onSendMsgCallback = "onSendMsgCallback",
                onRecordAudioMsgCallback = "onRecordAudioMsgCallback",
                onUploadAudioMsgFileCallback = "onUploadAudioMsgFileCallback",
                onDownloadAudioMsgFileCallback = "onDownloadAudioMsgFileCallback",
                onPlayAudioMsgCallback = "onPlayAudioMsgCallback",
                onVoiceToTextCallback = "onVoiceToTextCallback",
                onDestroyCallback = "onDestroyCallback"
            }
            /**
             * @en
             * The status code of callback from the java side.
             * @zh
             * 从 java 层返回的 callback 的状态。
             */
            enum StatusCode {
                /**
                 * @en
                 * Fail.
                 * @zh
                 * 接口调用失败。
                 */
                fail = 0,
                /**
                 * @en
                 * Success.
                 * @zh
                 * 接口调用成功。
                 */
                success = 1
            }
            /**
             * @en
             * The general result of callback from java side.
             * @zh
             * 从 java 层返回的 callback 的通用结果对象。
             */
            class ApiCbResult {
                originData: any;
                code: StatusCode;
                errMsg?: string;
                data?: any;
                constructor(originData: any);
                toString(): string;
            }
            /**
             * @en
             *
             * @zh
             *
             */
            class MmSdkService {
                private eventHandler;
                constructor();
                /**
                 * @en
                 * Add event listener.
                 * @zh
                 * 持续监听事件。
                 * @param eventName - Event name.
                 * @param cb - Event callback.
                 * @param thisArg - Target node.
                 */
                on(eventName: string, cb: (result: ApiCbResult) => void, thisArg?: any, once?: boolean): void;
                /**
                 * @en
                 * Add event listener (once only).
                 * @zh
                 * 监听一次事件。
                 * @param eventName - Event name.
                 * @param cb - Event callback.
                 * @param thisArg - Target node.
                 */
                once(eventName: string, cb: (result: ApiCbResult) => void, thisArg?: any): void;
                /***
                 * @internal
                 */
                emit(eventName: string, ...params: any[]): void;
                /**
                 * @en
                 * Remove the event listener.
                 * @zh
                 * 取消事件的监听。
                 * @param eventName - Event name.
                 * @param cb - Event callback.
                 * @param thisArg - Target node.
                 * @example
                 */
                off(eventName: string, cb?: (result: ApiCbResult) => void, thisArg?: any): void;
                /**
                 * @en
                 * Remove all event listener of the target node.
                 * @zh
                 * 取消某个节点所有的事件监听。
                 * @param targetNode
                 * @example
                 */
                targetOff(targetNode: any): void;
                /**
                 * 申请权限
                 * @param guideUser 如果用户未授予权限是否显示引导弹窗
                */
                requestPermissions(guideUser: boolean, guideUserTipsText?: string, guideUserBtnText?: string): void;
                private _requestPermissionsCallback;
                /**
                 * 初始化
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-engine-android-0000001193958984
                */
                init(info: {
                    openId: string;
                    agcAppId: string;
                    agcClientId: string;
                    agcClientSecret: string;
                    agcApiKey: string;
                    logEnable: boolean;
                    logSize: number;
                    countryCode: string;
                    useSign: boolean;
                    sign: string;
                    nonce: string;
                    timeStamp: string;
                }): void;
                private _initCallback;
                /**
                 * 销毁实例
                */
                destroy(): void;
                private _onDestroyCallback;
                /**
                 * 加入小队房间
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-joinroom-roomid-android-0000001268934473
                 *
                 * @param roomId 房间id
                 */
                joinTeamRoom(roomId: string): void;
                private _onJoinTeamRoomCallback;
                /**
                 * 加入国战房间 在国战房间中，玩家分为指挥官和群众两种角色。加入房间时，玩家可根据roleType选择自身角色
                 *
                 * @param roomId:自定义的房间ID;
                 * @param roleType:玩家角色，1表示指挥官，2表示群众
                 */
                joinNationalRoom(roomId: string, roleType: number): void;
                private _onJoinNationalRoomCallback;
                /**
                 * 切换房间
                 * 前提条件:玩家至少已加入两个房间。
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-switchroom-android-0000001215529668
                 *
                 * @param roomId:房间ID;
                 */
                switchRoom(roomId: string): void;
                private _onSwitchRoomCallback;
                /**
                 * 转让房主身份，前提：玩家为房主身份，且房间中已有其他玩家。
                 * 原房主无需离开房间，转让房主给其他玩家
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-transferowner-android-0000001271687137
                 *
                 * @param roomId:房间ID;
                 * @param ownerId:新的房间主ID;
                 */
                transferOwner(roomId: string, ownerId: string): void;
                private _onTransferOwnerCallback;
                /**
                 * 获取指定房间信息
                 *
                 * @param roomId 房间ID
                 */
                getRoom(roomId: string): void;
                private _getRoomCallback;
                /**
                 * 离开房间
                 * 普通玩家离开房间时，参数ownerId传null或空字符串即可。
                 * 房主离开房间时，参数ownerId传null或空字符串，则表示随机指定新房主。
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-leaveroom-android-0000001233098849
                 *
                 * @param roomId  房间ID
                 * @param ownerId 新房间主
                 */
                leaveRoom(roomId: string, ownerId?: string): void;
                private _onLeaveRoomCallback;
                /**
                 * 设置麦克风状态
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-enablemic-android-0000001197485354
                 *
                 * @param isEnabled true 表示开启
                 */
                enableMic(isEnabled: boolean): void;
                private _onRemoteMicroStateChangedCallback;
                /**
                 * 禁言/解禁指定玩家
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-forbidplayer-android-0000001242285225
                 *
                 * @param roomId      房间ID
                 * @param openId      玩家ID
                 * @param isForbidden true表示禁言,false表示解禁
                 */
                forbidPlayer(roomId: string, openId: string, isForbidden: boolean): void;
                private _onForbidPlayerCallback;
                /**
                 * 禁言/解禁其他全部玩家
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-forbidplayer-android-0000001242285225
                 *
                 * @param roomId      房间ID
                 * @param isForbidden true表示禁言,false表示解禁
                 */
                forbidAllPlayers(roomId: string, isForbidden: boolean): void;
                private _onForbidAllPlayersCallback;
                /**
                 * 屏蔽/打开指定玩家语音
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-muteplayer-android-0000001197645332
                 *
                 * @param roomId  房间ID
                 * @param openId  玩家ID
                 * @param isMuted true表示屏蔽语音,false表示取消屏蔽
                 */
                mutePlayer(roomId: string, openId: string, isMuted: boolean): void;
                private _onMutePlayerCallback;
                /**
                 * 屏蔽/打开其他全部玩家语音
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-muteplayer-android-0000001197645332
                 *
                 * @param roomId  房间ID
                 * @param isMuted true表示屏蔽语音,false表示取消屏蔽
                 */
                muteAllPlayers(roomId: string, isMuted: boolean): void;
                private _onMuteAllPlayersCallback;
                /**
                 * 获取当前发言玩家列表
                 * 开启音量回调，并通过音量回调接口获取当前发言玩家ID列表以及对应的音量分贝。
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-enablespeakersdetection-android-0000001242224953
                 *
                 * @param roomId   房间ID
                 * @param interval 当前发言玩家列表回调的时间间隔,有效值范围为[100, 10000],单位: 毫秒,当传入0时,即关闭音量回调
                 */
                enableSpeakersDetection(roomId: string, interval: number): void;
                private _onSpeakersDetectionCallback;
                /**
                 * 加入临时群组
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-joingroupchannel-android-0000001372297610
                 *
                 * @param channelId 自定义的群组ID
                 */
                joinGroupChannel(channelId: string): void;
                private _onJoinChannelCallback;
                /**
                 * 离开群组
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-leavechannel-android-0000001422217617
                 *
                 * @param channelId 自定义的群组ID
                 */
                leaveChannel(channelId: string): void;
                private _onLeaveChannelCallback;
                /**
                 * 获取群组信息
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-getchannelinfo-android-0000001422457597
                 *
                 * @param channelId 自定义的群组ID
                 */
                getChannelInfo(channelId: string): void;
                private _getChannelInfoCallback;
                /**
                 * 发送消息
                 *
                 * @param recvId  接受者ID, 单聊时传入OpenId，群聊时传入ChannelId
                 * @param content 文本字符串
                 * @param type    1表示单聊, 2表示群聊
                 */
                sendTextMsg(recvId: string, content: string, type: number): void;
                private _onSendMsgCallback;
                /**
                 * 录制语音
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-record-play-audio-msg-android-0000001550814805
                 */
                startRecordAudioMsg(): void;
                private _startRecordAudioMsgCallback;
                /**
                 * 停止录制
                */
                stopRecordAudioMsg(): void;
                private _onRecordAudioMsgCallback;
                /**
                 * 上传音频文件到游戏多媒体服务器
                 *
                 * @param filePath  音频文件的待上传路径
                 * @param msTimeOut 超时时间, 单位：ms, 取值范围[3000, 7000]
                 */
                uploadAudioMsgFile(filePath: string, msTimeOut: number): void;
                private _onUploadAudioMsgFileCallback;
                /**
                 * 播放语音消息 - 下载文件
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-record-play-audio-msg-android-0000001550814805#section124701481487
                 *
                 * @param filePath  文件下载的存储地址。
                 * @param fileId    待下载文件唯一标识，即文件ID。
                 * @param msTimeOut 超时时间，单位：ms，取值范围[3000, 7000]。
                 */
                downloadAudioMsgFile(fileId: string, filePath: string, msTimeOut: number): void;
                private _onDownloadAudioMsgFileCallback;
                /**
                 * 播放语音消息 - 播放音频
                 *
                 * @param filePath:获取音频文件信息的文件路径
                 */
                playAudioMsg(filePath: string): void;
                /**
                 * 播放语音消息 - 停止音频
                 */
                stopPlayAudioMsg(): void;
                private _onPlayAudioMsgCallback;
                /**
                 * 获取文件信息，前提：下载完毕
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gamemme-model-audiomsgfileinfo-android-0000001499283292#section1515222884713
                 *
                 * @param filePath:获取音频文件信息的文件路径
                 */
                getAudioMsgFileInfo(filePath: string): void;
                private _getAudioMsgFileInfoCallback;
                /**
                 * 开始录音
                 * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-voicetotext-android-0000001256141451#section124212225298
                 *
                 * @param language 语言编码 只支持zh和en_US两种
                 */
                startRecordAudioToText(language: string): void;
                private _startRecordAudioToTextCallback;
                /**
                 * 停止录音 语音内容将自动转写成文本内容
                 */
                stopRecordAudioToText(): void;
                private _onVoiceToTextCallback;
            }
            const mmsdkService: MmSdkService;
        }
    }
}
