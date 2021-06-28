import {
    _decorator,
    Component,
    director,
    Button,
    Label,
    Event,
    sys,
    Node,
    instantiate,
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AuthSwitchProvider')
export class AuthSwitchProvider extends Component {
    @property({ type: Node })
    scrollContent: Node = null!;
    @property({ type: Node })
    buttonChooseProvider: Node = null!;

    start() {
        const auth = huawei.agc.auth;
        const usedProviders = JSON.parse(auth.authService.getSupportAuthType());

        for (const key in auth.AuthProvider) {
            if (!isNaN(Number(key))) continue;

            const value = auth.AuthProvider[key];
            if (usedProviders.indexOf(parseInt(value)) === -1) continue;

            const buttonNode = instantiate(this.buttonChooseProvider);
            buttonNode.active = true;
            const button = buttonNode.getComponent(Button) as Button;
            button.clickEvents[0].customEventData = value;
            const label = buttonNode.getComponentInChildren(Label) as Label;
            label.string = key;

            this.scrollContent.addChild(buttonNode);
        }
    }

    switchProvider(_event: Event, authType: string) {
        sys.localStorage.setItem('agcAuthCurProviderType', authType);
        this.goBack();
    }

    goBack() {
        director.loadScene('auth');
    }
}
