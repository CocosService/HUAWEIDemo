declare namespace huawei {
    namespace AGC {
        namespace remoteConfig {
            /**
             * Remote Config result code
             */
            enum RemoteConfigRetCode {
                /**
                 * fetch remote config success
                 */
                FETCH_SUCCESS = 1000,
                /**
                 * fetch remote config failed
                 */
                FETCH_FAILED = 1100
            }
            /**
             * Remote Config valete souece
             */
            enum RemoteConfigSource {
                /**
                 * The obtained value is the default value of a type.
                 */
                STATIC = 0,
                /**
                 * The obtained value is the local default value.
                 */
                DEFAULT = 1,
                /**
                 * The obtained value is the value in Remote Configuration.
                 */
                REMOTE = 2
            }
            /**
             * The Remote Config listener infterface
             */
            interface RemoteConfigListener {
                (retCode: number, msg: string): void;
            }
            /**
             * set the listener for remote config
             * @param {RemoteConfigListener} listener remote config listener
             */
            function setRemoteConfigListener(listener: RemoteConfigListener): void;
            /**
             * Fetches latest parameter values from Remote Configuration at a customized interval and applies parameter values.
             * If the method is called within an interval, cached data is returned. The unit is seconds.
             * Default intervalSeconds is -1;
             * @param {number} intervalSeconds Interval for fetching data.
             */
            function fetchAndApply(intervalSeconds?: number): void;
            /**
             * Fetches latest parameter values from Remote Configuration at a customized interval.
             * If the method is called within an interval, cached data is returned. The unit is seconds.
             * Default intervalSeconds is -1;
             * @param {number} intervalSeconds Interval for fetching data.
             */
            function fetch(intervalSeconds?: number): void;
            /**
             * Obtains the cached data that is successfully fetched last time and applies parameter values.
             */
            function applyLastFetched(): void;
            /**
             * Returns the value of the boolean type for a key.
             * @param {Boolean} key Key of a parameter specified in Remote Configuration.
             */
            function getValueAsBoolean(key: String): Boolean;
            /**
             * Returns the value of the double type for a key.
             * @param {Boolean} key Key of a parameter specified in Remote Configuration.
             */
            function getValueAsDouble(key: String): Number;
            /**
             * Returns the value of the long type for a key.
             * @param {Boolean} key Key of a parameter specified in Remote Configuration.
             */
            function getValueAsLong(key: String): Number;
            /**
             * Returns the value of the string type for a key.
             * @param {Boolean} key Key of a parameter specified in Remote Configuration.
             */
            function getValueAsString(key: String): String;
            /**
             * Returns all values obtained after the combination of the default values and values in Remote Configuration.
             */
            function getMergedAll(): any;
            /**
             * Returns the source of a key.
             * @param key Key of a parameter specified in Remote Configuration.
             */
            function getSource(key: String): Number;
            /**
             * Clears all cached data, including the data fetched from Remote Configuration and the default values passed.
             */
            function clearAll(): void;
            /**
             * Enables the developer mode, in which the number of times that the client obtains data from Remote Configuration is not limited, and traffic control is still performed over the cloud.
             * @param {Boolean} isDeveloperMode Indicates whether to enable the developer  mode.
             */
            function setDeveloperMode(isDeveloperMode: Boolean): void;
        }
    }
}
