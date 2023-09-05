import { _decorator, Button, Component, director, instantiate, Label, Node, NodePool, Prefab } from 'cc';
import { CmdType, frameSyncPlayerInitList, frameSyncPlayerList, GameSceneType, setDefaultFrameState, updatePlayerData } from './frame_sync';
import { global, RoomType } from './hw_gobe_global_data';
import { PlayerData } from './PlayerList';
import { Player } from './player';

const { ccclass, property } = _decorator;


@ccclass('GameCanvas')
export class GameCanvas extends Component {
    @property(Prefab)
    playerPrefab: Prefab = null;

    public players: Node[] = [];
    public tileSize = 40;
    public maxX = 19; // x轴最大值


    setPlayers (playerArr: PlayerData[]) {
        if (!Array.isArray(playerArr)) {
            playerArr = [];
        }
        for (let i = 0; i < this.players.length; i++) {
            const element = this.players[i];
            element.destroy();
        }
        this.players = [];

        for (let i = this.players.length; i < playerArr.length; i++) {
            let player = instantiate(this.playerPrefab);
            this.players.push(player);
        }
        global.playerArr = [];
        playerArr.forEach((player, i) => {
            if (this.players[i]) {
                const playerView = this.players[i].getComponent(Player);
                playerView.node.parent = this.node;
                playerView.initPlayer(player);
                //缓存
                global.playerArr.push(playerView);
            }
        });
    }

    convertPosition (mapX: number, mapY: number) {
        const x = mapX * this.tileSize + this.tileSize / 2;
        const y = mapY * this.tileSize + this.tileSize / 2;
        return { x, y };
    }

}