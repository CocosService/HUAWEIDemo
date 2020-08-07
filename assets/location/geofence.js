cc.Class({
    extends: cc.Component,

    properties: {
        console: require('Console'),
        editBox: cc.EditBox,
    },


    start() {
        window._demoGeofence = this;
        this.lon = 0;
        this.lat = 0;
        huawei.HMS.Location.locationService.on(huawei.HMS.Location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_LAST_LOCATION, this._receiveLocation.bind(this), this);
        huawei.HMS.Location.locationService.getLastLocation();
        this.receiveEvent();
    },

    _receiveLocation(location) {
        if (location.code === huawei.HMS.Location.LocationActivityService.StatusCode.success) {
            this.console.log('获取最后位置成功 lon:' + location.longitude + ",lat:" + location.latitude);
            !this.lon && (this.lon = location.longitude);
            !this.lat && (this.lat = location.latitude);
        } else {
            this.console.log('获取最后位置失败，原因：', location.errMsg);
        }
    },

    onDestroy() {
        huawei.HMS.Location.locationGeofenceService.targetOff(this);
        huawei.HMS.Location.locationService.targetOff(this);
    },

    returnClick() {
        cc.director.loadScene('location');
    },
    receiveEvent() {
        huawei.HMS.Location.locationGeofenceService.on(huawei.HMS.Location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_RECEIVE_GEOFENCE_DATA, (result) => {
            this.console.log('HMS_RECEIVE_GEOFENCE_DATA...', JSON.stringify(result));
        }, this);
    },

    mockLocation() {
        if (!this.lon || !this.lat) return;
        huawei.HMS.Location.locationService.setMockMode(true);
        this.schedule(this._mockLocation.bind(this), 0.1);
        this.schedule(() => {
            huawei.HMS.Location.locationService.getLastLocation();
        }, 5)
    },
    _mockLocation() {
        this.lon -= 0.00001;
        this.lat += 0.00001;
        huawei.HMS.Location.locationService.setMockLocation(this.lon, this.lat);
    },
    stopMockLocation() {
        this.unschedule(this._mockLocation);
        huawei.HMS.Location.locationService.setMockMode(false);
    },
    createGeofenceList() {
        if (!this.lon || !this.lat) {
            this.console.log('没有获取到当前位置');
            return;
        }
        if (!this.editBox.string) {
            this.console.log('请输入ID');
            return;
        }

        huawei.HMS.Location.locationGeofenceService.once(huawei.HMS.Location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_CREATE_GEOFENCE_LIST, (result) => {
            if (result.code === huawei.HMS.Location.LocationActivityService.StatusCode.success) {
                this.console.log('createGeofenceList', 'success');
            } else {
                this.console.log('createGeofenceList...', 'fail:', result.errMsg);
            }
        });
        let cls = huawei.HMS.Location.HMSGeofenceData;
        let type = huawei.HMS.Location.GEOFENCE_TYPE;
        let list = [
            new cls(
                this.editBox.string,
                type.DWELL_GEOFENCE_CONVERSION | type.ENTER_GEOFENCE_CONVERSION | type.EXIT_GEOFENCE_CONVERSION,
                this.lat,
                this.lon,
                2000,
                60 * 60 * 1000,
                1000
            )];
        let requestType = huawei.HMS.Location.HMS_LOCATION_GEOFENCEREQUEST;
        let initType = requestType.EXIT_INIT_CONVERSION | requestType.ENTER_INIT_CONVERSION | requestType.DWELL_INIT_CONVERSION;
        huawei.HMS.Location.locationGeofenceService.createGeofenceList(list, initType);
        this.console.log('createGeofenceList...', 'params=', JSON.stringify(list), 'init type=', initType);
    },
    removeWithIntent() {
        this.console.log('removeWithIntent...');
        huawei.HMS.Location.locationGeofenceService.once(huawei.HMS.Location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_REMOVE_GEOFENCE_WITH_INTENT, (result) => {
            if (result.code === huawei.HMS.Location.LocationActivityService.StatusCode.success) {
                this.console.log('removeWithIntent', 'success');
            } else {
                this.console.log('removeWithIntent...', 'fail:', result.errMsg);
            }
        });
        huawei.HMS.Location.locationGeofenceService.removeWithIntent();
    },
    removeWithID() {
        if (!this.editBox.string) {
            this.console.log('请输入要删除的id');
        }
        this.console.log('removeWithID...');
        huawei.HMS.Location.locationGeofenceService.once(huawei.HMS.Location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_REMOVE_GEOFENCE_WITH_ID, (result) => {
            if (result.code === huawei.HMS.Location.LocationActivityService.StatusCode.success) {
                this.console.log('removeWithID', 'success');
            } else {
                this.console.log('removeWithID...', 'fail:', result.errMsg);
            }
        });
        huawei.HMS.Location.locationGeofenceService.removeWithID([this.editBox.string]);
    }
    // update (dt) {},
});
