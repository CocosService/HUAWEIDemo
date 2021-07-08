import { _decorator, Component, Label, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonLoadScene')
export class ButtonLoadScene extends Component {
    @property({ type: Label })
    label: Label = null!;

    private sceneName = '';

    start() {}

    init(sceneName: string) {
        this.label.string = this.capitalizeWords(sceneName.replace('-', ' '));
        this.sceneName = sceneName;
    }

    onClicked() {
        director.loadScene(this.sceneName);
    }

    private capitalizeWords(str: string) {
        return str.replace(/\b\w/g, (l) => l.toUpperCase());
    }
}
