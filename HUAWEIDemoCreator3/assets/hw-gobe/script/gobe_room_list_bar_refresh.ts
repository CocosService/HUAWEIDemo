import { _decorator, Component, director, instantiate, Node, Prefab } from 'cc';
import { isInited } from './gobe_util';
import { global } from './hw_gobe_global_data';
//@ts-ignore
import { RoomInfo } from '../../cs-huawei/hwgobe/GOBE/GOBE';
import { RoomItemTemplate } from './room_item_template';
const { ccclass, property } = _decorator;

@ccclass('GobeRoomListBarRefresh')
export class GobeRoomListBarRefresh extends Component {
    @property(Prefab)
    itemPrefab: Prefab | null = null;

    onLoad () {
        this.fresh()
    }

    fresh () {
        this.node.removeAllChildren()
        const items: RoomInfo[] = global.roomInfos;
        if (items) {
            for (let i = 0; i < items.length; ++i) {
                const item = instantiate(this.itemPrefab);
                const data = items[i];
                this.node.addChild(item);
                item.getComponent(RoomItemTemplate).init(data);
            }
        }
    }

}