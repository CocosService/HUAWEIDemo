import { _decorator, Component, Node, loader, director, CCString, EventTarget, Label } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

/**
 * 华为定位服务
 * 指南：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/introduction-0000001050706106
 * 错误码：https://developer.huawei.com/consumer/cn/doc/development/HMS-3-References/location-error-code-v3
*/
@ccclass('Location')
export class Location extends Component {
    @property({ type: Console })
    consolePanel: Console = null;

    @property(Node)
    ScrollView_main: Node = null;
    @property(Node)
    ScrollView_location: Node = null;
    @property(Node)
    ScrollView_activity: Node = null;
    @property(Node)
    ScrollView_geofence: Node = null;

    @property(Label)
    LbPos: Label = null;
    @property(Label)
    LbPermission: Label = null;

    //是否有权限
    private hasPermission: boolean = false;
    // private location: typeof huawei.hms.location.locationService = (typeof huawei === 'undefined' ? null : huawei?.hms?.location?.locationService)!;
    // private activity: typeof huawei.hms.location.locationActivityService = (typeof huawei === 'undefined' ? null : huawei?.hms?.location?.locationActivityService)!;
    // private geofence: typeof huawei.hms.location.locationGeofenceService = (typeof huawei === 'undefined' ? null : huawei?.hms?.location?.locationGeofenceService)!;

    onEnable () {
        // 按需求开启 显示 debug 信息
        // huawei.hms.location.locationService.on(huawei.hms.location.API_EVENT_LIST.debugApiResult, (res: huawei.hms.location.LocationResult) => { this.consolePanel?.log("[debug location]" + res.toString()); }, this, false);
        // this.activity.on(huawei.hms.location.API_EVENT_LIST.debugApiResult, (res: huawei.hms.location.LocationResult) => { this.consolePanel?.log("[debug activity]" + res.toString()); }, this, false);
        // this.geofence.on(huawei.hms.location.API_EVENT_LIST.debugApiResult, (res: huawei.hms.location.LocationResult) => { this.consolePanel?.log("[debug geofence]" + res.toString()); }, this, false);

        //其他被动事件
        //设置活动识别更新监听 1
        huawei.hms.location.locationService.on(huawei.hms.location.API_EVENT_LIST.HMS_ACTIVITY_UPDATES, (result) => {
            this.consolePanel.log(result);
        });
        //设置活动识别更新监听 2
        huawei.hms.location.locationService.on(huawei.hms.location.API_EVENT_LIST.HMS_CONVERSION_UPDATES, (result) => {
            this.consolePanel.log(result);
        });
        //设置地理围栏监听
        huawei.hms.location.locationService.on(huawei.hms.location.API_EVENT_LIST.HMS_RECEIVE_GEOFENCE_DATA, (result) => {
            this.consolePanel.log(result);
        });

        this.showMainClick();

        //请求授权
        this.requestLocationPermission();

    }

    onDisable () {
        // 按需求开启 显示 debug 信息
        // huawei.hms.location.locationService.off(huawei.hms.location.API_EVENT_LIST.debugApiResult);
        // this.activity.off(huawei.hms.location.API_EVENT_LIST.debugApiResult);
        // this.geofence.off(huawei.hms.location.API_EVENT_LIST.debugApiResult);

        huawei.hms.location.locationService.off(huawei.hms.location.API_EVENT_LIST.HMS_ACTIVITY_UPDATES);
        huawei.hms.location.locationService.off(huawei.hms.location.API_EVENT_LIST.HMS_CONVERSION_UPDATES);
        huawei.hms.location.locationService.off(huawei.hms.location.API_EVENT_LIST.HMS_RECEIVE_GEOFENCE_DATA);
    }


    update () {
        //测试每秒更新一次位置
        if (this.hasPermission == true) {
            if (director.getTotalFrames() % 60 == 0) {
                huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_LAST_LOCATION, (result) => {
                    this._updateUiLocationPosInfo(result as huawei.hms.location.Location);
                });
                huawei.hms.location.locationService.getLastLocation();
            }
        }
    }


    showMainClick () {
        this.ScrollView_main.active = true;//
        this.ScrollView_location.active = false;
        this.ScrollView_activity.active = false;
        this.ScrollView_geofence.active = false;
    }

    locationClick () {
        this.ScrollView_main.active = false;
        this.ScrollView_location.active = true;//
        this.ScrollView_activity.active = false;
        this.ScrollView_geofence.active = false;
    }

    activityClick () {
        this.ScrollView_main.active = false;
        this.ScrollView_location.active = false;
        this.ScrollView_activity.active = true;//
        this.ScrollView_geofence.active = false;
    }

    geofenceClick () {
        this.ScrollView_main.active = false;
        this.ScrollView_location.active = false;
        this.ScrollView_activity.active = false;
        this.ScrollView_geofence.active = true;//
    }


    /**
     * 更新UI位置信息
    */
    private _updateUiLocationPosInfo (info: huawei.hms.location.Location) {
        this.LbPos.string = "位置：经度" + info.longitude + "  纬度：" + info.latitude;
    }

    private _updateLocationPermission (has: boolean) {
        this.hasPermission = has;
        this.LbPermission.string = "授权：" + (has ? "YES" : "NO");
    }


    //location 融合定位---------------------------------------------------------------

    /**
     * 请求定位权限
    */
    requestLocationPermission () {
        huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_LOCATION_PERMISSION, (result) => {
            this.consolePanel.log(result);
            this._updateLocationPermission(result.code == huawei.hms.location.LocationStatusCode.success);
        });
        huawei.hms.location.locationService.requestLocationPermission();
    }


    /**
     * 返回位置数据的可用性
    */
    getLocationAvailability () {
        huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_LOCATION_GET_LOCATION_AVAILABILITY, (result) => {
            this.consolePanel.log(result);
        });
        huawei.hms.location.locationService.getLocationAvailability();
    }


    /**
     * 检查设备定位设置
    */
    checkLocationSettings () {
        huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_LOCATION_SETTINGS, (result) => {
            this.consolePanel.log(result);
        });
        huawei.hms.location.locationService.checkLocationSettings();
    }

    /**
     * 取消持续监听
    */
    removeLocationUpdates () {
        huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_REMOVE_LOCATION_UPDATE, (result) => {
            this.consolePanel.log(result);
        });
        huawei.hms.location.locationService.removeLocationUpdates();
    }

    /**
     * 请求持续监听位置信息
    */
    requestLocationUpdates () {
        huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_REQUEST_LOCATION_UPDATE, (result) => {
            this.consolePanel.log(result);
        });
        huawei.hms.location.locationService.requestLocationUpdates();
    }

    /**
     * 扩展的位置信息服务接口，当前支持高精度定位，并兼容普通定位接口
    */
    requestLocationUpdatesEx () {
        huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_REQUEST_LOCATION_UPDATE, (result) => {
            this.consolePanel.log(result);
        });
        huawei.hms.location.locationService.requestLocationUpdatesEx();
    }

    /**
     * 获取最后位置
    */
    getLastLocation () {
        huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_LAST_LOCATION, (result) => {
            this.consolePanel.log(result);
            if (result.code == huawei.hms.location.LocationStatusCode.success) {
                this._updateUiLocationPosInfo(result as huawei.hms.location.Location);
            }
        });
        huawei.hms.location.locationService.getLastLocation();
    }


    /**
     * 设置位置信息返回的事件间隔，单位：毫秒
    */
    setLocationInterval () {
        let v = 1000;
        huawei.hms.location.locationService.setLocationInterval(v);
        this.consolePanel.log("setLocationInterval succeed, value:" + v);
    }

    /**
     * 设置优先级，如果请求GPS位置，则值为100；如请求网络位置，则值为102或104；如不需要主动请求位置，仅需被动接收位置，则值为105。如果请求高精度位置信息，则值为200。
    */
    setLocationPriority () {
        let v = 100;
        huawei.hms.location.locationService.setLocationPriority(v);
        this.consolePanel.log("setLocationPriority succeed, value:" + v);
    }

    /**
     * 设置虚拟定位的开关该功能用于测试环境,仅部分手机支持,请根据华为官方文档配置。设置为 true 时，将不再使用 GPS 或网络位置，直接返回通过 setMockLocation 设置的位置信息
     * 注意：mock模式需要开发者在AndroidManifest.xml添加： <uses-permission android:name="android.permission.ACCESS_MOCK_LOCATION" tools:ignore="MockLocation,ProtectedPermissions" />
    */
    setMockModeTrue () {
        huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_MOCK_MODE, (result) => {
            this.consolePanel.log(result);
        });
        huawei.hms.location.locationService.setMockMode(true);
    }
    setMockModeFalse () {
        huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_MOCK_MODE, (result) => {
            this.consolePanel.log(result);
        });
        huawei.hms.location.locationService.setMockMode(false);
    }


    /**
     * 设置虚拟定位的信息 longitude经度 latitude纬度
    */
    setMockLocation () {
        huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_MOCK_LOCATION, (result) => {
            this.consolePanel.log(result);
        });
        huawei.hms.location.locationService.setMockLocation(100, 200);
    }


    /**
     * 刷新当前正在处理的位置
    */
    flushLocations () {
        huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_FLUSH_LOCATIONS, (result) => {
            this.consolePanel.log(result);
        });
        huawei.hms.location.locationService.flushLocations();
    }

    /**
     * 返回最后一次请求的可用位置，包括详细地址信息。如果某个位置不可用，则返回 `null`。
    */
    getLastLocationWithAddress () {
        huawei.hms.location.locationService.once(huawei.hms.location.API_EVENT_LIST.HMS_GET_HWLOCATION, (result) => {
            this.consolePanel.log(result);
        });
        huawei.hms.location.locationService.getLastLocationWithAddress();
    }


    //activity 活动识别---------------------------------------------------------------

    /**
     * 请求活动相关的权限
    */
    requestRecognitionPermission () {
        huawei.hms.location.locationActivityService.once(huawei.hms.location.API_EVENT_LIST.HMS_RECOGNITION_PERMISSION, (result) => {
            this.consolePanel.log(result);
        });
        huawei.hms.location.locationActivityService.requestRecognitionPermission();
    }


    /**
     * 注册活动识别更新
    */
    createActivityIdentificationUpdates () {
        huawei.hms.location.locationActivityService.once(huawei.hms.location.API_EVENT_LIST.HMS_CREATE_ACTIVITY_IDENTIFICATION_UPDATES, (result) => {
            this.consolePanel.log(result);
        });
        huawei.hms.location.locationActivityService.createActivityIdentificationUpdates(5000);
    }

    /**
     * 移除活动识别更新
    */
    deleteActivityIdentificationUpdates () {
        huawei.hms.location.locationActivityService.once(huawei.hms.location.API_EVENT_LIST.HMS_DELETE_ACTIVITY_IDENTIFICATION_UPDATES, (result) => {
            this.consolePanel.log(result);
        });
        huawei.hms.location.locationActivityService.deleteActivityIdentificationUpdates();
    }


    /**
     * 提供检测活动转换条件（进入、退出）的功能，例如需要检测用户从走路变为骑自行车的状态等
    */
    createActivityConversionUpdates () {
        huawei.hms.location.locationActivityService.once(huawei.hms.location.API_EVENT_LIST.HMS_CREATE_ACTIVITY_CONVERSION_UPDATES, (result) => {
            this.consolePanel.log(result);
        });
        let cls = huawei.hms.location.ConversionInfo;
        let type = huawei.hms.location.ACTIVITY_IDENTIFICATION_ENUM;
        let cType = huawei.hms.location.ACTIVITY_CONVERSION_TYPE;
        let infoList = [
            new cls(type.STILL, cType.ENTER_ACTIVITY_CONVERSION),
            new cls(type.STILL, cType.EXIT_ACTIVITY_CONVERSION),
        ];
        huawei.hms.location.locationActivityService.createActivityConversionUpdates(infoList);
    }

    /**
     * 移除当前的关联活动转换更新
    */
    deleteActivityConversionUpdates () {
        huawei.hms.location.locationActivityService.once(huawei.hms.location.API_EVENT_LIST.HMS_DELETE_ACTIVITY_CONVERSION_UPDATES, (result) => {
            this.consolePanel.log(result);
        });
        huawei.hms.location.locationActivityService.deleteActivityConversionUpdates();
    }


    //geofence 地理围栏---------------------------------------------------------------

    /**
     * 创建地理围栏
    */
    createGeofenceList () {
        huawei.hms.location.locationGeofenceService.once(huawei.hms.location.API_EVENT_LIST.HMS_CREATE_GEOFENCE_LIST, (result) => {
            this.consolePanel.log(result);
        });

        let cls = huawei.hms.location.GeofenceData;
        let type = huawei.hms.location.GEOFENCE_TYPE;
        let list = [
            new cls(
                "msg123456",    //setUniqueId
                type.DWELL_GEOFENCE_CONVERSION | type.ENTER_GEOFENCE_CONVERSION | type.EXIT_GEOFENCE_CONVERSION, //setConversions
                24.4813889,     //setRoundArea, latitude
                118.1590724,    //setRoundArea, longitude
                2000,           //setRoundArea, radius
                60 * 60 * 1000, //setValidContinueTime
                1000)          //setDwellDelayTime
        ];
        let requestType = huawei.hms.location.HMS_LOCATION_GEOFENCEREQUEST;
        let initType = requestType.EXIT_INIT_CONVERSION | requestType.ENTER_INIT_CONVERSION | requestType.DWELL_INIT_CONVERSION;
        console.log('createGeofenceList...', 'params=', JSON.stringify(list), 'init type=', initType);
        huawei.hms.location.locationGeofenceService.createGeofenceList(list, initType);
    }


    /**
     *  移除当前intent的地理围栏
    */
    removeWithIntent () {
        huawei.hms.location.locationGeofenceService.once(huawei.hms.location.API_EVENT_LIST.HMS_REMOVE_GEOFENCE_WITH_INTENT, (result) => {
            this.consolePanel.log(result);
        });
        huawei.hms.location.locationGeofenceService.removeWithIntent();
    }

    /**
     * 根据地理围栏id列表删除地理围栏
    */
    removeWithID () {
        huawei.hms.location.locationGeofenceService.once(huawei.hms.location.API_EVENT_LIST.HMS_REMOVE_GEOFENCE_WITH_ID, (result) => {
            this.consolePanel.log(result);
        });
        var removeIdArr = ["msg123456"];
        huawei.hms.location.locationGeofenceService.removeWithID(removeIdArr);
    }


}
