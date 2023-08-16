declare const cc: any;
declare const JavascriptJavaBridge: any;
declare namespace huawei {
    namespace agc {
        namespace apms {
            /**
             * @en
             * Enum for analytics event listener.
             * @zh
             * 异步 API 调用的回调事件名称定义。
             */
            enum API_EVENT_LIST {
                /**
                 * @en
                 * The callback to get AAID.
                 * @zh
                 *
                 */
                fetchApmsLogCallback = "fetchApmsLogCallback"
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
            class ApmsResult {
                originData: Object;
                code: StatusCode;
                errMsg?: string;
                data?: any;
                constructor(originData: any);
            }
            /**
             * @en
             * [Class for HMS Analytics, provides public methods to report user behavior data. This class uses the singleton pattern, don't instantiate this class, use huawei.hms.analytics.analyticsService instead.](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/android-api-hianalytics-instance-0000001050987219-V5)
             * @zh
             * [分析服务类，提供上报用户行为数据的公共方法。该类使用了单例模式，请不要实例化该类，直接使用huawei.hms.analytics.analyticsService即可。](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References-V5/android-api-hianalytics-instance-0000001050987219-V5)
             */
            class AGCAPMSService {
                private eventHandler;
                constructor();
                /**
                 * @en
                 * Add event listener.
                 * @zh
                 * 持续监听事件。
                 * @param eventName - Event name.
                 * @param cb - Event callback.
                 * @param target - Target node.
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.on(huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_USER_PROFILES, (result) => {
                 *     // TODO
                 * }
                 * ```
                 */
                on(eventName: string, cb: (result: ApmsResult) => void, target?: any): void;
                /**
                 * @en
                 * Add event listener (once only).
                 * @zh
                 * 监听一次事件。
                 * @param eventName - Event name.
                 * @param cb - Event callback.
                 * @param target - Target node.
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.once(huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_USER_PROFILES, (result) => {
                 *     // TODO
                 * }
                 * ```
                 */
                once(eventName: string, cb: (result: ApmsResult) => void, target?: any): void;
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
                 * @param target - Target node.
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.off(huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_USER_PROFILES, (result) => {
                 *     // TODO
                 * }
                 * ```
                 */
                off(eventName: string, cb: (result: ApmsResult) => void, target: any): void;
                /**
                 * @en
                 * Remove all event listener of the target node.
                 * @zh
                 * 取消某个节点所有的事件监听。
                 * @param targetNode
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.targetOff(this);
                 * ```
                 */
                targetOff(targetNode: any): void;
                /**
               * @en
               * Enables or disables APM. If this parameter is set to false, APM stops collecting app performance data. The default value is true.
               * @zh
               * APM 性能服务开关。设置为 false 时，APM 会停止采集应用性能数据。默认取值 true
               * @param enable enable
               * @example
               * ```
               * huawei.agc.apms.apmsService.enableCollection(true);
               * ```
               */
                enableCollection(enable: boolean): void;
                /**
                 * @en
                 * Sets whether to enable the ANR monitoring function. The default value is true, indicating that ANR monitoring is enabled, and data is reported. To disable ANR monitoring, set this parameter to false
                 * @zh
                 * 设置APM服务开关。开关的默认值为true（打开），表示启用APM应用性能数据采集。如果需要停用APM应用性能数据采集，可将开关值设为false（关闭）
                 * @param enable enable
                 * @example
                 * ```
                 * huawei.agc.apms.apmsService.enableAnrMonitor(true);
                 * ```
                 */
                enableAnrMonitor(enable: boolean): void;
                /**
                 * @en
                 * Start custom tracking records
                 * @zh
                 * 启动自定义跟踪记录
                 * @param name Record name
                 * @example
                 * ```
                 * huawei.agc.apms.apmsService.startCustomTrace("traceID");
                 * ```
                 */
                startCustomTrace(name: string): void;
                /**
                 * @en
                 * Stop custom tracking records
                 * @zh
                 * 停止自定义跟踪记录
                 * @param name Record name
                 * @example
                 * ```
                 * huawei.agc.apms.apmsService.stopCustomTrace("traceID");
                 * ```
                 */
                stopCustomTrace(name: string): void;
                /**
                 * @en
                 * Set custom trace record attribute name and attribute value. Each CustomTrace instance can only set up to 5 custom attributes.
                 * @zh
                 * 设置自定义跟踪记录属性名称和属性值
                 * @param name          Record name
                 * @param propertyName  Custom attribute name can only be composed of Chinese, letters (not case sensitive), numbers and underscores, and the length is not more than 40 characters
                 * @param propertyValue Custom attribute values can only be composed of Chinese, letters (not case sensitive), numbers, and underscores, and the length does not exceed 100 characters
                 * @example
                 * ```
                 * let traceID = "testTrace";
                 * let pName = "product";
                 * let pValue = "food";
                 *
                 * huawei.agc.apms.apmsService.putCustomTraceProperty(traceID, pName, pValue);
                 * ```
                 */
                putCustomTraceProperty(name: string, propertyName: string, propertyValue: string): void;
                /**
                 * @en
                 * Remove the existing attribute from the CustomTrace instance.
                 * @zh
                 * 从 CustomTrace 实例中移除已存在属性
                 * @param name         Record name
                 * @param propertyName The name of the attribute to be removed
                 * @example
                 * ```
                 * let traceID = "testTrace";
                 * let pName = "product";
                 *
                 * huawei.agc.apms.apmsService.removeCustomTraceProperty(traceID, pName);
                 * ```
                 */
                removeCustomTraceProperty(name: string, propertyName: string): void;
                /**
                 * @en
                 * Get custom attribute values.
                 * @zh
                 * 获取自定义属性值
                 * @param name         Record name
                 * @param propertyName Custom attribute name
                 * @returns            Custom attribute value
                 * @example
                 * ```
                 * let traceID = "testTrace";
                 * let pName = "product";
                 * let propertValue = huawei.agc.apms.apmsService.getCustomTraceProperty(traceID, pName);
                 * console.log("pValue = ", propertValue);
                 * ```
                 */
                getCustomTraceProperty(name: string, propertyName: string): string;
                /**
                 * @en
                 * Increase the index value of the custom tracking index. If the indicator does not exist, a new indicator will be created. If the custom tracking record is not started or stopped, the interface does not take effect.
                 * @zh
                 * 增加自定义跟踪记录指标的指标值。如果指标不存在，将创建一个新指标。如果自定义跟踪记录未启动或已停止，接口不生效。
                 * @param name         Record name
                 * @param measureName  The name of the custom tracking indicator to increase the value of the indicator
                 * @param measureValue Increased index value
                 * @example
                 * ```
                 * let traceID = "testTrace";
                 * let mName = "MeasureName";
                 * let mValue = 12000;
                 *
                 * huawei.agc.apms.apmsService.incrementCustomTraceMeasure (traceID, mName, mValue);
                 * ```
                 */
                incrementCustomTraceMeasure(name: string, measureName: string, measureValue: number): void;
                /**
                 * @en
                 * Get custom tracking index values.
                 * @zh
                 * 获取自定义属性值
                 * @param name        Record name
                 * @param measureName Custom record tracking indicator name
                 * @returns Custom tracking index value
                 * @example
                 * ```
                 * let traceID = "testTrace";
                 * let mName = "MeasureName";
                 *
                 * let measureValue = huawei.agc.apms.apmsService.getCustomTraceMeasure(traceID, mName);
                 * console.log("mValue = ", measureValue);
                 * ```
                 */
                getCustomTraceMeasure(name: string, measureName: string): number;
                /**
                 * @en
                 * Add custom tracking metrics. If the indicator already exists, update the value of the indicator.
                 * @zh
                 * 添加自定义跟踪记录指标。如果指标已经存在，则更新指标的值
                 * @param name         Record name
                 * @param measureName  Custom record tracking metric name
                 * @param measureValue Custom tracking index value
                 * @example
                 * ```
                 * let traceID = "testTrace";
                 * let mName = "MeasureName";
                 * let mValue = 12000;
                 *
                 * huawei.agc.apms.apmsService.putCustomTraceMeasure (traceID, mName, mValue);
                 * ```
                 */
                putCustomTraceMeasure(name: string, measureName: string, measureValue: number): void;
                /**
                 * @en
                 * Get all the attributes of the custom tracking record.
                 * @zh
                 * 获取自定义跟踪记录的所有属性
                 * @param name Record name
                 * @returns    Store all attribute key-value pairs
                 * @example
                 * ```
                 * let traceID = "testTrace";
                 *
                 * let tProp = huawei.agc.apms.apmsService.getCustomTraceProperties(traceID);
                 * console.log("tProp = ", JSON.stringify(tProp));
                 * ```
                 */
                getCustomTraceProperties(name: string): any;
                /**
                 * @en
                 * Create a network request indicator instance for collecting network performance data.
                 * @zh
                 * 创建网络请求指标实例，用于监控网络请求性能
                 * @param url        Network request URL address.
                 * @param httpMethod Request method, only supports GET, PUT, POST, DELETE, HEAD, PATCH, OPTIONS, TRACE or CONNECT methods.
                 * @returns          Current network request id
                 * @example
                 * ```
                 * let id = huawei.agc.apms.apmsService.initNetworkMeasure(url, "POST");
                 * console.log("createNetworkMeasure, id = ", id);
                 * ```
                 */
                initNetworkMeasure(url: string, httpMethod: string): string;
                /**
                 * @en
                 * Set the request start time
                 * @zh
                 * 设置请求开始时间
                 * @param id Network request id
                 * @example
                 * ```
                 * huawei.agc.apms.apmsService.startNetworkMeasure(id);
                 * ```
                 */
                startNetworkMeasure(id: string): void;
                /**
                 * @en
                 * Set the request end time, and report the network request indicators and custom attribute data.
                 * @zh
                 * 设置请求结束时间，并上报网络请求指标及自定义属性数据
                 * @param id Network request id
                 * @example
                 * ```
                 * huawei.agc.apms.apmsService.stopNetworkMeasure(id);
                 * ```
                 */
                stopNetworkMeasure(id: string): void;
                /**
                 * @en
                 * Set the response code of the request
                 * @zh
                 * 设置请求的响应码
                 * @param id         Network request id
                 * @param statusCode Request response status code
                 * @example
                 * ```
                 * huawei.agc.apms.apmsService.setNetworkMeasureStatusCode(id, 500);
                 * ```
                 */
                setNetworkMeasureStatusCode(id: string, statusCode: number): void;
                /**
                 * @en
                 * Set the request body size
                 * @zh
                 * 设置请求体大小
                 * @param id     Network request id
                 * @param length Request body size
                 * @example
                 * ```
                 * huawei.agc.apms.apmsService.setNetworkMeasureBytesSent(id, 10000);
                 * ```
                 */
                setNetworkMeasureBytesSent(id: string, length: number): void;
                /**
                 * @en
                 * Set the response body size
                 * @zh
                 * 设置响应体大小
                 * @param id     Network request id
                 * @param length Response body size
                 * @example
                 * ```
                 * huawei.agc.apms.apmsService.setNetworkMeasureBytesReceived(id, 10000);
                 * ```
                 */
                setNetworkMeasureBytesReceived(id: string, length: number): void;
                /**
                 * @en
                 * Set the response body contentType type
                 * @zh
                 * 设置响应体 contentType 类型
                 * @param id          Network request id
                 * @param contentType Response body contentType
                 * @example
                 * ```
                 * huawei.agc.apms.apmsService.setNetworkMeasureContentType(id, "contentType1");
                 * ```
                 */
                setNetworkMeasureContentType(id: string, contentType: string): void;
                /**
                 * @en
                 * Set the custom attribute name and attribute value of the network request. Each NetworkMeasure instance can only set up to 5 custom attributes.
                 * @zh
                 * 设置网络请求的自定义属性名称和属性值。每个 NetworkMeasure 实例最多只能设置 5 个自定义属性
                 * @param id            Network request id
                 * @param propertyName  Custom attribute names can only be composed of Chinese, letters (not case sensitive), numbers, and underscores, and the length cannot exceed 40 characters
                 * @param propertyValue Custom attribute values can only be composed of Chinese, letters (not case sensitive), numbers, and underscores, and the length cannot exceed 100 characters
                 * @example
                 * ```
                 * var pName = "propName";
                 * var pValue = "12000";
                 * huawei.agc.apms.apmsService.putNetworkMeasureProperty(id, pName, pValue);
                 * ```
                 */
                putNetworkMeasureProperty(id: string, propertyName: string, propertyValue: string): void;
                /**
                 * @en
                 * Remove the existing attribute from the NetworkMeasure instance.
                 * @zh
                 * 从 NetworkMeasure 实例中移除已存在属性
                 * @param id           Network request id
                 * @param propertyName The name of the attribute to be removed
                 * @example
                 * ```
                 * var pName = "propName";
                 * huawei.agc.apms.apmsService.removeNetworkMeasureProperty(id, pName);
                 * ```
                 */
                removeNetworkMeasureProperty(id: string, propertyName: string): void;
                /**
                 * @en
                 * Obtains a custom attribute value.
                 * @zh
                 * 从 NetworkMeasure 实例中获取指定属性
                 * @param id           Network request id
                 * @param propertyName Custom attribute name
                 * @returns            Custom attribute value
                 * @example
                 * ```
                 * let pName = "propName";
                 * let nMeasure = huawei.agc.apms.apmsService.getNetworkMeasureProperty(id, pName);
                 * console.log("nMeasure = ", nMeasure);
                 * ```
                 */
                getNetworkMeasureProperty(id: string, propertyName: string): string;
                /**
                 * @en
                 * Get all attributes from the NetworkMeasure instance
                 * @zh
                 * 从 NetworkMeasure 实例中获取所有属性
                 * @param id Network request id
                 * @returns  Store all attribute key-value pairs
                 * @example
                 * ```
                 * let mProp = huawei.agc.apms.apmsService.getNetworkMeasureProperties(id);
                 * console.log("mProp = ", mProp);
                 * ```
                 */
                getNetworkMeasureProperties(id: string): any;
                /**
                 * @en
                 * Binds a user ID to the reported data. When the performance data is reported, the user ID is also reported to facilitate fault locating
                 * @zh
                 * 为上报数据绑定用户标识，性能数据上报时会一并上报该用户标识，方便单用户问题定位
                 * @param userIdentifier the identifier of the user
                 * @example
                 * ```
                 * huawei.agc.apms.apmsService.setUserIdentifier("475f5afaxxxxx");
                 * ```
                 */
                setUserIdentifier(userIdentifier: string): void;
                /**
                 * 自定义日志打印实例，支持打印的日志被日志回捞任务拉取。
                 * 创建成功后 调用setApmsLog写入日志
                 * @returns 是否成功
                */
                createApmsLog(): boolean;
                /**
                 * 写入自定义日志
                 * @param type verbose | debug | info | warn | error
                 * @param tag
                 * @param msg msg
                 * @returns 是否成功
                */
                setApmsLog(type: string, tag: string, msg: string): boolean;
                /**
                 * 将日志缓存到本地文件。
                 */
                flushApmsLog(): void;
                /**
                 * 释放实例，释放后日志打印功能不可用。
                 */
                releaseApmsLog(): void;
                /**
                 * 拉取回捞任务。
                 */
                fetchApmsLog(): void;
                /**
                 * 拉取回捞任务。
                 * @internal
                 */
                fetchApmsLogCallback(result: any): void;
                /**
                 * 同意执行日志回捞任务，将会根据回捞任务配置上传日志。
                 */
                grantApmsLog(): void;
                /**
                 * 拒绝执行日志回捞任务，拒绝的任务将不再提示。
                 */
                denyApmsLog(): void;
                /**
                 * 设置是否已同意用户隐私协议。在Application的onCreate方法中调用，如果尚未同意或者已拒绝用户隐私协议，须在同意用户隐私协议之后再调用一次该接口。
                 * @param isAgreed 是否已同意用户隐私协议。 true：表示已同意。false：表示尚未同意或者已拒绝。
                */
                setUserPrivacyAgreed(isAgreed: boolean): void;
            }
            const apmsService: AGCAPMSService;
        }
    }
}
