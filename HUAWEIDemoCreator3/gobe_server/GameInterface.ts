export interface GameBasicInfo {
}

/**
 * 本地游戏信息 飞机
 */
export interface Plane {
    playerId: string;           //玩家id
    x: number;                  //飞机座标x
    y: number;                  //飞机座标y
    direction: number;          // 0-上，1-左，2-下，3-右
}


/**
 * 飞机初始化信息
 */
export interface PlaneInitInfo {
    playerId: string;
    position: {
        x: number;
        y: number;
    }
    direction: Direction;
}

/**
 * 游戏结算
 */
export interface GameEndInfo {
    count: number;
    value: string;
    isSend: boolean;
}

/**
 * 上行消息 游戏初始化信息 type=’initGame‘
 */
export interface GameInitInfo {
    type: string;
    playerArr: PlaneInitInfo[];
}

/**
 * 指令类型 枚举
 */
export const enum CmdType {
    planeFly = 0,               // 飞机飞行
}

/**
 * 飞行方向 枚举
 */
export const enum Direction {
    up = 0,
    down = 180,
    left = 90,
    right = -90
}

/**
 * 上行消息 游戏指令
 */
export interface GameCmdInfo {
    cmd: CmdType;               // 指令类型
    playerId: string;           // 玩家id
    x?: number;                 // x座标
    y?: number;                 // y座标
    direction?: Direction;      // 飞行方向
}


// 以下为下行消息
export interface GameData {
    type: string;           //'Collide'
    playerId: string;
}

export interface GameInfo {
    playerId: string;
    planePos: {
        x: number;
        y: number;
    }
    planeDir: Direction;
}
