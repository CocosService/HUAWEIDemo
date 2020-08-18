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
        namespace rc {
            /**
             * @en
             * Remote Config result code
             * @zh
             * 远程配置结果回调枚举值
             */
            enum RemoteConfigRetCode {
                /**
                 * @en
                 * fetch remote config success
                 * @zh
                 * 获取远程配置成功
                 */
                FETCH_SUCCESS = 1000,
                /**
                 * @en
                 * fetch remote config failed
                 * @zh
                 * 获取远程配置失败
                 */
                FETCH_FAILED = 1100
            }
            /**
             * @en
             * Remote config value source
             * @zh
             * 远程配置获取 value 值来源
             */
            enum RemoteConfigSource {
                /**
                 * @en
                 * The obtained value is the default value of a type.
                 * @zh
                 * 获取的 value 值是类型默认值
                 */
                STATIC = 0,
                /**
                 * @en
                 * The obtained value is the local default value.
                 * @zh
                 * 获取的 value 值是本地默认值
                 */
                DEFAULT = 1,
                /**
                 * @en
                 * The obtained value is the value in Remote Configuration.
                 * @zh
                 * 获取的 value 值是云端值
                 */
                REMOTE = 2
            }
            /**
             * @en
             * The Remote Config listener interface
             * @zh
             * 远程配置监听接口
             */
            interface RemoteConfigListener {
                (retCode: number, msg: string): void;
            }
            class AGCRCBaseService {
                static callStaticMethod(...args: (number | boolean | string)[]): any;
            }
            class AGCRCService extends AGCRCBaseService {
                private cls_ServiceAGCRemoteConfig;
                support: boolean;
                listener: RemoteConfigListener;
                /**
                 * @en
                 * set the listener for remote config
                 * @zh
                 * 设置远程配置监听
                 * @param {RemoteConfigListener} listener remote config listener
                 */
                setRemoteConfigListener(listener: RemoteConfigListener): void;
                /**
                 * @en
                 * `fetched()` + `apply()` methods, fetches latest parameter values from Remote Configuration at a customized interval **and applies parameter values**. If the method is called within an interval, cached data is returned. The unit is seconds. Default intervalSeconds is -1.
                 * @zh
                 * `fetched()` + `apply()` 方法，从云测获取最新的配置数据，由参数传入间隔时间，间隔内返回缓存数据，**并生效配置参数**。单位是秒，默认 intervalSeconds 为 -1.
                 * @param {number} intervalSeconds Interval for fetching data.
                 * @example
                 * ```
                 * huawei.AGC.remoteConfig.fetchAndApply();
                 * ```
                 */
                fetchAndApply(intervalSeconds?: number): void;
                /**
                 * @en
                 * Fetches latest parameter values from Remote Configuration at a customized interval. If the method is called within an interval, cached data is returned. The unit is seconds. Default intervalSeconds is -1.
                 * @zh
                 * 从云测获取最新的配置数据，由参数传入间隔时间，间隔内返回缓存数据。单位是秒，默认 intervalSeconds 为 -1.
                 * @param {number} intervalSeconds Interval for fetching data.
                 */
                fetch(intervalSeconds?: number): void;
                /**
                 * @en
                 * `loadLastFetched()` + `apply()` methods, obtains the cached data that is successfully fetched last time **and applies parameter values**.
                 * @zh
                 * `loadLastFetched()` + `apply()` 方法，获取最近一次拉取成功的缓存数据，**并生效配置参数**。
                 */
                applyLastFetched(): void;
                /**
                 * @en
                 * Returns the value of the boolean type for a key.
                 * @zh
                 * 返回 Key 对应的 Boolean 类型的 Value 值
                 * @param {String} key Key of a parameter specified in Remote Configuration.
                 * @return {Boolean} Value
                 */
                getValueAsBoolean(key: string): boolean;
                /**
                 * @en
                 * Returns the value of the Double (Java side) type for a key.
                 * @zh
                 * 返回 Key 对应的 Java 侧 Double 类型的 Value 值
                 * @param {String} key Key of a parameter specified in Remote Configuration.
                 * @return {number} Value
                 */
                getValueAsDouble(key: string): number;
                /**
                 * @en
                 * Returns the value of the Long (Java side) type for a key.
                 * @zh
                 * 返回 Key 对应的 Java 侧 Long 类型的 Value 值
                 * @param {String} key Key of a parameter specified in Remote Configuration.
                 * @return {number} Value
                 */
                getValueAsLong(key: string): number;
                /**
                 * @en
                 * Returns the value of the string type for a key.
                 * @zh
                 * 返回 Key 对应的 String 类型的 Value 值
                 * @param {String} key Key of a parameter specified in Remote Configuration.
                 * @return {String} Value
                 * @example
                 * ```
                 * let value = huawei.AGC.remoteConfig.getValueAsString('test');
                 * cc.log('Get config by key : test, value :' + value);
                 * ```
                 */
                getValueAsString(key: string): string;
                /**
                 * @en
                 * Returns all values obtained after the combination of the default values and values in Remote Configuration.
                 * @zh
                 * 返回默认值和云端值合并后的所有值
                 * @return {any} All values merged
                 * @example
                 * ```
                 * let values = huawei.AGC.remoteConfig.getMergedAll();
                 * cc.log('Get all configs : ' + JSON.stringify(values));
                 * ```
                 */
                getMergedAll(): any;
                /**
                 * @en
                 * Returns the source of a key.
                 * @zh
                 * 返回 Key 对应的来源
                 * @param {String} key Key of a parameter specified in Remote Configuration.
                 * @return {number} Source of the key
                 */
                getSource(key: string): number;
                /**
                 * @en
                 * Clears all cached data, including the data fetched from Remote Configuration and the default values passed.
                 * @zh
                 * 清除所有的缓存数据，包括从云测拉取的数据和传入的默认值
                 */
                clearAll(): void;
                /**
                 * @en
                 * Enables the developer mode, in which the number of times that the client obtains data from Remote Configuration is not limited, and traffic control is still performed over the cloud.
                 * @zh
                 * 设置开发者模式，将不限制客户端获取数据的次数，云测仍将进行流控
                 * @param {Boolean} isDeveloperMode Indicates whether to enable the developer  mode.
                 */
                setDeveloperMode(isDeveloperMode: boolean): void;
                onRemoteConfigResult(retCode: number, msg: string): void;
            }
            const rcService: AGCRCService;
        }
    }
}
