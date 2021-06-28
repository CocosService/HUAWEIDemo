cc.Class({
  extends: cc.Component,

  properties: {
    console: require('Console'),
  },

  httpPost(url, params) {
    return new Promise((resolve, reject) => {
      var xhr = cc.loader.getXMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4)
          resolve(xhr);
      };
      xhr.open("POST", url, true);
      xhr.timeout = 5000;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(params);
    })

  },

  start() {
    this.hasAPMS = huawei && huawei.agc && huawei.agc.apms && huawei.agc.apms.apmsService && huawei.agc.apms.apmsService.support ? true : false;
    if (this.hasAPMS) this._apms = huawei.agc.apms.apmsService;
    this._customTraceName = '';
    this._execNetWorkMeasure = false;
  },

  setUserIdentifier() {
    if (!this.hasAPMS) return;
    const userIdentifier = '475f5afaxxxxx';
    this._apms.setUserIdentifier(userIdentifier);
    this.console.log('APMS', `setUserIdentifier to ${userIdentifier}`);
  },

  startCustomTrace() {
    if (this._customTraceName !== '') return;
    this._customTraceName = "customTrace1";
    this.hasAPMS && this._apms.startCustomTrace(this._customTraceName);
    this.console.log('APMS', "start custom trace, trace name : " + this._customTraceName);
  },

  stopCustomTrace() {
    if (this._customTraceName === '') return;
    this.hasAPMS && this._apms.stopCustomTrace(this._customTraceName);
    this.console.log('APMS', "stop custom trace, trace name : " + this._customTraceName);
    this._customTraceName = '';
  },

  networkMeasure() {
    if (this._execNetWorkMeasure) return;
    let url = "https://api.apiopen.top/getJoke?page=1&count=2&type=video";
    let networkMeasureId = this.hasAPMS ? this._apms.initNetworkMeasure(url, 'POST') : "";
    this.console.log('APMS', "start network measure, id : " + networkMeasureId);
    this.console.log('APMS', "POST: " + url);
    this._apms.putNetworkMeasureProperty(networkMeasureId, 'key1', 'value1');
    this.console.log('APMS', "Auto Test: " + "putNetworkMeasureProperty(networkMeasureId, 'key1', 'value1');");
    this._apms.putNetworkMeasureProperty(networkMeasureId, 'key2', 'value2');
    this.console.log('APMS', "Auto Test: " + "putNetworkMeasureProperty(networkMeasureId, 'key2', 'value2');");
    this.console.log('APMS', "Auto Test: " + "getNetworkMeasureProperty(networkMeasureId, 'key1'); -- " + this._apms.getNetworkMeasureProperty(networkMeasureId, 'key1'));
    this.console.log('APMS', "Auto Test: " + "getNetworkMeasureProperties(networkMeasureId); -- " + JSON.stringify(this._apms.getNetworkMeasureProperties(networkMeasureId)));
    this._apms.removeNetworkMeasureProperty(networkMeasureId, 'key1');
    this.console.log('APMS', "Auto Test: " + "removeNetworkMeasureProperty(networkMeasureId, 'key1');");
    this.console.log('APMS', "Auto Test: " + "getNetworkMeasureProperties(networkMeasureId); -- " + JSON.stringify(this._apms.getNetworkMeasureProperties(networkMeasureId)));
    this.hasAPMS && this._apms.startNetworkMeasure(networkMeasureId);
    this.httpPost(url).then(res => {
      huawei.agc.apms.apmsService.setNetworkMeasureStatusCode(networkMeasureId, res.status);
      if (res.status >= 200 && res.status < 300) {
        this.console.log(res.responseText);
      } else {
        this.console.log('HTTP post failed, status: ' + res.status);
      }
      this.hasAPMS && this._apms.stopNetworkMeasure(networkMeasureId);
      this.console.log('APMS', "stop network measure, id : " + networkMeasureId);
    });
  },

  returnClick() {
    cc.director.loadScene('list');
  },

  onDestroy() {},


  // update (dt) {},
});
