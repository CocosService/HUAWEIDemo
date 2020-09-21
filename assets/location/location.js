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
        this.receiveLocationInvoked = false;
        this.checkPermission();
    },

    checkPermission() {
        this.console.log('Check permission');
        huawei.hms.location.locationService.once(huawei.hms.location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_LOCATION_SETTINGS, (result) => {
            if (result.code === huawei.hms.location.LocationActivityService.StatusCode.success) {
                this.console.log('Check permission success');
                this.hasPermission = true;
            } else {
                this.requestLocationPermission();
            }
            this.checkPermissionTips();
        });
        huawei.hms.location.locationService.checkLocationSettings();
    },

    checkPermissionTips() {
        this.permission.getComponent('Prop').setValue(this.hasPermission ? "Yes" : "No");
    },
    returnClick() {
        cc.director.loadScene('list');
    },

    onDestroy() {
        huawei.hms.location.locationService.targetOff(this);
    },

    updateLocationTips(location) {
        this.mLon.getComponent('Prop').setValue(location.longitude);
        this.mLat.getComponent('Prop').setValue(location.latitude);
    },
    getLastLocation() {
        this.console.log('Get last location');
        if (this.hasPermission) {
            huawei.hms.location.locationService.once(huawei.hms.location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_LAST_LOCATION, (location) => {
                if (location.code === huawei.hms.location.LocationActivityService.StatusCode.success) {
                    this.console.log('get last location lon:' + location.longitude + ",lat:" + location.latitude);
                    this._location = location;
                    this.updateLocationTips(location);
                } else {
                    this.console.log('get last location fail，reason：', location.errMsg);
                }
            });
            huawei.hms.location.locationService.getLastLocation();
        } else {
            this.console.error('have not location permission');
        }
    },

    requestLocationUpdate() {
        this.console.log('invoke location update');
        if (this.hasPermission) {
            huawei.hms.location.locationService.setLocationInterval(10000);
            //100是gps，102是网络，室内gps信号弱会自己换成网络
            huawei.hms.location.locationService.setLocationPriority(100);

            huawei.hms.location.locationService.once(huawei.hms.location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_REQUEST_LOCATION_UPDATE, (result) => {
                if (result.code === huawei.hms.location.LocationActivityService.StatusCode.success) {
                    this.console.log('invoke location update success');
                } else {
                    this.console.log('invoke location update fail，reason：', result.errMsg);
                }
            });

            this.receiveLocationUpdate();
            huawei.hms.location.locationService.requestLocationUpdates();
        } else {
            this.console.error('have not location permission');
        }
    },

    requestLocationUpdateEx() {
        this.console.log('invoke location update');
        if (this.hasPermission) {
            huawei.hms.location.locationService.setLocationInterval(10000);
            //100是gps，102是网络，室内gps信号弱会自己换成网络
            huawei.hms.location.locationService.setLocationPriority(100);

            huawei.hms.location.locationService.once(huawei.hms.location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_REQUEST_LOCATION_UPDATE, (result) => {
                if (result.code === huawei.hms.location.LocationActivityService.StatusCode.success) {
                    this.console.log('invoke location update success');
                } else {
                    this.console.log('invoke location update fail，reason：', result.errMsg);
                }
            });

            this.receiveLocationUpdate();
            huawei.hms.location.locationService.requestLocationUpdatesEx();
        } else {
            this.console.error('have not location permission');
        }
    },

    receiveLocationUpdate() {
        if (this.receiveLocationInvoked) {
            return;
        }
        this.receiveLocationInvoked = true;
        huawei.hms.location.locationService.on(huawei.hms.location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_LOCATION_UPDATES, (location) => {
            if (location.code === huawei.hms.location.LocationActivityService.StatusCode.success) {
                this.console.log('receive location：lon', location.longitude, 'lat :', location.latitude);
                this.updateLocationTips(location);
            } else {
                this.console.log('location update fail，reason：', location.errMsg);
            }
        }, this);
    },

    removeLocationUpdate() {
        this.console.log('remove location update');
        huawei.hms.location.locationService.once(huawei.hms.location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_REMOVE_LOCATION_UPDATE, (result) => {
            if (result.code === huawei.hms.location.LocationActivityService.StatusCode.success) {
                this.console.log('remove location update success');
            } else {
                this.console.log('remove location update，reason：', result.errMsg);
            }
        });
        huawei.hms.location.locationService.removeLocationUpdates();
    },

    requestLocationPermission() {
        this.console.log('request location permission');
        huawei.hms.location.locationService.once(huawei.hms.location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_LOCATION_PERMISSION, (result) => {
            if (result.code === huawei.hms.location.LocationActivityService.StatusCode.success) {
                this.console.log('request location permission success');
                this.hasPermission = true;
                this.checkPermissionTips();
            } else {
                this.console.log('request location permission fail,reason:', result.errMsg);
            }
        });
        huawei.hms.location.locationService.requestLocationPermission();
    },

    activityClick() {
        cc.director.loadScene('activity');
    },
    geoClick() {
        cc.director.loadScene('geofence');
    },
    getLastLocationWithAddress() {
        if (!this.hasPermission) {
            this.console.log('have not location permission');
            return;
        }
        huawei.hms.location.locationService.once(huawei.hms.location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_GET_HWLOCATION, (result) => {
            if (result.code === huawei.hms.location.LocationService.StatusCode.success) {
                this.console.log('getLastLocationWithAddress success,data is ', JSON.stringify(result));
            } else {
                this.console.log('getLastLocationWithAddress fail ,reason ', result.errMsg);
            }
        });
        huawei.hms.location.locationService.getLastLocationWithAddress();
    },
    flushLocations() {
        if (!this.hasPermission) {
            this.console.log('have not location permission');
            return;
        }
        huawei.hms.location.locationService.once(huawei.hms.location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_FLUSH_LOCATIONS, (result) => {
            if (result.code === huawei.hms.location.LocationService.StatusCode.success) {
                this.console.log('flushLocations success,data is ', result.toString());
            } else {
                this.console.log('flushLocations fail ,reason ', result.errMsg);
            }
        });
        huawei.hms.location.locationService.flushLocations();
    }
});
