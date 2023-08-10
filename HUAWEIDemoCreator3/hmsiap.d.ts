declare const cc: any;
declare const JavascriptJavaBridge: any;
declare namespace huawei {
    namespace hms {
        namespace iap {
            /**
             * @en
             * Enum for analytics event listener.
             * @zh
             * 异步 API 调用的回调事件名称定义。
             */
            enum API_EVENT_LIST {
                debugApiResult = "debugApiResult",
                isEnvReadyCallBack = "isEnvReadyCallBack",
                obtainProductInfoCallBack = "obtainProductInfoCallBack",
                createPurchaseIntentCallBack = "createPurchaseIntentCallBack",
                createPurchaseIntentWithPriceCallBack = "createPurchaseIntentWithPriceCallBack",
                consumeOwnedPurchaseCallBack = "consumeOwnedPurchaseCallBack",
                obtainOwnedPurchasesCallBack = "obtainOwnedPurchasesCallBack",
                obtainOwnedPurchaseRecordCallBack = "obtainOwnedPurchaseRecordCallBack",
                startIapActivityCallBack = "startIapActivityCallBack"
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
            class HmsIapService {
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
                 * 设置支付公钥
                */
                setPublicKey(key: string): void;
                /**
                 * 获取是否支持应用内支付
                */
                isEnvReady(): void;
                /**
                 * @internal
                */
                private _isEnvReadyCallBack;
                /**
                 * 获取商品信息
                 * @param productIdArr 商品id列表 查询的商品必须是您在AppGallery Connect网站配置的商品
                 * @param priceType    0：消耗型商品; 1：非消耗型商品; 2：订阅型商品
                */
                obtainProductInfo(productIdArr: string[], priceType: number): void;
                /**
                 * @internal
                */
                private _obtainProductInfoCallBack;
                /**
                 * 发起购买PMS商品
                 * @param productId        商品ID
                 * @param priceType        商品类型 0：消耗型商品; 1：非消耗型商品; 2：订阅型商品
                 * @param developerPayload 商户侧保留信息
                */
                createPurchaseIntent(productId: string, priceType: number, developerPayload: string): void;
                /**
                 * @internal
                */
                private _createPurchaseIntentCallBack;
                /**
                 * 购买非PMS商品
                */
                createPurchaseIntentWithPrice(info: {
                    currency: string;
                    developerPayload: string;
                    priceType: number;
                    sdkChannel: string;
                    productName: string;
                    amount: string;
                    productId: string;
                    serviceCatalog: string;
                    country: string;
                }): void;
                /**
                 * @internal
                */
                private _createPurchaseIntentWithPriceCallBack;
                /**
                 * 消耗品确认交易 在消耗型商品支付成功后，应用需要在发放商品成功之后调用此接口对消耗型商品执行消耗操作。
                 * @param inAppPurchaseData 购买数据中的inAppPurchaseData
                */
                consumeOwnedPurchase(inAppPurchaseData: string): void;
                /**
                 * @internal
                */
                private _consumeOwnedPurchaseCallBack;
                /**
                 * 获取对应类型的商品的付款信息
                 * @param priceType 0：消耗型商品; 1：非消耗型商品; 2：订阅型商品
                */
                obtainOwnedPurchases(priceType: number): void;
                /**
                 * @internal
                */
                private _obtainOwnedPurchasesCallBack;
                /**
                 * 查看用户购买历史
                 * @param priceType 0：消耗型商品; 2：订阅型商品
                */
                obtainOwnedPurchaseRecord(priceType: number): void;
                /**
                 * @internal
                */
                private _obtainOwnedPurchaseRecordCallBack;
                /**
                 * 跳转到管理订阅页/跳转到编辑订阅页
                 * @param type      2(StartIapActivityReq.TYPE_SUBSCRIBE_MANAGER_ACTIVITY)跳转到管理订阅页   3(StartIapActivityReq.TYPE_SUBSCRIBE_EDIT_ACTIVITY)跳转到管理订阅页
                 * @param productId type为3时候使用
                 */
                startIapActivity(type: number, productId: string | null): void;
                /**
                  * @internal
                 */
                private _startIapActivityCallBack;
            }
            const iapService: HmsIapService;
        }
    }
}
