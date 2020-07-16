cc.Class({
    extends: cc.Component,

    properties: {
        hasPermission: false,
        PropItem: cc.Prefab,
        mLon: cc.Node,
        mLat: cc.Node,
        permission: cc.Node,
        console: require('Console'),
        _location: null,
    },


    start() {
        window._demoLocation = this;
        if (cc.sys.platform !== cc.sys.ANDROID) {
            return;
        }

        this.checkPermission();
        this.receiveLocationUpdate();
    },
    checkPermission() {
        this.console.log('开始检查权限');
        huawei.HMS.locationService.once(huawei.HMS.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_LOCATION_SETTINGS, (result) => {
            if (result.code === huawei.HMS.HMSLocationActivityService.StatusCode.success) {
                this.console.log('获取权限成功');
                this.hasPermission = true;
            } else {
                this.requestLocationPermission();
            }
            this.checkPermissionTips();
        });
        huawei.HMS.locationService.checkLocationSettings();
    },

    checkPermissionTips() {
        this.permission.getComponent('Prop').setValue(this.hasPermission ? "是" : "否");
    },
    returnClick() {
        cc.director.loadScene('list');
    },

    onDestroy() {
        huawei.HMS.locationService.targetOff(this);
    },

    updateLocationTips(location) {
        this.mLon.getComponent('Prop').setValue(location.longitude);
        this.mLat.getComponent('Prop').setValue(location.latitude);
    },
    getLastLocation() {
        this.console.log('获取最后位置');
        if (this.hasPermission) {
            huawei.HMS.locationService.once(huawei.HMS.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_LAST_LOCATION, (location) => {
                if (location.code === huawei.HMS.HMSLocationActivityService.StatusCode.success) {
                    this.console.log('获取最后位置成功 lon:' + location.longitude + ",lat:" + location.latitude);
                    this._location = location;
                    this.updateLocationTips(location);
                } else {
                    this.console.log('获取最后位置失败，原因：', location.errMsg);
                }
            });
            huawei.HMS.locationService.getLastLocation();
        }
    },

    requestLocationUpdate() {
        this.console.log('持续定位开启');
        if (this.hasPermission) {
            huawei.HMS.locationService.setLocationInterval(10000);
            //100是gps，102是网络，室内gps信号弱会自己换成网络
            huawei.HMS.locationService.setLocationPriority(100);

            huawei.HMS.locationService.once(huawei.HMS.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_REQUEST_LOCATION_UPDATE, (result) => {
                if (result.code === huawei.HMS.HMSLocationActivityService.StatusCode.success) {
                    this.console.log('持续定位开启成功');
                } else {
                    this.console.log('持续定位开启失败，原因：', result.errMsg);
                }
            });


            huawei.HMS.locationService.requestLocationUpdates();
        }
    },

    receiveLocationUpdate() {
        huawei.HMS.locationService.on(huawei.HMS.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_LOCATION_UPDATES, (location) => {
            if (location.code === huawei.HMS.HMSLocationActivityService.StatusCode.success) {
                this.console.log('获得持续定位：lon', location.longitude, 'lat :', location.latitude);
                this.updateLocationTips(location);
            } else {
                this.console.log('持续定位失败，原因：', location.errMsg);
            }
        }, this);
    },

    removeLocationUpdate() {
        this.console.log('取消持续定位');
        huawei.HMS.locationService.once(huawei.HMS.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_REMOVE_LOCATION_UPDATE, (result) => {
            if (result.code === huawei.HMS.HMSLocationActivityService.StatusCode.success) {
                this.console.log('取消持续定位成功');
            } else {
                this.console.log('持续定位关闭失败，原因：', result.errMsg);
            }
        });
        huawei.HMS.locationService.removeLocationUpdates();
    },

    requestLocationPermission() {
        this.console.log('开始请求权限');
        huawei.HMS.locationService.once(huawei.HMS.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_LOCATION_PERMISSION, (result) => {
            if (result.code === huawei.HMS.HMSLocationActivityService.StatusCode.success) {
                this.console.log('获取权限成功');
                this.hasPermission = true;
                this.checkPermissionTips();
            } else {
                this.console.log('获取权限失败', result.errMsg);
            }
        });
        huawei.HMS.locationService.requestLocationPermission();
    },

    activityClick() {
        cc.director.loadScene('activity');
    },
    geoClick() {
        cc.director.loadScene('geofence');
    }
});
