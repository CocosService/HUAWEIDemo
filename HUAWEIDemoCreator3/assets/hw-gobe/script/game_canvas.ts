import { _decorator, Button, Component, director, instantiate, Label, Node, NodePool, Prefab } from 'cc';
import { global } from './hw_gobe_global_data';
import { PlayerData } from './PlayerList';
import { Player } from './player';

const { ccclass, property } = _decorator;


@ccclass('GameCanvas')
export class GameCanvas extends Component {
    @property(Prefab)
    playerPrefab: Prefab = null;


    /**
     * 刷新player节点
    */
    refreshPlayers (newPlayerDataArr: PlayerData[]) {
        if (!Array.isArray(newPlayerDataArr)) {
            newPlayerDataArr = [];
        }
        //销毁旧的
        global.playerNodeArr.forEach((player, i) => {
            player.destroy();
        })
        global.playerNodeArr = [];

        this.node.removeAllChildren();

        //创建新角色
        newPlayerDataArr.forEach((player, i) => {
            let playerNode = instantiate(this.playerPrefab);
            const playerView = playerNode.getComponent(Player);
            playerView.node.parent = this.node;
            playerView.initPlayer(player);
            //缓存
            global.playerNodeArr.push(playerView);
        });
    }

    /**
     * 更新已有的player的数据
    */
    updatePlayerData (playerDatas: PlayerData[]) {
        let allPlayerView = global.playerNodeArr;
        for (let i = 0; i < allPlayerView.length; i++) {
            //实体
            const playerView: Player = allPlayerView[i];
            //数据
            let playerData = playerDatas.find((p) => p.playerId == playerView.playerId);
            //刷新
            playerView.updatePlayer(playerData);
        }
    }
}