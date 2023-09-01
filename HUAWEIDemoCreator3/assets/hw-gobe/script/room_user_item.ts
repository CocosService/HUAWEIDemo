import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RoomUserItem')
export class RoomUserItem extends Component {

    @property(Node)
    owner: Node = null;

    @property(Label)
    userName: Label = null;

    @property(Label)
    readyStatus: Label = null;

    @property(ProgressBar)
    progressBar: ProgressBar = null;

    @property(Label)
    progressText: Label = null;

    @property(Node)
    noUserMask: Node = null;

    public progress: number = 0;


    onEnable (): void {
        this.setUserInfo(null, false);
    }

    //设置用户
    setUserInfo (player: GOBE.PlayerInfo, isOwner: boolean) {
        if (player == null) {
            this._setMaskState(true);
            this.setReadyStatus(false);
            this.updateProgress(0);
        } else {
            this._setMaskState(false);
            this.owner.active = isOwner;
            this.userName.string = player.playerId;
            this.setReadyStatus(player.customPlayerStatus === 1);
        }
    }


    //设置mask
    private _setMaskState (show: boolean) {
        this.noUserMask.active = show;
    }

    //设置准备状态
    public setReadyStatus (isReady: boolean) {
        this.readyStatus.string = isReady ? "已经准备" : "未准备";
    }

    //更新进度
    public updateProgress (progress: number) {
        this.progress = progress;
        this.progressBar.progress = progress;
        this.progressText.string = Math.floor(progress * 100) + "%";
    }
}

