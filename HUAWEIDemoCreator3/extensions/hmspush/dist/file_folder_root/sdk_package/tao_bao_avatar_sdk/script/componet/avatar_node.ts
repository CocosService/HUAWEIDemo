import { _decorator, Component, Node, Vec3, Quat, SkinnedMeshRenderer, AnimationClip, Socket, instantiate, AnimationComponent } from 'cc';
import { ConvertColorAndTexInfo } from '../libs/taobao_avatar_sdk.mjs';
import { ICharacter } from '../libs/taobao_avatar_sdk.mjs';
import { AnimDispose } from './anim_dispose';
import { AvatarSkinRender } from './avatar_skin_render';
import { AvatarNodeHelper } from '../libs/taobao_avatar_sdk.mjs';
import { SDKConstant } from '../libs/taobao_avatar_sdk.mjs';

const { ccclass, property } = _decorator;


/**
 * 注意：SDK内部类, 请勿修改
 * 角色处理脚本
 * 挂载到基础角色模型上，根据模型数据初始化模型
*/
@ccclass('AvatarNode')
export class AvatarNode extends Component {

    //辅助类
    _componentHelper: AvatarNodeHelper = null;

    @property(Node)
    head: Node = null;
    @property(Node)
    body: Node = null;
    //基础皮肤的渲染控制
    @property(AvatarSkinRender)
    skinRender: AvatarSkinRender = null;
    //动画处理器
    @property(AnimDispose)
    animCtrl: AnimDispose = null;


    //sdk内部使用的id
    public avatarId: number = -1;
    //是否启用动画烘焙
    public useBakedAnim: boolean = false;
    //参数：投射和接受阴影
    public castShadow: boolean = false;
    public receiveShadow: boolean = false;

    //fbx 基础的 骨骼信息映射 骨骼名 -- 骨骼全路径（后续不会变化）
    public fbxSkeletonJointPathArr: string[] = [];

    //骨骼信息映射 骨骼名 -- 骨骼全路径 （会不断更新）
    public skeletonJointMap: Map<string, string> = new Map();
    //每个骨骼节点 位置 旋转 缩放 初始信息
    public skeletonJointPos: Map<string, Vec3> = new Map();
    public skeletonJointRot: Map<string, Quat> = new Map();
    public skeletonJointScale: Map<string, Vec3> = new Map();
    //是否被释放了
    public isRelease: boolean = false;
    //是否完全创建完毕了
    public isCreateOver: boolean = false;

    private _isOnLoad: boolean = false;

    onLoad () {
        this._isOnLoad = true;
        this._componentHelper = new AvatarNodeHelper(this);
    }

    //初始化
    public init (
        avatarId: number,
        useBakedAnim: boolean,
        characterData: ICharacter,
        castShadow: boolean = false,
        receiveShadow: boolean = false,
        createOverCb: Function,
        timeout = 30,
        timeoutCb: Function
    ) {
        if (this._isOnLoad == false) {
            console.error(SDKConstant.TEXT.DEBUG_ERR_CALL_FUNC_AVATAR_BASE_BODY_NEED_ACTIVE);
            return;
        }
        //记录部分参数
        this.avatarId = avatarId;
        this.useBakedAnim = useBakedAnim;
        this.castShadow = castShadow;
        this.receiveShadow = receiveShadow;
        this._componentHelper.init(avatarId, characterData, castShadow, receiveShadow, createOverCb, timeout, timeoutCb);
    }

    /**
     * 设置基础人体的隐藏位置
    */
    public setBasicBodyNodeHide () {
        if (this._componentHelper) {
            this._componentHelper.setBasicBodyNodeHideState(false);
        } else {
            console.error(SDKConstant.TEXT.DEBUG_ERR_CALL_FUNC_AVATAR_BASE_BODY_NEED_ACTIVE);
        }
    }

    /**
     * 往皮肤上面应用贴图和颜色
    */
    public useColorAndTexInfoToSkin (info: ConvertColorAndTexInfo) {
        if (this._componentHelper) {
            this._componentHelper.useColorAndTexInfoToSkin(info);
        } else {
            console.error(SDKConstant.TEXT.DEBUG_ERR_CALL_FUNC_AVATAR_BASE_BODY_NEED_ACTIVE);
        }
    }

    /**
     * 在动画上添加帧事件
     * animName:动画名
     * atBody:是否添加到身体上，否则添加到头上
     */
    public addAnimFrameEvent (animName: string, atBody: boolean, items: AnimationClip.IEvent[]) {
        if (this._componentHelper) {
            this.animCtrl.addAnimFrameEvent(animName, atBody, items);
        } else {
            console.error(SDKConstant.TEXT.DEBUG_ERR_CALL_FUNC_AVATAR_BASE_BODY_NEED_ACTIVE);
        }
    }

    /**
     * 为动画删除一个帧事件
     * animName:动画名{Avatar.ANIM_NAME}
     * atBody:是否在身体上移除事件，否则在头上
     * eventFuncName:事件的方法名
    */
    public removeAnimFrameEvent (animName: string, atBody: boolean, eventFuncName: string) {
        if (this._componentHelper) {
            this.animCtrl.removeAnimFrameEvent(animName, atBody, eventFuncName);
        } else {
            console.error(SDKConstant.TEXT.DEBUG_ERR_CALL_FUNC_AVATAR_BASE_BODY_NEED_ACTIVE);
        }
    }



    /**
     * 播放动画 不使用混合
     */
    public playAnim (animName: string, wrapMode?: number) {
        if (this._componentHelper) {
            this._componentHelper.playAnim(animName, wrapMode);
        } else {
            console.error(SDKConstant.TEXT.DEBUG_ERR_CALL_FUNC_AVATAR_BASE_BODY_NEED_ACTIVE);
        }
    }

    /**
     * 播放动画 使用混合
    */
    public playAnimUseCrossFade (animName: string, duration: number = 0.3, wrapMode?: number) {
        if (this._componentHelper) {
            this._componentHelper.playAnimUseCrossFade(animName, duration, wrapMode);
        } else {
            console.error(SDKConstant.TEXT.DEBUG_ERR_CALL_FUNC_AVATAR_BASE_BODY_NEED_ACTIVE);
        }
    }

    /**
     * 播放某个动画
     */
    public stopAnim () {
        if (this._componentHelper) {
            this._componentHelper.stopAnim();
        } else {
            console.error(SDKConstant.TEXT.DEBUG_ERR_CALL_FUNC_AVATAR_BASE_BODY_NEED_ACTIVE);
        }
    }


    /**
     * 刷新骨骼路径信息
    */
    public updateSkeletonPathMap () {
        if (this._componentHelper) {
            this._componentHelper.updateSkeletonPathMap();
        } else {
            console.error(SDKConstant.TEXT.DEBUG_ERR_CALL_FUNC_AVATAR_BASE_BODY_NEED_ACTIVE);
        }
    }

    /**
     * 获取头部mesh
    */
    public get headMesh (): SkinnedMeshRenderer {
        if (this.skinRender == null) {
            return null;
        }
        return this.skinRender.headMesh;
    }
    public set headMesh (value: any) {
        //console.error("外界无需设置headMesh");
    }

    /**
     * 获取身体mesh
    */
    public get bodyMesh (): SkinnedMeshRenderer {
        if (this.skinRender == null) {
            return null;
        }
        return this.skinRender.bodyMesh;
    }
    public set bodyMesh (value: any) {
        //console.error("外界无需设置bodyMesh");
    }

    /**
     * 释放
    */
    public release () {
        if (this._componentHelper) {
            this._componentHelper.release();
        } else {
            console.error(SDKConstant.TEXT.DEBUG_ERR_CALL_FUNC_AVATAR_BASE_BODY_NEED_ACTIVE);
        }
    }
}
