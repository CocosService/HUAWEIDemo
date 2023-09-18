import { _decorator, Component, director, Node } from 'cc';
import { isInited } from './gobe_util';
import { global } from './hw_gobe_global_data';
import { Console } from '../../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('GobeMatch')
export class GobeMatch extends Component {

    @property({ type: Console })
    console: Console = null!;

    //是否在匹配中
    private isInMatch: boolean = false;

    protected onEnable (): void {
        this.isInMatch = false;
    }


    /**
     * 创建房间
    */
    onCreateRoomNodeClick () {
        if (!isInited()) {
            return this.console.log("请先初始化 SDK");
        }
        if (this.isInMatch) {
            this.console.log("正在匹配,请先取消匹配");
        } else {
            director.loadScene("gobe_create_room");
        }
    }

    /**
     * 加入房间
    */
    onJoinRoomNodeClick () {
        director.loadScene("gobe_room_list");
    }


    /**
     * 返回
    */
    onGoBackClick () {
        director.loadScene("gobe_hall");
    }

    /**
     * 快速匹配
    */
    async onFastMatchPlayer () {
        if (this.isInMatch) {
            this.console.log("正在匹配,请稍后");
            return;
        }
        this.console.log("正在匹配,请稍后");


        this.isInMatch = true;

        let customRoomProp = {
            bgMaxX: global.bgMaxX,                // 飞行背景x最大值
            bgMaxY: global.bgMaxY                 // 飞行背景y最大值
        }
        global.client.matchRoom(
            {
                matchParams: {
                    'matchRule': global.matchRule,
                },
                roomType: global.matchRule,
                customRoomProperties: JSON.stringify(customRoomProp),
                maxPlayers: 2,
            },
            {
                customPlayerStatus: 0, customPlayerProperties: ""
            })
            .then((room) => {

                this.console.log("房间匹配成功");
                global.room = room;
                global.player = room.player;
                this.isInMatch = false;
                //转入room场景
                director.loadScene("gobe_room");
            })
            .catch((e) => {
                this.isInMatch = false;
                this.console.log("房间匹配失败", e);
            });
    }
}

