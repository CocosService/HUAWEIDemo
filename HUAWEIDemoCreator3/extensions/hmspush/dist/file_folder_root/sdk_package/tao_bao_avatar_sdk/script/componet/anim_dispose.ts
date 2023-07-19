import { _decorator, Node, Component, SkeletalAnimation, animation, Quat, Vec3, AnimationClip, Socket } from 'cc';
import { AnimInfo } from '../libs/taobao_avatar_sdk.mjs';
import { SDKConstant } from '../libs/taobao_avatar_sdk.mjs';
import { AnimDisposeLocalHelper } from '../libs/taobao_avatar_sdk.mjs';

const { ccclass, property } = _decorator;


/**
 * 注意：SDK内部类,请勿修改.
 * 人物动画控处理器
*/
@ccclass('AnimDispose')
export class AnimDispose extends Component {

    //辅助类
    private _componentHelper: AnimDisposeLocalHelper = null;
    //头上的骨骼动画播放器
    @property(Node)
    headAnimNode: Node = null;
    //身体的骨骼动画播放器
    @property(Node)
    bodyAnimNode: Node = null;

    @property(SkeletalAnimation)
    bodyAnimNodeSkeletalAnimation: SkeletalAnimation;
    @property(SkeletalAnimation)
    headAnimNodeSkeletalAnimation: SkeletalAnimation;

    //当前已经存在的动画列表
    public animMap: Map<string, AnimInfo> = new Map<string, AnimInfo>();

    //骨骼信息映射 骨骼名 -- 骨骼全路径。（Character解析后传递）
    public joints: Map<string, string> = new Map();
    //每个骨骼节点 位置 旋转 缩放 初始信息
    public skeletonJointPos: Map<string, Vec3> = new Map();
    public skeletonJointRot: Map<string, Quat> = new Map();
    public skeletonJointScale: Map<string, Vec3> = new Map();

    //是否初始化完毕了
    public isInitOver: boolean = false;
    //是否启用动画烘焙
    public useBakedAnim: boolean = false;


    onLoad () {
        this._componentHelper = new AnimDisposeLocalHelper(this);
    }
    //塞入一些参数
    //初始化
    public init (useBakedAnim: boolean, joints: Map<string, string>, skeletonJointPos: Map<string, Vec3>, skeletonJointRot: Map<string, Quat>, skeletonJointScale: Map<string, Vec3>) {
        //外界如果预先初始化了则不再初始化
        if (this.isInitOver == true) {
            return;
        }
        this.isInitOver = true;
        this.useBakedAnim = useBakedAnim;
        this.joints = joints;
        this.skeletonJointPos = skeletonJointPos;
        this.skeletonJointRot = skeletonJointRot;
        this.skeletonJointScale = skeletonJointScale;
        this._componentHelper.init(this.useBakedAnim);
    }
    /**
     * 播放某个动画
    */
    public playAnim (animName: string, useCrossFade: boolean, crossFadeTime: number = 0.3, wrapMode?: number) {
        this._componentHelper.playAnim(animName, useCrossFade, crossFadeTime, wrapMode);
    }
    /**
     * 停止动画播放
    */
    public stopAnim () {
        this._componentHelper.stopAnim();
    }

    /**
     * 在动画上添加帧事件(仅测试)
     * animName:动画名
     * atBody:是否添加到身体上，否则添加到头上
     */
    public addAnimFrameEvent (animName: string, atBody: boolean, items: AnimationClip.IEvent[]) {
        this._componentHelper.addAnimFrameEvent(animName, atBody, items)
    }
    /**
     * 为动画删除一个帧事件
     * animName:动画名{Avatar.ANIM_NAME}
     * atBody:是否在身体上移除事件，否则在头上
     * eventFuncName:事件的方法名
    */
    public removeAnimFrameEvent (animName: string, atBody: boolean, eventFuncName: string) {
        this._componentHelper.removeAnimFrameEvent(animName, atBody, eventFuncName)
    }

    /**
     * 释放
     */
    public release () {
        this._componentHelper.release();
    }

    //----------debug-----------
    /**
     * 设置动画烘焙模式（仅调试,请勿调用）
    */
    public setBakedAnimState (useBaked: boolean) {
        this._componentHelper.setBakedAnimState(useBaked)
    }


}
