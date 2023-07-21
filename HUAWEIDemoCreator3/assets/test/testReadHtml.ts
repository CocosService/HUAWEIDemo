import { _decorator, Component, Node, TextAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('testReadHtml')
export class testReadHtml extends Component {

    @property(TextAsset)
    public xml: TextAsset = null;

    private addServiceXml: string = `
    <service xmlns:android="http://schemas.android.com/apk/res/android"
            android:name=".ServiceHmsPush"
            android:exported="false">
            <intent-filter>
                <action android:name="com.huawei.push.action.MESSAGING_EVENT" />
            </intent-filter>
    </service>\n
    `;

    private addIntentXml: string = `
    <intent xmlns:android="http://schemas.android.com/apk/res/android">
            <action android:name="com.huawei.hms.core.aidlservice" />
    </intent>\n
    `;
    start () {
        this.remove();
    }


    private remove () {
        let parserMain = new DOMParser();
        let xmlDocMain = parserMain.parseFromString(this.xml.text, "text/xml");
        let manifestArr = xmlDocMain.getElementsByTagName("manifest");
        let applicationArr = xmlDocMain.getElementsByTagName("application");
        let queriesArr = xmlDocMain.getElementsByTagName("queries");
        if (applicationArr.length != 0) {
            //获取匹配的 service 删除
            let serviceArr = applicationArr[0].getElementsByTagName("service");
            //判断是否需要再次添加
            for (let i = 0; i < serviceArr.length; i++) {
                const service = serviceArr[i];
                let data = service.getAttribute("android:name")
                if (data != null && data === ".ServiceHmsPush") {
                    applicationArr[0].removeChild(service);
                }
            }
        }
        if (queriesArr.length != 0) {
            //获取匹配的 intent 删除
            for (let index = 0; index < queriesArr.length; index++) {
                const queries = queriesArr[index];
                //查找 intent
                let queriesIntentArr = queries.getElementsByTagName("intent");
                for (let i = 0; i < queriesIntentArr.length; i++) {
                    const queriesIntent = queriesIntentArr[i];
                    let actionArr = queriesIntent.getElementsByTagName("action");
                    if (actionArr != null && actionArr.length != 0) {
                        for (let j = 0; j < actionArr.length; j++) {
                            if (actionArr[j].getAttribute("android:name") === "com.huawei.hms.core.aidlservice") {
                                //queries 内删除 整个 intent
                                queries.removeChild(queriesIntent);
                            };
                        }
                    }
                }
            }
        }

        let str = manifestArr[0].outerHTML;
        console.log(str);
    }



    private add () {
        let parserMain = new DOMParser();
        let xmlDocMain = parserMain.parseFromString(this.xml.text, "text/xml");
        let manifestArr = xmlDocMain.getElementsByTagName("manifest");
        //查找 application 是否存在 不存在则添加
        let applicationArr = xmlDocMain.getElementsByTagName("application");
        if (applicationArr.length == 0) {
            let node = xmlDocMain.createElement("application");
            manifestArr[0].appendChild(node);
        }

        //处理添加 service
        let needAddService = true;
        let serviceArr = applicationArr[0].getElementsByTagName("service");
        //判断是否需要再次添加
        for (let i = 0; i < serviceArr.length; i++) {
            const service = serviceArr[i];
            let data = service.getAttribute("android:name")
            if (data != null && data === ".ServiceHmsPush") {
                needAddService = false;
                console.warn("忽略添加")
                break;
            }
        }

        if (needAddService == true) {
            let parserService = new DOMParser();
            let xmlDocService = parserService.parseFromString(this.addServiceXml, "text/xml");
            //实际只有一个
            let serviceArr = xmlDocService.getElementsByTagName("service");
            for (let i = 0; i < serviceArr.length; i++) {
                const service = serviceArr[i];
                applicationArr[0].appendChild(service);
            }
        }
        //处理添加 queries
        //查找 queries 是否存在 不存在则添加
        let queriesArr = xmlDocMain.getElementsByTagName("queries");
        if (queriesArr.length == 0) {
            let node = xmlDocMain.createElement("queries");
            manifestArr[0].appendChild(node);
        }

        //是否要塞入
        let needAddQueriesIntent = true;
        for (let index = 0; index < queriesArr.length; index++) {
            const queries = queriesArr[index];
            //查找 intent
            let queriesIntentArr = queries.getElementsByTagName("intent");
            for (let i = 0; i < queriesIntentArr.length; i++) {
                const queriesIntent = queriesIntentArr[i];
                let actionArr = queriesIntent.getElementsByTagName("action");
                if (actionArr != null && actionArr.length != 0) {
                    for (let j = 0; j < actionArr.length; j++) {
                        if (actionArr[j].getAttribute("android:name") === "com.huawei.hms.core.aidlservice") {
                            console.warn("忽略添加");
                            needAddQueriesIntent = false;
                        };
                    }
                }
            }
        }

        if (needAddQueriesIntent == true) {
            let parserIntent = new DOMParser();
            let xmlDocService = parserIntent.parseFromString(this.addIntentXml, "text/xml");
            //实际只有一个
            let intentArr = xmlDocService.getElementsByTagName("intent");
            for (let i = 0; i < intentArr.length; i++) {
                const intent = intentArr[i];
                queriesArr[0].appendChild(intent);
            }
        }

        //移除 多余的 xmlns:android="http://schemas.android.com/apk/res/android"
        let str = manifestArr[0].outerHTML;
        str = str.replace(`service xmlns:android="http://schemas.android.com/apk/res/android"`, "service");
        str = str.replace(`intent xmlns:android="http://schemas.android.com/apk/res/android"`, "intent");

        console.log(str);
    }


}

