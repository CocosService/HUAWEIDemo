/**
 * @internal
 */
declare const jsb: {
    reflection: {
        callStaticMethod: (...args: any) => any;
    };
};
/**
 * @internal
 */
declare const cc: any;
declare namespace huawei {
    namespace agc {
        namespace apms {
            class AGCAPMSBaseService {
                static callStaticMethod(...args: (number | boolean | String)[]): any;
            }
            class AGCAPMSService extends AGCAPMSBaseService {
                private cls_ServiceAGCAPMS;
                support: boolean;
                /**
                * @en
                * Enables or disables APM. If this parameter is set to false, APM stops collecting app performance data. The default value is true.
                * @zh
                * APM 性能服务开关。设置为 false 时，APM 会停止采集应用性能数据。默认取值 true
                * @param enable enable
                * @example
                * ```
                * huawei.AGC.apms.enableCollection(true);
                * ```
                */
                enableCollection(enable: boolean): void;
                /**
                 * @en
                 * Start custom tracking records
                 * @zh
                 * 启动自定义跟踪记录
                 * @param name Record name
                 * @example
                 * ```
                 * huawei.AGC.apms.startCustomTrace("traceID");
                 * ```
                 */
                startCustomTrace(name: String): void;
                /**
                 * @en
                 * Stop custom tracking records
                 * @zh
                 * 停止自定义跟踪记录
                 * @param name Record name
                 * @example
                 * ```
                 * huawei.AGC.apms.stopCustomTrace("traceID");
                 * ```
                 */
                stopCustomTrace(name: String): void;
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
                 * huawei.AGC.apms.putCustomTracePropert(traceID, pName, pValue);
                 * ```
                 */
                putCustomTraceProperty(name: String, propertyName: String, propertyValue: String): void;
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
                 * huawei.AGC.apms.removeCustomTraceProperty(traceID, pName);
                 * ```
                 */
                removeCustomTraceProperty(name: String, propertyName: String): void;
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
                 * let propertValue = huawei.AGC.apms.getCustomTraceProperty(traceID, pName);
                 * console.log("pValue = ", propertValue);
                 * ```
                 */
                getCustomTraceProperty(name: String, propertyName: String): String;
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
                 * huawei.AGC.apms.incrementCustomTraceMeasure (traceID, mName, mValue);
                 * ```
                 */
                incrementCustomTraceMeasure(name: String, measureName: String, measureValue: number): void;
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
                 * let measureValue = huawei.AGC.apms.getCustomTraceMeasure(traceID, mName);
                 * console.log("mValue = ", measureValue);
                 * ```
                 */
                getCustomTraceMeasure(name: String, measureName: String): number;
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
                 * huawei.AGC.apms.putCustomTraceMeasure (traceID, mName, mValue);
                 * ```
                 */
                putCustomTraceMeasure(name: String, measureName: String, measureValue: number): void;
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
                 * let tProp = huawei.AGC.apms.getCustomTraceProperties(traceID);
                 * console.log("tProp = ", JSON.stringify(tProp));
                 * ```
                 */
                getCustomTraceProperties(name: String): any;
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
                 * let id = huawei.AGC.apms.initNetworkMeasure(url, "POST");
                 * console.log("createNetworkMeasure, id = ", id);
                 * ```
                 */
                initNetworkMeasure(url: String, httpMethod: String): String;
                /**
                 * @en
                 * Set the request start time
                 * @zh
                 * 设置请求开始时间
                 * @param id Network request id
                 * @example
                 * ```
                 * huawei.AGC.apms.startNetworkMeasure(id);
                 * ```
                 */
                startNetworkMeasure(id: String): void;
                /**
                 * @en
                 * Set the request end time, and report the network request indicators and custom attribute data.
                 * @zh
                 * 设置请求结束时间，并上报网络请求指标及自定义属性数据
                 * @param id Network request id
                 * @example
                 * ```
                 * huawei.AGC.apms.stopNetworkMeasure(id);
                 * ```
                 */
                stopNetworkMeasure(id: String): void;
                /**
                 * @en
                 * Set the response code of the request
                 * @zh
                 * 设置请求的响应码
                 * @param id         Network request id
                 * @param statusCode Request response status code
                 * @example
                 * ```
                 * huawei.AGC.apms.setNetworkMeasureStatusCode(id, 500);
                 * ```
                 */
                setNetworkMeasureStatusCode(id: String, statusCode: number): void;
                /**
                 * @en
                 * Set the request body size
                 * @zh
                 * 设置请求体大小
                 * @param id     Network request id
                 * @param length Request body size
                 * @example
                 * ```
                 * huawei.AGC.apms.setNetworkMeasureBytesSent(id, 10000);
                 * ```
                 */
                setNetworkMeasureBytesSent(id: String, length: number): void;
                /**
                 * @en
                 * Set the response body size
                 * @zh
                 * 设置响应体大小
                 * @param id     Network request id
                 * @param length Response body size
                 * @example
                 * ```
                 * huawei.AGC.apms.setNetworkMeasureBytesReceived(id, 10000);
                 * ```
                 */
                setNetworkMeasureBytesReceived(id: String, length: number): void;
                /**
                 * @en
                 * Set the response body contentType type
                 * @zh
                 * 设置响应体 contentType 类型
                 * @param id          Network request id
                 * @param contentType Response body contentType
                 * @example
                 * ```
                 * huawei.AGC.apms.setNetworkMeasureContentType(id, "contentType1");
                 * ```
                 */
                setNetworkMeasureContentType(id: String, contentType: String): void;
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
                 * huawei.AGC.apms.putNetworkMeasureProperty(id, pName, pValue);
                 * ```
                 */
                putNetworkMeasureProperty(id: String, propertyName: String, propertyValue: String): void;
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
                 * huawei.AGC.apms.removeNetworkMeasureProperty(id, pName);
                 * ```
                 */
                removeNetworkMeasureProperty(id: String, propertyName: String): void;
                /**
                 * @en
                 * Obtains all attributes from a NetworkMeasure instance
                 * @zh
                 * 从 NetworkMeasure 实例中获取所有属性
                 * @param id           Network request id
                 * @param propertyName Custom attribute name
                 * @returns            Custom attribute value
                 * @example
                 * ```
                 * let pName = "propName";
                 * let nMeasure = huawei.AGC.apms.removeNetworkMeasureProperty(id, pName);
                 * console.log("nMeasure = ", JSON.stringify(nMeasure));
                 * ```
                 */
                getNetworkMeasureProperty(id: String, propertyName: String): String;
                /**
                 * @en
                 * Get all attributes from the NetworkMeasure instance
                 * @zh
                 * 获取自定义属性值
                 * @param id Network request id
                 * @returns  Store all attribute key-value pairs
                 * @example
                 * ```
                 * let mProp = huawei.AGC.apms.getNetworkMeasureProperties(id);
                 * console.log("mProp = ", mProp);
                 * ```
                 */
                getNetworkMeasureProperties(id: String): any;
            }
            const apmsService: AGCAPMSService;
        }
    }
}
