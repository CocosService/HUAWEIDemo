import { GameSceneType } from "./frame_sync";
import { Player } from "./player";

/**
 * 战斗房间的状态
*/
export enum FightRoomState {
    Ready = 0,
    Fight = 1,
    GameOver = 2,
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
    public playerNodeArr: Player[] = [];

    public playerName: string = "";
    public unhandleFrames: GOBE.RecvFrameMessage[] = [];            // 未处理的帧
    public unProcessedServerInfo: GOBE.RecvFromServerInfo[] = [];   // 未处理的实时消息
    public curHandleFrameId: number = 0;                            // 当前处理到的帧id

    public isConnected: boolean = false;                            // 长链是否是连接状态，默认false
    public isRequestFrameStatus = false;                            // 当前是否为补帧状态

    // 回放相关
    public recordInfos: GOBE.RecordInfo[] = [];                     // 对战记录列表
    public recordPlayerIdMap = new Map();                           // 回放玩家列表 key: recordId, value: playerIds

    public gameSceneType: GameSceneType = 0;                        // 默认为空
    public recordRoomInfo = null;                                   // 当前回放记录的房间基本信息
    public planeStepPixel: number = 20;                             // 飞机每步移动像素

    public bgMinX: number = 50;                                     // 飞行背景x最小值
    public bgMaxX: number = 1000 - 50;                              // 飞行背景x最大值

    public bgMinY: number = 50;                                     // 飞行背景y最小值
    public bgMaxY: number = 690 - 50;                               // 飞行背景y最大值

    public TeamAPlayer1StartPos = { x: this.bgMinX + 100, y: this.bgMaxY - 100 };                   // 队伍A一号玩家起始位置
    public TeamBPlayer1StartPos = { x: this.bgMaxX - 100, y: this.bgMinY + 100 };                   // 队伍B一号玩家起始位置

    public needResetRoomFrameId: boolean = false;                                                   // 标志需要重置房间帧同步起始帧id
    public maxReconnectCount: number = 3;                                                           // 断线最大重连次数
}
export const global = new HwGobeGlobalData();