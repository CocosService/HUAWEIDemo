import { _decorator, Component, loader, director, CCString, EventTarget, EditBox, Node, Button, Label, instantiate, Prefab, AssetManager, Asset, profiler } from 'cc';
import { Console } from '../../prefabs/console';
import { HwGobeGlobalData, LockType, global } from './hw_gobe_global_data';
import config from './config';
import { getCustomPlayerProperties, getPlayerMatchParams } from './gobe_util';
import { GobeRecordList } from './gobe_record_list';
const { ccclass, property } = _decorator;

/**
 * 华为联机对战 大厅
*/
@ccclass('GobeHall')
export class GobeHall extends Component {

    @property({ type: Console })
    console: Console = null!;

    @property({ type: GobeRecordList })
    recordListPanel: GobeRecordList = null!;

    @property({ type: Node })
    cancelFastMatchPlayerBtn: Node = null!;


    private _isInMatch: boolean = false;
    private get isInMatch (): boolean {
        return this._isInMatch;
    }
    private set isInMatch (val: boolean) {
        this._isInMatch = val;
        this.cancelFastMatchPlayerBtn.active = val;
    }

    private _onMatchEve = (onMatchResponse) => this._onMatch(onMatchResponse)


    onEnable (): void {
        this.isInMatch = false;
        this.recordListPanel.node.active = false;
    }
    onDestroy (): void {
        global.client.onMatch.clear();
    }

    /**
     * 监听匹配结果
    */
    private _onMatch (res: GOBE.OnMatchResponse) {
        if (res.rtnCode === 0) {
            this.console.log('在线匹配成功:' + res.room);
            global.room = res.room;
            global.player = res.room.player;
            director.loadScene("gobe_room");
        } else {
            this.console.log("在线匹配失败", res);
            //是否是已经在匹配中//"101106 player already in one room"
            if (res.rtnCode == 101106) {
                this.console.error("101106 TODO")
            }
        }
        this.isInMatch = false;
    }

    /**
     * 离开
     */
    onExitBtn () {
        this.onCancelMatch(false);
        director.loadScene("hwgobe");
    }

    /**
     * “普通房间”按钮点击事件
     */
    onOrdinaryRoomBtn () {
        this.console.log(`正在进入菜鸟区`);
        global.matchRule = '0';
        director.loadScene("gobe_match");
    }

    /**
     * “高手房间”按钮点击事件
     */
    onExpertRoomBtn () {
        this.console.log(`正在进入高手区`);
        global.matchRule = '1';
        director.loadScene("gobe_match");
    }

    /**
     * 快速匹配
    */
    async onFastMatchPlayer () {
        if (this.isInMatch) {
            this.console.error("正在匹配中,无需再次操作");
            return;
        }
        let player = {
            playerId: global.playerId,
            matchParams: getPlayerMatchParams()
        };

        this.isInMatch = true;
        //事件 
        global.client.onMatch.clear();
        global.client.onMatch(this._onMatchEve);
        // 调用GOBE的matchPlayer发起在线匹配
        global.client.matchPlayer(
            {
                playerInfo: player,
                teamInfo: null,
                matchCode: config.matchCode
            }, { customPlayerStatus: 0, customPlayerProperties: getCustomPlayerProperties() })
            .then((res: GOBE.MatchResponse) => {
                this.console.log("在线匹配开始")
            })
            .catch((e: GOBE.MatchResponse) => {
                //清除匹配事件
                global.client.onMatch.clear();
                this.isInMatch = false;
                this.console.log("在线匹配失败", e);
                //查询匹配结果时，玩家已不在匹配中，请重新发起匹配。
                if (e.rtnCode == 104211) {
                    //可能是自己取消了匹配
                }
            });
    }

    /**
     * 取消快速匹配
     */
    public onCancelMatch (showLog: boolean = true) {
        if (!this.isInMatch) {
            this.console.log("当前未在匹配");
            return;
        }
        this.isInMatch = false;
        //清除匹配事件
        global.client.onMatch.clear();
        global.client.cancelMatch()
            .then(() => {
                showLog && this.console.log('取消匹配成功');
            }).catch(() => {
                showLog && this.console.log('取消匹配失败');
            })
    }

    /**
     * “战绩回放”按钮点击事件
     */
    onRecordList () {
        this.recordListPanel.node.active = true;
    }


}