import { _decorator, Component } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('AppMessaging')
export class AppMessaging extends Component {
    @property({ type: Console })
    console: Console = null!;

    private displayEnable = false;
    private fetchEnable = false;
    private currentLocation!: huawei.agc.appmessaging.Location;

    start() {
        this.console.log(
            'please open and config app message at AGC website first'
        );
        this.console.log(
            'you need to add AAID to AGC website for enabling debug mode'
        );
        this.currentLocation = huawei.agc.appmessaging.Location.CENTER;
        this.initListener();
    }

    initListener() {
        huawei.agc.appmessaging.appMessagingService.on(
            huawei.agc.appmessaging.AGC_APP_MESSAGING_LISTENER_NAME
                .ON_MESSAGE_DISMISS,
            (result) => {
                this.console.log(
                    'receive ON_MESSAGE_DISMISS',
                    JSON.stringify(result)
                );
            },
            this
        );
        huawei.agc.appmessaging.appMessagingService.on(
            huawei.agc.appmessaging.AGC_APP_MESSAGING_LISTENER_NAME
                .ON_MESSAGE_CLICK,
            (result) => {
                this.console.log(
                    'receive ON_MESSAGE_CLICK',
                    JSON.stringify(result)
                );
            },
            this
        );
        huawei.agc.appmessaging.appMessagingService.on(
            huawei.agc.appmessaging.AGC_APP_MESSAGING_LISTENER_NAME
                .ON_MESSAGE_DISPLAY,
            (result) => {
                this.console.log(
                    'receive ON_MESSAGE_DISPLAY',
                    JSON.stringify(result)
                );
            },
            this
        );

        huawei.agc.appmessaging.appMessagingService.on(
            huawei.agc.appmessaging.AGC_APP_MESSAGING_LISTENER_NAME
                .ON_MESSAGE_ERROR,
            (result) => {
                this.console.log(
                    'receive ON_MESSAGE_ERROR',
                    JSON.stringify(result)
                );
            },
            this
        );
    }

    onDestroy() {
        huawei.agc.appmessaging.appMessagingService.targetOff(this);
    }

    getAAID() {
        this.console.log(
            'current AAID',
            huawei.agc.appmessaging.appMessagingService.getAAID()
        );
    }

    setForceFetch() {
        huawei.agc.appmessaging.appMessagingService.setForceFetch();
        this.console.log('set force fetch');
    }

    setDisplayEnable() {
        huawei.agc.appmessaging.appMessagingService.setDisplayEnable(
            this.displayEnable
        );
        this.console.log('setDisplayEnable', this.displayEnable);
        this.displayEnable = !this.displayEnable;
    }

    isDisplayEnable() {
        this.console.log(
            'isDisplayEnable',
            huawei.agc.appmessaging.appMessagingService.isDisplayEnable()
        );
    }

    setFetchMessageEnable() {
        huawei.agc.appmessaging.appMessagingService.setFetchMessageEnable(
            this.fetchEnable
        );
        this.console.log('setFetchMessageEnable', this.fetchEnable);
        this.fetchEnable = !this.fetchEnable;
    }

    isFetchMessageEnable() {
        this.console.log(
            'isFetchMessageEnable',
            huawei.agc.appmessaging.appMessagingService.isFetchMessageEnable()
        );
    }

    setLocation() {
        const appmessaging = huawei.agc.appmessaging;

        if (this.currentLocation === appmessaging.Location.BOTTOM)
            this.currentLocation = appmessaging.Location.CENTER;
        else this.currentLocation = appmessaging.Location.BOTTOM;

        appmessaging.appMessagingService.setDisplayLocation(
            this.currentLocation
        );

        this.console.log(
            'set location to',
            appmessaging.Location[this.currentLocation]
        );
    }

    triggerDisplayAd() {
        const eventId = '$DisplayAd';
        huawei.agc.appmessaging.appMessagingService.trigger(eventId);
        this.console.log('trigger', eventId);
    }
}
