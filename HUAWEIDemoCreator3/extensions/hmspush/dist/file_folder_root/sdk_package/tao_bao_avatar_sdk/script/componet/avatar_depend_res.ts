import { _decorator, Component, Node, Material, Texture2D, JsonAsset, Prefab, AnimationClip } from 'cc';
import { AvatarDependResHelper } from '../libs/taobao_avatar_sdk.mjs';
import { ICharacter, IMakeup } from '../libs/taobao_avatar_sdk.mjs';
import { ClothesType } from '../libs/taobao_avatar_sdk.mjs';
const { ccclass, property } = _decorator;


/**
 * 注意：SDK内部类, 请勿修改
 * 角色依赖的资源
*/
@ccclass('AvatarDependRes')
export class AvatarDependRes extends Component {
    //辅助类
    _componentHelper: AvatarDependResHelper = null;

    //角色正式材质球
    @property([Material])
    characterUseMatArr: Material[] = [];

    //基础测材质gltf模型信息，解析皮肤用
    @property(JsonAsset)
    skinMatGltfInfo: JsonAsset;

    //合图工具 prefab
    @property(Prefab)
    textureMergeTool: Prefab;

    //基础男角色数据(sdk完全转换后的数据，数据校验使用)
    @property(JsonAsset)
    basicsManAvatarInfo: JsonAsset;
    //基础女角色数据
    @property(JsonAsset)
    basicsWomanAvatarInfo: JsonAsset;
    //所有的皮肤贴图
    @property([Texture2D])
    allSkinTexture2D: Texture2D[] = [];
    //皮肤的法线图
    @property(Texture2D)
    skinNormalTexture2D: Texture2D = null;
    //妆容数据 兜底资源(资源单条资源,)
    @property(JsonAsset)
    basicsAvatarLowestInfo: JsonAsset = null;

    onLoad () {
        this._componentHelper = new AvatarDependResHelper(this);
    }


    /**
     * 根据名称获取材质球
    */
    public getMatByName (matName: string): Material {
        return this._componentHelper.getMatByName(matName);
    }

    /**
     * 校验数据，对不完整的字段进行补充
    */
    public checkPlayerAvatarData (info: ICharacter) {
        this._componentHelper.checkPlayerAvatarDataArgs(info);
    }

    /**
     * 校验数据，处理资源兜底
    */
    public checkPlayerAvatarDataTryGetLowestInfo (info: ICharacter) {
        this._componentHelper.checkPlayerAvatarDataTryGetLowestInfo(info);
    }
    /**
     * 获取皮肤贴图
    */
    public getFaceSkinTexture2D (skinImgId: string): Texture2D {
        return this._componentHelper.getFaceSkinTexture2D(skinImgId);
    }

    /**
     * 获取一个默认的皮肤贴图
    */
    public getOneDefSkinTexture2D (): Texture2D {
        return this._componentHelper.getFaceSkinTexture2D("ch_base_preview_001");
    }

}

