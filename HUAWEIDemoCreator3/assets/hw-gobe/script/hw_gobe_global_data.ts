import { GameSceneType } from "./frame_sync";
import { Player } from "./player";

/**
 * 战斗房间的状态
*/
export enum FightRoomState {
    Ready = 0,
    Fight = 0,
}

/**
 * 房间锁定状态
*/
export enum LockType {
    UnLocked = 0,
    Locked = 1,
}


export class HwGobeGlobalData {
    public room: GOBE.Room = null;
    public player: GOBE.Player = null;
    public playerId: string = null;
    public client: GOBE.Client = null;
    public matchRule: string = '0';                                 // 匹配规则 0-菜鸟区，1-高手区
    public roomInfos: GOBE.RoomInfo[] = null;
    public roomId: string = null;
    public group: GOBE.Group = null;
    public playerArr: Player[] = [];

    public playerName: string = "";
    public unhandleFrames: GOBE.RecvFrameMessage[] = [];            //未处理的帧
    public unProcessedServerInfo: GOBE.RecvFromServerInfo[] = [];   //未处理的实时消息
    public curHandleFrameId: number = 0;                            // 当前处理到的帧id

    public isConnected: boolean = false;                            // 长链是否是连接状态，默认false
    public clearColliderCacheInterval = 2000;                       //清理碰撞缓存周期，2s
    public rollbackFrameCount = 100;                                // 回退帧数量
    public isRequestFrameStatus = false;                            // 当前是否为补帧状态

    // 回放相关
    public recordInfos: GOBE.RecordInfo[] = [];                     // 对战记录列表
    public recordPlayerIdMap = new Map();                           // 回放玩家列表 key: recordId, value: playerIds

    public gameSceneType: GameSceneType = 0;                        // 默认为空
    public recordRoomInfo = null;                                   // 当前回放记录的房间基本信息
    public planeStepPixel: number = 20;                             // 飞机每步移动像素

    public bgMaxX: number = 1000 - 50;                              // 飞行背景x最大值
    public bgMinX: number = 50;                                     // 飞行背景x最小值
    public bgMaxY: number = 690 - 50;                               // 飞行背景y最大值
    public bgMinY: number = 50;                                     // 飞行背景y最小值

    public redPlayer1StartPos = { x: 55, y: 630 };                  // 红色方一号玩家起始位置
    public yellowPlayer1StartPos = { x: 940, y: 60 };               // 黄色方一号玩家起始位置

    public playerYStartOffset = 40;                                 // 同一方飞机Y轴起始偏移量
}
export const global = new HwGobeGlobalData();