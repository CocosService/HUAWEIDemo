// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        item: cc.Node,
        scrollContent: cc.Node,
        scrollView: cc.ScrollView,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    log(...args) {
        let str = args.join(' ');
        let item = cc.instantiate(this.item);
        item.getComponent('cc.Label').string = str;
        item.active = true;
        this.scrollContent.addChild(item);
        this.scrollView.scrollToBottom(0.1);
        cc.log(str);
    },

    error(...args) {
        let str = args.join(' ');
        let item = cc.instantiate(this.item);
        item.getComponent('cc.Label').string = str;
        item.color = cc.color(255, 0, 0);
        item.active = true;
        this.scrollContent.addChild(item);
        this.scrollView.scrollToBottom(0.1);
        cc.error(str);
    },
    clean() {
        this.scrollContent.removeAllChildren(true);
    }
    // update (dt) {},
});
