import { _decorator, Button, Component, director, instantiate, Label, Node, Prefab } from 'cc';
import { global, LockType, RoomType } from './hw_gobe_global_data';
import { GameSceneType } from './frame_sync';
import { setRoomType, sleep } from './gobe_util';
import { PlayerInfo, RecvFromServerInfo, RoomInfo, UpdateCustomPropertiesResponse, UpdateCustomStatusResponse } from '../../cs-huawei/hwgobe/GOBE/GOBE';
const { ccclass, property } = _decorator;

@ccclass('RoomItemTemplate')
export class RoomItemTemplate extends Component {
    @property
    public roomId: string = '';
    @property(Label)
    public roomName: Label = null;
    @property(Label)
    public roomDesc: Label = null;
    @property(Label)
    public roomStatus: Label = null;

    @property(Node)
    public backGround: Node = null;

    init (data: RoomInfo) {
        this.roomId = data.roomId;
        this.roomName.string = data.roomName.length > 20 ? data.roomName.slice(0, 20) + "..." : data.roomName;
        this.roomDesc.string = data.roomId.length > 20 ? data.roomId.slice(0, 20) : data.roomId;
        this.roomStatus.string = data.roomStatus == 1 ? "游戏中" : "空闲";

    }

}
