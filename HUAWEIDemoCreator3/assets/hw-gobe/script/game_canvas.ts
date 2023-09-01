import { _decorator, Button, Component, director, instantiate, Label, Node, NodePool, Prefab } from 'cc';
import { cloudsList, CmdType, colliderEventMap, destroyedBulletSet, frameSyncPlayerInitList, frameSyncPlayerList, GameSceneType, setDefaultFrameState, updatePlayerData } from './frame_sync';
import { global, RoomType } from './hw_gobe_global_data';
import { Cloud } from './cloud';

import { CloudData } from './cloud_list';
import { PlayerData } from './PlayerList';
import { Player } from './player';
import { BulletData } from './gobe_util';
import { Bullet } from './bullet';
const { ccclass, property } = _decorator;


let playersPool: NodePool = null;
let cloudsPool: NodePool = null;
// 初始化对象池
function initPlayersPool (playerPrefab: Prefab) {
    if (playersPool) {
        return;
    }
    playersPool = new NodePool();
    let player = instantiate(playerPrefab);
    playersPool.put(player);
}

function getFromPlayersPool (playerPrefab: Prefab) {
    /*let player;
    if (playersPool.size() > 0) {
        player = playersPool.get();
    } else {
        player = instantiate(playerPrefab);
    }

    return player;*/
    let player = instantiate(playerPrefab);
    return player;
}

function getFromCloudsPool (cloudPrefab: Prefab) {
    let cloud;
    if (cloudsPool != null && cloudsPool.size() > 0) {
        cloud = cloudsPool.get();
    } else {
        cloud = instantiate(cloudPrefab);
    }
    return cloud;
}

function removeToPlayerPool (player) {
    playersPool.put(player);
}
@ccclass('GameCanvas')
export class GameCanvas extends Component {
    @property(Prefab)
    playerPrefab: Prefab = null;

    @property(Prefab)
    cloudPrefab: Prefab = null;

    @property(Prefab)
    circlePrefab: Prefab = null;

    @property(Prefab)
    bulletPrefab: Prefab = null;

    public players: Node[] = [];
    public clouds: Cloud[] = [];
    public tileSize = 40;
    public cloudSize = 36;
    public maxX = 19; // x轴最大值

    start () {
        initPlayersPool(this.playerPrefab);
    }

    setClouds (clouds: CloudData[], dt) {
        if (!Array.isArray(clouds)) {
            clouds = [];
        }
        if (clouds && clouds.length > 0) {
            for (let i = this.clouds.length; i < clouds.length; i++) {
                this.clouds.push(getFromCloudsPool(this.cloudPrefab));
            }
            let cloudNum = clouds.length - 5;
            clouds.forEach((cloud, i) => {
                const cloudView = this.clouds[i].getComponent(Cloud);
                if (i > cloudNum) {
                    const { x, y } = this.convertPosition(cloud.x, cloud.y);
                    cloudView.node.parent = this.node;
                    if (x + cloud.offset >= (this.maxX * this.tileSize + this.cloudSize / 2)) {
                        // 销毁节点
                        cloudView.node.parent = null;
                    } else {
                        cloud.offset += cloud.speed * dt;
                        cloudView.initCloud(x + cloud.offset, y);
                    }
                } else {
                    // 销毁节点
                    cloudView.node.parent = null;
                }
            });
        }
    }

    setPlayers (playerArr: PlayerData[]) {
        if (!Array.isArray(playerArr)) {
            playerArr = [];
        }
        this.players.splice(playerArr.length).forEach(player => removeToPlayerPool(player));
        for (let i = this.players.length; i < playerArr.length; i++) {
            this.players.push(getFromPlayersPool(this.playerPrefab));
        }
        playerArr.forEach((player, i) => {
            if (this.players[i]) {
                const playerView = this.players[i].getComponent(Player);
                playerView.node.parent = this.node;
                if (player.hp == 0 && player.isShoot) {
                    let tempPlayer = frameSyncPlayerInitList.players.find(p => p.playerId == player.playerId);
                    player.hp = global.planeMaxHp;
                    player.x = tempPlayer.x;
                    player.y = tempPlayer.y;
                }
                playerView.initPlayer(player);
            }
        });
    }

    setBullet (bulletData: BulletData) {
        let bullet = this.node.getChildByName(bulletData.bulletId.toString());
        if (bullet) {
            console.log('---------移动子弹------');
            let bulletView = bullet.getComponent(Bullet);
            bulletView.updatePos(bulletData);
        } else {
            // 若为刚销毁的子弹，说明已经发生过碰撞，无需再创建了
            if (!destroyedBulletSet.has(bulletData.bulletId)) {
                console.log('---------创建子弹------');
                bullet = instantiate(this.bulletPrefab);
                bullet.parent = this.node;
                let bulletView = bullet.getComponent(Bullet);
                bulletView.initBullet(bulletData);
            }
        }
    }

    destroyBullet (bulletId: string) {
        let bullet = this.node.getChildByName(bulletId);
        if (bullet) {
            let bulletView = bullet.getComponent(Bullet);
            bulletView.destroyBullet();
        }
    }

    convertPosition (mapX: number, mapY: number) {
        const x = mapX * this.tileSize + this.tileSize / 2;
        const y = mapY * this.tileSize + this.tileSize / 2;
        return { x, y };
    }

}