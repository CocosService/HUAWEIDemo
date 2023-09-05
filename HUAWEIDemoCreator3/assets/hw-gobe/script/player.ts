import { _decorator, Component, Label, Node, ProgressBar, Sprite } from 'cc';
import { Team, frameSyncPlayerList, frameSyncPlayerInitList } from './frame_sync';
import { PlayerData } from './PlayerList';
import { global } from './hw_gobe_global_data';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(Label)
    label: Label = null;

    @property(Node)
    selfAngleNode: Node = null;


    @property(Node)
    otherAngleNode: Node = null;


    // 组件需要记录玩家id，后面有用
    playerId: string;
    public initPlayer (playerData: PlayerData) {
        this.node.name = playerData.playerId;
        this.playerId = playerData.playerId;

        if ((playerData.teamId == null && playerData.playerId === global.playerId) ||
            (playerData.teamId != null && playerData.teamId === Team.red)
        ) {
            this.selfAngleNode.active = true;
            this.selfAngleNode.angle = playerData.direction;
            this.otherAngleNode.active = false;

        }
        if ((playerData.teamId == null && playerData.playerId !== global.playerId) ||
            (playerData.teamId != null && playerData.teamId === Team.yellow)) {
            this.selfAngleNode.active = false;
            this.otherAngleNode.active = true;
            this.otherAngleNode.angle = playerData.direction;
        }
        if (playerData.playerId === global.playerId) {
            this.label.string = '我';
        }
        else {
            if (playerData.robotName) {
                this.label.string = playerData.robotName;
            }
            else {
                this.label.string = playerData.playerId;
            }
        }
        this.node.setPosition(playerData.x, playerData.y, 0);
    }
}

