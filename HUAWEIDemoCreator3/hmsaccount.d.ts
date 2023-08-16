declare const cc: any;
declare const JavascriptJavaBridge: any;
declare namespace huawei {
    namespace hms {
        namespace account {
            /**
             * @en
             * Enum for analytics event listener.
             * @zh
             * 异步 API 调用的回调事件名称定义。
             */
            enum API_EVENT_LIST {
                debugApiResult = "debugApiResult",
                loginCallback = "loginCallback",
                logoutCallback = "logoutCallback",
                cancelAuthorizationCallback = "cancelAuthorizationCallback"
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
            class HmsAccountService {
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
                 * 登陆
                 * @param type AuthorizationCode ｜ IDToken ｜ Silent
                */
                login(type: string): void;
                /**
                 * @internal
                */
                loginCallback(result: any): void;
                /**
                 * 退出账号
                */
                logout(): void;
                /**
                 * @internal
                */
                logoutCallback(result: any): void;
                /**
                 * 取消授权
                */
                cancelAuthorization(): void;
                /**
                 * @internal
                */
                cancelAuthorizationCallback(result: any): void;
            }
            const accountService: HmsAccountService;
        }
    }
}
