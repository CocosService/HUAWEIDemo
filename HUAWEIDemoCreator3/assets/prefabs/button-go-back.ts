import { _decorator, Component, director, sys } from 'cc';
const { ccclass } = _decorator;

@ccclass('ButtonGoBack')
export class ButtonGoBack extends Component {
    start () { }

    goBack () {
        director.loadScene('startup');
    }
}
