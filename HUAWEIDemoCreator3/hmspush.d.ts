declare const cc: any;
declare const JavascriptJavaBridge: any;
declare namespace huawei {
    namespace hms {
        namespace push {
            /**
             * @en
             * Enum for analytics event listener.
             * @zh
             * 异步 API 调用的回调事件名称定义。
             */
            enum API_EVENT_LIST {
                getOdidCallback = "getOdidCallback",
                getAAIDCallback = "getAAIDCallback",
                getTokenCallback = "getTokenCallback",
                getTokenBySubjectIdCallback = "getTokenBySubjectIdCallback",
                debugApiResult = "debugApiResult"
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
            class HmsPushService {
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
                 * @param strResult object
                 */
                debugApiResult(strResult: any): void;
                /**
                 * 开始推送
                 * 调用 SDK 的开始或注册推送方法，在成功回调中获取推送 Token。
                */
                startPush(appId: string): void;
                /**
                 * 关闭推送
                 * 调用 SDK 的关闭推送方法。
                */
                closePush(appId: string): void;
                /**
                 * 设置别名
                 * 调用 SDK 的设置别名方法。
                */
                setAlias(params: string): void;
                /**
                 * 删除别名
                 * 调用 SDK 的删除别名方法。
                */
                delAlias(params: string): void;
                /**
                 * 调用 SDK 的设置标签方法
                */
                setTag(tag: string): void;
                /**
                 * 删除标签 调用 SDK 的删除标签方法
                */
                delTag(tag: string): void;
                /**
                 * 异步任务打开接收通知栏消息开关
                */
                turnOnPush(): void;
                /**
                 * 异步任务关闭接收通知栏消息开关。
                */
                turnOffPush(): void;
                /**
                 * 华为Push服务器通过HTTPS方式调用此接口给您的服务器推送上行消息。
                 * params：json 序列化后的数据
                */
                sendMessage(params: string): void;
                /**
                 * 异步任务获取ODID
                */
                getOdid(): void;
                /**
                 * @internal
                 */
                getOdidCallback(result: any): void;
                /**
                 * 异步任务获取AAID
                */
                getAAID(): void;
                /**
                 * @internal
                 */
                getAAIDCallback(result: any): void;
                /**
                 * 删除本地生成的AAID与时间戳并同步删除已生成的与本AAID相关的所有Token。
                */
                deleteAAID(): void;
                /**
                 * 获取是否启用自动初始化功能。
                */
                isAutoInitEnabled(): boolean;
                /**
                 * 设置自动初始化使能与否。
                */
                setAutoInitEnabled(enable: boolean): void;
                /**
                 * 获取接入推送服务所需的Token。
                */
                getToken(appId: string): void;
                /**
                 * @internal
                 */
                getTokenCallback(result: any): void;
                /**
                 * 多发送者场景下，目标应用为发送者注销Token的方法
                */
                getTokenBySubjectId(subjectId: string): void;
                /**
                 * @internal
                 */
                getTokenBySubjectIdCallback(result: any): void;
                /**
                 * 删除Token。
                 */
                deleteToken(appId: string): void;
                /**
                 * 多发送者场景下，目标应用为发送者注销Token的方法。
                */
                deleteTokenBySubjectId(subjectId: string): void;
                /**
                 * 判断当前终端设备是否支持帐号校验功能。
                */
                isSupportProfile(): boolean;
                /**
                 * 添加当前设备上该用户与应用的关系。
                */
                addProfile(params: string): void;
                /**
                 * 清除当前设备上该用户与应用的关系。
                */
                deleteProfile(params: string): void;
            }
            const pushService: HmsPushService;
        }
    }
}
