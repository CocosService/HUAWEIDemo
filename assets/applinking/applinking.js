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
        this.console.log('请先生成链接再点击分享');

        huawei.AGC.appLinkingService.on(huawei.AGC.AGC_APP_LINKING_EVENT_LISTENER_NAME.RECEIVE_LONG_LINK_CALLBACK, (data) => {
            if (data.code === 1) {
                this.console.log('接收到deepLink：', data.getDeepLink());
            }
        }, this);
    },

    returnClick() {
        cc.director.loadScene('list');
    },

    onDestroy() {
        huawei.AGC.appLinkingService.targetOff(this);
    },

    buildShortLink() {
        huawei.AGC.appLinkingService.once(huawei.AGC.AGC_APP_LINKING_EVENT_LISTENER_NAME.BUILD_SHORT_LINK, (data) => {
            if (data.code === 1) {
                this._shortLink = data.data;
                this.console.log('构建短链接成功：', this._shortLink);
            }
        }, this);
        huawei.AGC.appLinkingService.buildShortLink(this._genLinkInfo());
    },

    _genLinkInfo() {
        let linkInfo = new huawei.AGC.AGCAppLinking();

        let linkBuilder = new huawei.AGC.AppLinkingBuilder();
        linkBuilder.setDeepLink(DEEP_LINK);
        linkBuilder.setUriPrefix(PREFIX_URL);
        linkInfo.setBuilder(linkBuilder);

        let socialBuilder = new huawei.AGC.AppLinkingSocialCardInfo();
        socialBuilder.setDescription('这是一个测试例');
        socialBuilder.setImageUrl('http://lcywzm.cn/temp/huatu1/res/avg/fc/fcd923bf-ab2b-4a2a-87cd-0cdc647ba006.1e14a.jpg');
        socialBuilder.setTitle('AppLinking Test');
        linkInfo.setSocialCardInfo(socialBuilder);

        let campaignInfo = new huawei.AGC.AppLinkingCampaignInfo();
        campaignInfo.setMedium('test-medium');
        campaignInfo.setSource('test-source');
        campaignInfo.setName('test-name');
        linkInfo.setCampaignInfo(campaignInfo);

        let androidLinkInfo = new huawei.AGC.AppLinkingAndroidLinkInfo();
        androidLinkInfo.setMinimumVersion(1);
        linkInfo.setAndroidLinkInfo(androidLinkInfo);
        return linkInfo;
    },

    buildLongLink() {
        this._longLink = huawei.AGC.appLinkingService.buildLongLink(this._genLinkInfo());
        this.console.log('构建长链接成功，', this._longLink);
    },

    shareShortLink() {
        if (!this._shortLink) {
            this.console.error('当前短链接为空，无法分享');
            return;
        }
        huawei.AGC.appLinkingService.shareLink(this._shortLink);
    },

    shareLongLink() {
        if (!this._longLink) {
            this.console.error('当前长链接为空，无法分享');
            return;
        }
        huawei.AGC.appLinkingService.shareLink(this._longLink);
    },

    buildShortLinkFromLongLink() {
        if (!this._longLink) {
            this.console.error('当前长链接为空，无法生成短链接');
            return;
        }
        huawei.AGC.appLinkingService.once(huawei.AGC.AGC_APP_LINKING_EVENT_LISTENER_NAME.BUILD_SHORT_LINK_FROM_LONG_LINK, (data) => {
            if (data.code === 1) {
                this._shortLink = data.data;
                this.console.log('构建短链接成功：', this._shortLink);
            }
        }, this);
        huawei.AGC.appLinkingService.buildShortLinkFromLongLink(this._longLink);
    },
    // update (dt) {},
});
