import { _decorator, Component, Camera, MeshRenderer } from 'cc';
import { TextureMergeTask } from '../libs/taobao_avatar_sdk.mjs';
import { TextureMergeToolHelper } from '../libs/taobao_avatar_sdk.mjs';

const { ccclass, property } = _decorator;

/**
 * 注意：SDK内部类, 请勿修改
 * 贴图合图工具
 * */
@ccclass('TextureMergeTool')
export class TextureMergeTool extends Component {
    //辅助类
    _componentHelper: TextureMergeToolHelper = null;


    //放皮肤贴图的node
    @property(MeshRenderer)
    skinTexMr: MeshRenderer = null;
    //放金属度贴图的node
    @property(MeshRenderer)
    metallicTexMr: MeshRenderer = null;
    //相机
    @property(Camera)
    camera: Camera = null;
    //是否在运行
    public isInRuning: boolean = false;


    onLoad () {
        this._componentHelper = new TextureMergeToolHelper(this);
        this._componentHelper.onLoad();
    }
    /**
     * 执行任务
     * task:皮肤渲染任务
     * doOverCb:执行完毕的回调 无需回调参数
    */
    public runTask (task: TextureMergeTask, doOverCb: Function) {
        this._componentHelper.runTask(task, doOverCb);
    }
    /**
     * 停止处理当前的任务
    */
    public stopCurTask () {
        this._componentHelper.stopCurTask();
    }

}

