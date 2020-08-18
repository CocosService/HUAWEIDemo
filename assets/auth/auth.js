cc.Class({
  extends: cc.Component,

  properties: {
    console: require('Console'),
    verifyCode: cc.EditBox,
  },

  start() {
    this.hasAuth = huawei && huawei.agc && huawei.agc.auth && huawei.agc.auth.authService && huawei.agc.auth.authService.support ? true : false;
    if (!this.hasAuth) return;
    this.loginInfo = {
      email: 'test@test.com', // email provider need
      phoneNumber: "181********", // phone provider need
      countryCode: "86", // phone provider need
      verifyCode: "", // after get user info nend reset login info with verify code
      action: "register", // regiser, reset
    }
    this._auth = huawei.agc.auth.authService;
    this._auth.setAuthListener((retCode, msg) => this.console.log("Auth", `${retCode}: ${msg}`))
  },

  returnClick() {
    cc.director.loadScene('list');
  },

  switchAuthType() {
    cc.director.loadScene('providers');
    if (!this.hasAuth) return;
    this._auth.action = 'login';
  },

  onDestroy() {},

  login() {
    if (!this.hasAuth) return;
    if (typeof this._auth.loginAuthType == 'undefined') return this.console.log("Auth", `please click Switch Auth Provider!`);
    this._auth.switchAuthType(this._auth.loginAuthType);
    if (this._auth.loginAuthType === huawei.agc.auth.AuthProvider.Phone_Provider || this._auth.loginAuthType === huawei.agc.auth.AuthProvider.Email_Provider) {
      if (!this.verifyCode.string) return this.console.log('Auth', 'Please input verify code!');
      this.loginInfo.verifyCode = this.verifyCode.string;
      this._auth.setLoginInfo(this.loginInfo);
    }
    this._auth.login();
  },

  logout() {
    this._auth.switchAuthType(this._auth.loginAuthType);
    this.hasAuth && this._auth.logout();
  },

  getVerifyCode() {
    this._auth.switchAuthType(this._auth.loginAuthType);
    this.hasAuth && this._auth.setLoginInfo(this.loginInfo);
    this.hasAuth && this._auth.getVerifyCode();
  },

  getUserInfo() {
    if (!this.hasAuth) return;
    let userInfo = this._auth.getUserInfo();
    this.console.log('Auth', JSON.stringify(userInfo));
  },

  // update (dt) {},
});