cc.Class({
  extends: cc.Component,

  properties: {
    console: require('Console'),
    numberContainer: cc.Node,
    codeContainer: cc.Node,
    verifyCode: cc.EditBox,
    numberLabel: cc.Label,
    countryCode: cc.EditBox,
    numberOrEmial: cc.EditBox,
  },

  start() {
    this.hasAuth = huawei && huawei.agc && huawei.agc.auth && huawei.agc.auth.authService && huawei.agc.auth.authService.support ? true : false;
    if (!this.hasAuth) return;
    this.loginInfo = {
      email: '', // email provider need
      phoneNumber: "", // phone provider need
      countryCode: "86", // phone provider need
      verifyCode: "", // after get user info nend reset login info with verify code
      action: "register", // regiser, reset
    }
    this._auth = huawei.agc.auth.authService;
    this._auth.setAuthListener((retCode, msg) => this.console.log("Auth", `${retCode}: ${msg}`))
    this.numberContainer.active = false;
    this.codeContainer.active = false;
    if (typeof this._auth.loginAuthType !== 'undefined') {
      if (this._auth.loginAuthType === huawei.agc.auth.AuthProvider.Phone_Provider) {
        this.numberContainer.active = true;
        this.codeContainer.active = true;
        this.numberLabel.string = 'Phone';
        this.countryCode.node.active = true;
      } else if (this._auth.loginAuthType === huawei.agc.auth.AuthProvider.Email_Provider) {
        this.numberContainer.active = true;
        this.codeContainer.active = true;
        this.numberLabel.string = 'Email';
        this.countryCode.node.active = false;
      }
    }
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
    if (this._auth.loginAuthType === huawei.agc.auth.AuthProvider.Phone_Provider) {
      if (!this.countryCode.string) return this.console.log('Auth', 'Please input country code!');
      if (!this.numberOrEmial.string) return this.console.log('Auth', 'Please input phone number!');
      if (!this.verifyCode.string) return this.console.log('Auth', 'Please input verify code!');
      this.loginInfo.countryCode = this.countryCode.string;
      this.loginInfo.phoneNumber = this.numberOrEmial.string;
      this.loginInfo.verifyCode = this.verifyCode.string;
    } else if (this._auth.loginAuthType === huawei.agc.auth.AuthProvider.Email_Provider) {
      if (!this.numberOrEmial.string) return this.console.log('Auth', 'Please input email!');
      if (!this.verifyCode.string) return this.console.log('Auth', 'Please input verify code!');
      this.loginInfo.email = this.numberOrEmial.string;
      this.loginInfo.verifyCode = this.verifyCode.string;
    }
    this._auth.setLoginInfo(this.loginInfo);
    this._auth.login();
  },

  logout() {
    this._auth.switchAuthType(this._auth.loginAuthType);
    this.hasAuth && this._auth.logout();
  },

  link() {
    if (!this.hasAuth) return;
    if (typeof this._auth.loginAuthType == 'undefined') return this.console.log("Auth", `please click Switch Auth Provider!`);
    if (this._auth.loginAuthType === huawei.agc.auth.AuthProvider.Phone_Provider) {
      if (!this.countryCode.string) return this.console.log('Auth', 'Please input country code!');
      if (!this.numberOrEmial.string) return this.console.log('Auth', 'Please input phone number!');
      if (!this.verifyCode.string) return this.console.log('Auth', 'Please input verify code!');
      this.loginInfo.countryCode = this.countryCode.string;
      this.loginInfo.phoneNumber = this.numberOrEmial.string;
      this.loginInfo.verifyCode = this.verifyCode.string;
    } else if (this._auth.loginAuthType === huawei.agc.auth.AuthProvider.Email_Provider) {
      if (!this.numberOrEmial.string) return this.console.log('Auth', 'Please input email!');
      if (!this.verifyCode.string) return this.console.log('Auth', 'Please input verify code!');
      this.loginInfo.email = this.numberOrEmial.string;
      this.loginInfo.verifyCode = this.verifyCode.string;
    }
    this._auth.setLoginInfo(this.loginInfo);
    this._auth.link(this._auth.loginAuthType);
  },

  unlink() {
    if (!this.hasAuth) return;
    if (typeof this._auth.loginAuthType == 'undefined') return this.console.log("Auth", `please click Switch Auth Provider!`);
    this._auth.unlink(this._auth.loginAuthType);
  },

  getVerifyCode() {
    if (!this.hasAuth) return;
    this._auth.switchAuthType(this._auth.loginAuthType);
    if (this._auth.loginAuthType === huawei.agc.auth.AuthProvider.Phone_Provider) {
      if (!this.countryCode.string) return this.console.log('Auth', 'Please input country code!');
      if (!this.numberOrEmial.string) return this.console.log('Auth', 'Please input phone number!');
      this.loginInfo.countryCode = this.countryCode.string;
      this.loginInfo.phoneNumber = this.numberOrEmial.string;
      this.loginInfo.verifyCode = this.verifyCode.string;
    } else if (this._auth.loginAuthType === huawei.agc.auth.AuthProvider.Email_Provider) {
      if (!this.numberOrEmial.string) return this.console.log('Auth', 'Please input email!');
      this.loginInfo.email = this.numberOrEmial.string;
      this.loginInfo.verifyCode = this.verifyCode.string;
    }
    this._auth.setLoginInfo(this.loginInfo);
    this._auth.getVerifyCode();
  },

  getUserInfo() {
    if (!this.hasAuth) return;
    let userInfo = this._auth.getUserInfo();
    this.console.log('Auth', JSON.stringify(userInfo));
  },

  // update (dt) {},
});