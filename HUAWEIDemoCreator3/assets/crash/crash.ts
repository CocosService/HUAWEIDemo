import { _decorator, Component } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('Crash')
export class Crash extends Component {
    @property({ type: Console })
    console: Console = null!;

    private crashState = false;

    toggleCrashCollection() {
        huawei.agc.crash.crashService.enableCrashCollection(this.crashState);
        this.console.log(
            'enableCrashCollection invoke with state:',
            this.crashState
        );
        this.crashState = !this.crashState;
    }

    setCustomKey() {
        this.setCustomKeyAndLog('floatKey', 123.11);
        this.setCustomKeyAndLog('intKey', 123);
        this.setCustomKeyAndLog('stringKey', 'crash');
        this.setCustomKeyAndLog('boolKey', true);
    }

    setCustomKeyAndLog(key: string, value: any) {
        huawei.agc.crash.crashService.setCustomKey(key, value);
        this.console.log(`setCustomKey key: ${key}, value: ${value}`);
    }

    setUserId() {
        const userId = 'HUAWEI_Crash_Demo';
        huawei.agc.crash.crashService.setUserId(userId);
        this.console.log(`setUserId: ${userId}`);
    }

    log() {
        const logType = huawei.agc.crash.LOG;
        this.logInCrashServiceAndConsole(logType.DEBUG, 'debug log invoke');
        this.logInCrashServiceAndConsole(logType.INFO, 'info log invoke');
        this.logInCrashServiceAndConsole(logType.WARN, 'warn log invoke');
        this.logInCrashServiceAndConsole(logType.ERROR, 'error log invoke');
        this.logInCrashServiceAndConsole(logType.VERBOSE, 'verbose log invoke');
    }

    logInCrashServiceAndConsole(level: huawei.agc.crash.LOG, content: string) {
        huawei.agc.crash.crashService.log(level, content);
        this.console.log(
            `log, level: ${huawei.agc.crash.LOG[level]}, content: ${content}`
        );
    }

    testJavaCrash() {
        let time = 5;
        this.console.log(`app will cause a java crash in ${time} seconds, \
please restart the app and wait for a while and then check the crash at the AGC website`);
        this.scheduleOnce(() => {
            huawei.agc.crash.crashService.testIt();
        }, time);
    }

    testNativeCrash() {
        let time = 5;
        this.console.log(`app will cause a native crash in ${time} seconds, \
please restart the app and wait for a while and then check the crash at the AGC website`);
        this.scheduleOnce(() => {
            agcnativecrash.crashTest();
        }, time);
    }
}
