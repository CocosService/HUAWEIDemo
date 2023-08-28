import { _decorator, Component, loader, director, CCString, EventTarget } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

/**
 * 华为账号
*/
@ccclass('Account')
export class Account extends Component {
    @property({ type: Console })
    consolePanel: Console = null!;


    private account: typeof huawei.hms.account.accountService = (typeof huawei ===
        'undefined'
        ? null
        : huawei?.hms?.account?.accountService)!;


    onEnable () {
    }

    onDisable (): void {
    }



    /**
     * 登陆 AuthorizationCode
    */
    loginByAuthorizationCode () {
        this.account.once(huawei.hms.account.API_EVENT_LIST.loginCallback, (result: huawei.hms.account.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        this.account.login("AuthorizationCode");
    }

    /**
     * 登陆 IDToken
    */
    loginByIDToken () {
        this.account.once(huawei.hms.account.API_EVENT_LIST.loginCallback, (result: huawei.hms.account.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        this.account.login("IDToken");
    }


    /**
     * 登陆 Silent
    */
    loginBySilent () {
        this.account.once(huawei.hms.account.API_EVENT_LIST.loginCallback, (result: huawei.hms.account.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        this.account.login("Silent");
    }

    /**
     * 退出账号
    */
    logout () {
        this.account.once(huawei.hms.account.API_EVENT_LIST.logoutCallback, (result: huawei.hms.account.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        this.account.logout();
    }


    /**
     * 取消授权
    */
    cancelAuthorization () {
        this.account.once(huawei.hms.account.API_EVENT_LIST.cancelAuthorizationCallback, (result: huawei.hms.account.ApiCbResult) => {
            this.consolePanel.log(result);
        }, this)
        this.account.cancelAuthorization();
    }
}
