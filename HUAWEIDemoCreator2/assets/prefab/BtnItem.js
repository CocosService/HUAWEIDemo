// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    tips: cc.Label,
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start() {

  },

  init(tips, scene) {
    this.tips.string = tips;
    this.scene = scene;
  },

  click() {
    if (typeof this.scene === 'function') return this.scene();
    cc.director.loadScene(this.scene.name);
  }
  // update (dt) {},
});