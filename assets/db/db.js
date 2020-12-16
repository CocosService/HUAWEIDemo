cc.Class({
    extends: cc.Component,

    properties: {
        console: require('Console'),
    },


    start() {
        this.hasDB = huawei && huawei.agc && huawei.agc.db && huawei.agc.db.dbService && huawei.agc.db.dbService.support ? true : false;
        if (this.hasDB) this._db = huawei.agc.db;
        this._db.dbService.on("error", data => this.console.log("Cloud DB", `error : [${data.zoneId}][${data.typeName}] ${data.errCode}:${data.errMsg}`), this);
        let config = this._db.AGCCloudDBZoneConfig.createConfig("test", this._db.SyncProperty.CLOUDDBZONE_CLOUD_CACHE);
        this._zone = this._db.dbService.openCloudDBZone(config, true);
    },

    queryAll() {
        if (!this.hasDB) return;
        let query = this._db.AGCCloudDBZoneQuery.where("Types", "queryTest");
        let result = this._zone.querySync(query, this._db.QueryPolicy.POLICY_QUERY_FROM_CLOUD_ONLY);
        if (result instanceof Array && result.length > 0) {
            this.console.log('Cloud DB', 'getObjectTypeName : ' + result[0].getObjectTypeName());
            this.console.log('Cloud DB', 'getPackageName : ' + result[0].getPackageName());
        }
        this.console.log('Cloud DB', 'query : ' + JSON.stringify(result));
    },

    deleteByQuery() {
        if (!this.hasDB) return;
        let query = this._db.AGCCloudDBZoneQuery.where("Types", "deleteTest").lessThan('typeInt', 5);
        let count = this._zone.deleteSync(query, this._db.QueryPolicy.POLICY_QUERY_FROM_CLOUD_ONLY);
        this.console.log('Cloud DB', 'delete count : ' + count);
    },

    insertAll() {
        if (!this.hasDB) return;
        let objs = [];
        for (var i = 0; i < 10; i++) {
            let obj = {
                typeInt: i+1,
                typeLong: i+1,
                typeDouble: i+1,
                typeBool: i % 2 === 0,
                typeStr: `name${i+1}`,
                typeDate: new Date(),
            }
            objs.push(obj);
        }
        let count = this._zone.insertSync(objs, "Types");
        this.console.log('Cloud DB', 'insert count : ' + count);
    },


    returnClick() {
        cc.director.loadScene('list');
    },

    onDestroy() {},


    // update (dt) {},
});