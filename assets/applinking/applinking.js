const PREFIX_URL = 'https://chuanqi.drcn.agconnect.link';
const DEEP_LINK = 'https://lcywzm.cn/temp/huatu1';
cc.Class({
    extends: cc.Component,

    properties: {
        console: require('Console'),
    },


    start() {
        this._shortLink = '';
        this._longLink = '';
        this.crashState = true;
        window._demoAppLinking = this;
        this.console.log('please build links before share');

        huawei.agc.applinking.appLinkingService.on(huawei.agc.applinking.AGC_APP_LINKING_EVENT_LISTENER_NAME.RECEIVE_LINK_CALLBACK, (data) => {
            if (data.code === 1) {
                this.console.log('receive deepLink：', data.getDeepLink());
            } else {
                this.console.log('receive deepLink：', data.errMsg);
            }
        }, this);
    },

    returnClick() {
        cc.director.loadScene('list');
    },

    onDestroy() {
        huawei.agc.applinking.appLinkingService.targetOff(this);
    },

    buildShortLink() {
        huawei.agc.applinking.appLinkingService.once(huawei.agc.applinking.AGC_APP_LINKING_EVENT_LISTENER_NAME.BUILD_SHORT_LINK, (data) => {
            if (data.code === 1) {
                this._shortLink = data.data;
                this.console.log('build short link success：', this._shortLink);
            }
        }, this);
        huawei.agc.applinking.appLinkingService.buildShortLink(this._genLinkInfo());
    },

    _genLinkInfo() {
        let linkInfo = new huawei.agc.applinking.AppLinking();

        let linkBuilder = new huawei.agc.applinking.Builder();
        linkBuilder.setDeepLink(DEEP_LINK);
        linkBuilder.setUriPrefix(PREFIX_URL);
        linkInfo.setBuilder(linkBuilder);

        let socialBuilder = new huawei.agc.applinking.SocialCardInfo();
        socialBuilder.setDescription('this is a test case');
        socialBuilder.setImageUrl('http://lcywzm.cn/temp/huatu1/res/avg/fc/fcd923bf-ab2b-4a2a-87cd-0cdc647ba006.1e14a.jpg');
        socialBuilder.setTitle('AppLinking Test');
        linkInfo.setSocialCardInfo(socialBuilder);

        let campaignInfo = new huawei.agc.applinking.CampaignInfo();
        campaignInfo.setMedium('test-medium');
        campaignInfo.setSource('test-source');
        campaignInfo.setName('test-name');
        linkInfo.setCampaignInfo(campaignInfo);

        let androidLinkInfo = new huawei.agc.applinking.AndroidLinkInfo();
        androidLinkInfo.setMinimumVersion(1);
        linkInfo.setAndroidLinkInfo(androidLinkInfo);
        // androidLinkInfo.setFallbackUrl('https://lcywzm.cn/feedback');
        androidLinkInfo.setOpenType(huawei.agc.applinking.AndroidOpenType.AppGallery);
        return linkInfo;
    },

    buildLongLink() {
        this._longLink = huawei.agc.applinking.appLinkingService.buildLongLink(this._genLinkInfo());
        this.console.log('build long link success', this._longLink);
    },

    shareShortLink() {
        if (!this._shortLink) {
            this.console.error('current short link is empty, please build one first');
            return;
        }
        huawei.agc.applinking.appLinkingService.shareLink(this._shortLink);
    },

    shareLongLink() {
        if (!this._longLink) {
            this.console.error('current long link is empty, please build one first');
            return;
        }
        huawei.agc.applinking.appLinkingService.shareLink(this._longLink);
    },

    buildShortLinkFromLongLink() {
        if (!this._longLink) {
            this.console.error('current long link is empty, please build one first');
            return;
        }
        huawei.agc.applinking.appLinkingService.once(huawei.agc.applinking.AGC_APP_LINKING_EVENT_LISTENER_NAME.BUILD_SHORT_LINK_FROM_LONG_LINK, (data) => {
            if (data.code === 1) {
                this._shortLink = data.data;
                this.console.log('build short link success：', this._shortLink);
            }
        }, this);
        huawei.agc.applinking.appLinkingService.buildShortLinkFromLongLink(this._longLink);
    },
    // update (dt) {},
});
