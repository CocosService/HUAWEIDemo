// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        mLabel: cc.Label,
        mValue: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    init(label, value) {
        this.label = label;
        this.value = value;
    },

    setValue(str) {
        this.mValue.string = str;
    },

    setLabel(str) {
        this.mLabel.string = str
    }

    // update (dt) {},
});
