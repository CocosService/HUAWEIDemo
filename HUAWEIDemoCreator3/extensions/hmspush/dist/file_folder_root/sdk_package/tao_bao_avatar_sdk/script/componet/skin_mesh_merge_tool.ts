import { _decorator, Component, SkinnedMeshRenderer, Mesh } from 'cc';
import { SkinMeshMergeToolHelper } from '../libs/taobao_avatar_sdk.mjs';

const { ccclass, property } = _decorator;


/**
 * 注意：SDK内部类, 请勿修改
 * 皮肤网格合并工具
*/
@ccclass('SkinMeshMergeTool')
export class SkinMeshMergeTool extends Component {

    //辅助类
    _componentHelper: SkinMeshMergeToolHelper = null;

    //网格渲染
    @property(SkinnedMeshRenderer)
    smr: SkinnedMeshRenderer = null;

    onLoad () {
        this._componentHelper = new SkinMeshMergeToolHelper(this);
    }

    /**
     * 获取合并后的新 mesh 
    */
    public getMergeOverMesh (needHideMatNameArr: string[], createOverCb: Function) {
        this._componentHelper.getMergeOverMesh(needHideMatNameArr, createOverCb);
    }

    /**
     * 释放
    */
    public release () {
        this._componentHelper.release();
    }
}
