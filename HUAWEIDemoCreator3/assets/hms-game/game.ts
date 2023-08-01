import { _decorator, Component, loader, director, CCString, EventTarget, Node } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

/**
 * 华为游戏
*/
@ccclass('Game')
export class Game extends Component {
    @property({ type: Console })
    consolePanel: Console = null!;

    @property(Node)
    ScrollView_main: Node = null!;
    @property(Node)
    ScrollView_DoAchievementEvent: Node = null!;
    @property(Node)
    ScrollView_DoRankingsEvent: Node = null!;
    @property(Node)
    ScrollView_doGetRankingInfoEvent: Node = null!;
    @property(Node)
    ScrollView_doArchiveEvent: Node = null!;



    public closeSonShowMainPanel () {
        this.ScrollView_main.active = true;
        this.ScrollView_DoAchievementEvent.active = false;
        this.ScrollView_DoRankingsEvent.active = false;
        this.ScrollView_doGetRankingInfoEvent.active = false;
        this.ScrollView_doArchiveEvent.active = false;
    }



    private game: typeof huawei.hms.game.gameService = (typeof huawei ===
        'undefined'
        ? null
        : huawei?.hms?.game?.gameService)!;



    onEnable () {
        // 按需求开启 显示 debug 信息
        // this.game.on(huawei.hms.game.API_EVENT_LIST.debugApiResult, (res: huawei.hms.game.ApiCbResult) => {
        //     if (this.consolePanel) {
        //         this.consolePanel.log("[debug]" + res.toString());
        //     } else {
        //         console.error("console panel == null");
        //     }
        // }, this, false);

        this.closeSonShowMainPanel();
    }


    onDisable (): void {
        // 按需求开启 显示 debug 信息
        // this.game.off(huawei.hms.game.API_EVENT_LIST.debugApiResult);
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
     * 取消游戏服务
    */
    cancelGameService () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.cancelGameServiceCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.cancelGameService();
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
     * 获取当前玩家的统计信息，如在线时长、在线名次等
     * Api参考：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/gameplayerstatisticsclient-0000001050123613#section202215288110
     * isRealTime 是否联网获取数据。true：是，表示从华为游戏服务器获取数据。false：否，表示从本地缓存获取数据。本地缓存时间为5分钟，如果本地无缓存或缓存超时，则从华为游戏服务器获取。
    */
    getGamePlayerStats () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.getGamePlayerStatsCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        //联网获取
        this.game.getGamePlayerStats(true);

        // this.game.getGamePlayerStats(false);
    }

    /**
     * 获取游戏基本信息
     * fromLocal 是否从本地缓存获取，否则从服务器获取
    */
    getGameSummary () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.getGameSummaryCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        //联网获取
        this.game.getGameSummary(false);
    }


    /**
     * 获取当前玩家的所有状态的成就列表数据
     * Api文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/achievementsclient-0000001050121648#section1887812284306
     * forceReload true：服务器端。false：本地客户端。
    */
    getAchievementList () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.getAchievementListCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        //联网获取
        this.game.getAchievementList(true);
    }


    /**
     * 展示成就列表页面
     * api：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/achievementsclient-0000001050121648#section53667366810
     * 指南：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-achievement-0000001050123477
    */
    getShowAchievementListIntent () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.getShowAchievementListIntentCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.getShowAchievementListIntent();
    }


    /**
     * 事件上报 之 获取事件列表
     * 参考文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-events-0000001050121530
     * forceReload 获取服务器端还是本地缓存的事件列表。true：服务器端. false：本地缓存.
     * eventIds 需要获取数据的事件ID数组,如果为空则获取全部
    */
    getEventList_1 () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.getEventListCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.getEventList(null, true);
        // this.game.getEventList(false, null);
    }
    getEventList_2 () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.getEventListCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.getEventList(["0B885B7706E3B0C487A912EA65FE153BC758CD39CF5DD22B028BC42EB6816A71", "410BD5BEAB2E5595D3066FBAABB67E799A040FEFD9949B0BC2D3936007D0151D"], true);
        // this.game.getEventList(false, [0B885B7706E3B0C487A912EA65FE153BC758CD39CF5DD22B028BC42EB6816A71,410BD5BEAB2E5595D3066FBAABB67E799A040FEFD9949B0BC2D3936007D0151D]);
    }

    /**
     * 事件上报 之 提交事件
     * 参考文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-events-0000001050121530
     * eventId 需要提交数据的事件ID。由开发者在配置事件后获取。
     * growAmount 在已有事件数值的基础上要增量增加的数值。
    */
    submitEvent () {
        let suc1 = this.game.submitEvent("0B885B7706E3B0C487A912EA65FE153BC758CD39CF5DD22B028BC42EB6816A71", 2);
        let suc2 = this.game.submitEvent("410BD5BEAB2E5595D3066FBAABB67E799A040FEFD9949B0BC2D3936007D0151D", 3);

        this.consolePanel.log("submitEvent suc1:" + suc1);
        this.consolePanel.log("submitEvent suc2:" + suc2);

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


    //组合类


    //成就------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 执行成就相关事件
     * 参考文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-achievement-0000001050123477 
     * 成就创建位置：https://developer.huawei.com/consumer/cn/service/josp/agc/index.html#/myApp/108702107/9249519184595931384
     * funcName 执行的接口名 支持： visualizeWithResult | visualize | growWithResult ｜ grow ｜ makeStepsWithResult ｜ makeSteps ｜ reachWithResult ｜ reach  
     * jsonData json字符串形式的参数
    */
    doAchievementEvent () {
        this.ScrollView_main.active = false;
        this.ScrollView_DoAchievementEvent.active = true;   //
        this.ScrollView_DoRankingsEvent.active = false;
        this.ScrollView_doGetRankingInfoEvent.active = false;
        this.ScrollView_doArchiveEvent.active = false;
    }

    /**
     * 成就：揭秘成就 网络方式
    */
    visualizeWithResult () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doAchievementEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            achievementId: "C1B196ADDD0CBD11F2403A7AB12A9A3BDD8A079E1ACC049EE948D67891D861F5",
        }
        this.game.doAchievementEvent("visualizeWithResult", JSON.stringify(info));
    }

    /**
     * 成就：揭秘成就(如果设备当前无网络或应用无需立即获取操作结果)
    */
    visualize () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doAchievementEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            achievementId: "C1B196ADDD0CBD11F2403A7AB12A9A3BDD8A079E1ACC049EE948D67891D861F5",
        }
        this.game.doAchievementEvent("visualize", JSON.stringify(info));
    }

    /**
     * 增长成就步长
    */
    growWithResult () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doAchievementEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            achievementId: "019ECDD9541E9F1D47BE848166D56771BC87109C875770EB89450212753494AF",
            stepsNum: 1
        }
        this.game.doAchievementEvent("growWithResult", JSON.stringify(info));
    }

    /**
     * 增长成就步长
    */
    grow () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doAchievementEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            achievementId: "019ECDD9541E9F1D47BE848166D56771BC87109C875770EB89450212753494AF",
            stepsNum: 1
        }
        this.game.doAchievementEvent("grow", JSON.stringify(info));
    }


    /**
     * 设置成就步长
    */
    makeStepsWithResult () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doAchievementEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            achievementId: "019ECDD9541E9F1D47BE848166D56771BC87109C875770EB89450212753494AF",
            stepsNum: 2
        }
        this.game.doAchievementEvent("makeStepsWithResult", JSON.stringify(info));
    }

    /**
     * 设置成就步长
     */
    makeSteps () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doAchievementEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            achievementId: "019ECDD9541E9F1D47BE848166D56771BC87109C875770EB89450212753494AF",
            stepsNum: 2
        }
        this.game.doAchievementEvent("makeSteps", JSON.stringify(info));
    }


    /**
     * 解锁成就
    */
    reachWithResult () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doAchievementEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            achievementId: "5B5A1F11D048E22C6A211E3F9942F2E9A2608FBB9C12489F9C994B562E9A80BE",
        }
        this.game.doAchievementEvent("reachWithResult", JSON.stringify(info));
    }


    /**
     * 解锁成就
    */
    reach () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doAchievementEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            achievementId: "5B5A1F11D048E22C6A211E3F9942F2E9A2608FBB9C12489F9C994B562E9A80BE",
        }
        this.game.doAchievementEvent("reach", JSON.stringify(info));
    }



    //排行榜1------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    /**
     * 执行排行榜相关事件
     * 参考文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-leaderboards-0000001050123481
     * 排行榜创建地址：https://developer.huawei.com/consumer/cn/service/josp/agc/index.html#/myApp/108702107/9249519184596018033
     * funcName 执行的接口名 支持： getRankingSwitchStatus | setRankingSwitchStatus | submitRankingScore ｜ submitScoreWithResult  
     * jsonData json字符串形式的参数
    */
    doRankingsEvent () {
        this.ScrollView_main.active = false;
        this.ScrollView_DoAchievementEvent.active = false;
        this.ScrollView_DoRankingsEvent.active = true; //
        this.ScrollView_doGetRankingInfoEvent.active = false;
        this.ScrollView_doArchiveEvent.active = false;
    }
    /**
     * 查询玩家在当前排行榜的开关状态
     * 用户首次登录时排行榜开关状态默认为0，表示玩家未设置在排行榜中公开自己的分数。
    */
    getRankingSwitchStatus () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doRankingsEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.doRankingsEvent("getRankingSwitchStatus", "{}");
    }

    private _curOpenRankingStatus = false;
    /**
     * 设置 排行榜开关 1 打开， 0 关
    */
    setRankingSwitchStatus () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doRankingsEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            stateValue: this._curOpenRankingStatus ? 1 : 0
        }
        this.game.doRankingsEvent("setRankingSwitchStatus", JSON.stringify(info));
        //循环
        this._curOpenRankingStatus = !this._curOpenRankingStatus;
    }


    /**
     * 提交玩家分数 排行榜的开关状态要为1
     * 参考：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/rankingsclient-0000001050121670#section19891954194113
    */
    submitRankingScore () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doRankingsEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            rankingId: "BA67B4279DD91B5D7071BC08F388FC4275DCF0FDEFFD010A85A34B3260E9A63A",
            score: "88",
            scoreTips: "A",//分数的自定义单位，只支持[a-zA-Z0-9_-]中的字符。
        }
        this.game.doRankingsEvent("submitRankingScore", JSON.stringify(info));
    }


    /**
     * 提交玩家分数 排行榜的开关状态要为1
     * 参考：
    */
    submitScoreWithResult () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doRankingsEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            rankingId: "BA67B4279DD91B5D7071BC08F388FC4275DCF0FDEFFD010A85A34B3260E9A63A",
            score: "99",
            scoreTips: "Z",//分数的自定义单位，只支持[a-zA-Z0-9_-]中的字符。
        }
        this.game.doRankingsEvent("submitScoreWithResult", JSON.stringify(info));
    }

    //排行榜2------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 执行获取排行榜相关信息事件
     * 参考文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-leaderboards-0000001050123481
     * funcName 执行的接口名 支持：  getRankingIntent| getRankingSummary | getCurrentPlayerRankingScore ｜ getPlayerCenteredRankingScores ｜ getMoreRankingScores ｜ getRankingTopScores
     * jsonData json字符串形式的参数
     */
    doGetRankingInfoEvent () {
        this.ScrollView_main.active = false;
        this.ScrollView_DoAchievementEvent.active = false;
        this.ScrollView_DoRankingsEvent.active = false;
        this.ScrollView_doGetRankingInfoEvent.active = true;//
        this.ScrollView_doArchiveEvent.active = false;
    }


    /**
     * 获取某个排行榜全部时间维度的排行榜选择界面/获取某个排行榜指定时间维度的排行榜选择界面
    */
    getRankingIntent () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doGetRankingInfoEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            rankingId: "BA67B4279DD91B5D7071BC08F388FC4275DCF0FDEFFD010A85A34B3260E9A63A",
            timeDimension: "2",//时间维度。0：当天的数据。1：本周的数据。2：全部时间。
        }
        this.game.doGetRankingInfoEvent("getRankingIntent", JSON.stringify(info));
    }

    /**
     * 获取所有排行榜/仅需要获取某个排行榜
    */
    getRankingSummary () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doGetRankingInfoEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            isRealTime: "1",// "1"：联网，表示直接从华为游戏服务器获取。其他：不联网，表示从本地缓存获取。
            //rankingId: "BA67B4279DD91B5D7071BC08F388FC4275DCF0FDEFFD010A85A34B3260E9A63A",//需要获取数据的排行榜ID。不填写为获取当前所有排行榜数据
        }
        this.game.doGetRankingInfoEvent("getRankingSummary", JSON.stringify(info));
    }


    /**
     * 获取当前登录玩家在指定排行榜中的分数信息，支持指定时间维度。
     * https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/rankingsclient-0000001050121670#section1377018308316
    */
    getCurrentPlayerRankingScore () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doGetRankingInfoEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            rankingId: "BA67B4279DD91B5D7071BC08F388FC4275DCF0FDEFFD010A85A34B3260E9A63A",
            timeDimension: "2",//时间维度。0：当天的数据。1：本周的数据。2：全部时间。
        }
        this.game.doGetRankingInfoEvent("getCurrentPlayerRankingScore", JSON.stringify(info));
    }

    getPlayerCenteredRankingScores () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doGetRankingInfoEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        //获取以玩家为中心的排行榜中的分数信息，支持从本地缓存获取。例如玩家当前在排行榜中排名第5，则本方法支持获取排名在玩家前后的指定数量的分数信息。
        //https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/rankingsclient-0000001050121670#section8258857183619
        let info = {
            rankingId: "BA67B4279DD91B5D7071BC08F388FC4275DCF0FDEFFD010A85A34B3260E9A63A",
            timeDimension: "2",//时间维度。0：当天的数据。1：本周的数据。2：全部时间。
            maxResults: "20",//每页的最大数量，支持取值为1到21的整数
            isRealTime: "1",
        }

        //获取以玩家为中心的排行榜中的分数信息，只支持直接从华为游戏服务器获取。
        //https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/rankingsclient-0000001050121670#section192101672387
        let info2 = {
            rankingId: "BA67B4279DD91B5D7071BC08F388FC4275DCF0FDEFFD010A85A34B3260E9A63A",
            timeDimension: "2",//时间维度。0：当天的数据。1：本周的数据。2：全部时间。
            maxResults: "20",//每页的最大数量，支持取值为1到21的整数
            offsetPlayerRank: "0",//从offsetPlayerRank指定的位置，根据pageDirection指定的数据获取方向获取一页数据，offsetPlayerRank取值必须为大于等于0的整数，0表示从第1位开始,例如offsetPlayerRank取值为5，pageDirection取值为0，表示从排行榜的第6位分数开始向下获取一页数据,首次调用时此参数不生效，默认以当前玩家所在的位置为准。
            pageDirection: "0"//数据获取方向。0：下一页1：上一页
        }

        this.game.doGetRankingInfoEvent("getPlayerCenteredRankingScores", JSON.stringify(info));
    }

    /**
     * 分页获取某个排行榜的分数信息。
     * https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/rankingsclient-0000001050121670#section16942333123515
    */
    getMoreRankingScores () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doGetRankingInfoEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            rankingId: "BA67B4279DD91B5D7071BC08F388FC4275DCF0FDEFFD010A85A34B3260E9A63A",
            offsetPlayerRank: "0",
            maxResults: "20",//每页的最大数量，支持取值为1到21的整数
            pageDirection: "0",//数据获取方向。0：下一页 ,1：上一页
            timeDimension: "2",//时间维度。0：当天的数据。1：本周的数据。2：全部时间。
        }
        this.game.doGetRankingInfoEvent("getMoreRankingScores", JSON.stringify(info));
    }

    /**
     * 联网获取某个排行榜的首页数据。/ 获取某个排行榜的首页数据，支持从本地缓存获取。
    */
    getRankingTopScores () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doGetRankingInfoEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });

        //联网获取某个排行榜的首页数据。
        //https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/rankingsclient-0000001050121670#section16594122583910
        let info = {
            rankingId: "BA67B4279DD91B5D7071BC08F388FC4275DCF0FDEFFD010A85A34B3260E9A63A",
            timeDimension: "2",//时间维度。0：当天的数据。1：本周的数据。2：全部时间。
            maxResults: "20",//每页的最大数量，支持取值为1到21的整数
            offsetPlayerRank: "0",//从offsetPlayerRank指定的位置，根据pageDirection指定的数据获取方向获取一页数据，offsetPlayerRank取值必须为大于等于0的整数，0表示从第1位开始,例如offsetPlayerRank取值为5，pageDirection取值为0，表示从排行榜的第6位分数开始向下获取一页数据,首次调用时此参数不生效，默认以当前玩家所在的位置为准。
            pageDirection: "0"//数据获取方向。当前只支持“0”，表示向下一页获取数据。
        }

        //获取某个排行榜的首页数据，支持从本地缓存获取。
        //https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/rankingsclient-0000001050121670#section419819468407
        let info2 = {
            rankingId: "BA67B4279DD91B5D7071BC08F388FC4275DCF0FDEFFD010A85A34B3260E9A63A",
            timeDimension: "2",//时间维度。0：当天的数据。1：本周的数据。2：全部时间。
            maxResults: "100",//每页的最大数量，支持取值为1到200的整数
            isRealTime: "1",
        }
        this.game.doGetRankingInfoEvent("getRankingTopScores", JSON.stringify(info));
    }




    //存档------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 调用存档相关功能
     * 参考文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-archive-0000001050121532
     * @param funcName 执行的接口名 支持：setScopeList | addArchive | removeArchive | getLimitThumbnailSize | getLimitDetailsSize ｜ getShowArchiveListIntent ｜ getArchiveSummaryList ｜ loadArchiveDetails ｜ updateArchive
     * @param jsonData json字符串形式的参数
    */
    doArchiveEvent () {
        this.ScrollView_main.active = false;
        this.ScrollView_DoAchievementEvent.active = false;
        this.ScrollView_DoRankingsEvent.active = false;
        this.ScrollView_doGetRankingInfoEvent.active = false;
        this.ScrollView_doArchiveEvent.active = true;//
    }

    /**
     * 设置登陆前的标识位，如果需要使用存档相关功能 需要在登陆接口调用前调用此接口，登陆成功后才可以使用存档相关功能
    */
    setScopeList_Archive () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doArchiveEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.doArchiveEvent("setScopeList", "{}");
    }

    /**
     * 提交存档，存档成功后HMS Core SDK将以ArchiveSummary对象方式向应用返回存档成功后的存档元数据。
     * https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/archivesclient-0000001050123603#section919631562213
    */
    addArchive () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doArchiveEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            activeTime: "5000",//设置存档变更的游戏时长。(存档变更时长的时间戳。)
            currentProgress: "50",//设置存档的进度值。(存档进度值，单位由开发者自行定义。)
            descInfo: "savedata" + Math.ceil(Math.random() * 100), //设置存档的描述。(存档的描述。)
            // thumbnail: "archiveIcon.png",//存档的封面图片(包含存档封面图片的二进制信息。)
            // thumbnailMimeType: "png",//封片图片的Mime类型。
            archiveDetails: "time = 5000,progress = 50",
            isSupportCache: "0",//是否支持网络异常时先缓存到本地，待网络恢复后再提交。“1”：支持 ，其他：不支持
        }
        this.game.doArchiveEvent("addArchive", JSON.stringify(info));
    }

    /**
     * 删除存档记录，包括华为游戏服务器和本地缓存的存档记录。华为游戏服务器侧根据存档记录的ID删除，本地缓存根据存档记录的名称删除。
    */
    removeArchive () {
        console.error("TODO 获取存档ID");
        return;
        this.game.once(huawei.hms.game.API_EVENT_LIST.doArchiveEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            archiveId: "",
        }
        this.game.doArchiveEvent("removeArchive", JSON.stringify(info));
    }

    /**
     * 获取华为游戏服务器允许的存档封面文件的最大大小。
    */
    getLimitThumbnailSize () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doArchiveEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.doArchiveEvent("getLimitThumbnailSize", "{}");
    }


    /**
     * 获取华为游戏服务器允许的存档文件的最大大小。
    */
    getLimitDetailsSize () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doArchiveEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        this.game.doArchiveEvent("getLimitDetailsSize", "{}");
    }


    /**
     * 获取存档数据选择界面的Intent对象。
     * https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/archivesclient-0000001050123603#section060419457266
    */
    getShowArchiveListIntent () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doArchiveEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            title: "Savedata",      //界面上展示的存档的名称。
            allowAddBtn: "1",       //是否允许有新增存档按钮。"1"允许 其他不允许
            allowDeleteBtn: "1",    //是否允许有删除存档按钮。"1"允许 其他不允许
            maxArchive: "5",          //展示存档的最大数量，"-1"表示展示全部。
        }
        this.game.doArchiveEvent("getShowArchiveListIntent", JSON.stringify(info));
    }


    /**
     * 获取全部存档数据，支持从本地缓存获取。
     * https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/archivesclient-0000001050123603#section20922651183118
    */
    getArchiveSummaryList () {
        this.game.once(huawei.hms.game.API_EVENT_LIST.doArchiveEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            isRealTime: "1",      //是否联网获取数据。"1"是，表示从华为游戏服务器获取数据。否，表示从本地缓存获取数据。本地缓存时间为5分钟，如果本地无缓存或缓存超时，则从华为游戏服务器获取。
        }
        this.game.doArchiveEvent("getArchiveSummaryList", JSON.stringify(info));
    }


    /**
     * 打开存档数据/使用某个策略打开存档数据。/以文件名方式打开存档数据。/以不处理冲突的方式打开存档数据。
     * https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/archivesclient-0000001050123603#section20922651183118
    */
    loadArchiveDetails () {
        console.error("TODO 获取存档ID");
        return;
        this.game.once(huawei.hms.game.API_EVENT_LIST.doArchiveEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            diffStrategy: "STRATEGY_TOTAL_PROGRESS",//https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/archivesclient-0000001050123603#section073211610341
            archiveId: "",
        }
        this.game.doArchiveEvent("loadArchiveDetails", JSON.stringify(info));
    }

    /**
     * 解决数据冲突
     * https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/archivesclient-0000001050123603#section185311123389
    */
    updateArchive () {
        console.error("TODO 获取存档ID");
        return;
        this.game.once(huawei.hms.game.API_EVENT_LIST.doArchiveEventCallback, (result: huawei.hms.game.ApiCbResult) => {
            this.consolePanel.log(result);
        });
        let info = {
            //selectArchive: "recentArchive",
            archiveId: "",
            activeTime: "8000",
            currentProgress: "60",
            archiveDetails: "time=8000,progress=60",
            descInfo: "savedata" + Math.ceil(Math.random() * 100),
            thumbnail: "archiveIcon.png",
            thumbnailMimeType: "png",
        }
        this.game.doArchiveEvent("updateArchive", JSON.stringify(info));
    }
}
