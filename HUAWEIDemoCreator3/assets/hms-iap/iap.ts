import { _decorator, Component, loader, director, CCString, EventTarget } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

/**
 * 应用内支付
*/
@ccclass('Iap')
export class Iap extends Component {
    @property({ type: Console })
    consolePanel: Console = null!;




    //以下信息需要替换成开发者自己的，华为后台获取
    //iap支付公钥
    private iapPublicKey = 'MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEAz4AAQlPGHrNpKErQt+B1z/2jxkZ1XAW3nqU4upx32wRahr5ieY7n5iFUJxOWsrmMMeIIR98atGSaxbeGnZdV/Nz6DQ/Hj4TfgtZIBE4wXh7w1JHtYkWp/uLKm8wzouwIg/Y9WmGEAN/uP01FSC84WGyjuVhS6vaUUH4hXzbI/MUq4D+4EJw7iY75DjImu5M6T4yVTTciDbtXzT0lHbQ1uh28y9eR3Isj5xkzaQpGHfz3KAIApu3bhTy8PT1/QFw4xEESS9L+w/6l8t+bZ4F5n8mgvoxXHDoSvkMbSgzkNiRnH209F6DJbiE4D9j2oDzYV90KZFqCCnp4VOLrOAvGPpWHLuZbNHfMPEbT+vt2UG7Ra6+gCyOkE4w4iKAF0VAeRUtAH2YrVSm29MG4OxQsvb/hIs5VlpP7RhSJW6IQ4OEhDyi+G38gJMFcAXGLt0kqAX4HwvzvwX3ikrIRu7U/co66nqaCFozqCxOx/wqKxxs1lRRPEsZVoG7EVl6TD0OhAgMBAAE='

    //消耗商品id:
    private consumableProductId = "consume001";
    //非消耗商品id:
    private unConsumableProductId = "unConsume001";
    //订阅周商品ID：
    private subscriptionWeekProductId = "weekProduct001";



    //测试用,记录已经购买的但未消耗的商品信息（inAppPurchaseData），执行consumeOwnedPurchase会用到此参数
    //格式参考：https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/json-inapppurchasedata-0000001050986125
    private itemInfoArr_type_0: string[] = [];
    private itemInfoArr_type_1: string[] = [];
    private itemInfoArr_type_2: string[] = [];

    private iap: typeof huawei.hms.iap.iapService = (typeof huawei ===
        'undefined'
        ? null
        : huawei?.hms?.iap?.iapService)!;


    onEnable () {
        //debug 按需开启
        // this.iap.on(huawei.hms.iap.API_EVENT_LIST.debugApiResult, (res: huawei.hms.iap.ApiCbResult) => {
        //     if (this.consolePanel) {
        //         this.consolePanel.log("[debug]" + res.toString());
        //     } else {
        //         console.error("console panel == null");
        //     }
        // }, this, false);
    }

    onDisable (): void {
        //debug 按需开启
        // this.iap.off(huawei.hms.iap.API_EVENT_LIST.debugApiResult);
    }

    //--------------------------------

    /**
     * 初始化
    */
    init () {
        this.iap.once(huawei.hms.iap.API_EVENT_LIST.initCallBack, (res: huawei.hms.iap.ApiCbResult) => {
            this.consolePanel && this.consolePanel.log(res);
        });
        this.iap.init(this.iapPublicKey, false);
    }


    /**
     * 获取是否支持应用内支付
    */
    isEnvReady () {
        this.iap.once(huawei.hms.iap.API_EVENT_LIST.isEnvReadyCallBack, (res: huawei.hms.iap.ApiCbResult) => {
            this.consolePanel && this.consolePanel.log(res);
        });
        this.iap.isEnvReady();
    }

    /**
     * 获取后台配置的单个商品信息
     * priceType    0：消耗型商品; 1：非消耗型商品; 2：订阅型商品
     * productIdArr 商品id列表 查询的商品必须是您在AppGallery Connect网站配置的商品
     */
    obtainProductInfo () {
        this.iap.once(huawei.hms.iap.API_EVENT_LIST.obtainProductInfoCallBack, (res: huawei.hms.iap.ApiCbResult) => {
            this.consolePanel && this.consolePanel.log(res);
        });
        //消耗型商品
        this.iap.obtainProductInfo([this.consumableProductId], 0);
        //非消耗型商品
        // this.iap.obtainProductInfo(1, [this.unConsumableProductId]);
        //订阅型商品
        // this.iap.obtainProductInfo(2, [this.subscriptionWeekProductId]);
    }


    /**
     * 购买消耗品
    */
    public buyConsumableProduct () {
        this._createPurchaseIntent(this.consumableProductId, 0, "test");
    }

    /**
     * 购买非消耗品 如果之前买过则提示60051错误
    */
    public buyUnConsumableProduct () {
        this._createPurchaseIntent(this.unConsumableProductId, 1, "test");
    }

    /**
     * 购买订阅类型 如果之前买过且未失效则提示60051错误
    */
    public buySubscriptionWeekProduct () {
        this._createPurchaseIntent(this.subscriptionWeekProductId, 2, "test");
    }

    /**
     * 发起购买PMS商品
     * productId        商品ID
     * priceType        商品类型 0：消耗型商品; 1：非消耗型商品; 2：订阅型商品
     * developerPayload 商户侧保留信息
    */
    private _createPurchaseIntent (productId: string, priceType: number, developerPayload: string) {
        this.iap.once(huawei.hms.iap.API_EVENT_LIST.createPurchaseIntentCallBack, (res: huawei.hms.iap.ApiCbResult) => {
            this.consolePanel && this.consolePanel.log(res);
            //记录商品信息 消耗用
            if (res.code == huawei.hms.iap.StatusCode.success) {
                if (res.data.suc == true && res.data.returnCode == 0) {
                    let purchaseData: any = res.data.purchaseData;
                    let inAppPurchaseData: string = purchaseData._rawJsonInfo;

                    if (priceType == 0) {
                        this.itemInfoArr_type_0.push(inAppPurchaseData);
                        console.log("刷新本地消耗品信息", this.itemInfoArr_type_0)
                    }
                    else if (priceType == 1) {
                        this.itemInfoArr_type_1.push(inAppPurchaseData);
                        console.log("刷新本地非消耗品信息", this.itemInfoArr_type_1)
                    }
                    else if (priceType == 2) {
                        this.itemInfoArr_type_2.push(inAppPurchaseData);
                        console.log("刷新本地订阅品信息", this.itemInfoArr_type_2)
                    }
                }
            }
        });
        this.iap.createPurchaseIntent(productId, priceType, developerPayload, false);

    }


    /**
     * 确认交易,执行消耗操作 消耗型商品
    */
    consumeOwnedPurchase_type_0 () {
        this._consumeOwnedPurchase(0);
    }
    /**
     * 非消耗型商品仅沙箱环境可消耗
    */
    consumeOwnedPurchase_type_1 () {
        this._consumeOwnedPurchase(1);
    }

    /**
     * 确认交易,执行消耗操作  在商品支付成功后，应用需要在发放商品成功之后调用此接口对消耗型商品执行消耗操作。
     * 注意： 1.订阅商品不支持 无需消耗 否则返回错误，2.非消耗型商品仅沙箱环境可消耗
     * inAppPurchaseData 购买数据中的inAppPurchaseData
    */
    private _consumeOwnedPurchase (priceType: number) {
        let tempArr: string[] = null;

        if (priceType == 0) {
            tempArr = this.itemInfoArr_type_0;
        }
        else if (priceType == 1) {
            tempArr = this.itemInfoArr_type_1;
        }
        else if (priceType == 2) {
            tempArr = this.itemInfoArr_type_2;
        }
        //选一个
        let select: string = tempArr.length > 0 ? tempArr[0] : null;
        if (select == null) {
            this.consolePanel && this.consolePanel.error("本地记录中不存在已支付但是未消耗的商品信息，请进行购买或者先查询订单列表");
            return;
        }

        //发起消耗
        this.iap.once(huawei.hms.iap.API_EVENT_LIST.consumeOwnedPurchaseCallBack, (res: huawei.hms.iap.ApiCbResult) => {
            this.consolePanel && this.consolePanel.log(res);
            if (res.code == huawei.hms.iap.StatusCode.success) {
                if (res.data.suc == true) {
                    let index = tempArr.indexOf(select);
                    if (index != -1) {
                        tempArr.splice(index, 1);
                    } else {
                        console.warn("要移除的信息不存在，要删除的和当前数组数据：", select, tempArr)
                    }
                }
            }
        });
        this.iap.consumeOwnedPurchase(select);
    }



    /**
     * 获取消耗品订单列表
     */
    public getConsumableProductList () {
        this._obtainOwnedPurchases(0);
    }

    /**
     * 获取非消耗品订单列表
    */
    public getUnConsumableProductList () {
        this._obtainOwnedPurchases(1);
    }

    /**
     * 获取订阅类型订单列表
    */
    public getSubscriptionWeekProductList () {
        this._obtainOwnedPurchases(2);
    }



    /**
     * 获取对应类型的商品的付款信息
     * priceType 0：消耗型商品; 1：非消耗型商品; 2：订阅型商品
    */
    private _obtainOwnedPurchases (priceType: number) {
        if (priceType == 0) {
            this.itemInfoArr_type_0 = [];
        }
        else if (priceType == 1) {
            this.itemInfoArr_type_1 = [];
        }
        else {
            this.itemInfoArr_type_2 = [];
        }
        this.iap.once(huawei.hms.iap.API_EVENT_LIST.obtainOwnedPurchasesCallBack, (res: huawei.hms.iap.ApiCbResult) => {
            this.consolePanel && this.consolePanel.log(res);
            if (res.code == huawei.hms.iap.StatusCode.success) {
                if (res.data.suc == true) {
                    let purchasesArr = res.data.purchasesArr as Array<any>;
                    if (purchasesArr != null && purchasesArr.length != 0) {
                        for (let i = 0; i < purchasesArr.length; i++) {
                            const temp = purchasesArr[i];
                            // 已支付，未消耗 (仅支持 消耗品 和非消耗品（沙盒环境）)
                            if (temp.kind == 0 || temp.kind == 1) {
                                if (
                                    temp.purchaseState == 0 &&          //-1：初始化 0：已购买 1：已取消 2：已退款 3：待处理
                                    temp.consumptionState == 0          //0：未消耗 1：已消耗
                                ) {
                                    let inAppPurchaseData: string = temp._rawJsonInfo;
                                    if (priceType == 0) {
                                        this.itemInfoArr_type_0.push(inAppPurchaseData);
                                        console.log("刷新本地消耗品信息", this.itemInfoArr_type_0)
                                    }
                                    else if (priceType == 1) {
                                        this.itemInfoArr_type_1.push(inAppPurchaseData);
                                        console.log("刷新本地非消耗品信息", this.itemInfoArr_type_1)
                                    }
                                }
                            }
                            else if (temp.kin == 2) {
                                //忽略（无法消耗，无需记录）
                                // if (
                                //     temp.purchaseState == 0           //-1：初始化 0：已购买 1：已取消 2：已退款 3：待处理
                                //     // && temp.consumptionState == 0          //0：未消耗 1：已消耗
                                // ) {
                                //     let inAppPurchaseData: string = temp._rawJsonInfo;
                                //     this.itemInfoArr_type_2.push(inAppPurchaseData);
                                //     console.log("刷新本地订阅品信息", this.itemInfoArr_type_2)
                                // }
                            }

                        }
                    }

                }
            }
        });
        this.iap.obtainOwnedPurchases(priceType);
    }


    /**
     * 查看用户购买历史
     * priceType 0：消耗型商品; 2：订阅型商品
    */
    obtainOwnedPurchaseRecord () {
        this.iap.once(huawei.hms.iap.API_EVENT_LIST.obtainOwnedPurchaseRecordCallBack, (res: huawei.hms.iap.ApiCbResult) => {
            // this.consolePanel && this.consolePanel.log(res);
            if (res.code == huawei.hms.iap.StatusCode.success) {
                let arr: Array<any> = res.data?.inAppPurchaseDataList;
                if (arr != null) {
                    this.consolePanel && this.consolePanel.log("获取到 " + arr.length + " 条订单记录");
                }
            } else {
                this.consolePanel && this.consolePanel.log(res);
            }
        });
        this.iap.obtainOwnedPurchaseRecord(0);
        // this.iap.obtainOwnedPurchaseRecord(2);
    }

    /**
     * 跳转到管理订阅页/跳转到编辑订阅页
     * type      2(StartIapActivityReq.TYPE_SUBSCRIBE_MANAGER_ACTIVITY)跳转到管理订阅页 
     */
    startIapActivity2 () {
        this.iap.once(huawei.hms.iap.API_EVENT_LIST.startIapActivityCallBack, (res: huawei.hms.iap.ApiCbResult) => {
            this.consolePanel && this.consolePanel.log(res);
        });
        this.iap.startIapActivity(2, null);
    }
    /**
     * 跳转到管理订阅页/跳转到编辑订阅页
     * 3(StartIapActivityReq.TYPE_SUBSCRIBE_EDIT_ACTIVITY)跳转到管理订阅页
     * productId
     */
    startIapActivity3 () {
        this.iap.startIapActivity(3, this.subscriptionWeekProductId);
    }

}
