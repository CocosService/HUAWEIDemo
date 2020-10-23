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
    let query = this._db.AGCCloudDBZoneQuery.where("test", "queryTest");
    let result = this._zone.querySync(query, this._db.QueryPolicy.POLICY_QUERY_FROM_CLOUD_PRIOR);
    this.console.log('Cloud DB', 'query : ' + JSON.stringify(result));
  },

  deleteAll() {
    if (!this.hasDB) return;
    let count = this._zone.deleteAllSync("test");
    this.console.log('Cloud DB', 'delete count : ' + count);
  },

  deleteByQuery() {
    if (!this.hasDB) return;
    let query = this._db.AGCCloudDBZoneQuery.where("test", "deleteTest").lessThan('id', "5");
    let count = this._zone.deleteSync(query, this._db.QueryPolicy.POLICY_QUERY_FROM_CLOUD_PRIOR);
    this.console.log('Cloud DB', 'delete count : ' + count);
  },

  insertAll() {
    if (!this.hasDB) return;
    let objs = [];
    for (var i = 0; i < 10; i++) {
      let obj = {
        id: `${i+1}`,
        name: `name${i+1}`
      }
      objs.push(obj);
    }
    let count = this._zone.insertSync(objs, "test");
    this.console.log('Cloud DB', 'insert count : ' + count);
  },


  returnClick() {
    cc.director.loadScene('list');
  },

  onDestroy() {},


  // update (dt) {},
});