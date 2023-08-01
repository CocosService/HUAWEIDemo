declare const cc: any;
declare const JavascriptJavaBridge: any;
declare namespace huawei {
    namespace hms {
        namespace game {
            /**
             * @en
             * Enum for analytics event listener.
             * @zh
             * 异步 API 调用的回调事件名称定义。
             */
            enum API_EVENT_LIST {
                debugApiResult = "debugApiResult",
                initGameCallback = "initGameCallback",
                checkAppUpdateCallback = "checkAppUpdateCallback",
                signInCallback = "signInCallback",
                logoutCallback = "logoutCallback",
                cancelAuthorizationCallback = "cancelAuthorizationCallback",
                cancelGameServiceCallback = "cancelGameServiceCallback",
                getCurrentPlayerCallback = "getCurrentPlayerCallback",
                setPopupsPositionCallback = "setPopupsPositionCallback",
                submitAppPlayerInfoCallback = "submitAppPlayerInfoCallback",
                getAppIdCallback = "getAppIdCallback",
                getGamePlayerStatsCallback = "getGamePlayerStatsCallback",
                getGameSummaryCallback = "getGameSummaryCallback",
                getAchievementListCallback = "getAchievementListCallback",
                getShowAchievementListIntentCallback = "getShowAchievementListIntentCallback",
                doAchievementEventCallback = "doAchievementEventCallback",
                doRankingsEventCallback = "doRankingsEventCallback",
                doGetRankingInfoEventCallback = "doGetRankingInfoEventCallback",
                getEventListCallback = "getEventListCallback",
                doArchiveEventCallback = "doArchiveEventCallback",
                submitPlayerEventEndCallback = "submitPlayerEventEndCallback"
            }
            /**
             * @en
             * The status code of callback from the java side.
             * @zh
             * 从 java 层返回的 callback 的状态。
             */
            enum StatusCode {
                /**
                 * @en
                 * Fail.
                 * @zh
                 * 接口调用失败。
                 */
                fail = 0,
                /**
                 * @en
                 * Success.
                 * @zh
                 * 接口调用成功。
                 */
                success = 1
            }
            /**
             * @en
             * The general result of callback from java side.
             * @zh
             * 从 java 层返回的 callback 的通用结果对象。
             */
            class ApiCbResult {
                originData: any;
                code: StatusCode;
                errMsg?: string;
                data?: any;
                constructor(originData: any);
                toString(): string;
            }
            /**
             * @en
             *
             * @zh
             *
             */
            class HmsGameService {
                private eventHandler;
                constructor();
                /**
                 * @en
                 * Add event listener.
                 * @zh
                 * 持续监听事件。
                 * @param eventName - Event name.
                 * @param cb - Event callback.
                 * @param thisArg - Target node.
                 */
                on(eventName: string, cb: (result: ApiCbResult) => void, thisArg?: any, once?: boolean): void;
                /**
                 * @en
                 * Add event listener (once only).
                 * @zh
                 * 监听一次事件。
                 * @param eventName - Event name.
                 * @param cb - Event callback.
                 * @param thisArg - Target node.
                 */
                once(eventName: string, cb: (result: ApiCbResult) => void, thisArg?: any): void;
                /***
                 * @internal
                 */
                emit(eventName: string, ...params: any[]): void;
                /**
                 * @en
                 * Remove the event listener.
                 * @zh
                 * 取消事件的监听。
                 * @param eventName - Event name.
                 * @param cb - Event callback.
                 * @param thisArg - Target node.
                 * @example
                 */
                off(eventName: string, cb?: (result: ApiCbResult) => void, thisArg?: any): void;
                /**
                 * @en
                 * Remove all event listener of the target node.
                 * @zh
                 * 取消某个节点所有的事件监听。
                 * @param targetNode
                 * @example
                 */
                targetOff(targetNode: any): void;
                /**
                 * (debug)接口调用情况
                 * @internal
                 * @param result object
                 */
                debugApiResult(result: any): void;
                /**
                 * 初始化
                */
                initGame(): void;
                /**
                 * @internal
                */
                initGameCallback(result: any): void;
                /**
                 * 检查应用更新
                 * Api文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/appupdateclient-0000001050123641#section1113567144514
                 * @param showUpdateDialog (mustBtnOne)强制更新按钮选择。true：升级提示框只有升级按钮，无取消按钮，用户只能选择升级。false：升级提示框有升级按钮和取消按钮，用户可选择不升级。
                */
                checkAppUpdate(forceUpdate: boolean): void;
                /**
                 * @internal
                 */
                checkAppUpdateCallback(result: any): void;
                /**
                 * 登陆
                 * @param useAuthorizationMode 是否采用授权方式登陆
                 */
                signIn(useAuthorizationMode: boolean): void;
                /**
                 * @internal
                 */
                signInCallback(result: any): void;
                /**
                 * 退出
                 */
                logout(): void;
                /**
                 * @internal
                 */
                logoutCallback(result: any): void;
                /**
                 * 帐号取消授权
                */
                cancelAuthorization(): void;
                /**
                 * @internal
                 */
                cancelAuthorizationCallback(result: any): void;
                /**
                 * 取消游戏服务授权
                 */
                cancelGameService(): void;
                /**
                 * @internal
                 */
                cancelGameServiceCallback(result: any): void;
                /**
                 * 获取player数据
                */
                getCurrentPlayer(): void;
                /**
                 * @internal
                 */
                getCurrentPlayerCallback(result: any): void;
                /**
                 * 设置欢迎提示语和完成成就提示框展示的位置。如果不调用本接口，将默认在页面顶部展示。
                 * @param position 当前只支持传入“1”，表示在页面顶部展示欢迎提示语和完成成就提示框。
                */
                setPopupsPosition(position: number): void;
                /**
                 * @internal
                 */
                setPopupsPositionCallback(result: any): void;
                /**
                 * 获取游戏的应用ID。
                */
                getAppId(): void;
                /**
                 * @internal
                 */
                getAppIdCallback(result: any): void;
                /**
                 * 保存玩家在当前游戏内的信息
                 * Api文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/playersclient-0000001050121668#section183401219425
                 * @param info
                 * area：玩家在游戏内的区服信息。
                 * rank：玩家在游戏内的等级。
                 * role：玩家在游戏内的角色。
                 * sociaty：玩家在游戏内的公会信息。
                */
                submitAppPlayerInfo(info: {
                    area: string;
                    rank: string;
                    role: string;
                    sociaty: string;
                }): void;
                /**
                 * @internal
                 */
                submitAppPlayerInfoCallback(result: any): void;
                /**
                 * 获取当前玩家的统计信息，如在线时长、在线名次等
                 * Api文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/gameplayerstatisticsclient-0000001050123613#section202215288110
                 * @param isRealTime 是否联网获取数据。true：是，表示从华为游戏服务器获取数据。false：否，表示从本地缓存获取数据。本地缓存时间为5分钟，如果本地无缓存或缓存超时，则从华为游戏服务器获取。
                */
                getGamePlayerStats(isRealTime: boolean): void;
                /**
                 * @internal
                 */
                getGamePlayerStatsCallback(result: any): void;
                /**
                 * 获取游戏基本信息
                 * Api文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/gamesummaryclient-0000001050123615
                 * @param fromLocal 是否从本地缓存获取，否则从服务器获取
                */
                getGameSummary(fromLocal: boolean): void;
                /**
                 * @internal
                 */
                getGameSummaryCallback(result: any): void;
                /**
                 * 获取当前玩家的所有状态的成就列表数据
                 * Api文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/achievementsclient-0000001050121648#section1887812284306
                 * @param forceReload true：服务器端。false：本地客户端。
                */
                getAchievementList(forceReload: boolean): void;
                /**
                 * @internal
                 */
                getAchievementListCallback(result: any): void;
                /**
                 * 展示成就列表页面
                 * api：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/achievementsclient-0000001050121648#section53667366810
                 * 指南：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-achievement-0000001050123477
                */
                getShowAchievementListIntent(): void;
                /**
                 * @internal
                 */
                getShowAchievementListIntentCallback(result: any): void;
                /**
                 * 执行成就相关事件
                 * 参考文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-achievement-0000001050123477
                 * @param funcName 执行的接口名 支持： visualizeWithResult | visualize | growWithResult ｜ grow ｜ makeStepsWithResult ｜ makeSteps ｜ reachWithResult ｜ reach
                 * @param jsonData json字符串形式的参数
                */
                doAchievementEvent(funcName: string, jsonData?: string): void;
                /**
                 * @internal
                 */
                doAchievementEventCallback(result: any): void;
                /**
                 * 执行排行榜相关事件
                 * 参考文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-leaderboards-0000001050123481
                 * @param funcName 执行的接口名 支持： getRankingSwitchStatus | setRankingSwitchStatus | submitRankingScore ｜ submitScoreWithResult
                 * @param jsonData json字符串形式的参数
                */
                doRankingsEvent(funcName: string, jsonData?: string): void;
                /**
                 * @internal
                 */
                doRankingsEventCallback(result: any): void;
                /**
                 * 执行获取排行榜相关信息事件
                 * 参考文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-leaderboards-0000001050123481
                 * @param funcName 执行的接口名 支持：  getRankingIntent| getRankingSummary | getCurrentPlayerRankingScore ｜ getPlayerCenteredRankingScores｜ getMoreRankingScores｜ getRankingTopScores
                 * @param jsonData json字符串形式的参数
                 */
                doGetRankingInfoEvent(funcName: string, jsonData?: string): void;
                /**
                 * @internal
                 */
                doGetRankingInfoEventCallback(result: any): void;
                /**
                 * 调用存档相关功能
                 * 参考文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-archive-0000001050121532
                 * @param funcName 执行的接口名 支持：setScopeList | addArchive | removeArchive | getLimitThumbnailSize | getLimitDetailsSize ｜ getShowArchiveListIntent ｜ getArchiveSummaryList ｜ loadArchiveDetails ｜ updateArchive
                 * @param jsonData json字符串形式的参数
                */
                doArchiveEvent(funcName: string, jsonData: string): void;
                /**
                 * @internal
                 */
                doArchiveEventCallback(result: any): void;
                /**
                 * 事件上报 之 获取事件列表
                 * 参考文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-events-0000001050121530
                 * @param eventIds 需要获取数据的事件ID数组,如果为空则获取全部
                 * @param forceReload 获取服务器端还是本地缓存的事件列表。true：服务器端. false：本地缓存.
                */
                getEventList(eventIds: string[], forceReload: boolean): void;
                /**
                 * 事件上报 之 提交事件
                 * 参考文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-events-0000001050121530
                 * @param eventId 需要提交数据的事件ID。由开发者在配置事件后获取。
                 * @param growAmount 在已有事件数值的基础上要增量增加的数值。
                 * @returns 结果
                */
                submitEvent(eventId: string, growAmount: number): boolean;
                /**
                 * @internal
                 */
                getEventListCallback(result: any): void;
                /**
                 * 显示浮标
                 * Api文档：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/buoyclient-0000001050123633
                */
                showFloatWindow(): void;
                /**
                 * 隐藏浮标
                */
                hideFloatWindow(): void;
            }
            const gameService: HmsGameService;
        }
    }
}
