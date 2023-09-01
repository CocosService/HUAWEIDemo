import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Cloud')
export class Cloud extends Component {
    @property(Sprite)
    cloudSprite: Sprite = null;

    public initCloud (x = 0, y = 0) {
        this.cloudSprite.node.active = true;
        this.node.setPosition(x, y, 0)
    }
}

