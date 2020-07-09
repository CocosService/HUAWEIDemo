cc.Class({
    extends: cc.Component,

    properties: {
        BtnItem: cc.Prefab,
        scrollContent: cc.Node,
        list: [cc.Class({
            name: 'list-item',
            properties: {
                sceneName: cc.String,
                scene: cc.SceneAsset,
            }
        })],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.list.forEach((item) => {
            let prefab = cc.instantiate(this.BtnItem);
            prefab.getComponent('BtnItem').init(item.sceneName, item.scene);
            this.scrollContent.addChild(prefab)
        });
    },

    // update (dt) {},
});
