import { _decorator, Component, director, Label, Node } from 'cc';
import { RecordInfo } from '../../cs-huawei/hwgobe/GOBE/GOBE';
import { download, getFileHash, getTimestampYMDHMS } from './gobe_util';
import { global } from './hw_gobe_global_data';
import { CmdType, frameSyncPlayerList, GameSceneType } from './frame_sync';
import { Console } from '../../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('GobeRecordItem')
export class GobeRecordItem extends Component {

    private _info: RecordInfo = null;

    @property(Label)
    recordId: Label = null;

    @property(Label)
    recordTime: Label = null;

    @property({ type: Console })
    _console: Console = null!;


    public init (info: RecordInfo, console: Console) {
        this._info = info;
        this._console = console;
        this.recordId.string = "id:" + info.recordId;
        this.recordTime.string = "时间戳：" + getTimestampYMDHMS(Number(info.createTime));
    }

    //查看
    onViewBtnClick () {
        global.recordRoomInfo = null;
        if (this._info.url) {
            let remoteUrl = this._info.url;
            let fileSha256 = this._info.fileSha256;
            download(remoteUrl)
                .then(async (res: ArrayBuffer) => {
                    const pathName = remoteUrl.substring(remoteUrl.lastIndexOf('_') + 1, remoteUrl.lastIndexOf('.'));
                    const fileName = remoteUrl.substring(remoteUrl.lastIndexOf('/') + 1, remoteUrl.lastIndexOf('.'));
                    let result;
                    if (cc.sys.isBrowser) {
                        const sha256 = await getFileHash(res);
                        result = sha256 == fileSha256;
                        this._console.log(`文件完整性校验成功,sha256: ${sha256}`);
                    }
                    else {
                        result = true;
                    }
                    if (result) {
                        let newZip = new JSZip();
                        newZip.loadAsync(res).then(zip => {
                            zip.file(`${pathName}/${fileName}.data`).async('text').then(data => {
                                let lines = data.split('\n');
                                lines.forEach((item, idx) => {
                                    if (!item) {
                                        lines.splice(idx, 1);
                                    }
                                });
                                global.gameSceneType = GameSceneType.FOR_RECORD;

                                let hasFindSyncRoomInfo = false;
                                for (let i = 0; i < lines.length; i++) {
                                    let line = JSON.parse(lines[i]);
                                    let frame: GOBE.RecvFrameMessage = {
                                        currentRoomFrameId: line.data.frameId,
                                        frameInfo: line.data?.frameInfo,
                                        ext: {
                                            seed: line.data.seed,
                                        },
                                        isReplay: false,
                                        time: line.ts
                                    }

                                    if (!hasFindSyncRoomInfo && frame.frameInfo && frame.frameInfo.length > 0) {
                                        for (let j = 0; j < frame.frameInfo.length; j++) {
                                            let frameData: string[] = frame.frameInfo[j].data;
                                            if (frameData && frameData.length > 0) {
                                                for (let k = 0; k < frameData.length; k++) {
                                                    let obj = JSON.parse(frameData[k]);
                                                    if (obj.cmd == CmdType.syncRoomInfo && obj.roomInfo.players != null && obj.roomInfo.players.length >= 2) {
                                                        global.recordRoomInfo = obj.roomInfo;
                                                        frameSyncPlayerList.players = obj.roomInfo.players;
                                                        hasFindSyncRoomInfo = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            if (hasFindSyncRoomInfo) {
                                                break;
                                            }
                                        }
                                    }
                                    global.unhandleFrames.push(frame);
                                }
                                //是否完整
                                if (global.recordRoomInfo == null) {
                                    this._console.log("此对战记录无实际操作内容，请选择其它记录进行查看");
                                } else {
                                    director.loadScene("gobe_room");
                                }
                            });
                        });
                    }
                    else {
                        this._console.log(`sha256校验不一致，recordId：${this._info.recordId}`);
                    }
                })
                .catch((err) => {
                    this._console.log(`下载失败,请重试 error：`, err);
                });
        }
    }

}

