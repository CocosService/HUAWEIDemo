import { sys } from "cc";
import config from "./config";
import { RoomType, global } from "./hw_gobe_global_data";

export interface BulletData {
    playerId: string,
    bulletId: number,
    x: number,
    y: number,
    direction: number,
    needDestroy: boolean,
}

/**
 * 随机产生 openId
 */
export function mockOpenId () {
    let str = sys.localStorage.getItem('openId');
    if (!str) {
        str = randomStr();
        sys.localStorage.setItem('openId', str);
    }
    return str;
}

function randomStr () {
    let str = Date.now().toString(36);
    for (let i = 0; i < 7; i++) {
        str += Math.ceil(Math.random() * (10 ** 4)).toString(36);
    }
    return str;
}



/**
 * 判断 MGOBE SDK 是否初始化完成
 */
export function isInited (): boolean {
    // 初始化成功后才有玩家ID
    return !!global.client?.playerId;
}
/**
 * 获取玩家自定义属性
 */
export function getCustomPlayerProperties () {
    let playerName: string = global.playerName;
    let data: Object = {
        playerName
    }
    let customPlayerProperties: string = JSON.stringify(data);
    return customPlayerProperties;
}


// 在非对称匹配规则下，队伍编号值为1的表示1人队的一方 ， 队伍编号值为11的表示3人队的一方
export function mockTeamNumber () {
    return Math.random() < 0.5 ? 1 : 11;
}
export function getPlayerMatchParams () {
    return { 'level': 2 };
}


export function setRoomType (roomType: RoomType) {
    global.roomType = roomType;
    if (global.room && global.room.ownerId === global.room.playerId) {
        let roomProp;
        if (global.client.room.customRoomProperties) {
            roomProp = JSON.parse(global.client.room.customRoomProperties);
            roomProp.roomType = roomType;
        } else {
            roomProp = { roomType: roomType };
        }
        global.room.updateRoomProperties({ customRoomProperties: JSON.stringify(roomProp) });
    }
}

/**
 * 休眠second秒
 * @param second
 * @private
 */
export function sleep (second: number) {
    return new Promise((resolve) => setTimeout(resolve, second));
}
