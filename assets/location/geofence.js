cc.Class({
    extends: cc.Component,

    properties: {},


    start() {
        window._demoGeofence = this;
    },
    returnClick() {
        cc.director.loadScene('location');
    }
    // update (dt) {},
});
