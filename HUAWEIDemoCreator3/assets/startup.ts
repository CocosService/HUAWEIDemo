import { _decorator, Component, Node, instantiate, Prefab, director, profiler } from 'cc';
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

    start () {
        profiler.hideStats();
        for (let i = 0; i < this.sceneList.length; i++) {
            const sceneListItem = this.sceneList[i];
            if (this.checkServiceAvailable(sceneListItem.sceneName)) {
                const buttonLoadScene = instantiate(this.buttonLoadScene);
                const script = buttonLoadScene.getComponent(
                    'ButtonLoadScene'
                ) as ButtonLoadScene;
                script.init(sceneListItem.sceneName);
                this.scrollContent.addChild(buttonLoadScene);
            }
        }
    }

    private checkServiceAvailable (sceneName: string): boolean {

        if (sceneName == "hwgobe") {
            // @ts-ignore
            return typeof GOBE !== 'undefined';
        }


        // @ts-ignore
        if (typeof huawei === 'undefined') {
            return false;
        }

        switch (sceneName) {
            case 'analytics':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.hms?.analytics?.analyticsService
                );
            case 'function':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.agc?.func?.funcService
                );
            case 'remoteconfig':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.agc?.rc?.rcService
                );
            case 'apms':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.agc?.apms?.apmsService
                );
            case 'crash':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.agc?.crash?.crashService
                );
            case 'appmessaging':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.agc?.appmessaging?.appMessagingService
                );
            case 'auth':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.agc?.auth?.authService?.support
                );
            case 'storage':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.agc?.storage?.storageService?.support
                );
            case 'db':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.agc?.db?.dbService?.support
                );
            case 'push':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.hms?.push?.pushService
                );
            case 'account':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.hms?.account?.accountService
                );
            case 'game':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.hms?.game?.gameService
                );
            case 'ads':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.hms?.ads?.adsService
                );
            case 'location':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.hms?.location?.locationService
                );
            case 'iap':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.hms?.iap?.iapService
                );
            case 'hwmmsdk':
                return !!(
                    // prettier-ignore
                    // @ts-ignore
                    huawei?.game?.mmsdk?.mmsdkService
                );
            default:
                console.error("未处理的场景：" + sceneName);
                return false;
        }
    }
}
