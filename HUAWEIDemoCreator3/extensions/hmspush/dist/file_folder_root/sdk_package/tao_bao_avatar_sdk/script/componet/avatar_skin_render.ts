import { _decorator, Component, SkinnedMeshRenderer } from "cc";
import { ConvertColorAndTexInfo } from '../libs/taobao_avatar_sdk.mjs';
import { AvatarSkinRenderHelper } from '../libs/taobao_avatar_sdk.mjs';
import { ICharacter } from '../libs/taobao_avatar_sdk.mjs';

const { ccclass, property } = _decorator;


/**
 * 注意：SDK内部类, 请勿修改
 * 角色的基础的皮肤渲染（合成皮肤使用）
 * */
@ccclass('AvatarSkinRender')
export class AvatarSkinRender extends Component {
    //辅助类
    _componentHelper: AvatarSkinRenderHelper = null;

    //sdk内部使用的id
    public avatarId: number = -1;

    //参数
    //是否启用动画烘焙
    public useBakedAnim: boolean = false;
    //投射和接受阴影
    public castShadow: boolean = false;
    public receiveShadow: boolean = false;

    @property(SkinnedMeshRenderer)
    headMesh: SkinnedMeshRenderer = null;
    @property(SkinnedMeshRenderer)
    bodyMesh: SkinnedMeshRenderer = null;


    onLoad () {
        this._componentHelper = new AvatarSkinRenderHelper(this);
    }

    /**
     * 初始化
    */
    public init (avatarId: number, useBakedAnim: boolean, castShadow: boolean, receiveShadow: boolean) {
        this.avatarId = avatarId;
        this.useBakedAnim = useBakedAnim;
        this.castShadow = castShadow;
        this.receiveShadow = receiveShadow;
        this._componentHelper.init();
    }

    /**
     * 衣服或妆容，往皮肤上面应用贴图和颜色，这里仅仅记录数据, 直到衣服和妆容处理完毕
    */
    public addUseColorAndTexInfo (info: ConvertColorAndTexInfo) {
        this._componentHelper.addUseColorAndTexInfo(info);
    }


    /**
     * 开始处理皮肤渲染
     * isMan:是男的还是女的
     * needHideSkinMatArr：需要隐藏的材质球
     * renderOverCb：渲染完毕的回调
    */
    public startSkinRender (avatarCfg: ICharacter, isMan: boolean, isHighToe: boolean, needHideSkinMatArr: string[], renderOverCb: Function) {
        this._componentHelper.startSkinRender(avatarCfg, isMan, isHighToe, needHideSkinMatArr, renderOverCb);
    }

    /**
     * 释放
    */
    public release () {
        this._componentHelper.release();
    }

}
