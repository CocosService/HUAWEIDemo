declare const cc: any;
declare const JavascriptJavaBridge: any;
declare namespace huawei {
    namespace hms {
        namespace location {
            /**
             * @en
             * Enum for analytics event listener.
             * @zh
             * 异步 API 调用的回调事件名称定义。
             */
            enum API_EVENT_LIST {
                /**
                 * @en
                 * enum of listener for `requestLocationPermission`
                 * @zh
                 * `requestLocationPermission` 的结果回调枚举值
                */
                HMS_LOCATION_PERMISSION = "HMS_LOCATION_PERMISSION",
                /**
                 * enum of listener for `getLocationAvailability`
                 * @zh
                 * `getLocationAvailability` 的结果回调枚举值
                */
                HMS_LOCATION_GET_LOCATION_AVAILABILITY = "HMS_LOCATION_GET_LOCATION_AVAILABILITY",
                /**
                 * @en
                 * enum of listener for `checkLocationSettings`
                 * @zh
                 * `checkLocationSettings` 的结果回调枚举值
                 */
                HMS_LOCATION_SETTINGS = "HMS_LOCATION_SETTINGS",
                /**
                 * @en
                 * enum of listener for `removeLocationUpdates`
                 * @zh
                 * `removeLocationUpdates` 的结果回调枚举值
                 */
                HMS_REMOVE_LOCATION_UPDATE = "HMS_REMOVE_LOCATION_UPDATE",
                /**
                 * @en
                 * enum of listener for `requestLocationUpdates`
                 * @zh
                 * `requestLocationUpdates` 的结果回调枚举值
                 */
                HMS_REQUEST_LOCATION_UPDATE = "HMS_REQUEST_LOCATION_UPDATE",
                /**
                 * @en
                 * enum of listener for `getLastLocation`
                 * @zh
                 * `getLastLocation` 的结果回调枚举值
                 */
                HMS_LAST_LOCATION = "HMS_LAST_LOCATION",
                /**
                 * @en
                 * enum of listener for location updates
                 * @zh
                 * 请求定位权限的回调枚举值
                 */
                HMS_LOCATION_UPDATES = "HMS_LOCATION_UPDATES",
                /**
                 * @en
                 * enum of listener for `setMockMode`
                 * @zh
                 * `setMockMode` 的结果回调枚举值
                 */
                HMS_MOCK_MODE = "HMS_MOCK_MODE",
                /**
                 * @en
                 * enum of listener for `setMockLocation`
                 * @zh
                 * `setMockLocation` 的结果回调枚举值
                 */
                HMS_MOCK_LOCATION = "HMS_MOCK_LOCATION",
                /**
                 * @en
                 * enum of listener for `requestRecognitionPermission`
                 * @zh
                 * `requestRecognitionPermission` 的结果回调枚举值
                 */
                HMS_RECOGNITION_PERMISSION = "HMS_RECOGNITION_PERMISSION",
                /**
                 * @en
                 * enum of listener for `createActivityIdentificationUpdates`
                 * @zh
                 * `createActivityIdentificationUpdates` 的结果回调枚举值
                 */
                HMS_CREATE_ACTIVITY_IDENTIFICATION_UPDATES = "HMS_CREATE_ACTIVITY_IDENTIFICATION_UPDATES",
                /**
                 * @en
                 * enum of listener for `deleteActivityIdentificationUpdates`
                 * @zh
                 * `deleteActivityIdentificationUpdates` 的结果回调枚举值
                 */
                HMS_DELETE_ACTIVITY_IDENTIFICATION_UPDATES = "HMS_DELETE_ACTIVITY_IDENTIFICATION_UPDATES",
                /**
                 * @en
                 * enum of listener for activity updates
                 * @zh
                 * 活动结果的更新（会多次回调回来）的回调枚举值
                 */
                HMS_ACTIVITY_UPDATES = "HMS_ACTIVITY_UPDATES",
                /**
                 * @en
                 * enum of listener for `createActivityConversionUpdates`
                 * @zh
                 * `createActivityConversionUpdates` 的结果回调枚举值
                 */
                HMS_CREATE_ACTIVITY_CONVERSION_UPDATES = "HMS_CREATE_ACTIVITY_CONVERSION_UPDATES",
                /**
                 * @en
                 * enum of listener for `deleteActivityConversionUpdates`
                 * @zh
                 * `deleteActivityConversionUpdates` 的结果回调枚举值
                 */
                HMS_DELETE_ACTIVITY_CONVERSION_UPDATES = "HMS_DELETE_ACTIVITY_CONVERSION_UPDATES",
                /**
                 * @en
                 * enum of listener for conversion updates
                 * @zh
                 * 触发活动识别（会触发多次）的回调枚举值
                 */
                HMS_CONVERSION_UPDATES = "HMS_CONVERSION_UPDATES",
                /**
                 * @en
                 * enum of listener for `createGeofenceList`
                 * @zh
                 * `createGeofenceList` 的结果回调枚举值
                 */
                HMS_CREATE_GEOFENCE_LIST = "HMS_CREATE_GEOFENCE_LIST",
                /**
                 * @en
                 * enum of listener for `removeWithID`
                 * @zh
                 * `removeWithID` 的结果回调枚举值
                 * 结果回调
                 */
                HMS_REMOVE_GEOFENCE_WITH_ID = "HMS_REMOVE_GEOFENCE_WITH_ID",
                /**
                 * @en
                 * enum of listener for
                 * @zh
                 * `removeWithIntent` 的结果回调枚举值
                 *                  */
                HMS_REMOVE_GEOFENCE_WITH_INTENT = "HMS_REMOVE_GEOFENCE_WITH_INTENT",
                /**
                 * @en
                 * enum of listener for receive geofence data
                 * @zh
                 * 触发地理围栏的回调（会多次触发）的回调枚举值
                 */
                HMS_RECEIVE_GEOFENCE_DATA = "HMS_RECEIVE_GEOFENCE_DATA",
                HMS_FLUSH_LOCATIONS = "HMS_FLUSH_LOCATIONS",
                HMS_GET_HWLOCATION = "HMS_GET_HWLOCATION"
            }
            /**
             * @en
             * The status code of callback from the java side.
             * @zh
             * 从 java 层返回的 callback 的状态。
             */
            enum LocationStatusCode {
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
            class LocationResult {
                originData: any;
                code: LocationStatusCode;
                errMsg?: string;
                data?: any;
                constructor(originData: any);
                toString(): string;
            }
            class HWLocation extends LocationResult {
                mLatitude: number;
                mLongitude: number;
                mAltitude: number;
                mSpeed: number;
                mBearing: number;
                mHorizontalAccuracyMeters: number;
                mVerticalAccuracyMeters: number;
                mSpeedAccuracyMetersPerSecond: number;
                mBearingAccuracyDegrees: number;
                mProvider: string;
                mTime: number;
                mElapsedRealtimeNanos: number;
                mCountryCode: string;
                mCountryName: string;
                mState: string;
                mCity: string;
                mCounty: string;
                mStreet: string;
                mFeatureName: string;
                mPostalCode: string;
                mPhone: string;
                mUrl: string;
                extraInfo: Object;
                constructor(data: any);
            }
            /**
             * @en
             * class for location result
             * @zh
             * 定位结果类，用于返回定位的结果
             */
            class Location extends LocationResult {
                /**
                 * @en
                 * longitude
                 * @zh
                 * 经度
                 */
                longitude: number;
                /**
                 * @en
                 * latitude
                 * @zh
                 * 纬度
                 */
                latitude: number;
                /**
                 * @en
                 * altitude
                 * @zh
                 * 高度（海拔）
                 */
                altitude: number;
                /**
                 * @en
                 * bearing
                 * @zh
                 * 方位
                 */
                bearing: number;
                constructor(originData: any);
            }
            /**
             * @en
             * [Class of Geofence event](https://developer.huawei.com/consumer/en/doc/development/HMS-References/geofencedata)
             * @zh
             * [地理围栏的返回结果类](https://developer.huawei.com/consumer/cn/doc/development/HMS-References/geofencedata)
             */
            class GeofenceCallback extends LocationResult {
                /**
                 * @en
                 * status code
                 * @zh
                 * 地理围返回状态
                 */
                status: number;
                /**
                 * @en
                 * error code
                 * @zh
                 * 错误码
                 */
                errorCode: number;
                /**
                 * @en
                 * convert type of a geofence
                 * @zh
                 * 地理围栏触发类型
                 */
                conversion: number;
                /**
                 * @en
                 * information about converted geofences
                 * @zh
                 * 地理围栏信息
                 */
                convertingGeofenceList: Array<string>;
                /**
                 * @en
                 * location information
                 * @zh
                 * 位置信息
                 */
                location: Location;
                constructor(originData: any);
            }
            /**
             @en
             * class for activity conversion event
             * @zh
             * 活动转换事件类
             */
            class Conversion {
                /**
                 * @en
                 * activity type
                 * @zh
                 * 活动类型
                 */
                activityType: number;
                /**
                 * @en
                 * conversion type
                 * @zh
                 * 活动转换类型
                 */
                conversionType: number;
                /**
                 * @en
                 * timestamp, in milliseconds
                 * @zh
                 * 活动转换触发时,自设备启动以来的毫秒数
                 */
                elapsedTimeFromReboot: number;
                constructor(activityType: number, conversionType: number, elapsedTimeFromReboot: number);
            }
            /**
             * @en
             * class for activity result
             * @zh
             * 活动结果类
             */
            class ConversionList extends LocationResult {
                conversionList: Array<Conversion>;
                constructor(originData: any);
            }
            /**
             * @en
             * [class for detecting the activity](https://developer.huawei.com/consumer/en/doc/development/HMS-References/activityidentificationdata)
             * @zh
             * [检测活动类型](https://developer.huawei.com/consumer/cn/doc/development/HMS-References/activityidentificationdata)
             */
            class ActivityIdentificationData {
                /**
                 * @en
                 * detected activity type
                 * @zh
                 * 检测到的活动类型
                 */
                identificationActivity: number;
                /**
                 * @en
                 * confidence
                 * @zh
                 * 置信度
                 */
                possibility: number;
                constructor(identificationActivity: number, possibility: number);
            }
            /**
             * @en
             * [activity identification response](https://developer.huawei.com/consumer/en/doc/development/HMS-References/activityidentificationresponse)
             * @zh
             * [活动识别结果类](https://developer.huawei.com/consumer/cn/doc/development/HMS-References/activityidentificationresponse)
             */
            class ActivityIdentificationResponse extends LocationResult {
                /**
                 * @en
                 * timestamp, in milliseconds
                 * @zh
                 * 识别结果触发时,自1970年1月1日00:00:00以来的毫秒数
                 */
                time: number;
                /**
                 * @en
                 * identification time, number of nanoseconds since boot
                 * @zh
                 * 识别结果触发时,自设备启动以来的纳秒数
                 */
                elapsedTimeFromReboot: number;
                /**
                 * @en
                 * Most possible activity identification in the period
                 * @zh
                 * 检测到的周期内的最有可能的活动
                 */
                mostActivityIdentificationData: ActivityIdentificationData;
                /**
                 * @en
                 * most possible activity identification in the period
                 * @zh
                 * 检测到的周期内的所有活动列表，按置信度排序
                 */
                activityIdentificationDatas: Array<ActivityIdentificationData>;
                constructor(originData: any);
            }
            /**
             * @en
             * [enum for activity identification](https://developer.huawei.com/consumer/en/doc/development/HMS-References/activityidentificationdata)
             * @zh
             * [活动的状态码](https://developer.huawei.com/consumer/cn/doc/development/HMS-References/activityidentificationdata)
             */
            enum ACTIVITY_IDENTIFICATION_ENUM {
                /**
                 * @en
                 * the device is in a vehicle, such as a car
                 * @zh
                 * 设备在车辆中，如汽车
                 */
                VEHICLE = 100,
                /**
                 * @en
                 * the device is on a bicycle
                 * @zh
                 * 设备在自行车上
                 */
                BIKE = 101,
                /**
                 * @en
                 * the device user is walking or running
                 * @zh
                 * 设备在行走或跑步
                 */
                FOOT = 102,
                /**
                 * @en
                 * the device is still
                 * @zh
                 * 设备静止
                 */
                STILL = 103,
                /**
                 * @en
                 * the current activity cannot be detected
                 * @zh
                 * 无法检测当前活动
                 */
                OTHERS = 104,
                /**
                 * @en
                 * the device has an obvious tilt change
                 * @zh
                 * 设备有明显的重力变化
                 */
                TILTING = 105,
                /**
                 * @en
                 * the device has an obvious tilt change
                 * @zh
                 * 设备的用户正在行走，这是FOOT的子活动
                 */
                WALKING = 107,
                /**
                 * @en
                 * the user of the device is walking,it is a sub-activity of FOOT
                 * @zh
                 * 设备的用户正在奔跑，这是FOOT的子活动
                 */
                RUNNING = 108
            }
            /**
             * @en
             * [enum for activity conversion type](https://developer.huawei.com/consumer/en/doc/development/HMS-References/activityconversioninfo#h1-1584413287298)
             * @zh
             * [活动转换的状态码](https://developer.huawei.com/consumer/cn/doc/development/HMS-References/activityconversioninfo#h1-1584413287298)
             */
            enum ACTIVITY_CONVERSION_TYPE {
                /**
                 * @en
                 * a user enters the given activity. The value is 0
                 * @zh
                 * 活动转换进入，取值为0
                 */
                ENTER_ACTIVITY_CONVERSION = 0,
                /**
                 * @en
                 * a user exits the given activity. The value is 1
                 * @zh
                 * 活动转换退出，取值为1
                 */
                EXIT_ACTIVITY_CONVERSION = 1
            }
            /**
             * @en
             * [activity conversion info](https://developer.huawei.com/consumer/en/doc/development/HMS-References/activityconversioninfo)
             * @zh
             * [活动转换](https://developer.huawei.com/consumer/cn/doc/development/HMS-References/activityconversioninfo)
             */
            class ConversionInfo {
                /**
                 * @en
                 * activity type
                 * @zh
                 * 活动类型
                 */
                activityType: ACTIVITY_IDENTIFICATION_ENUM;
                /**
                 * @en
                 * conversion type
                 * @zh
                 * 活动转换类型
                 */
                conversionType: ACTIVITY_CONVERSION_TYPE;
                constructor(type: ACTIVITY_IDENTIFICATION_ENUM, conversionType: ACTIVITY_CONVERSION_TYPE);
            }
            /**
             * @zh
             * 地理围栏，事件类型定义
             */
            enum GEOFENCE_TYPE {
                /**
                 * @en
                 * a user enters the geofence
                 * @zh
                 * 用户进入围栏
                 */
                ENTER_GEOFENCE_CONVERSION = 1,
                /**
                 * @en
                 * a user exits the geofence
                 * @zh
                 * 用户退出围栏
                 */
                EXIT_GEOFENCE_CONVERSION = 2,
                /**
                 * @en
                 * a user stays in the geofence
                 * @zh
                 * 用户驻留在围栏中
                 */
                DWELL_GEOFENCE_CONVERSION = 4,
                /**
                 * @en
                 * no timeout interval is configured for the geofence
                 * @zh
                 * 地理围栏无超时期限
                 */
                GEOFENCE_NEVER_EXPIRE = -1
            }
            /**
             * @en
             * Geofence event
             * @zh
             * 地理围栏事件
             */
            class GeofenceData {
                /**
                 * @en
                 * unique ID of a geofence
                 * @zh
                 * 请求唯一id
                 */
                uniqueId: string;
                /**
                 * @en
                 * conversion
                 * @zh
                 * 事件类型
                 */
                conversion: GEOFENCE_TYPE;
                /**
                 * @en
                 * latitude
                 * @zh
                 * 地理围栏的纬度
                 */
                latitude: number;
                /**
                 * @en
                 * longitude
                 * @zh
                 * 地理围栏的经度
                 */
                longitude: number;
                /**
                 * @en
                 * radius, unit:m
                 * @zh
                 * 地理围栏的半径，（单位米）
                 */
                radius: number;
                /**
                 * @en
                 * Geofence timeout interval, in milliseconds. The geofence will be automatically deleted after this amount of time.
                 * @zh
                 * 地理围栏超时时间，当超过这个时间，围栏将会被自动移除（单位毫秒）
                 */
                validContinueTime: number;
                /**
                 * @en
                 * Lingering duration for converting a geofence event, in milliseconds. A geofence event is converted when a user lingers in a geofence for this amount of time.
                 * @zh
                 * 地理围栏驻留触发时间，当用户在围栏中并停留超过这个时间，则会触发围栏上报（单位毫秒）
                 */
                dwellDelayTime?: number;
                constructor(uniqueId: string, conversion: GEOFENCE_TYPE, latitude: number, longitude: number, radius: number | undefined, validContinueTime: number | undefined, dwellDelayTime: number);
            }
            enum HMS_LOCATION_GEOFENCEREQUEST {
                /**
                 * @en
                 * Triggered immediately when a request is initiated to add the geofence where a user device has already entered.
                 * @zh
                 * 当用户已经在地理围栏中，添加围栏会立即触发
                 */
                ENTER_INIT_CONVERSION = 1,
                /**
                 * @en
                 * Triggered immediately when a request is initiated to add the geofence where a user device has already exited.
                 * @zh
                 * 当用户已经在地理围栏外，添加围栏会立即触发
                 */
                EXIT_INIT_CONVERSION = 2,
                /**
                 * @en
                 * Triggered immediately when a user device stays in the geofence for the specified duration.
                 * @zh
                 * 当用户已经在围栏内添加围栏并随后停留超过设置的驻留时间，会立即触发
                 */
                DWELL_INIT_CONVERSION = 4
            }
            /**
             * @internal 各服务父类
             */
            class HMSBaseService {
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
                on(eventName: string, cb: (result: LocationResult) => void, thisArg?: any, once?: boolean): void;
                /**
                 * @en
                 * Add event listener (once only).
                 * @zh
                 * 监听一次事件。
                 * @param eventName - Event name.
                 * @param cb - Event callback.
                 * @param thisArg - Target node.
                 */
                once(eventName: string, cb: (result: LocationResult) => void, thisArg?: any): void;
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
                off(eventName: string, cb?: (result: LocationResult) => void, thisArg?: any): void;
                /**
                 * @en
                 * Remove all event listener of the target node.
                 * @zh
                 * 取消某个节点所有的事件监听。
                 * @param targetNode
                 * @example
                 */
                targetOff(targetNode: any): void;
            }
            /**
             * 融合定位
            */
            class LocationService extends HMSBaseService {
                private readonly _callStaticMethodClassName;
                /**
                 * @en
                 * request location permission
                 * @zh
                 * 请求定位权限
                 * @example
                 * ```
                 * huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_LOCATION_PERMISSION, (result) => {
                 *     if (result.code === huawei.hms.location.LocationStatusCode.success) {
                 *         console.log('checkLocationSettings...', 'success');
                 *     } else {
                 *         console.log('checkLocationSettings...', failed, errMsg = ', result.errMsg);
                 *     }
                 * });
                 *
                 * huawei.hms.location.locationService.requestLocationPermission();
                 * ```
                 */
                requestLocationPermission(): void;
                /**
                 * @internal
                 */
                private _requestLocationPermissionCallback;
                /**
                 * 返回位置数据的可用性
                 */
                getLocationAvailability(): void;
                /**
                 * @internal
                 */
                private _getLocationAvailabilityCallback;
                /**
                 * @en
                 * check location settings
                 * @zh
                 * 检查定位权限
                 * @example
                 * ```
                 * huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_LOCATION_SETTINGS, (result) => {
                 *     if (result.code === huawei.hms.location.LocationStatusCode.success) {
                 *         console.log('checkLocationSettings...', 'success');
                 *     } else {
                 *         console.log('checkLocationSettings...', 'fail:', result.errMsg);
                 *     }
                 * });
                 *
                 * huawei.hms.location.locationService.checkLocationSettings();
                 */
                checkLocationSettings(): void;
                /**
                 * @internal
                 */
                private _checkLocationSettingsCallback;
                /**
                 * @en
                 * remove location updates
                 * @zh
                 * 取消持续监听
                 * @example
                 * ```
                 * huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_REMOVE_LOCATION_UPDATE, (result) => {
                 *     if (result.code === huawei.hms.location.LocationStatusCode.success) {
                 *         console.log('removeLocationUpdates...', 'success');
                 *     } else {
                 *         console.log('removeLocationUpdates...', 'fail:', result.errMsg);
                 *     }
                 * });
                 *
                 * huawei.hms.location.locationService.removeLocationUpdates();
                 * ```
                 */
                removeLocationUpdates(): void;
                /**
                 * @internal
                 */
                private _removeLocationUpdatesCallback;
                /**
                 * @en
                 * request location updates
                 * @zh
                 * 请求持续监听位置信息
                 * ```
                 * huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_REQUEST_LOCATION_UPDATE, (result) => {
                 *     if (result.code === huawei.hms.location.LocationStatusCode.success) {
                 *         console.log('requestLocationUpdates...', 'success');
                 *     } else {
                 *         console.log('requestLocationUpdates...', 'fail:', result.errMsg);
                 *     }
                 * });
                 *
                 * huawei.hms.location.locationService.requestLocationUpdates();
                 */
                requestLocationUpdates(): void;
                /**
                 * @internal
                 */
                private _requestLocationUpdatesCallback;
                /**
                 * @en
                 * Requests location updates. This is an extended location service API that supports high-precision location and is compatible with common location APIs.
                 * @zh
                 * 扩展的位置信息服务接口，当前支持高精度定位，并兼容普通定位接口
                 * ```
                 * huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_REQUEST_LOCATION_UPDATE, (result) => {
                 *     if (result.code === huawei.hms.location.LocationStatusCode.success) {
                 *         console.log('requestLocationUpdatesEx...', 'success');
                 *     } else {
                 *         console.log('requestLocationUpdatesEx...', 'fail:', result.errMsg);
                 *     }
                 * });
                 *
                 * huawei.hms.location.locationService.requestLocationUpdatesEx();
                 */
                requestLocationUpdatesEx(): void;
                /**
                 * @internal
                 */
                private _locationUpdates;
                /**
                 * @en
                 * get last location
                 * @zh
                 * 获取最后位置
                 * @example
                 * ```
                 * huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_LAST_LOCATION, (location) => {
                 *     if (location.code === huawei.hms.location.LocationStatusCode.success) {
                 *         console.log('getLastLocation...', 'success', lon:' + location.longitude + ",lat:" + location.latitude);
                 *     } else {
                 *         console.log('getLastLocation...', 'fail:', location.errMsg);
                 *     }
                 * });
                 *
                 * huawei.hms.location.locationService.getLastLocation();
                 * ```
                 */
                getLastLocation(): void;
                /**
                 * @internal
                 */
                private _getLastLocationCallback;
                /**
                 * @en
                 * set location interval, unit: ms
                 * @zh
                 * 设置位置信息返回的事件间隔，单位：毫秒
                 * @param interval location callback interval
                 * @example
                 * ```
                 * huawei.hms.location.locationService.setLocationInterval(10000);
                 * ```
                 */
                setLocationInterval(interval: number): void;
                /**
                 * @en
                 * set location priority, value: [com.huawei.hms.location.LocationRequest](https://developer.huawei.com/consumer/en/doc/HMSCore-References-V5/constant-values-0000001050746179-V5#EN-US_TOPIC_0000001050746179__section54539193202)
                 * @zh
                 * 设置优先级，如果请求GPS位置，则值为100；如请求网络位置，则值为102或104；如不需要主动请求位置，仅需被动接收位置，则值为105。如果请求高精度位置信息，则值为200。
                 * @param priority
                 * @example
                 * ```
                 * huawei.hms.location.locationService.setLocationPriority(100);
                 * ```
                 */
                setLocationPriority(priority: number): void;
                /**
                 * @en
                 * set mock mode
                 * @zh
                 * 设置虚拟定位的开关该功能用于测试环境,仅部分手机支持,请根据华为官方文档配置.设置为 true 时，将不再使用 GPS 或网络位置，直接返回通过 setMockLocation 设置的位置信息
                 * 注意：mock模式需要开发者在AndroidManifest.xml添加： <uses-permission android:name="android.permission.ACCESS_MOCK_LOCATION" tools:ignore="MockLocation,ProtectedPermissions" />
                 * @param flag true is open ,false is close
                 * @example
                 * ```
                 * huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_MOCK_MODE, (result) => {
                 *     if (location.code === huawei.hms.location.LocationStatusCode.success) {
                 *         console.log('setMockMode...', 'success');
                 *     } else {
                 *         console.log('setMockMode...', 'fail:', result.errMsg);
                 *     }
                 * });
                 *
                 * huawei.hms.location.locationService.setMockMode(true);
                 * ```
                 */
                setMockMode(flag: boolean): void;
                /**
                 * @internal
                 */
                _setMockModeCallback(result: any): void;
                /**
                 * @en
                 * set mock location
                 * @zh
                 * 设置虚拟定位的信息
                 * @param lon longitude
                 * @param lat latitude
                 */
                setMockLocation(lon: number, lat: number): void;
                /**
                 * @internal
                 */
                _setMockLocationCallback(result: any): void;
                /**
                 * @en
                 * Updates the location under processing
                 * @zh
                 * 刷新当前正在处理的位置
                 * @example
                 * ```
                 * huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_FLUSH_LOCATIONS, (result) => {
                 *      if (result.code === huawei.hms.location.LocationStatusCode.success) {
                 *          console.log('flushLocations success,data is ', result.toString());
                 *      } else {
                 *          console.log('flushLocations fail ,reason ', result.errMsg);
                 *      }
                 * });
                 *
                 * huawei.hms.location.locationService.flushLocations();
                 * ```
                 */
                flushLocations(): void;
                /**
                 * @internal
                 */
                _flushLocationsCallback(result: LocationResult): void;
                /**
                 * @en
                 * Obtains the available location of the last request, including the detailed address information. If a location is unavailable, `null` will be returned.
                 * @zh
                 * 返回最后一次请求的可用位置，包括详细地址信息。如果某个位置不可用，则返回 `null`。
                 * @example
                 * ```
                 * huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_GET_HWLOCATION, (result) => {
                 *      if (result.code === huawei.hms.location.LocationStatusCode.success) {
                 *          console.log('getLastLocationWithAddress success,data is ', JSON.stringify(result));
                 *      } else {
                 *          console.log('getLastLocationWithAddress fail ,reason ', result.errMsg);
                 *      }
                 * });
                 *
                 * huawei.hms.location.locationService.getLastLocationWithAddress();
                 * ```
                 */
                getLastLocationWithAddress(): void;
                /**
                 * @internal
                 */
                _getLastLocationWithAddressCallback(result: LocationResult): void;
            }
            /**
             * @en
             * class for location action
             * @zh
             * 处理活动识别相关的类
             */
            class LocationActivityService extends HMSBaseService {
                private readonly _callStaticMethodClassName;
                /**
                 * @en
                 * request recognition permission
                 * @zh
                 * 请求活动相关的权限
                 * @example
                 * ```
                 * huawei.hms.location.locationActivityService.requestRecognitionPermission();
                 * ```
                 */
                requestRecognitionPermission(): void;
                /**
                 * @internal
                 */
                private _requestRecognitionPermissionCallback;
                /**
                 * @en
                 * create activity identification updates
                 * @zh
                 * 注册活动识别更新
                 * @param interval [activity update interval](https://developer.huawei.com/consumer/en/doc/HMSCore-References-V5/activityidentificationservice-0000001050986183-V5)
                 * @example
                 * ```
                 * huawei.hms.location.locationActivityService.once(huawei.hms.location.API_EVENT_LIST.HMS_CREATE_ACTIVITY_IDENTIFICATION_UPDATES, (result) => {
                 *     if (result.code === huawei.hms.location.LocationStatusCode.success) {
                 *         console.log('requestActivityUpdates...', 'success');
                 *     } else {
                 *         console.log('requestActivityUpdates...', 'fail:', result.errMsg);
                 *     }
                 * });
                 *
                 * huawei.hms.location.locationActivityService.createActivityIdentificationUpdates(parseInt(time) || 5000);
                 * ```
                 */
                createActivityIdentificationUpdates(interval: number): void;
                /**
                 * @internal
                 */
                private _createActivityIdentificationUpdatesCallback;
                /**
                 * @en
                 * delete activity identification updates
                 * @zh
                 * 移除活动识别更新
                 * @example
                 * ```
                 * huawei.hms.location.locationActivityService.once(huawei.hms.location.API_EVENT_LIST.HMS_DELETE_ACTIVITY_CONVERSION_UPDATES, (result) => {
                 *     if (result.code === huawei.hms.location.LocationStatusCode.success) {
                 *         console.log('deleteActivityUpdates...', 'success');
                 *     } else {
                 *         console.log('deleteActivityUpdates...', 'fail:', result.errMsg);
                 *     }
                 * });
                 *
                 * huawei.hms.location.locationActivityService.deleteActivityIdentificationUpdates();
                 * ```
                 */
                deleteActivityIdentificationUpdates(): void;
                /**
                 * @internal
                 */
                private _deleteActivityIdentificationUpdatesCallback;
                /**
                 * @en
                 * create activity conversion updates
                 * @zh
                 * 提供检测活动转换条件（进入、退出）的功能，例如需要检测用户从走路变为骑自行车的状态等
                 * @param infoList
                 * @example
                 * ```
                 * huawei.hms.location.locationActivityService.once(huawei.hms.location.API_EVENT_LIST.HMS_CREATE_ACTIVITY_CONVERSION_UPDATES, (result) => {
                 *     if (result.code === huawei.hms.location.LocationStatusCode.success) {
                 *         console.log('createActivityConversionUpdates...', 'success');
                 *     } else {
                 *         console.log('createActivityConversionUpdates...', 'fail:', result.errMsg);
                 *     }
                 * });
                 * let cls = huawei.hms.location.ConversionInfo;
                 * let type = huawei.hms.location.ACTIVITY_IDENTIFICATION_ENUM;
                 * let cType = huawei.hms.location.ACTIVITY_CONVERSION_TYPE;
                 * let infoList = [
                 *     new cls(type.STILL, cType.ENTER_ACTIVITY_CONVERSION),
                 *     new cls(type.STILL, cType.EXIT_ACTIVITY_CONVERSION),
                 * ];
                 * huawei.hms.location.locationActivityService.createActivityConversionUpdates(infoList);
                 * ```
                 */
                createActivityConversionUpdates(infoList: Array<ConversionInfo>): void;
                /**
                 * @internal
                 */
                private _createActivityConversionUpdatesCallback;
                /**
                 * @en
                 * delete activity conversion updates
                 * @zh
                 * 移除当前的关联活动转换更新
                 * @example
                 * ```
                 * huawei.hms.location.locationActivityService.once(huawei.hms.location.API_EVENT_LIST.HMS_REMOVE_ACTIVITY_CONVERSION_UPDATES, (result) => {
                 *     if (result.code === huawei.hms.location.LocationStatusCode.success) {
                 *         console.log('deleteActivityConversionUpdates...', 'success');
                 *     } else {
                 *         console.log('deleteActivityConversionUpdates...', 'fail:', result.errMsg);
                 *     }
                 * });
                 *
                 * huawei.hms.location.locationActivityService.deleteActivityConversionUpdates();
                 * ```
                 */
                deleteActivityConversionUpdates(): void;
                /**
                 * @internal
                 */
                private _deleteActivityConversionUpdates;
                /**
                 * @internal
                 */
                private _activityConversionUpdatesCallback;
                /**
                 * @internal
                 */
                private _activityUpdatesCallback;
            }
            /**
             * @en
             * class for location geofence
             * @zh
             * 地理围栏处理相关类
             */
            class LocationGeofenceService extends HMSBaseService {
                private readonly _callStaticMethodClassName;
                /**
                 * @en
                 * adds multiple geofences
                 * @zh
                 * 创建地理围栏
                 * @param list geofence data list
                 * @param type
                 * @example
                 * ```
                 * huawei.hms.location.locationGeofenceService.once(huawei.hms.location.API_EVENT_LIST.HMS_CREATE_GEOFENCE_LIST, (result) => {
                 *     if (result.code === huawei.hms.location.LocationStatusCode.success) {
                 *         console.log('createGeofenceList...', 'success');
                 *     } else {
                 *         console.log('createGeofenceList...', 'fail:', result.errMsg);
                 *     }
                 * });
                 *
                 * let cls = huawei.hms.location.GeofenceData;
                 * let type = huawei.hms.location.GEOFENCE_TYPE;
                 * let list = [
                 *     new cls(
                 *         "msg123456",    //setUniqueId
                 *         type.DWELL_GEOFENCE_CONVERSION | type.ENTER_GEOFENCE_CONVERSION | type.EXIT_GEOFENCE_CONVERSION, //setConversions
                 *         24.4813889,     //setRoundArea, latitude
                 *         118.1590724,    //setRoundArea, longitude
                 *         2000,           //setRoundArea, radius
                 *         60 * 60 * 1000, //setValidContinueTime
                 *         1000)          //setDwellDelayTime
                 * ];
                 * let requestType = huawei.hms.location.HMS_LOCATION_GEOFENCEREQUEST;
                 * let initType = requestType.EXIT_INIT_CONVERSION | requestType.ENTER_INIT_CONVERSION | requestType.DWELL_INIT_CONVERSION;
                 * console.log('createGeofenceList...', 'params=', JSON.stringify(list), 'init type=', initType);
                 *
                 * huawei.hms.location.locationGeofenceService.createGeofenceList(list, initType);
                 * ```
                 */
                createGeofenceList(list: Array<GeofenceData>, type: HMS_LOCATION_GEOFENCEREQUEST): void;
                /**
                 * @internal
                 */
                private _createGeofenceListCallback;
                /**
                 * @en
                 * remove the geofence with intent
                 * @zh
                 * 移除当前intent的地理围栏
                 * @example
                 * ```
                 * huawei.hms.location.locationGeofenceService.once(huawei.hms.location.API_EVENT_LIST.HMS_REMOVE_GEOFENCE_WITH_INTENT, (result) => {
                 *     if (result.code === huawei.hms.location.LocationStatusCode.success) {
                 *         console.log('removeWithIntent', 'success');
                 *     } else {
                 *         console.log('removeWithIntent...', 'fail:', result.errMsg);
                 *     }
                 * });
                 *
                 * huawei.hms.location.locationGeofenceService.removeWithIntent();
                 * ```
                 */
                removeWithIntent(): void;
                /**
                 * @internal
                 */
                private _removeWithIntentCallback;
                /**
                 * @en
                 * remove the geofence by id
                 * @zh
                 * 根据地理围栏id列表删除地理围栏
                 * @param removeIdArr
                 * @example
                 * ```
                 * huawei.hms.location.locationGeofenceService.once(huawei.hms.location.API_EVENT_LIST.HMS_REMOVE_GEOFENCE_WITH_ID, (result) => {
                 *     if (result.code === huawei.hms.location.LocationStatusCode.success) {
                 *         console.log('removeWithID...', 'success');
                 *     } else {
                 *         console.log('removeWithID...', 'fail:', result.errMsg);
                 *     }
                 * });
                 *
                 * var removeIdArr = ["ID1"];
                 * huawei.hms.location.locationGeofenceService.removeWithID(removeIdArr);
                 * ```
                 */
                removeWithID(removeIdArr: string[]): void;
                /**
                 * @internal
                 */
                private _removeWithIDCallback;
                /**
                 * @internal
                 */
                private _receiveGeoFenceDataCallback;
            }
            const locationService: LocationService;
            const locationActivityService: LocationActivityService;
            const locationGeofenceService: LocationGeofenceService;
        }
    }
}
