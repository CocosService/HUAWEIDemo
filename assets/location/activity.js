cc.Class({
    extends: cc.Component,

    properties: {
        console: require('Console'),
    },


    start() {
        window._demoActivity = this;

        huawei.HMS.Location.locationActivityService.requestRecognitionPermission();
        this.receiveActivityUpdate();
    },
    returnClick() {
        cc.director.loadScene('location');
    },
    receiveActivityUpdate() {
        huawei.HMS.Location.locationActivityService.on(huawei.HMS.Location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_ACTIVITY_UPDATES, (result) => {
            this.console.log('HMS_ACTIVITY_UPDATES', JSON.stringify(result));
        }, this);

        huawei.HMS.Location.locationActivityService.on(huawei.HMS.Location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_CONVERSION_UPDATES, (result) => {
            this.console.log('HMS_CONVERSION_UPDATES...', JSON.stringify(result));
        }, this);
    },
    removeActivityUpdates() {
        this.console.log('removeActivityUpdates...');
        huawei.HMS.Location.locationActivityService.once(huawei.HMS.Location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_DELETE_ACTIVITY_IDENTIFICATION_UPDATES, (result) => {
            if (result.code === huawei.HMS.Location.LocationActivityService.StatusCode.success) {
                this.console.log('removeActivityUpdates', 'success');
            } else {
                this.console.log('removeActivityUpdates...', 'fail:', result.errMsg);
            }
        });
        huawei.HMS.Location.locationActivityService.deleteActivityIdentificationUpdates();
    },
    requestActivityUpdates(event, time) {
        this.console.log('requestActivityUpdates...');
        huawei.HMS.Location.locationActivityService.once(huawei.HMS.Location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_CREATE_ACTIVITY_IDENTIFICATION_UPDATES, (result) => {
            if (result.code === huawei.HMS.Location.LocationActivityService.StatusCode.success) {
                this.console.log('requestActivityUpdates...', 'success');
            } else {
                this.console.log('requestActivityUpdates...', 'fail:', result.errMsg);
            }
        });
        huawei.HMS.Location.locationActivityService.createActivityIdentificationUpdates(parseInt(time) || 5000);
    },

    createActivityConversionUpdates() {
        this.console.log('createActivityConversionUpdates...');
        huawei.HMS.Location.locationActivityService.once(huawei.HMS.Location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_CREATE_ACTIVITY_CONVERSION_UPDATES, (result) => {
            if (result.code === huawei.HMS.Location.LocationActivityService.StatusCode.success) {
                this.console.log('createActivityConversionUpdates...', 'success');
            } else {
                this.console.log('createActivityConversionUpdates...', 'fail:', result.errMsg);
            }
        });
        let cls = huawei.HMS.Location.HMSConversionInfo;
        let type = huawei.HMS.Location.ACTIVITY_IDENTIFICATION_ENUM;
        let cType = huawei.HMS.Location.ACTIVITY_CONVERSION_TYPE;
        let infoList = [
            new cls(type.STILL, cType.ENTER_ACTIVITY_CONVERSION),
            new cls(type.STILL, cType.EXIT_ACTIVITY_CONVERSION),
        ];
        huawei.HMS.Location.locationActivityService.createActivityConversionUpdates(infoList);
    },
    deleteActivityConversionUpdates() {
        this.console.log('deleteActivityConversionUpdates...');
        huawei.HMS.Location.locationActivityService.once(huawei.HMS.Location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_DELETE_ACTIVITY_CONVERSION_UPDATES, (result) => {
            if (result.code === huawei.HMS.Location.LocationActivityService.StatusCode.success) {
                this.console.log('deleteActivityConversionUpdates...', 'success');
            } else {
                this.console.log('deleteActivityConversionUpdates...', 'fail:', result.errMsg);
            }
        });
        huawei.HMS.Location.locationActivityService.deleteActivityConversionUpdates();
    },
    onDestroy() {
        huawei.HMS.Location.locationActivityService.targetOff(this);
    },
    // update (dt) {},
});
