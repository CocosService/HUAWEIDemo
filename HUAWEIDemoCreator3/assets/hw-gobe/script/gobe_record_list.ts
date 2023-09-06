import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { Console } from '../../prefabs/console';
import { global } from './hw_gobe_global_data';
import { GobeRecordItem } from './gobe_record_item';
const { ccclass, property } = _decorator;

@ccclass('GobeRecordList')
export class GobeRecordList extends Component {
    @property({ type: Console })
    console: Console = null!;

    @property({ type: Node })
    itemParent: Node = null;

    @property({ type: Prefab })
    itemPrefab: Prefab = null!;

    onEnable (): void {
        //清空历史
        this.itemParent.removeAllChildren();
        global.recordInfos = [];
        global.recordPlayerIdMap.clear();

        this.console.log("`正在查询战绩列表`");
        global.client.queryRecordList(0, 10)
            .then((res) => {
                if (res.recordInfos.length > 0) {
                    global.recordInfos = res.recordInfos;
                    for (let i = 0; i < global.recordInfos.length; i++) {
                        let info: GOBE.RecordInfo = global.recordInfos[i];
                        let itemNode = instantiate(this.itemPrefab);
                        this.itemParent.addChild(itemNode);
                        let ctrl = itemNode.getComponent(GobeRecordItem);
                        ctrl.init(info, this.console);
                    }
                }
                this.console.log(`查询战绩列表成功`, JSON.stringify(res));
            })
            .catch((err) => {
                global.recordInfos = [];
                this.console.log(`查询战绩列表失败 err:`, err);
            });
    }


    onCloseBtnClick () {
        this.node.active = false;
    }


}

