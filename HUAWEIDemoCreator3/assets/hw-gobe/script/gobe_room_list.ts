import { _decorator, Component, director, EditBox, instantiate, macro, Node, Prefab } from 'cc';
import { global } from './hw_gobe_global_data';
//@ts-ignore
import { RoomInfo } from '../../cs-huawei/hwgobe/GOBE/GOBE';
import { RoomItemTemplate } from './room_item_template';
import { GobeRoomListBarRefresh } from './gobe_room_list_bar_refresh';
import { Console } from '../../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('GobeRoomList')
export class GobeRoomList extends Component {

    @property({ type: Console })
    console: Console = null!;

    @property(EditBox)
    roomCodeEditBox: EditBox = null;

    @property(GobeRoomListBarRefresh)
    gobeRoomListBarRefresh: GobeRoomListBarRefresh = null;

    //锁定操作
    private _lockSubmit: boolean = false;


    /**
     * 加入根据code
    */
    public async joinRoomByRoomCode () {
        if (this._lockSubmit == true) {
            this.console.log('请稍后...');
            return;
        }
        let target: string = null;
        target = this.roomCodeEditBox.string;
        if (target == null || target.length == 0) {
            this.console.error(`请输入正确的房间code`);
            return;
        }

        let customPlayerProperties = "";
        this._lockSubmit = true;
        this.console.log(`正在加入房间，房间Code：${target}`);
        await global.client.joinRoom(target,
            { customPlayerStatus: 0, customPlayerProperties: customPlayerProperties }).then((room) => {
                this.console.log("加入房间成功");
                global.room = room;
                global.player = room.player;
                this._lockSubmit = false;
                this._loadRoomScene();
            }).catch((e) => {
                this._lockSubmit = false;
                this.console.log("提示", "加入房间失败", e);
            });
    }


    /**
     * 刷新idle房间列表
    */
    public freshIdleRoomListBtn () {
        global.client.getAvailableRooms({
            roomType: global.matchRule,
            sync: false
        }).then((infos) => {
            console.log("查询房间列表成功,数量：" + infos.rooms.length);
            global.roomInfos = infos.rooms;
            this._freshList();
        }).catch((e) => {
            // 查询房间列表失败
            console.log("查询房间列表失败", e);
            global.roomInfos = []
            this._freshList();
        })
    }


    /**
     * 离开
    */
    public quitBtn () {
        director.loadScene("gobe_hall");
    }


    //---------------------------------------------------------------
    _queryData () {
        global.client.getAvailableRooms({
            roomType: global.matchRule,
            sync: true
        }).then((infos) => {
            console.log("查询房间列表成功");
            global.roomInfos = infos.rooms;
            this._freshList();
        }).catch((e) => {
            // 查询房间列表失败
            console.log("查询房间列表失败", e);
            global.roomInfos = []
            this._freshList();
        })
    }


    _loadRoomScene () {
        this._lockSubmit = true;
        director.loadScene("gobe_room");
    }

    _freshList () {
        this.gobeRoomListBarRefresh.fresh();
        const cls: Node[] = this.gobeRoomListBarRefresh.node.children;
        for (let i = 0; i < cls.length; ++i) {
            const backGround = cls[i].getComponent(RoomItemTemplate).backGround
            backGround.on(Node.EventType.TOUCH_START, () => this._freshEdit(global.roomInfos[i]));
        }
    }

    _freshEdit (data: RoomInfo) {
        this.roomCodeEditBox.string = data.roomCode;
    }

}