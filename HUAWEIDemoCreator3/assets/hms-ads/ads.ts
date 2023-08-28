import { _decorator, Component, loader, director, CCString, EventTarget } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

/**
 * 华为广告
 * https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/publisher-service-introduction-0000001070671805
*/
@ccclass('Ads')
export class Ads extends Component {
    @property({ type: Console })
    consolePanel: Console = null!;


    private ads: typeof huawei.hms.ads.adsService = (typeof huawei ===
        'undefined'
        ? null
        : huawei?.hms?.ads?.adsService)!;


    onEnable () {
        this._onAdEvent();
    }

    onDisable (): void {
        this._offAdEvent();
    }



    private _onAdEvent () {
        huawei.hms.ads.adsService.on(huawei.hms.ads.API_EVENT_LIST.showAdsCallback, (res: huawei.hms.ads.ApiCbResult) => { this.consolePanel && this.consolePanel.log("showAdsCallback\n" + res.toString()); }, this, false);
        huawei.hms.ads.adsService.on(huawei.hms.ads.API_EVENT_LIST.preloadAdsCallback, (res: huawei.hms.ads.ApiCbResult) => { this.consolePanel && this.consolePanel.log("preloadAdsCallback\n" + res.toString()); }, this, false);

        huawei.hms.ads.adsService.on(huawei.hms.ads.API_EVENT_LIST.onAdLoadedCallback, (res: huawei.hms.ads.ApiCbResult) => { this.consolePanel && this.consolePanel.log("onAdLoadedCallback\n" + res.toString()); }, this, false);
        huawei.hms.ads.adsService.on(huawei.hms.ads.API_EVENT_LIST.onAdFailedCallback, (res: huawei.hms.ads.ApiCbResult) => { this.consolePanel && this.consolePanel.log("onAdFailedCallback\n" + res.toString()); }, this, false);
        huawei.hms.ads.adsService.on(huawei.hms.ads.API_EVENT_LIST.onAdOpenedCallback, (res: huawei.hms.ads.ApiCbResult) => { this.consolePanel && this.consolePanel.log("onAdOpenedCallback\n" + res.toString()); }, this, false);
        huawei.hms.ads.adsService.on(huawei.hms.ads.API_EVENT_LIST.onAdClickedCallback, (res: huawei.hms.ads.ApiCbResult) => { this.consolePanel && this.consolePanel.log("onAdClickedCallback\n" + res.toString()); }, this, false);
        huawei.hms.ads.adsService.on(huawei.hms.ads.API_EVENT_LIST.onAdLeaveCallback, (res: huawei.hms.ads.ApiCbResult) => { this.consolePanel && this.consolePanel.log("onAdLeaveCallback\n" + res.toString()); }, this, false);
        huawei.hms.ads.adsService.on(huawei.hms.ads.API_EVENT_LIST.onAdClosedCallback, (res: huawei.hms.ads.ApiCbResult) => { this.consolePanel && this.consolePanel.log("onAdClosedCallback\n" + res.toString()); }, this, false);

        huawei.hms.ads.adsService.on(huawei.hms.ads.API_EVENT_LIST.onVideoStartCallback, (res: huawei.hms.ads.ApiCbResult) => { this.consolePanel && this.consolePanel.log("onVideoStartCallback\n" + res.toString()); }, this, false);
        huawei.hms.ads.adsService.on(huawei.hms.ads.API_EVENT_LIST.onVideoPlayCallback, (res: huawei.hms.ads.ApiCbResult) => { this.consolePanel && this.consolePanel.log("onVideoPlayCallback\n" + res.toString()); }, this, false);
        huawei.hms.ads.adsService.on(huawei.hms.ads.API_EVENT_LIST.onVideoEndCallback, (res: huawei.hms.ads.ApiCbResult) => { this.consolePanel && this.consolePanel.log("onVideoEndCallback\n" + res.toString()); }, this, false);

        huawei.hms.ads.adsService.on(huawei.hms.ads.API_EVENT_LIST.onRewardAdOpenedCallback, (res: huawei.hms.ads.ApiCbResult) => { this.consolePanel && this.consolePanel.log("onRewardAdOpenedCallback\n" + res.toString()); }, this, false);
        huawei.hms.ads.adsService.on(huawei.hms.ads.API_EVENT_LIST.onRewardAdClosedCallback, (res: huawei.hms.ads.ApiCbResult) => { this.consolePanel && this.consolePanel.log("onRewardAdClosedCallback\n" + res.toString()); }, this, false);
        huawei.hms.ads.adsService.on(huawei.hms.ads.API_EVENT_LIST.onRewardAdFailedToShowCallback, (res: huawei.hms.ads.ApiCbResult) => { this.consolePanel && this.consolePanel.log("onRewardAdFailedToShowCallback\n" + res.toString()); }, this, false);
        huawei.hms.ads.adsService.on(huawei.hms.ads.API_EVENT_LIST.onRewardedCallback, (res: huawei.hms.ads.ApiCbResult) => { this.consolePanel && this.consolePanel.log("onRewardedCallback\n" + res.toString()); }, this, false);
    }

    private _offAdEvent () {
        huawei.hms.ads.adsService.off(huawei.hms.ads.API_EVENT_LIST.showAdsCallback);
        huawei.hms.ads.adsService.off(huawei.hms.ads.API_EVENT_LIST.preloadAdsCallback);

        huawei.hms.ads.adsService.off(huawei.hms.ads.API_EVENT_LIST.onAdLoadedCallback);
        huawei.hms.ads.adsService.off(huawei.hms.ads.API_EVENT_LIST.onAdFailedCallback);
        huawei.hms.ads.adsService.off(huawei.hms.ads.API_EVENT_LIST.onAdOpenedCallback);
        huawei.hms.ads.adsService.off(huawei.hms.ads.API_EVENT_LIST.onAdClickedCallback);
        huawei.hms.ads.adsService.off(huawei.hms.ads.API_EVENT_LIST.onAdLeaveCallback);
        huawei.hms.ads.adsService.off(huawei.hms.ads.API_EVENT_LIST.onAdClosedCallback);

        huawei.hms.ads.adsService.off(huawei.hms.ads.API_EVENT_LIST.onVideoStartCallback);
        huawei.hms.ads.adsService.off(huawei.hms.ads.API_EVENT_LIST.onVideoPlayCallback);
        huawei.hms.ads.adsService.off(huawei.hms.ads.API_EVENT_LIST.onVideoEndCallback);

        huawei.hms.ads.adsService.off(huawei.hms.ads.API_EVENT_LIST.onRewardAdOpenedCallback);
        huawei.hms.ads.adsService.off(huawei.hms.ads.API_EVENT_LIST.onRewardAdClosedCallback);
        huawei.hms.ads.adsService.off(huawei.hms.ads.API_EVENT_LIST.onRewardAdFailedToShowCallback);
        huawei.hms.ads.adsService.off(huawei.hms.ads.API_EVENT_LIST.onRewardedCallback);
    }



    //Banner
    showBannerAd () {
        let params = {
            adId: "testw6vs28auh3",
            pos: "0",
            adSize: "BANNER_SIZE_320_50"
        };
        this.ads.showAds("Banner", JSON.stringify(params));
    }
    hideBannerAd () {
        let params = {
            adId: "testw6vs28auh3",
        };
        this.ads.hideAds("Banner", JSON.stringify(params));
    }


    //Reward
    preloadRewardAd () {
        let params = {
            adId: "testx9dtjwj8hp",
        };
        this.ads.preloadAds("Reward", JSON.stringify(params));
    }
    showRewardAd () {
        let params = {
            adId: "testx9dtjwj8hp",
        };
        this.ads.showAds("Reward", JSON.stringify(params));
    }


    //Interstitial
    preloadInterstitialAd () {
        let params = {
            adId: "testb4znbuh3n2",
        };
        this.ads.preloadAds("Interstitial", JSON.stringify(params));
    }
    showInterstitialAd () {
        let params = {
            adId: "testb4znbuh3n2",
        };
        this.ads.showAds("Interstitial", JSON.stringify(params));
    }


    //Native
    showNativeAd () {
        let params = {
            adId: "testy63txaom86",
            nativeLayout: "native_small",
            requestCustomDislikeThisAd: "1",
            choicesPosition: "3",
            videoConfiguration: "1",
            audioFocusType: "NOT_GAIN_AUDIO_FOCUS_WHEN_MUTE",
            startMuted: "0",
            customizeOperateRequested: "1",
        };
        this.ads.showAds("Native", JSON.stringify(params));
    }
    hideNativeAd () {
        let params = {
            adId: "testy63txaom86",
        };
        this.ads.hideAds("Native", JSON.stringify(params));
    }
}
