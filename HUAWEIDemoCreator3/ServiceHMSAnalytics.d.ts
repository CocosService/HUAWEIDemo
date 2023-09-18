declare const cc: any;
declare const JavascriptJavaBridge: any;
declare namespace huawei {
    namespace hms {
        namespace analytics {
            /**
             * @en
             * Report policy.
             * @zh
             * 上报策略。
             */
            class ReportPolicy {
                type: number;
                threshold: number;
                private constructor();
                /**
                 * @en
                 * Reports an event when an app is opened. You do not need to
                 * set parameters.
                 * @zh
                 * 应用启动上报策略。无须设置参数。
                 */
                static ON_APP_LAUNCH_POLICY: ReportPolicy;
                /**
                 * @en
                 * Reports an event when an app is switched to the background
                 * (including app exit). You do not need to set parameters.
                 * @zh
                 * 应用切后台（包括应用退出）上报策略。无须设置参数。
                 */
                static ON_MOVE_BACKGROUND_POLICY: ReportPolicy;
                /**
                 * @en
                 * Reports an event at the specified interval. The value
                 * ranges from 60 to 1800, in seconds. The default value is
                 * 60.
                 * @zh
                 * 定时上报策略。定时周期范围：[60, 1800]秒，默认60秒。
                 */
                static ON_SCHEDULED_TIME_POLICY: ReportPolicy;
                /**
                 * @en
                 * Reports an event when the data cache reaches the specified
                 * threshold. The value ranges from 30 to 1000. The default
                 * value is 30.
                 * @zh
                 * 数据缓存达到阈值自动上报策略。阈值范围：[30, 1000]条，默认30条。
                 */
                static ON_CACHE_THRESHOLD_POLICY: ReportPolicy;
            }
            /**
             * @en
             * Log level.
             * @zh
             * 显示的日志等级。
             */
            enum LOG_LEVEL {
                debug = 3,
                info = 4,
                warn = 5,
                error = 6
            }
            /**
             * @en
             * [Provides constants that define the IDs of all predefined events.](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/android-api-haeventtype-0000001051318956-V5)
             * @zh
             * [此接口提供了所有预定义事件的事件ID常量。](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References-V5/android-api-haeventtype-0000001051318956-V5)
             */
            enum HAEventType {
                CREATEPAYMENTINFO = "$CreatePaymentInfo",
                ADDPRODUCT2CART = "$AddProduct2Cart",
                ADDPRODUCT2WISHLIST = "$AddProduct2WishList",
                STARTAPP = "$StartApp",
                STARTCHECKOUT = "$StartCheckout",
                VIEWCAMPAIGN = "$ViewCampaign",
                VIEWCHECKOUTSTEP = "$ViewCheckoutStep",
                WINVIRTUALCOIN = "$WinVirtualCoin",
                COMPLETEPURCHASE = "$CompletePurchase",
                OBTAINLEADS = "$ObtainLeads",
                JOINUSERGROUP = "$JoinUserGroup",
                COMPLETELEVEL = "$CompleteLevel",
                STARTLEVEL = "$StartLevel",
                UPGRADELEVEL = "$UpgradeLevel",
                SIGNIN = "$SignIn",
                SIGNOUT = "$SignOut",
                SUBMITSCORE = "$SubmitScore",
                CREATEORDER = "$CreateOrder",
                REFUNDORDER = "$RefundOrder",
                DELPRODUCTFROMCART = "$DelProductFromCart",
                SEARCH = "$Search",
                VIEWCONTENT = "$ViewContent",
                UPDATECHECKOUTOPTION = "$UpdateCheckoutOption",
                SHARECONTENT = "$ShareContent",
                REGISTERACCOUNT = "$RegisterAccount",
                CONSUMEVIRTUALCOIN = "$ConsumeVirtualCoin",
                STARTTUTORIAL = "$StartTutorial",
                COMPLETETUTORIAL = "$CompleteTutorial",
                OBTAINACHIEVEMENT = "$ObtainAchievement",
                VIEWPRODUCT = "$ViewProduct",
                VIEWPRODUCTLIST = "$ViewProductList",
                VIEWSEARCHRESULT = "$ViewSearchResult",
                UPDATEMEMBERSHIPLEVEL = "$UpdateMembershipLevel",
                FILTRATEPRODUCT = "$FiltrateProduct",
                VIEWCATEGORY = "$ViewCategory",
                UPDATEORDER = "$UpdateOrder",
                CANCELORDER = "$CancelOrder",
                COMPLETEORDER = "$CompleteOrder",
                CANCELCHECKOUT = "$CancelCheckout",
                OBTAINVOUCHER = "$ObtainVoucher",
                CONTACTCUSTOMSERVICE = "$ContactCustomService",
                RATE = "$Rate",
                INVITE = "$Invite",
                NOVICEGUIDESTART = "$NoviceGuideStart",
                NOVICEGUIDEEND = "$NoviceGuideEnd",
                STARTGAME = "$StartGame",
                ENDGAME = "$EndGame",
                WINPROPS = "$WinProps",
                CONSUMEPROPS = "$ConsumeProps"
            }
            /**
             * @en
             * [Provides constants that define the IDs of all predefined event parameters.](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/android-api-haparamtype-0000001051319011-V5)
             * @zh
             * [此接口提供了所有预定义参数的参数ID常量。](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References-V5/android-api-haparamtype-0000001051319011-V5)
             */
            enum HAParamType {
                STORENAME = "$StoreName",
                BRAND = "$Brand",
                CATEGORY = "$Category",
                PRODUCTID = "$ProductId",
                PRODUCTNAME = "$ProductName",
                PRODUCTFEATURE = "$ProductFeature",
                PRICE = "$Price",
                QUANTITY = "$Quantity",
                REVENUE = "$Revenue",
                CURRNAME = "$CurrName",
                PLACEID = "$PlaceId",
                DESTINATION = "$Destination",
                ENDDATE = "$EndDate",
                BOOKINGDAYS = "$BookingDays",
                PASSENGERSNUMBER = "$PassengersNumber",
                BOOKINGROOMS = "$BookingRooms",
                ORIGINATINGPLACE = "$OriginatingPlace",
                BEGINDATE = "$BeginDate",
                TRANSACTIONID = "$TransactionId",
                CLASS = "$Class",
                CLICKID = "$ClickId",
                PROMOTIONNAME = "$PromotionName",
                CONTENT = "$Content",
                EXTENDPARAM = "$ExtendParam",
                MATERIALNAME = "$MaterialName",
                MATERIALSLOT = "$MaterialSlot",
                MEDIUM = "$Medium",
                SOURCE = "$Source",
                KEYWORDS = "$Keywords",
                OPTION = "$Option",
                STEP = "$Step",
                VIRTUALCURRNAME = "$VirtualCurrName",
                VOUCHER = "$Voucher",
                PLACE = "$Place",
                SHIPPING = "$Shipping",
                TAXFEE = "$TaxFee",
                USERGROUPID = "$UserGroupId",
                LEVELNAME = "$LevelName",
                RESULT = "$Result",
                ROLENAME = "$RoleName",
                LEVELID = "$LevelId",
                CHANNEL = "$Channel",
                SCORE = "$Score",
                SEARCHKEYWORDS = "$SearchKeywords",
                CONTENTTYPE = "$ContentType",
                ACHIEVEMENTID = "$AchievementId",
                FLIGHTNO = "$FlightNo",
                POSITIONID = "$PositionId",
                PRODUCTLIST = "$ProductList",
                ACOUNTTYPE = "$AcountType",
                OCCURREDTIME = "$OccurredTime",
                EVTRESULT = "$EvtResult",
                PREVLEVEL = "$PrevLevel",
                CURRVLEVEL = "$CurrvLevel",
                VOUCHERS = "$Vouchers",
                MATERIALSLOTTYPE = "$MaterialSlotType",
                LISTID = "$ListId",
                FILTERS = "$Filters",
                SORTS = "$Sorts",
                ORDERID = "$OrderId",
                PAYTYPE = "$PayType",
                REASON = "$Reason",
                EXPIREDATE = "$ExpireDate",
                VOUCHERTYPE = "$VoucherType",
                SERVICETYPE = "$ServiceType",
                DETAILS = "$Details",
                COMMENTTYPE = "$CommentType",
                REGISTMETHOD = "$RegistMethod",
                DURATION = "$Duration",
                LEVEL = "$Level",
                PURCHASEENTRY = "$PurchaseEntry",
                PROPS = "$Props",
                ENTRY = "$Entry"
            }
            /**
             * @en
             * [Provides constants that define the names of all predefined user attributes.](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/android-api-hauserprofiletype-0000001063666963-V5)
             * @zh
             * [此接口提供了所有预定义用户属性名称的常量。](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References-V5/android-api-hauserprofiletype-0000001063666963-V5)
             */
            /**
             * @en
             * Enum for analytics event listener.
             * @zh
             * 异步 API 调用的回调事件名称定义。
             */
            enum HMS_ANALYTICS_EVENT_LISTENER_NAME {
                /**
                 * @en
                 * The callback to get AAID.
                 * @zh
                 * 获取 AAID 的回调
                 */
                GET_AAID = "GET_AAID",
                /**
                 * @en
                 * The callback to get user profiles.
                 * @zh
                 * 获取用户 Profiles 的回调
                 */
                GET_USER_PROFILES = "GET_USER_PROFILES",
                /**
                 * @zh
                 * 获取当前限制数据共享开关状态 的回调
                */
                IS_RESTRICTION_SHARED = "IS_RESTRICTION_SHARED",
                /**
                 * @zh
                 * 获取当前数据上报的数据处理位置的回调
                */
                GET_DATA_UPLOAD_SITE_INFO = "GET_DATA_UPLOAD_SITE_INFO"
            }
            /**
             * @en
             * The status code of callback from the java side.
             * @zh
             * 从 java 层返回的 callback 的状态。
             */
            enum StatusCode {
                /**
                 * @en
                 * Fail.
                 * @zh
                 * 接口调用失败。
                 */
                fail = 0,
                /**
                 * @en
                 * Success.
                 * @zh
                 * 接口调用成功。
                 */
                success = 1
            }
            /**
             * @en
             * The general result of callback from java side.
             * @zh
             * 从 java 层返回的 callback 的通用结果对象。
             */
            class AnalyticsResult {
                originData: Object;
                code: StatusCode;
                errMsg?: string;
                data?: any;
                constructor(originData: any);
            }
            /**
             * @en
             * [Class for HMS Analytics, provides public methods to report user behavior data. This class uses the singleton pattern, don't instantiate this class, use huawei.hms.analytics.analyticsService instead.](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/android-api-hianalytics-instance-0000001050987219-V5)
             * @zh
             * [分析服务类，提供上报用户行为数据的公共方法。该类使用了单例模式，请不要实例化该类，直接使用huawei.hms.analytics.analyticsService即可。](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References-V5/android-api-hianalytics-instance-0000001050987219-V5)
             */
            class Analytics {
                private eventHandler;
                constructor();
                /**
                 * @en
                 * Add event listener.
                 * @zh
                 * 持续监听事件。
                 * @param eventName - Event name.
                 * @param cb - Event callback.
                 * @param target - Target node.
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.on(huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_USER_PROFILES, (result) => {
                 *     // TODO
                 * }
                 * ```
                 */
                on(eventName: string, cb: (result: AnalyticsResult) => void, target?: any): void;
                /**
                 * @en
                 * Add event listener (once only).
                 * @zh
                 * 监听一次事件。
                 * @param eventName - Event name.
                 * @param cb - Event callback.
                 * @param target - Target node.
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.once(huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_USER_PROFILES, (result) => {
                 *     // TODO
                 * }
                 * ```
                 */
                once(eventName: string, cb: (result: AnalyticsResult) => void, target?: any): void;
                /***
                 * @internal
                 */
                emit(eventName: string, ...params: any[]): void;
                /**
                 * @en
                 * Remove the event listener.
                 * @zh
                 * 取消事件的监听。
                 * @param eventName - Event name.
                 * @param cb - Event callback.
                 * @param target - Target node.
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.off(huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_USER_PROFILES, (result) => {
                 *     // TODO
                 * }
                 * ```
                 */
                off(eventName: string, cb: (result: AnalyticsResult) => void, target: any): void;
                /**
                 * @en
                 * Remove all event listener of the target node.
                 * @zh
                 * 取消某个节点所有的事件监听。
                 * @param targetNode
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.targetOff(this);
                 * ```
                 */
                targetOff(targetNode: any): void;
                /**
                 * @en
                 * Specifies whether to enable event logging.
                 * @zh
                 * 是否打开埋点采集能力。关闭后将不再记录任何数据，且不分析数据。
                 * @param enable
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.setAnalyticsEnabled(true);
                 * ```
                 */
                setAnalyticsEnabled(enable: boolean): void;
                /**
                 * @en
                 * Sets the automatic event reporting policy.
                 * @zh
                 * 设置自动上报的策略。
                 * @param reportPolicies
                 * @example
                 * ```
                 * let ReportPolicy = huawei.hms.analytics.ReportPolicy;
                 * let moveBackgroundPolicy = ReportPolicy.ON_MOVE_BACKGROUND_POLICY;
                 * let scheduledTimePolicy = ReportPolicy.ON_SCHEDULED_TIME_POLICY;
                 * scheduledTimePolicy.threshold = 600;
                 * huawei.hms.analytics.analyticsService.setReportPolicies(moveBackgroundPolicy, scheduledTimePolicy);
                 * ```
                 */
                setReportPolicies(...reportPolicies: ReportPolicy[]): void;
                /**
                 * @en
                 * Sets a user ID.
                 * When the method is called, a new session is generated if
                 * the old value of id is not empty and is different from the
                 * new value. If you do not want to use id to identify a user
                 * (for example, when a user signs out), you must set id to
                 * null or undefined when calling setUserId.
                 * @zh
                 * 设置用户的 ID。
                 * 调用setUserId()接口时，如果旧id不为空字符串且和新id不同，会
                 * 重新生成新的Session会话。若您不希望使用setUserId标识用户
                 * （如用户退出时），必须将id设为null或者undefined。
                 * @param userId
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.setUserId("a123456");
                 * huawei.hms.analytics.analyticsService.setUserId(null);
                 * huawei.hms.analytics.analyticsService.setUserId(undefined);
                 * ```
                 */
                setUserId(userId: string | null | undefined): void;
                /**
                 * @en
                 * Sets user attributes. The values of user attributes remain
                 * unchanged throughout the app lifecycle and during each
                 * session. A maximum of 25 user attributes are supported. If
                 * the name of an attribute set later is the same as that of
                 * an existing attribute, the value of the existing attribute
                 * is updated.
                 * @zh
                 * 设置用户属性。用户属性值将在整个应用程序生命周期和会话期间
                 * 保持不变。最多支持25个用户属性名称，如果后面设置属性有重复
                 * 的name，则刷新value值。
                 * @param name - Profile key.
                 * @param value - Profile value.
                 * @example
                 * ```
                 * let name = 'profile1';
                 * let value = 'value1';
                 * huawei.hms.analytics.analyticsService.setUserProfile(name, value);
                 * ```
                 */
                setUserProfile(name: string, value: string | null | undefined): void;
                /**
                 * @en
                 * Sets the push token. After obtaining a push token through
                 * Push Kit, call this method to save the push token so that
                 * you can use the audience defined by Analytics Kit to create
                 * HCM notification tasks.
                 * @zh
                 * 设置Push Token。您可以在通过Push Kit获取到Push Token后，通
                 * 过此方法保存Push Token，以便支撑您使用Analytics Kit定义的受
                 * 众创建HCM通知任务。
                 * @param token
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.setPushToken("0864618033588744300007222600CN01");
                 * ```
                 */
                setPushToken(token: string): void;
                /**
                 * @en
                 * Sets the minimum interval for starting a new session. A new
                 * session is generated when an app is switched back to the
                 * foreground after it runs in the background for the
                 * specified minimum interval. By default, the minimum
                 * interval is 30,000 milliseconds (that is, 30 seconds).
                 * @zh
                 * 设置重新开始新Session的最短时间间隔。此方法设置的时间间隔，
                 * 用于指定App在后台运行多长后，再次切回前台时，需要生成新的会
                 * 话。默认30000 毫秒（30秒）。
                 * @param time - NOTE: the unit is ms.
                 * @example
                 * ```
                 * let value = 1000 * 60 * 60;
                 * huawei.hms.analytics.analyticsService.setMinActivitySessions(value);
                 * ```
                 */
                setMinActivitySessions(time: number): void;
                /**
                 * @en
                 * Sets the session timeout interval. A new session is generated
                 * when an app is running in the foreground but the interval
                 * between two adjacent events exceeds the specified timeout
                 * interval. By default, the timeout interval is 1,800,000
                 * milliseconds (that is, 30 minutes).
                 * @zh
                 * 设置Session超时时长。App一直在前台运行，当两个相邻事件的时
                 * 间间隔超过此方法设置的阈值时，将生成一个新的会话。默认
                 * 1800000毫秒（30分钟）。
                 * @param time - NOTE: the unit is ms.
                 * @example
                 * ```
                 * let value = 1000 * 60 * 60;
                 * huawei.hms.analytics.analyticsService.setSessionDuration(value);
                 * ```
                 */
                setSessionDuration(time: number): void;
                /**
                 * @en
                 * Records an event.
                 * @zh
                 * 记录事件。
                 * @param eventId - Event ID.
                 * @param params - Event params.
                 * @example
                 * ```
                 * let eventName = 'myEvent';
                 * let params = {
                 *     name: 'userName',
                 *     age: 18,
                 *     others: {
                 *         stature: 199,
                 *         level: 100
                 *     }
                 * };
                 *
                 * huawei.hms.analytics.analyticsService.onEvent(eventName, params);
                 * ```
                 */
                onEvent(eventId: string, params: any): void;
                /**
                 * @en
                 * Clears all collected data cached locally, including cached data that failed to be sent.
                 * @zh
                 * 清除本地缓存的所有采集数据，包括发送失败的缓存数据。
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.clearCachedData();
                 * ```
                 */
                clearCachedData(): void;
                /**
                 * @en
                 * Obtains the app instance ID from AppGallery Connect.
                 * @zh
                 * 从AGC服务中获取App Instance ID。
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.once(huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_AAID, (result) => {
                 *     cc.log('getAAID', JSON.stringify(result));
                 * );
                 *
                 * huawei.hms.analytics.analyticsService.getAAID();
                 * ```
                 */
                getAAID(): void;
                /**
                 * @internal
                 */
                getAAIDCallback(result: any): void;
                /**
                 * @en
                 * Obtains the automatically collected or custom user attributes.
                 * @zh
                 * 获取自采集或者自定义的用户属性。
                 * @param predefined
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.once(huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_USER_PROFILES, (result) => {
                 *     cc.log('getUserProfiles', JSON.stringify(result));
                 * });
                 *
                 * huawei.hms.analytics.analyticsService.getUserProfiles();
                 * ```
                 */
                getUserProfiles(predefined?: boolean): void;
                /**
                 * @internal
                 */
                getUserProfilesCallback(result: any): void;
                /**
                 * @en
                 * Customizes a page entry event. This method applies only to
                 * non-activity pages because automatic collection is
                 * supported for activity pages. If it is called for an
                 * activity page, statistics on page entry and exit events
                 * will be inaccurate.
                 * After this method is called, the pageEnd() API must be called.
                 * @zh
                 * 自定义页面开始事件，只在非Activity的页面调用，Activity页面
                 * 无需调用，Activity页面会自动采集。如果在Activity页面调用，
                 * 会导致页面进出事件统计不准确。
                 * 需要在调用本方法后调用pageEnd方法配对使用。
                 * @param pageName
                 * @param pageClassOverride
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.pageStart("pageName1", "pageClassOverride1");
                 * ```
                 */
                pageStart(pageName: string, pageClassOverride: string): void;
                /**
                 * @en
                 * Customizes a page end event. This method applies only to
                 * non-activity pages because automatic collection is
                 * supported for activity pages. If it is called for an
                 * activity page, statistics on page entry and exit events
                 * will be inaccurate. Before this method is called, the
                 * pageStart() API must be called.
                 * @zh
                 * 自定义页面结束事件，只在非Activity的页面调用，Activity页面
                 * 无需调用，Activity页面会自动采集。如果在Activity页面调用，
                 * 会导致页面进出事件统计不准确。需要在调用本方法前先调用
                 * pageStart方法配对使用。
                 * @param pageName
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.pageEnd("pageName1");
                 * ```
                 */
                pageEnd(pageName: string): void;
                /**
                  * @en
                  * Specifies whether to enable restriction of HUAWEI
                  * Analytics. The default value is false, which indicates that
                  * HUAWEI Analytics is enabled by default.
                  * @zh
                  * 设置是否限制数据分析能力。限制分析开关默认值为false，即默认
                  * 开启数据分析能力。
                  * @param isEnabled
                  * @example
                  * ```
                  * huawei.hms.analytics.analyticsService.setRestrictionEnabled(true);
                  * ```
                  */
                setRestrictionEnabled(isEnabled: boolean): void;
                /**
                 * @en
                 * Obtains the restriction status of HUAWEI Analytics.
                 * @zh
                 * 获取当前分析开关状态。
                 */
                isRestrictionEnabled(): boolean;
                /**
                 * @zh
                 * 设置是否允许采集广告标识符。
                 * @param isEnabled
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.setCollectAdsIdEnabled(true);
                 * ```
                */
                setCollectAdsIdEnabled(isEnabled: boolean): void;
                /**
                 * @zh
                 * 设置是否限制数据共享。
                 * @param shared
                 * @example
                 * ```
                 * huawei.hms.analytics.analyticsService.setRestrictionShared(true);
                 * ```
                */
                setRestrictionShared(shared: boolean): void;
                /**
                 * @zh
                 * 获取当前限制数据共享开关状态。
                 * @param shared
                  * @example
                  * ```
                  * huawei.hms.analytics.analyticsService.isRestrictionShared();
                  * huawei.hms.analytics.analyticsService.once(huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.IS_RESTRICTION_SHARED, (result) => {
                  *     cc.log('isRestrictionShared', JSON.stringify(result));
                  * });
                  *
                  * ```
                */
                isRestrictionShared(): void;
                /**
                 * @internal
                 */
                isRestrictionSharedCallback(result: any): void;
                /**
                 * @zh
                 * 添加默认事件参数，默认事件参数将被添加到除自动采集事件之外的所有事件中，默认事件参数与事件参数同名时，使用事件参数。
                 * @param params
                 * 参数最多支持100个键值对，每个键值对中key的长度不能超过256个字符，且只能由数字、字母、下划线组成，不能以数字开头；value长度不能超过256个字符，value只支持String、int、long、double、boolean、float、char、byte、short。
                 * 注意1：如果传入的params为null，将清除所有缓存的默认事件参数；如果传入的键值对中value为null，将删除对应的默认事件参数；如果传入的键值对中key已存在，将更新对应的默认事件参数。
                 * 注意2：默认事件参数的个数和大小会被onEvent计入，请注意参数的使用限制。
                 * @example
                 * ```
                 * let params = {
                 *     platform: 'windows',
                 *     os: 'win10',
                 * };
                 * huawei.hms.analytics.analyticsService.addDefaultEventParams(params);
                 * ```
                */
                addDefaultEventParams(params: any | null | undefined): void;
                /**
                 * @zh
                 * 设置微信openId。
                 * @param wxOpenId 非空，长度不超过256字符。如果参数非法，SDK将会重置wxOpenId为空字符串。如果传入的wxOpenId为null，将清除设置的微信openId。
                */
                setWXOpenId(wxOpenId: string): void;
                /**
                 * @zh
                 * 设置微信unionId。
                 * 若您不希望使用setWXUnionId标识用户（如用户退出时），必须将wxUnionId设为null。
                 * @param wxUnionId 非空，长度不超过256字符。如果参数非法，SDK将会重置wxUnionId为空字符串。如果传入的wxUnionId为null，将清除设置的微信unionId。
                */
                setWXUnionId(wxUnionId: string): void;
                /**
                 * @zh
                 * 设置微信AppId。
                 * @param wxAppId 非空，长度不超过256字符。如果参数非法，SDK将会重置wxAppId为空字符串。如果传入的wxAppId为null，将清除设置的微信AppId。
                */
                setWXAppId(wxAppId: string): void;
                /**
                  * @zh
                  * 设置应用安装来源。仅第一次设置有效，重复设置不生效。
                  * 设置应用安装来源也可以通过在“AndroidManifest.xml”文件中添加meta-data参数，设置install_channel的值来实现。
                  * 如果已在“AndroidManifest.xml”文件中设置了安装来源的值，那么通过该接口设置的channel值将不生效。
                  * @param channel 非空，长度不超过128字符。支持英文字母、阿拉伯数字、下划线、中划线和空格，不能以空格开头和结尾。
                  */
                setChannel(channel: string): void;
                /**
                  * @zh
                  * 设置是否允许采集pushToken。
                  * 是否允许采集pushToken也可以通过在“AndroidManifest.xml”文件中添加meta-data参数，设置analyticskit_pushtoken_collection_enabled的值来实现
                  * 通过该接口设置的值，优先级高于通过“AndroidManifest.xml”文件设置的值。
                  * @param enabled 是否允许采集pushToken。默认值为true，即允许采集。true：允许  false：不允许
                  * 此接口设置的值为false时，setPushToken接口调用不生效。
                  */
                setPushTokenCollectionEnabled(enabled: boolean): void;
                /**
                  * @zh
                  * 设置是否允许采集系统属性，支持关闭和开启userAgent属性是否采集。
                  * 禁止采集系统属性也可以通过在“AndroidManifest.xml”文件中添加meta-data参数，设置analyticskit_properties_collection_disabled的值来实现
                  * 通过该接口设置的值，优先级高于通过“AndroidManifest.xml”文件设置的值。
                  * @param property 系统属性，仅支持userAgent。
                  * @param enabled 是否允许采集系统属性。默认值为true，即允许采集。true：允许 false：不允许
                  */
                setPropertyCollection(property: string, enabled: boolean): void;
                /**
                  * @zh
                  * 设置自定义Referrer
                  * 该接口仅第一次调用生效。
                  * @param customReferrer 自定义Referrer。 非空，长度不超过256字符。
                  */
                setCustomReferrer(customReferrer: string): void;
                /**
                  * @zh
                  * 获取当前数据上报的数据处理位置。
                  * @example
                  * ```
                  * huawei.hms.analytics.analyticsService.getDataUploadSiteInfo();
                  * huawei.hms.analytics.analyticsService.once(huawei.hms.analytics.HMS_ANALYTICS_EVENT_LISTENER_NAME.GET_DATA_UPLOAD_SITE_INFO, (result) => {
                  *     cc.log('getDataUploadSiteInfo', JSON.stringify(result));
                  * });
                  * ```
                  */
                getDataUploadSiteInfo(): void;
                /**
                 * @internal
                 */
                getDataUploadSiteInfoCallback(result: any): void;
            }
            class AnalyticsTools {
                /**
                 * @en
                 * Enables the debug log function and sets the minimum log level.
                 * @zh
                 * 打开调试日志，可自定义打印的最小日志级别。
                 * @param level - Log Level.
                 * @example
                 * ```
                 * huawei.hms.analytics.AnalyticsTools.enableLog();
                 *
                 * huawei.hms.analytics.AnalyticsTools.enableLog(huawei.hms.analytics.LOG_LEVEL.debug);
                 * ```
                 */
                static enableLog(level?: LOG_LEVEL): void;
            }
            const analyticsService: Analytics;
        }
    }
}
