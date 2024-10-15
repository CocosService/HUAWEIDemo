import { _decorator, Component, loader, director, CCString, EventTarget, Node } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

//存档数据结构
interface ArchiveSummaryInfo {
    activeTime: number,
    archiveId: string,
    currentProgress: number,
    destInfo: string,
    fileName: string,
    hasThumbnail: boolean,
    index: number,
    recentUpdateTime: number,
    thumbnailRatio: number,
}

/**
 * 华为游戏
*/
@ccclass('Game')
export class Game extends Component {
    @property({ type: Console })
    consolePanel: Console = null!;

    @property(Node)
    ScrollView_main: Node = null!;


    //当前获取的存档数据
    private _curGetArchiveSummaryInfoArr: Map<string, ArchiveSummaryInfo> = new Map();

    public closeSonShowMainPanel () {
        this.ScrollView_main.active = true;
    }



    private game: typeof huawei.hms.game.gameService = (typeof huawei ===
        'undefined'
        ? null
        : huawei?.hms?.game?.gameService)!;


    onEnable () {
        this.closeSonShowMainPanel();
    }

    onDisable (): void {
    }


    /**
     * 初始化游戏
    */
    initGame () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.initGameCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.initGame();
    }

    /**
     * 检查应用更新
    */
    checkAppUpdate () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.checkAppUpdateCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.checkAppUpdate(true);
    }

    /**
     * 登陆
    */
    signIn_1 () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.signInCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        //采用授权方式登陆
        this.game.signIn(true);
        // this.game.signIn(false);
    }

    /**
     * 登陆
    */
    signIn_2 () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.signInCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });

        this.game.signIn(false);
    }
    /**
     * 退出
    */
    logout () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.logoutCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.logout();
    }


    /**
     * 取消登陆授权
    */
    cancelAuthorization () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.cancelAuthorizationCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.cancelAuthorization();
    }

    /**
     * 获取player数据
     */
    getCurrentPlayer () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.getCurrentPlayerCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.getCurrentPlayer();
    }


    /**
     * 设置欢迎提示语和完成成就提示框展示的位置。如果不调用本接口，将默认在页面顶部展示。
     * position 当前只支持传入“1”，表示在页面顶部展示欢迎提示语和完成成就提示框。
    */
    setPopupsPosition () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.setPopupsPositionCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.setPopupsPosition(1);
    }

    /**
     * 获取游戏的应用ID。
    */
    getAppId () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.getAppIdCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.getAppId();
    }

    /**
     * @deprecated
     * 保存玩家在当前游戏内的信息
    */
    submitAppPlayerInfo () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.submitAppPlayerInfoCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.submitAppPlayerInfo({
            area: "测试区服1", rank: "测试等级1", role: "测试角色1", sociaty: "测试工会消息1"
        });
    }

    /**
     * 保存玩家在当前游戏内的信息
    */
    savePlayerRole () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.savePlayerRoleCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.savePlayerRole({
            serverId: "123", serverName: "server1", roleId: "321", roleName: "测试角色1"
        });
    }


    /**
     * 显示浮标
     * Api文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/buoyclient-0000001050123633
    */
    showFloatWindow () {
        this.game.showFloatWindow();
        this.consolePanel.log("showFloatWindow suc");
    }

    /**
     * 隐藏浮标
    */
    hideFloatWindow () {
        this.game.hideFloatWindow();
        this.consolePanel.log("hideFloatWindow suc");
    }
}
