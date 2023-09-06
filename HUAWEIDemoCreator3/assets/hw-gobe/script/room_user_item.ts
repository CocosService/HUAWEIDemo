import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RoomUserItem')
export class RoomUserItem extends Component {

    @property(Node)
    owner: Node = null;

    @property(Label)
    userName: Label = null;

    @property(Node)
    noUserMask: Node = null;

    onEnable (): void {
        this.setUserInfo(null, false);
    }

    //设置用户
    setUserInfo (player: GOBE.PlayerInfo, isOwner: boolean) {
        if (player == null) {
            this._setMaskState(true);
        } else {
            this._setMaskState(false);
            this.owner.active = isOwner;
            this.userName.string = player.playerId;
        }
    }

    //设置mask
    private _setMaskState (show: boolean) {
        this.noUserMask.active = show;
    }
}

