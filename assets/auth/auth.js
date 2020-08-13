const hasAuth = huawei && huawei.AGC && huawei.AGC.auth && huawei.AGC.auth.switchAuthType ? true : false;
cc.Class({
  extends: cc.Component,

  properties: {
    console: require('Console'),
    verifyCode: cc.EditBox,
  },

  start() {
    if (!hasAuth) return;
    this.loginInfo = {
      email: 'test@test.com', // email provider need
      phoneNumber: "181********", // phone provider need
      countryCode: "86", // phone provider need
      verifyCode: "", // after get user info nend reset login info with verify code
      action: "register", // regiser, reset
    }
    this._auth = huawei.AGC.auth;
    this._auth.setAuthListener((retCode, msg) => {
      this.console.log("Auth", `${retCode}: ${msg}`);
    })
  },

  returnClick() {
    cc.director.loadScene('list');
  },

  switchAuthType() {
    cc.director.loadScene('providers');
    if (!hasAuth) return;
    this._auth.action = 'login';
  },

  onDestroy() {},

  login() {
    if (!hasAuth) return;
    if (typeof this._auth.loginAuthType == 'undefined') return this.console.log("Auth", `please click Switch Auth Provider!`);
    this._auth.switchAuthType(this._auth.loginAuthType);
    if (this._auth.loginAuthType === this._auth.AuthProvider.Phone_Provider || this._auth.loginAuthType === this._auth.AuthProvider.Email_Provider) {
      if (!this.verifyCode.string) return this.console.log('Auth', 'Please input verify code!');
      this.loginInfo.verifyCode = this.verifyCode.string;
      this._auth.setLoginInfo(this.loginInfo);
    }
    this._auth.login();
  },

  logout() {
    this._auth.switchAuthType(this._auth.loginAuthType);
    hasAuth && this._auth.logout();
  },

  getVerifyCode() {
    this._auth.switchAuthType(this._auth.loginAuthType);
    hasAuth && this._auth.setLoginInfo(this.loginInfo);
    hasAuth && this._auth.getVerifyCode();
  },

  getUserInfo() {
    if (!hasAuth) return;
    let userInfo = this._auth.getUserInfo();
    this.console.log('Auth', JSON.stringify(userInfo));
  },

  // update (dt) {},
});