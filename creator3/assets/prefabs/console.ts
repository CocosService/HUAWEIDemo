import {
    _decorator,
    Component,
    Node,
    ScrollView,
    instantiate,
    Label,
    color,
    log,
    error,
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Console')
export class Console extends Component {
    @property({ type: Node })
    item: Node = null!;
    @property({ type: ScrollView })
    scrollView: ScrollView = null!;

    log(...args: any[]) {
        const { item, str } = this.addItem(null, ...args);
        if (item) log(str);
    }

    error(...args: any[]) {
        const { item, str } = this.addItem(({ label }) => {
            label.color = color(255, 0, 0);
        }, ...args);
        if (item) error(str);
    }

    clear() {
        this.getScrollContent()?.removeAllChildren();
    }

    private addItem(
        onBuildItem:
            | ((components: { item: Node; label: Label }) => void)
            | null,
        ...args: any[]
    ): { item: Node | null; str: string } {
        const msgs = args.map((arg: Object | null | undefined) => {
            if (arg === null) {
                return 'null';
            }
            if (arg === undefined) {
                return 'undefined';
            }
            if (arg.toString().startsWith('[object ')) {
                return JSON.stringify(arg);
            }
            return arg.toString();
        });
        const str = msgs.join(' ');

        const item = instantiate(this.item);
        const label = item.getComponent(Label);
        if (!label) {
            log('Cannot get the label component of item');
            return { item: null, str: '' };
        }
        label.string = str;
        item.active = true;

        if (onBuildItem) onBuildItem({ item, label });

        this.getScrollContent()?.addChild(item);
        this.scrollView.scrollToBottom(0.5);

        return { item, str };
    }

    private getScrollContent(): Node | null {
        if (!this.scrollView.content) {
            log('Cannot get the content component of scroll view');
            return null;
        }
        return this.scrollView.content;
    }
}
