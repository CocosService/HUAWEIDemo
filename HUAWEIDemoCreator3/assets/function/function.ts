import { _decorator, Component, Node } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('Function')
export class Function extends Component {
    @property({ type: Console })
    console: Console = null!;

    //有参
    callWithParam () {
        huawei.agc.func.funcService.wrap('func-$latest').call(
            (err, data) => {
                if (err !== null) {
                    this.console.log(
                        'Cloud Functions',
                        `error: ${JSON.stringify(err)}`
                    );
                }
                this.console.log(
                    'Cloud Functions',
                    `result: ${JSON.stringify(data)}`
                );
            },
            {
                data: 'data',
                data2: {
                    data3: 'data3e',
                    data4: 123,
                },
            }
        );
    }

    //无参
    callWithoutParam () {
        huawei.agc.func.funcService.wrap('func-$latest').call((err, data) => {
            if (err !== null) {
                this.console.log(
                    'Cloud Functions',
                    `error: ${JSON.stringify(err)}`
                );
            }
            this.console.log(
                'Cloud Functions',
                `result: ${JSON.stringify(data)}`
            );
        });
    }
}
