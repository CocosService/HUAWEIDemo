import { _decorator, Component, Label, Node, ProgressBar, Sprite } from 'cc';
import { Team, CollideTag, frameSyncPlayerList, frameSyncPlayerInitList, colliderEventMap, destroyedBulletSet } from './frame_sync';
import { PlayerData } from './PlayerList';
import { global } from './hw_gobe_global_data';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(Label)
    label: Label = null;

    @property(Sprite)
    icon1Sprite: Sprite = null;

    @property(Sprite)
    icon2Sprite: Sprite = null;

    @property(ProgressBar)
    hp: ProgressBar = null;

    public cloudSize = 36;
    // 组件需要记录玩家id，后面有用
    playerId: string;

    public initPlayer (playerData: PlayerData) {
        this.node.name = playerData.playerId;
        this.playerId = playerData.playerId;
        this.hp.getComponent(ProgressBar).progress = playerData.hp / global.planeMaxHp;

        if ((playerData.teamId == null && playerData.playerId === global.playerId) ||
            (playerData.teamId != null && playerData.teamId === Team.red)
        ) {
            this.icon1Sprite.node.active = true;
            this.icon2Sprite.node.active = false;
            this.icon1Sprite.node.angle = playerData.direction;
        }
        if ((playerData.teamId == null && playerData.playerId !== global.playerId) ||
            (playerData.teamId != null && playerData.teamId === Team.yellow)) {
            this.icon2Sprite.node.active = true;
            this.icon1Sprite.node.active = false;
            this.icon2Sprite.node.angle = playerData.direction;
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

    /**
     * 碰撞检测
     * @param other
     */
    onCollisionEnter (other, self) {
        if (other.tag == CollideTag.bullet) {
            let bulletHead = other.node.name.split('_')[0];
            if (bulletHead == this.playerId) {
                return;
            }
            console.log(`Plane onCollisionEnter playerId: ${this.playerId}, selfTag: ${self.tag}, otherTag: ${other.tag},`);
            let syncPlayer = frameSyncPlayerList.players.find((p) => p.playerId == this.playerId);
            if (this.hp.getComponent(ProgressBar).progress < 1) {
                console.log('----残血被攻击----');
                let initPlayer = frameSyncPlayerInitList.players.find((p) => p.playerId == this.playerId);
                if (initPlayer) {
                    syncPlayer.hp = global.planeMaxHp;
                    syncPlayer.x = initPlayer.x;
                    syncPlayer.y = initPlayer.y;
                    syncPlayer.direction = initPlayer.direction;
                }
            }
            else {
                console.log('----满血被攻击----');
                syncPlayer.hp = 1;
            }

            colliderEventMap.set(other.node.name, {
                playerId: this.playerId,
                bulletId: other.node.name,
                timeStamp: Date.now()
            });
            destroyedBulletSet.add(other.node.name);
            console.log('---------缓存碰撞事件---------');
        }
    }
}

