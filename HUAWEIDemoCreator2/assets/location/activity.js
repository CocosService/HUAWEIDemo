cc.Class({
    extends: cc.Component,

    properties: {
        console: require('Console'),
    },


    start() {
        window._demoActivity = this;

        huawei.hms.location.locationActivityService.requestRecognitionPermission();
        this.receiveActivityUpdate();
    },
    returnClick() {
        cc.director.loadScene('location');
    },
    receiveActivityUpdate() {
        huawei.hms.location.locationActivityService.on(huawei.hms.location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_ACTIVITY_UPDATES, (result) => {
            this.console.log('HMS_ACTIVITY_UPDATES', JSON.stringify(result));
        }, this);

        huawei.hms.location.locationActivityService.on(huawei.hms.location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_CONVERSION_UPDATES, (result) => {
            this.console.log('HMS_CONVERSION_UPDATES...', JSON.stringify(result));
        }, this);
    },
    removeActivityUpdates() {
        this.console.log('removeActivityUpdates...');
        huawei.hms.location.locationActivityService.once(huawei.hms.location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_DELETE_ACTIVITY_IDENTIFICATION_UPDATES, (result) => {
            if (result.code === huawei.hms.location.LocationActivityService.StatusCode.success) {
                this.console.log('removeActivityUpdates', 'success');
            } else {
                this.console.log('removeActivityUpdates...', 'fail:', result.errMsg);
            }
        });
        huawei.hms.location.locationActivityService.deleteActivityIdentificationUpdates();
    },
    requestActivityUpdates(event, time) {
        this.console.log('requestActivityUpdates...');
        huawei.hms.location.locationActivityService.once(huawei.hms.location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_CREATE_ACTIVITY_IDENTIFICATION_UPDATES, (result) => {
            if (result.code === huawei.hms.location.LocationActivityService.StatusCode.success) {
                this.console.log('requestActivityUpdates...', 'success');
            } else {
                this.console.log('requestActivityUpdates...', 'fail:', result.errMsg);
            }
        });
        huawei.hms.location.locationActivityService.createActivityIdentificationUpdates(parseInt(time) || 5000);
    },

    createActivityConversionUpdates() {
        this.console.log('createActivityConversionUpdates...');
        huawei.hms.location.locationActivityService.once(huawei.hms.location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_CREATE_ACTIVITY_CONVERSION_UPDATES, (result) => {
            if (result.code === huawei.hms.location.LocationActivityService.StatusCode.success) {
                this.console.log('createActivityConversionUpdates...', 'success');
            } else {
                this.console.log('createActivityConversionUpdates...', 'fail:', result.errMsg);
            }
        });
        let cls = huawei.hms.location.ConversionInfo;
        let type = huawei.hms.location.ACTIVITY_IDENTIFICATION_ENUM;
        let cType = huawei.hms.location.ACTIVITY_CONVERSION_TYPE;
        let infoList = [
            new cls(type.STILL, cType.ENTER_ACTIVITY_CONVERSION),
            new cls(type.STILL, cType.EXIT_ACTIVITY_CONVERSION),
        ];
        huawei.hms.location.locationActivityService.createActivityConversionUpdates(infoList);
    },
    deleteActivityConversionUpdates() {
        this.console.log('deleteActivityConversionUpdates...');
        huawei.hms.location.locationActivityService.once(huawei.hms.location.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_DELETE_ACTIVITY_CONVERSION_UPDATES, (result) => {
            if (result.code === huawei.hms.location.LocationActivityService.StatusCode.success) {
                this.console.log('deleteActivityConversionUpdates...', 'success');
            } else {
                this.console.log('deleteActivityConversionUpdates...', 'fail:', result.errMsg);
            }
        });
        huawei.hms.location.locationActivityService.deleteActivityConversionUpdates();
    },
    onDestroy() {
        huawei.hms.location.locationActivityService.targetOff(this);
    },
    // update (dt) {},
});
