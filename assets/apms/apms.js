const hasAPMS = huawei && huawei.AGC && huawei.AGC.apms && huawei.AGC.apms.enableCollection ? true : false;
cc.Class({
  extends: cc.Component,

  properties: {
    console: require('Console'),
  },

  randomString(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var pwd = '';
    for (var i = 0; i < len; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    return pwd;
  },

  httpPost(url, params) {
    return new Promise((resolve, reject) => {
      var xhr = cc.loader.getXMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300))
          resolve(xhr.responseText);
      };
      xhr.open("POST", url, true);
      xhr.timeout = 5000;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(params);
    })

  },


  start() {
    if (hasAPMS) this._apms = huawei.AGC.apms;
    this._customTraceName = '';
    this._execNetWorkMeasure = false;
  },

  startCustomTrace() {
    if (this._customTraceName !== '') return;
    this._customTraceName = "customTrace_" + this.randomString(6);
    hasAPMS && this._apms.startCustomTrace(this._customTraceName);
    this.console.log('APMS', "start custom trace, trace name : " + this._customTraceName);
  },

  stopCustomTrace() {
    if (this._customTraceName === '') return;
    hasAPMS && this._apms.stopCustomTrace(this._customTraceName);
    this.console.log('APMS', "stop custom trace, trace name : " + this._customTraceName);
    this._customTraceName = '';
  },

  networkMeasure() {
    if (this._execNetWorkMeasure) return;
    let url = "https://api.apiopen.top/getJoke?page=1&count=2&type=video";
    let networkMeasureId = hasAPMS ? this._apms.initNetworkMeasure(url, 'POST') : "";
    this.console.log('APMS', "start network measure, id : " + networkMeasureId);
    this.console.log('APMS', "POST: " + url);
    hasAPMS && this._apms.startNetworkMeasure(networkMeasureId);
    this.httpPost(url).then(res => {
      console.log(JSON.parse(res));
      hasAPMS && this._apms.stopNetworkMeasure(networkMeasureId);
      this.console.log('APMS', "stop network measure, id : " + networkMeasureId);
    });
  },

  returnClick() {
    cc.director.loadScene('list');
  },

  onDestroy() {},


  // update (dt) {},
});