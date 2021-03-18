import { _decorator, Component, Node, instantiate, Prefab } from 'cc';
const { ccclass, property } = _decorator;
import { ButtonLoadScene } from './prefabs/button-load-scene';

@ccclass('SceneListItem')
export class SceneListItem {
    @property({})
    sceneName = '';
}

@ccclass('Startup')
export class Startup extends Component {
    @property({ type: Node })
    scrollContent: Node = null!;
    @property({ type: SceneListItem })
    sceneList: SceneListItem[] = [];

    @property({ type: Prefab })
    buttonLoadScene: Prefab = null!;

    start() {
        for (const sceneListItem of this.sceneList) {
            if (!this.checkServiceAvailable(sceneListItem.sceneName)) continue;

            const buttonLoadScene = instantiate(this.buttonLoadScene);
            const script = buttonLoadScene.getComponent(
                'ButtonLoadScene'
            ) as ButtonLoadScene;
            script.init(sceneListItem.sceneName);
            this.scrollContent.addChild(buttonLoadScene);
        }
    }

    private checkServiceAvailable(sceneName: string): boolean {
        if (typeof huawei === 'undefined') {
            return false;
        }

        switch (sceneName) {
            case 'analytics':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei.hms && huawei.hms.analytics && huawei.hms.analytics.analyticsService
                );
            case 'function':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei.agc && huawei.agc.func && huawei.agc.func.funcService
                );
            case 'remoteconfig':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei && huawei.agc && huawei.agc.rc && huawei.agc.rc.rcService
                );
            default:
                return false;
        }
    }
}
