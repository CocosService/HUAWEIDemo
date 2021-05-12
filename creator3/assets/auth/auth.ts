import { _decorator, Component, director, Label, sys, Node, Button } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('Auth')
export class Auth extends Component {
    @property({ type: Console })
    console: Console = null!;

    @property({ type: Label })
    labelCurProvider: Label = null!;

    @property({ type: Node })
    phoneContainer: Node = null!;
    @property({ type: Label })
    labelCountryCode: Label = null!;
    @property({ type: Label })
    labelPhoneNumber: Label = null!;

    @property({ type: Node })
    emailContainer: Node = null!;
    @property({ type: Label })
    labelEmail: Label = null!;

    @property({ type: Button })
    buttonGetVerifyCode: Button = null!;

    @property({ type: Node })
    verifyCodeContainer: Node = null!;
    @property({ type: Label })
    labelVerifyCode: Label = null!;

    curProviderType = -1;

    private loginInfo = {
        email: '', // email provider required
        phoneNumber: '', // phone provider required
        countryCode: '86', // phone provider need
        verifyCode: '', // after `register` or `getVerifyCode` called, reset login info with verify code
        action: 'register', // `register` or `reset`
    };

    start() {
        const auth = huawei.agc.auth;

        this.curProviderType = parseInt(
            sys.localStorage.getItem('agcAuthCurProviderType') || '-1'
        );

        if (this.curProviderType === -1)
            this.labelCurProvider.string = 'Not Selected';
        else
            this.labelCurProvider.string =
                auth.AuthProvider[this.curProviderType];

        const authProvider = auth.AuthProvider;
        this.phoneContainer.active =
            this.curProviderType === authProvider.Phone_Provider;
        this.emailContainer.active =
            this.curProviderType === authProvider.Email_Provider;
        this.buttonGetVerifyCode.node.active =
            this.phoneContainer.active || this.emailContainer.active;
        this.verifyCodeContainer.active = this.buttonGetVerifyCode.node.active;

        if (this.curProviderType !== -1)
            auth.authService.switchAuthType(this.curProviderType);

        auth.authService.setAuthListener((retCode, msg) => {
            this.console.log('auth listener:', `${retCode}: ${msg}`);
        });
    }

    switchAuthProvider() {
        director.loadScene('auth-switch-provider');
    }

    checkProviderSelected(): boolean {
        if (this.curProviderType === -1) {
            this.console.log('please choose a auth provider first');
            return false;
        }
        return true;
    }

    getVerifyCode() {
        if (!this.checkProviderSelected()) return;

        const authProvider = huawei.agc.auth.AuthProvider;

        this.fillLoginInfo(false);

        huawei.agc.auth.authService.getVerifyCode();
    }

    login() {
        if (!this.checkProviderSelected()) return;

        this.fillLoginInfo();

        huawei.agc.auth.authService.login();
    }

    logout() {
        if (!this.checkProviderSelected()) return;

        huawei.agc.auth.authService.logout();
    }

    link() {
        if (!this.checkProviderSelected()) return;

        this.fillLoginInfo(false);

        huawei.agc.auth.authService.link(this.curProviderType);
    }

    unlink() {
        if (!this.checkProviderSelected()) return;

        huawei.agc.auth.authService.unlink(this.curProviderType);
    }

    getUserInfo() {
        const userInfo = huawei.agc.auth.authService.getUserInfo();
        this.console.log('userInfo:', userInfo);
    }

    fillLoginInfo(checkVerifyCode = true) {
        const authProvider = huawei.agc.auth.AuthProvider;

        if (
            this.curProviderType !== authProvider.Phone_Provider &&
            this.curProviderType !== authProvider.Email_Provider
        )
            return;

        switch (this.curProviderType) {
            case authProvider.Phone_Provider:
                const countryCode = this.labelCountryCode.string;
                const phoneNumber = this.labelPhoneNumber.string;
                if (!phoneNumber || !countryCode) {
                    this.console.log(
                        'please input the country code and phone number first'
                    );
                    return;
                }
                this.loginInfo.countryCode = countryCode;
                this.loginInfo.phoneNumber = phoneNumber;
                break;
            case authProvider.Email_Provider:
                const email = this.labelEmail.string;
                if (!email) {
                    this.console.log('please input the email first');
                    return;
                }
                this.loginInfo.email = email;
                break;
        }
        if (checkVerifyCode && !this.labelVerifyCode.string) {
            this.console.log('please input the verify code first');
            return;
        }
        this.loginInfo.verifyCode = this.labelVerifyCode.string;
        huawei.agc.auth.authService.setLoginInfo(this.loginInfo);
    }
}
