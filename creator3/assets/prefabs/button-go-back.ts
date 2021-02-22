import { _decorator, Component, director } from 'cc';
const { ccclass } = _decorator;

@ccclass('ButtonGoBack')
export class ButtonGoBack extends Component {
    start() {}

    goBack() {
        director.loadScene('startup');
    }
}
