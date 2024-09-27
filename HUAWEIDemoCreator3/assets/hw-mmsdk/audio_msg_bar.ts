import { _decorator, Component, Label, Node } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('AudioMsgBar')
export class AudioMsgBar extends Component {

    @property(Label)
    lbInfo: Label = null;

    private _filePath: string = "";
    private _fileId: string = "";

    private _console: Console = null;
    private _index: number = -1;
    //是否下载完毕
    private _isDownLoadOver: boolean = false;


    public init (console: Console, index: number, filePath: string, fileId: string) {
        this._index = index;
        this._console = console;
        this._filePath = filePath;
        this._fileId = fileId;

        this._updateInfoLb();
    }

    public downLoadAudio () {
        if (this._isDownLoadOver == true) {
            this._console.log("已经下载完毕");
            return;
        }
        this._downloadAudioMsgFile(this._fileId, this._filePath, 5000);
    }

    public getAudioInfo () {
        if (this._isDownLoadOver == false) {
            this._console.log("请先下载音频");
            return;
        }
        this._getAudioMsgFileInfo(this._filePath);
    }


    public playAudio () {
        if (this._isDownLoadOver == false) {
            this._console.log("请先下载音频");
            return;
        }
        this._playAudioMsg(this._filePath);
    }

    public stopPlayAudio () {
        if (this._isDownLoadOver == false) {
            this._console.log("请先下载音频");
            return;
        }
        this._stopPlayAudioMsg();
    }

    /**
     * 对语音消息文件进行风控送检
     */
    public startDetectAudioFile (): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onStartDetectAudioFileCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this._console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.startDetectAudioFile(this._fileId);
    }


    private _updateInfoLb () {
        this.lbInfo.string = this._index + (this._isDownLoadOver ? "已下载" : "未下载") + " fileId:" + this._fileId + "\n" + "filePath:" + this._filePath;
    }

    /**
     * 播放语音消息 - 下载文件
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gamemme-record-play-audio-msg-android-0000001550814805#section124701481487
     *
     * @param filePath  文件下载的存储地址。
     * @param fileId    待下载文件唯一标识，即文件ID。
     * @param msTimeOut 超时时间，单位：ms，取值范围[3000, 7000]。
     */
    private _downloadAudioMsgFile (fileId: string, filePath: string, msTimeOut: number): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onDownloadAudioMsgFileCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this._console.log(result);
            if (result.code == huawei.game.mmsdk.StatusCode.success) {
                if (result.data.code == 0) {
                    this._isDownLoadOver = true;
                    this._updateInfoLb();
                }
            }
        })
        huawei.game.mmsdk.mmsdkService.downloadAudioMsgFile(fileId, filePath, msTimeOut);
    }
    /**
     * 播放语音消息 - 播放音频
     *
     * @param filePath:获取音频文件信息的文件路径
     */
    private _playAudioMsg (filePath: string): void {
        huawei.game.mmsdk.mmsdkService.off(huawei.game.mmsdk.API_EVENT_LIST.onPlayAudioMsgCallback)
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onPlayAudioMsgCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this._console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.playAudioMsg(filePath);
    }

    /**
     * 播放语音消息 - 停止音频
     *
     * @param filePath:获取音频文件信息的文件路径
     */
    private _stopPlayAudioMsg (): void {
        huawei.game.mmsdk.mmsdkService.off(huawei.game.mmsdk.API_EVENT_LIST.onPlayAudioMsgCallback)
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.onPlayAudioMsgCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this._console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.stopPlayAudioMsg();
    }

    /**
     * 获取文件信息，前提：下载完毕
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gamemme-model-audiomsgfileinfo-android-0000001499283292#section1515222884713
     *
     * @param filePath:获取音频文件信息的文件路径
     */
    public _getAudioMsgFileInfo (filePath: string): void {
        huawei.game.mmsdk.mmsdkService.once(huawei.game.mmsdk.API_EVENT_LIST.getAudioMsgFileInfoCallback, (result: huawei.game.mmsdk.ApiCbResult) => {
            this._console.log(result);
        })
        huawei.game.mmsdk.mmsdkService.getAudioMsgFileInfo(filePath);
    }
}

