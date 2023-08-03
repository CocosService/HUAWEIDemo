declare const cc: any;
declare const JavascriptJavaBridge: any;
declare namespace huawei {
    namespace hms {
        namespace ads {
            /**
             * @en
             * Enum for analytics event listener.
             * @zh
             * 异步 API 调用的回调事件名称定义。
             */
            enum API_EVENT_LIST {
                debugApiResult = "debugApiResult",
                showAdsCallback = "showAdsCallback",
                hideAdsCallback = "hideAdsCallback",
                preloadAdsCallback = "preloadAdsCallback",
                onAdLoadedCallback = "onAdLoadedCallback",
                onAdFailedCallback = "onAdFailedCallback",
                onAdOpenedCallback = "onAdOpenedCallback",
                onAdClickedCallback = "onAdClickedCallback",
                onAdLeaveCallback = "onAdLeaveCallback",
                onAdClosedCallback = "onAdClosedCallback",
                onVideoStartCallback = "onVideoStartCallback",
                onVideoPlayCallback = "onVideoPlayCallback",
                onVideoEndCallback = "onVideoEndCallback",
                onRewardAdOpenedCallback = "onRewardAdOpenedCallback",
                onRewardAdClosedCallback = "onRewardAdClosedCallback",
                onRewardAdFailedToShowCallback = "onRewardAdFailedToShowCallback",
                onRewardedCallback = "onRewardedCallback"
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
            class HmsAdsService {
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
                 * 显示广告
                 * @param adType   支持广告类型 Banner/Native/Reward/Interstitial，（Reward/Interstitial类型需要先调用预加载）
                 * @param jsonInfo json参数
                */
                showAds(adType: string, jsonInfo: string): void;
                /**
                 * 显示广告 回调
                 * @internal
                */
                showAdsCallback(result: any): void;
                /**
                 * 关闭广告
                 * @param adType   支持广告类型 Banner/Native
                 * @param jsonInfo json参数
                */
                hideAds(adType: string, jsonInfo: string): void;
                /**
                 * 关闭广告 回调
                 * @internal
                */
                hideAdsCallback(result: any): void;
                /**
                 * 预加载广告
                 * @param adType   支持广告类型  Reward/Interstitial
                 * @param jsonInfo json参数
                */
                preloadAds(adType: string, jsonInfo: string): void;
                /**
                 * 预加载广告 回调
                 * @internal
                */
                preloadAdsCallback(result: any): void;
                /**
                 * 监听广告事件 - 广告获取成功
                 * @internal
                */
                onAdLoadedCallback(result: any): void;
                /**
                 * 监听广告事件 - 广告获取失败
                 * @internal
                */
                onAdFailedCallback(result: any): void;
                /**
                 * 监听广告事件 - 广告打开
                 * @internal
                */
                onAdOpenedCallback(result: any): void;
                /**
                 * 监听广告事件 - 广告点击
                 * @internal
                */
                onAdClickedCallback(result: any): void;
                /**
                 * 监听广告事件 - 广告离开
                 * @internal
                */
                onAdLeaveCallback(result: any): void;
                /**
                 * 监听广告事件 - 广告关闭
                 * @internal
                */
                onAdClosedCallback(result: any): void;
                /**
                 * 监听广告事件 - 在视频播放第一次开始时调用
                 * @internal
                */
                onVideoStartCallback(result: any): void;
                /**
                 * 监听广告事件 - 在播放视频时调用
                 * @internal
                */
                onVideoPlayCallback(result: any): void;
                /**
                 * 监听广告事件 - 视频播放结束时调用
                 * @internal
                */
                onVideoEndCallback(result: any): void;
                /**
                 * 监听广告事件 - 当激励广告打开时调用
                 * @internal
                */
                onRewardAdOpenedCallback(result: any): void;
                /**
                 * 监听广告事件 - 当激励广告关闭时调用
                 * @internal
                */
                onRewardAdClosedCallback(result: any): void;
                /**
                 * 监听广告事件 - 当奖励广告展示失败时调用
                 * @internal
                */
                onRewardAdFailedToShowCallback(result: any): void;
                /**
                 * 监听广告事件 - 当激励广告奖励达成时调用
                 * @internal
                */
                onRewardedCallback(result: any): void;
            }
            const adsService: HmsAdsService;
        }
    }
}
