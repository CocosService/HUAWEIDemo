cc.Class({
    extends: cc.Component,

    properties: {
        console: require('Console'),
    },


    start() {
        window._demoActivity = this;

        huawei.HMS.locationActivityService.requestRecognitionPermission();
        this.receiveActivityUpdate();
    },
    returnClick() {
        cc.director.loadScene('location');
    },
    receiveActivityUpdate() {
        huawei.HMS.locationActivityService.on(huawei.HMS.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_ACTIVITY_UPDATES, (result) => {
            this.console.log('HMS_ACTIVITY_UPDATES', JSON.stringify(result));
        }, this);

        huawei.HMS.locationActivityService.on(huawei.HMS.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_CONVERSION_UPDATES, (result) => {
            this.console.log('HMS_CONVERSION_UPDATES...', JSON.stringify(result));
        }, this);
    },
    removeActivityUpdates() {
        this.console.log('removeActivityUpdates...');
        huawei.HMS.locationActivityService.once(huawei.HMS.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_DELETE_ACTIVITY_IDENTIFICATION_UPDATES, (result) => {
            if (result.code === huawei.HMS.HMSLocationActivityService.StatusCode.success) {
                this.console.log('removeActivityUpdates', 'success');
            } else {
                this.console.log('removeActivityUpdates...', 'fail:', result.errMsg);
            }
        });
        huawei.HMS.locationActivityService.deleteActivityIdentificationUpdates();
    },
    requestActivityUpdates(event, time) {
        this.console.log('requestActivityUpdates...');
        huawei.HMS.locationActivityService.once(huawei.HMS.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_CREATE_ACTIVITY_IDENTIFICATION_UPDATES, (result) => {
            if (result.code === huawei.HMS.HMSLocationActivityService.StatusCode.success) {
                this.console.log('requestActivityUpdates...', 'success');
            } else {
                this.console.log('requestActivityUpdates...', 'fail:', result.errMsg);
            }
        });
        huawei.HMS.locationActivityService.createActivityIdentificationUpdates(parseInt(time) || 5000);
    },

    createActivityConversionUpdates() {
        this.console.log('createActivityConversionUpdates...');
        huawei.HMS.locationActivityService.once(huawei.HMS.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_CREATE_ACTIVITY_CONVERSION_UPDATES, (result) => {
            if (result.code === huawei.HMS.HMSLocationActivityService.StatusCode.success) {
                this.console.log('createActivityConversionUpdates...', 'success');
            } else {
                this.console.log('createActivityConversionUpdates...', 'fail:', result.errMsg);
            }
        });
        let cls = huawei.HMS.HMSConversionInfo;
        let type = huawei.HMS.ACTIVITY_IDENTIFICATION_ENUM;
        let infoList = [
            new cls(type.STILL, type.ENTER),
            new cls(type.STILL, type.LEAVE),
        ];
        huawei.HMS.locationActivityService.createActivityConversionUpdates(infoList);
    },
    removeActivityConversionUpdates() {
        this.console.log('removeActivityConversionUpdates...');
        huawei.HMS.locationActivityService.once(huawei.HMS.HMS_LOCATION_EVENT_LISTENER_NAME.HMS_REMOVE_ACTIVITY_CONVERSION_UPDATES, (result) => {
            if (result.code === huawei.HMS.HMSLocationActivityService.StatusCode.success) {
                this.console.log('removeActivityConversionUpdates...', 'success');
            } else {
                this.console.log('removeActivityConversionUpdates...', 'fail:', result.errMsg);
            }
        });
        huawei.HMS.locationActivityService.removeActivityConversionUpdates();
    },
    onDestroy() {
        huawei.HMS.locationActivityService.targetOff(this);
    },
    // update (dt) {},
});
