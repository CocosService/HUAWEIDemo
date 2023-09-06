import { _decorator, Component, director, EditBox, Label, Node } from 'cc';
import { isInited } from './gobe_util';
import { global, LockType } from './hw_gobe_global_data';
import { Console } from '../../prefabs/console';
const { ccclass, property } = _decorator;

/**
 * 创建房间
*/
@ccclass('GobeCreateRoom')
export class GobeCreateRoom extends Component {
    @property({ type: Console })
    console: Console = null!;

    @property(EditBox)
    roomName: EditBox = null;

    @property(Label)
    lbPublicState: Label;

    @property(Label)
    lbLockState: Label;

    private isPrivate = 1;                  //1 私有 0 公开
    private isLock = LockType.UnLocked;     //


    protected onEnable (): void {
        this._updatelbPublicState();
        this._updatelbLockState();
    }


    private _updatelbPublicState () {
        this.lbPublicState.string = "公开状态：" + (this.isPrivate == 1 ? "私有" : "公开");
    }

    private _updatelbLockState () {
        this.lbLockState.string = "锁定状态：" + (this.isLock == LockType.Locked ? "锁定" : "未锁");
    }


    /**
     * 设为公开
    */
    setRoomIsPublic () {
        this.isPrivate = 0;
        this._updatelbPublicState();
    }

    /**
     * 设为私有
    */
    setRoomIsPrivate () {
        this.isPrivate = 1;
        this._updatelbPublicState();
    }

    /**
     * 设为锁定
    */
    setRoomIsLock () {
        this.isLock = LockType.Locked;
        this._updatelbLockState();
    }
    /**
     * 设为不锁定
    */
    setRoomNotLock () {
        this.isLock = LockType.UnLocked;
        this._updatelbLockState();
    }

    /**
     * 创建房间
    */
    createRoom () {
        if (!isInited()) {
            return this.console.log("请先初始化 SDK");
        }
        // 创建（并加入）房间
        global.client.createRoom(
            {
                maxPlayers: 2,
                isPrivate: this.isPrivate,
                roomName: this.roomName.string,
                roomType: global.matchRule,
                matchParams: {
                    'matchRule': global.matchRule,
                },
                customRoomProperties: '',
                isLock: this.isLock
            },
            { customPlayerStatus: 0, customPlayerProperties: "111" }).then((room) => {
                // 创建房间成功
                this.console.log("创建房间成功");
                global.room = room;
                global.player = room.player;
                director.loadScene("gobe_room");
            }).catch((e) => {
                // 创建房间失败
                this.console.log("提示", "创建房间失败", e);
            });
    }


    /**
     * 取消
    */
    cancelCreateRoom () {
        this.console.log("返回大厅");
        director.loadScene("gobe_match");
    }
}

