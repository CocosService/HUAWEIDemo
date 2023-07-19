import { AnimationClip, AssetManager, director, instantiate, Node, Prefab, Quat, Vec3 } from "cc";
import { ICharacterData } from '../libs/taobao_avatar_sdk.mjs';
import { ICharacter } from '../libs/taobao_avatar_sdk.mjs';
import { ErrorParams } from '../libs/taobao_avatar_sdk.mjs';
import { SDKConstant } from '../libs/taobao_avatar_sdk.mjs';
import { loadSdkBundleRes } from '../libs/taobao_avatar_sdk.mjs';
import { AvatarDependRes } from "./avatar_depend_res";
import { AvatarNode } from "./avatar_node";
import { LoadingProgressInfo } from '../libs/taobao_avatar_sdk.mjs';
import { SdkEvent } from '../libs/taobao_avatar_sdk.mjs';
import { LoadingProgressInfoArgs, LoadingProgressTaskIndex, snextProgressEve as sendProgressEve } from '../libs/taobao_avatar_sdk.mjs';
import { getNextAvatarId } from '../libs/taobao_avatar_sdk.mjs';
import * as dataAdaptorSdk from '../libs/data-adaptor.umd.js';
import { DataAdaptorSdkTool } from '../libs/taobao_avatar_sdk.mjs';

/**
 * Avatar形象创建入口
*/
export class Avatar {

    /**
     * 动画名称枚举（sdk外部用）
    */
    public static readonly ANIM_NAME = {
        IDLE: "idle",                                   //idle
        WALK: "walk",                                   //行走
        RUN: "run",                                     //跑步
        DiaoYu_DengDai: "diaoyu_dengdai",               //钓鱼：idle 等待
        DiaoYu_LaChe: "diaoyu_lache",                   //钓鱼：把鱼拉上来
        DiaoYu_PaoGan: "diaoyu_paogan",                 //钓鱼：把杆抛到水里
        DiaoYu_ShouGan: "diaoyu_shougan",               //钓鱼：把杆抬起来
        DiaoYu_ZhanShi: "diaoyu_zhanshi",               //钓鱼：钓到展示
    }

    /**
     * 动画clip名称对应的动画名称（sdk外部用）
     */
    public static readonly ANIM_CLIP_NAME_TO_ANIM_NAME = {
        //身体
        "idle_Body": "idle",
        "walk_Body": "walk",
        "run_Body": "run",
        "diaoyu_dengdai_Body": "diaoyu_dengdai",
        "diaoyu_paogan_Body": "diaoyu_paogan",
        "diaoyu_shougan_Body": "diaoyu_shougan",
        "diaoyu_zhanshi_Body": "diaoyu_zhanshi",
        "diaoyu_lache_Body": "diaoyu_lache",
        //头部
        "idle_Head": "idle",
        "walk_Head": "walk",
        "run_Head": "run",
        "diaoyu_dengdai_Head": "diaoyu_dengdai",
        "diaoyu_paogan_Head": "diaoyu_paogan",
        "diaoyu_shougan_Head": "diaoyu_shougan",
        "diaoyu_zhanshi_Head": "diaoyu_zhanshi",
        "diaoyu_lache_Head": "diaoyu_lache",
    }

    //sdk内部使用的id
    public _avatarId: number = -1;

    //创建出来的角色形象控制
    private _avatarNode: AvatarNode = null;
    //是否被销毁了
    private _isDestroy: boolean = false;
    //创建完毕的回调
    private _succeedCb: Function = null;
    //超时时间 秒
    private _timeout: number = 30;
    //超时回调
    private _timeoutCb: Function = null;

    //参数：投射 和 接受阴影(由于材质不接受阴影设置无效)
    private _castShadow: boolean = false;
    private _receiveShadow: boolean = false;

    //是否启用动画烘焙
    public useBakedAnim: boolean = false;
    /**
     * 初始形象数据
    */
    public rawObjectCfg: ICharacterData = null;
    /**
     * 转换后的形象数据
    */
    public characterCfg: ICharacter = null;
    /**
     * 基础的身体（创建时传入）
    */
    public basicBodyNode: Node = null;
    /**
     * 当前的加载进度，代表已经完成（阶段性进度，数值不连续）
    */
    private _curLoadingProgressInfo: LoadingProgressInfo = null;
    /**
     * 用户传入的加载进度的回调
    */
    private _progressUpdateCb: Function = null;


    /**
     * 在一个基础人体上加载形象
     * 参数：
     * basicBodyNode:基础人体,在此角色上进行组装形象（实例化prefab_character后的Node节点,需确保在场景中为激活状态）
     * useBakedAnim:是否启用动画烘焙
     * cfg:淘宝人物形象数据
     * isConvertOverData:是否是转换后的数据
     * castShadow:是否投射阴影
     * succeedCb:创建完毕的回调
     * timeout:超时时间（秒）,默认30秒，当加载时长超过此时间后，代表创建失败,执行timeoutCb
     * timeoutCb:创建失败（超时）的回调
     * progressUpdateCb:加载进度有更新时候的回调
    */
    constructor (
        basicBodyNode: Node,
        useBakedAnim: boolean,
        cfg: any | ICharacterData,
        isConvertOverData: boolean,
        castShadow: boolean = false,
        succeedCb?: Function,
        timeout = 30,
        timeoutCb?: Function,
        progressUpdateCb?: Function,
    ) {
        //sdk 内部唯一ID
        this._avatarId = getNextAvatarId();
        this.useBakedAnim = useBakedAnim;
        this._castShadow = castShadow;
        // this._receiveShadow = true;
        this._succeedCb = succeedCb;
        this._timeout = timeout;
        this._timeoutCb = timeoutCb;
        this._progressUpdateCb = progressUpdateCb;

        //进度事件监听
        SdkEvent.on(SDKConstant.EVENT.UPDATE_LOADING_PROGRESS, this._eveLoadingProgressUpdate, this);
        sendProgressEve(LoadingProgressTaskIndex.start, this._avatarId);

        //配置是否为null
        if (cfg == null) {
            console.error(SDKConstant.TEXT.DEBUG_ERR_AVATAR_CFG, cfg);
            return;
        }
        //传入的基础人体是否正确
        if (basicBodyNode == null) {
            console.error("请传入基础的人体node");
            return;
        }
        this.basicBodyNode = basicBodyNode;
        //获取脚本
        this._avatarNode = basicBodyNode.getComponent(AvatarNode);
        if (this._avatarNode == null) {
            console.error("基础的人体 prefab上 无AvatarNode组件,请使用正确的prefab");
            return;
        }

        //设置基础人体隐藏状态初始位置
        this._avatarNode.setBasicBodyNodeHide();

        if (typeof (cfg) == "object") {
            this.rawObjectCfg = cfg as ICharacterData;
            // console.log("object 类型的形象数据");
        } else {
            console.error(SDKConstant.TEXT.DEBUG_ERR_AVATAR_CFG, cfg);
            return;
        }
        //转换为object失败
        if (this.rawObjectCfg == null) {
            console.error(SDKConstant.TEXT.DEBUG_ERR_AVATAR_CFG, cfg);
            return;
        }

        //使用sdk转换数据
        try {
            this.characterCfg = this._convertCharacterInfo(this.rawObjectCfg, isConvertOverData);
        }
        catch (error) {
            console.error(SDKConstant.TEXT.DEBUG_ERR_AVATAR_CFG, cfg);
            return;
        }
        if (this.characterCfg == null) {
            console.error(SDKConstant.TEXT.DEBUG_ERR_AVATAR_CFG, cfg);
            return;
        }
        //进度事件
        sendProgressEve(LoadingProgressTaskIndex.disposeCharacterInfoOver_1, this._avatarId);
        //开始创建
        this._loadResAndCreate()
    }




    /**
     * 播放动画 不使用混合
     * animName:动画名
     * wrapMode:是否重新指定动画的循环模式
     */
    public playAnim (animName: string, wrapMode?: number) {
        if (this._isDestroy == true) {
            console.error("形象已经被销毁");
            return;
        }
        if (this.isCreateOver == false) {
            console.error("形象未创建完毕");
            return;
        }
        this._avatarNode.playAnim(animName, wrapMode);
    }

    /**
     * 播放动画 使用混合方式
     * animName:动画名
     * duration:渐变的持续时间
     * wrapMode:是否重新指定动画的循环模式
    */
    public playAnimUseCrossFade (animName: string, duration: number = 0.3, wrapMode?: number) {
        if (this._isDestroy == true) {
            console.error("形象已经被销毁");
            return;
        }
        if (this.isCreateOver == false) {
            console.error("形象未创建完毕");
            return;
        }
        this._avatarNode.playAnimUseCrossFade(animName, duration, wrapMode);
    }

    /**
     * 停止动画播放
     */
    public stopAnim () {
        if (this._isDestroy == true) {
            console.error("形象已经被销毁");
            return;
        }
        if (this.isCreateOver == false) {
            console.error("形象未创建完毕");
            return;
        }
        this._avatarNode.stopAnim();
    }

    /**
     * 销毁形象，同时会销毁创建时传入的基础人体
     */
    public destroy () {
        if (this._isDestroy == true) {
            console.error("重复销毁");
            return;
        }
        this._isDestroy = true;

        //进度事件监听
        SdkEvent.off(SDKConstant.EVENT.UPDATE_LOADING_PROGRESS, this._eveLoadingProgressUpdate, this);

        //销毁形象
        if (this._avatarNode != null) {
            this._avatarNode.release();
            this._avatarNode = null;
        }
    }

    /**
     * 获取形象是否创建完毕
    */
    public get isCreateOver (): boolean {
        if (this._avatarNode == null) {
            return false;
        } else {
            return this._avatarNode.isCreateOver;
        }
    }

    /**
     * 为动画添加一个帧事件
     * animName:动画名{Avatar.ANIM_NAME}
     * atBody:是否在身体上添加事件，否则加到头上
    */
    public addAnimFrameEvent (animName: string, atBody: boolean, events: AnimationClip.IEvent[]) {
        if (this._isDestroy == true) {
            console.error("形象已经被销毁");
            return;
        }
        if (this.isCreateOver == false) {
            console.error("形象未创建完毕");
            return;
        }
        this._avatarNode.addAnimFrameEvent(animName, atBody, events);
    }

    /**
     * 为动画删除一个帧事件
     * animName:动画名{Avatar.ANIM_NAME}
     * atBody:是否在身体上移除事件，否则在头上
     * eventFuncName:事件的方法名
    */
    public removeAnimFrameEvent (animName: string, atBody: boolean, eventFuncName: string) {
        if (this._isDestroy == true) {
            console.error("形象已经被销毁");
            return;
        }
        if (this.isCreateOver == false) {
            console.error("形象未创建完毕");
            return;
        }
        this._avatarNode.removeAnimFrameEvent(animName, atBody, eventFuncName);
    }

    //-----------private------------

    /**
     * sdk事件：形象加载进度更新
     * info:加载任务id等信息
    */
    private _eveLoadingProgressUpdate (info: LoadingProgressInfoArgs) {
        if (this._isDestroy == true) {
            return;
        }
        if (info == null) {
            console.error("进度信息为空");
            return;
        }
        //只处理自己的事件
        if (info.avatarId != this._avatarId) {
            return;
        }
        if (this._curLoadingProgressInfo == null) {
            this._curLoadingProgressInfo = new LoadingProgressInfo();
        }
        //更新进度
        this._curLoadingProgressInfo.setInfo(info.taskIndex);

        //用户传入的进度监听回调
        if (this._progressUpdateCb) {
            this._progressUpdateCb(this._curLoadingProgressInfo);
        }
    }

    /**
     * 创建完毕的回调
    */
    private _doCreateOverEve () {
        //进度事件监听
        SdkEvent.off(SDKConstant.EVENT.UPDATE_LOADING_PROGRESS, this._eveLoadingProgressUpdate, this);
        if (this._succeedCb != null) {
            this._succeedCb();
        }
    }

    /**
     * 创建超时的回调
    */
    private _doCreateTimeOutEve () {
        //进度事件监听
        SdkEvent.off(SDKConstant.EVENT.UPDATE_LOADING_PROGRESS, this._eveLoadingProgressUpdate, this);
        if (this._timeoutCb != null) {
            this._timeoutCb();
        }
    }

    /**
     * 加载依赖的资源  并进行创建角色
    */
    private _loadResAndCreate () {
        if (this._isDestroy) {
            return;
        }
        //加载依赖的资源
        this._loadDependRes();
    }

    /**
     * 加载渲染依赖的资源
    */
    private _loadDependRes () {
        if (this._isDestroy) {
            return;
        }
        if (SDKConstant.dependResNode == null || SDKConstant.dependResNode.isValid == false) {
            this._loadDependResPrefab(() => {
                sendProgressEve(LoadingProgressTaskIndex.loadDependResOver_2, this._avatarId);
                this._createAvatarNodeAndInit();
            })
        } else {
            sendProgressEve(LoadingProgressTaskIndex.loadDependResOver_2, this._avatarId);
            this._createAvatarNodeAndInit();
        }
    }

    /**
     * 创建角色模型，并且根据数据初始化
     */
    private _createAvatarNodeAndInit () {
        if (this._isDestroy) {
            return;
        }
        if (this.characterCfg == null) {
            console.error("角色创建失败,err:数据格式错误");
            return;
        }
        //初始化
        this._avatarNode.init(
            this._avatarId,
            this.useBakedAnim,
            this.characterCfg,
            this._castShadow,
            this._receiveShadow,
            () => {
                this._doCreateOverEve();
            },
            this._timeout,
            () => {
                this._doCreateTimeOutEve();
            }
        );
    }

    /**
     * 加载sdk 依赖的资源的prefab
    */
    private _loadDependResPrefab (cb: Function) {
        //加载和图工具资源
        loadSdkBundleRes(SDKConstant.BUNDLE_NAME.RES)
            .then((bundle: AssetManager.Bundle) => {
                // console.log("bundle：", bundle);
                bundle.load(SDKConstant.BUNDLE_RES_NAME.AVATAR_DEPEND_RES, Prefab, (err, prefab: Prefab) => {
                    if (this._isDestroy) {
                        return;
                    }
                    //已经加载过了 且处于可用
                    if (SDKConstant.dependResNode != null && SDKConstant.dependResNode.isValid == true) {
                        if (cb) {
                            cb();
                        }
                        return;
                    }
                    if (err) {
                        console.log("加载bundle内prefab资源失败 errMsg:", err);
                    } else {
                        if (prefab == null) {
                            console.error("prefab == null")
                        }
                        let node = instantiate(prefab);
                        director.getScene().addChild(node);
                        SDKConstant.dependResNode = node;
                        SDKConstant.dependResCtrl = node.getComponent(AvatarDependRes);
                    }
                    if (cb) {
                        cb();
                    }
                });
            })
            .catch((err) => {
                console.error("基础身体 prefab_character 加载失败 err ：", err);
            })
    }


    /**
     * 从 json object 转换角色信息
     */
    private _convertCharacterInfo (characterInfo: ICharacterData, isConvertOverData: boolean): ICharacter {
        //初始化sdk
        DataAdaptorSdkTool.init(dataAdaptorSdk);
        //sdk处理数据
        return DataAdaptorSdkTool.convertCharacterInfo(characterInfo, isConvertOverData);
    }


}
