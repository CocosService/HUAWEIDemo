import { _decorator, Component } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('Db')
export class Db extends Component {
    @property({ type: Console })
    console: Console = null!;

    private db = (typeof huawei !== 'undefined'
        ? huawei?.agc?.db
        : null) as typeof huawei.agc.db;
    private zone!: huawei.agc.db.AGCCloudDBZone;

    start() {
        this.db.dbService.on(
            'error',
            (data: any) =>
                this.console.log(
                    'Cloud DB',
                    `error : [${data.zoneId}][${data.typeName}] ${data.errCode}:${data.errMsg}`
                ),
            this
        );
        const config = this.db.AGCCloudDBZoneConfig.createConfig(
            'test',
            this.db.SyncProperty.CLOUDDBZONE_CLOUD_CACHE
        );
        this.zone = this.db.dbService.openCloudDBZone(config, true);
    }

    queryAll() {
        const query = this.db.AGCCloudDBZoneQuery.where('Types', 'queryTest');
        const result = this.zone.querySync(
            query,
            this.db.QueryPolicy.POLICY_QUERY_FROM_CLOUD_ONLY
        );
        if (result instanceof Array && result.length > 0) {
            this.console.log(
                'getObjectTypeName : ' + result[0].getObjectTypeName()
            );
            this.console.log('getPackageName : ' + result[0].getPackageName());
        }
        this.console.log('query :', result);
    }

    deleteByQuery() {
        const query = this.db.AGCCloudDBZoneQuery.where(
            'Types',
            'deleteTest'
        ).lessThan('typeInt', 5);
        const count = this.zone.deleteSync(
            query,
            this.db.QueryPolicy.POLICY_QUERY_FROM_CLOUD_ONLY
        );
        this.console.log('Cloud DB', 'delete count : ' + count);
    }

    insertItems() {
        const objs = [];
        for (var i = 0; i < 10; i++) {
            const obj = {
                typeInt: i + 1,
                typeLong: i + 1,
                typeDouble: i + 1,
                typeBool: i % 2 === 0,
                typeStr: `name${i + 1}`,
            };
            objs.push(obj);
        }
        let count = this.zone.insertSync(objs, 'Types');
        this.console.log('Cloud DB', 'insert count : ' + count);
    }
}
