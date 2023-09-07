import { PlayerData, PlayerList } from "./PlayerList";

export let frames: GOBE.ServerFrameMessage[] = [];

// key：方向， value：角度
export enum Direction {
    up = 0,
    down = 180,
    left = 90,
    right = -90
}

// 操作指令类型
export enum CmdType {
    planeFly = 0,              // 飞机飞行
    syncRoomInfo = 4,          // 房主同步房间信息
}

export enum Team {
    A = "A",
    B = "B"
}


export const frameSyncPlayerList: PlayerList = {
    players: []
};


export function clearFrames () {
    frames = [];
}

export function pushFrames (frame: GOBE.ServerFrameMessage) {
    frames.push(frame);
}

/**
 * 添加player
*/
export function addPlayerFromData (playerId: string, x: number, y: number, dir: Direction, teamId: string) {
    const player: PlayerData = {
        playerId,
        x,
        y,
        direction: dir,
        teamId,
    };
    frameSyncPlayerList.players.push(player);
}

/**
 * 更新player数据
*/
export function updatePlayerData (playerId: string, x: number, y: number, hp: number, dir: Direction) {
    let playerData = frameSyncPlayerList.players.find((p) => p.playerId == playerId);
    if (playerData) {
        playerData.x = x;
        playerData.y = y;
        playerData.direction = dir;
    } else {
        console.warn("找不到player,playerId:" + playerId);
    }
}




//游戏场景作用类型
export enum GameSceneType {
    FOR_NULL = 0,
    FOR_GAME = 1,
    FOR_RECORD = 3,
}
