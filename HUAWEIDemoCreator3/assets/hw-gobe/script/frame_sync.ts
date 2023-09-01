import { CloudList } from "./cloud_list";
import { PlayerData, PlayerList } from "./PlayerList";
import { global } from "./hw_gobe_global_data";
export let frames: GOBE.ServerFrameMessage[] = [];
// 碰撞体tag
export enum CollideTag {
    plane = 0,
    bullet = 1,
    circle = 2,
}


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
    bulletFly = 1,             // 子弹移动
    bulletDestroy = 2,         // 子弹销毁
    collide = 3,               // 碰撞
    syncRoomInfo = 4,          // 房主同步房间信息
}

export enum Team {
    red = "0",
    yellow = "1"
}

export const cloudsList: CloudList = {
    clouds: []
};

export const frameSyncPlayerList: PlayerList = {
    players: []
};

// 碰撞事件
export interface ColliderEvent {
    playerId: string;
    bulletId: string;
    timeStamp: number;
}

export const colliderEventMap = new Map<string, ColliderEvent>();
export const destroyedBulletSet = new Set();

// 记录玩家初始化的位置，以便飞机被子弹击中后回到初始化位置
export const frameSyncPlayerInitList: PlayerList = {
    players: []
};

export function clearFrames () {
    frames = [];
}

export function pushFrames (frame: GOBE.ServerFrameMessage) {
    frames.push(frame);
}

export function setPlayerData (playerId: string, x: number, y: number, hp: number, isShoot: boolean, dir: Direction, teamId: string, robotName?: string) {
    const player: PlayerData = {
        playerId,
        x,
        y,
        hp,
        isShoot,
        direction: dir,
        teamId,
        robotName,
    };
    frameSyncPlayerList.players.push(player);
    frameSyncPlayerInitList.players.push(player);
}

export function updatePlayerData (playerId: string, x: number, y: number, hp: number, dir: Direction) {
    let playerData = frameSyncPlayerList.players.find((p) => p.playerId == playerId);
    if (playerData) {
        playerData.x = x;
        playerData.y = y;
        playerData.hp = hp;
        playerData.direction = dir;
    }
    // console.log('-----frameSyncPlayerList.players----------' + JSON.stringify(frameSyncPlayerList.players));
}

export function resetFrameSyncPlayerList () {
    frameSyncPlayerList.players = [];
    frameSyncPlayerInitList.players = [];
    global.room.players.forEach(player => {
        if (player.customPlayerProperties == "watcher") {
            return;
        }
        // 如果是房主(红色)
        if (global.room.ownerId == player.playerId) {
            setPlayerData(
                global.room.ownerId,
                global.redPlayer1StartPos.x,
                global.redPlayer1StartPos.y,
                global.planeHp,
                false,
                Direction.right,
                null,
                player.robotName
            );
        } else {
            setPlayerData(
                player.playerId,
                global.yellowPlayer1StartPos.x,
                global.yellowPlayer1StartPos.y,
                global.planeHp,
                false,
                Direction.left,
                null,
                player.robotName
            );
        }
    })
}

function roomMatch (roomInfo) {
    // 房间匹配
    let roomProp = null;
    if (roomInfo?.customRoomProperties) {
        roomProp = JSON.parse(roomInfo.customRoomProperties);
    }
    roomInfo.players.forEach((p) => {
        if (p.customPlayerProperties == "watcher") {
            return;
        }
        if (roomProp?.frameSyncPlayerArr) {
            let item = roomProp.frameSyncPlayerArr.find(item => item.playerId === p.playerId);
            setPlayerData(item.playerId, item.x, item.y, item.hp, item.isShoot, item.direction, null, item.robotName);
        }
        else {
            // 如果是房主(红色)
            if (roomInfo.ownerId == p.playerId) {
                setPlayerData(
                    roomInfo.ownerId,
                    global.redPlayer1StartPos.x,
                    global.redPlayer1StartPos.y,
                    global.planeHp,
                    false,
                    Direction.right,
                    null,
                    p.robotName
                );
            } else {
                setPlayerData(
                    p.playerId,
                    global.yellowPlayer1StartPos.x,
                    global.yellowPlayer1StartPos.y,
                    global.planeHp,
                    false,
                    Direction.left,
                    null,
                    p.robotName
                );
            }
        }
    });
}

function teamMatch (redTeamId: string, roomInfo) {
    // 组队匹配
    let yellowPosY = global.yellowPlayer1StartPos.y;
    let redPosY = global.redPlayer1StartPos.y;
    let roomProp = null;
    if (roomInfo?.customRoomProperties) {
        roomProp = JSON.parse(roomInfo.customRoomProperties);
    }
    roomInfo.players.forEach((p) => {
        if (roomProp?.frameSyncPlayerArr) {
            let item = roomProp.frameSyncPlayerArr.find(item => item.playerId === p.playerId);
            setPlayerData(item.playerId, item.x, item.y, item.hp, item.isShoot, item.direction, null, item.robotName);
        } else {
            if (redTeamId === p.teamId) {
                // 红队
                setPlayerData(
                    p.playerId,
                    global.redPlayer1StartPos.x,
                    redPosY,
                    global.planeHp,
                    false,
                    Direction.right,
                    Team.red,
                    p.robotName
                );
                redPosY -= global.playerYStartOffset;
            } else {
                // 黄队
                setPlayerData(
                    p.playerId,
                    global.yellowPlayer1StartPos.x,
                    yellowPosY,
                    global.planeHp,
                    false,
                    Direction.left,
                    Team.yellow,
                    p.robotName
                );
                yellowPosY += global.playerYStartOffset;
            }
        }
    });
}

function getRedTeamId (roomInfo) {
    let redTeamId = null;
    roomInfo.players.forEach((p) => {
        if (roomInfo.ownerId === p.playerId) {
            // 如果是房主
            redTeamId = p.teamId;
            return;
        }
    });
    return redTeamId;
}

export function setDefaultFrameState () {
    let roomInfo;
    if (global.gameSceneType == GameSceneType.FOR_RECORD) {
        roomInfo = global.recordRoomInfo;
    }
    else {
        roomInfo = global.room;
    }
    frameSyncPlayerList.players = [];
    let redTeamId = getRedTeamId(roomInfo);
    if (redTeamId) {
        global.isTeamMode = true;
        teamMatch(redTeamId, roomInfo);
    } else {
        global.isTeamMode = false;
        roomMatch(roomInfo);
    }
}

//  游戏场景作用类型
export enum GameSceneType {
    FOR_NULL = 0,
    FOR_GAME = 1,
    FOR_WATCHER = 2,
    FOR_RECORD = 3,
}
