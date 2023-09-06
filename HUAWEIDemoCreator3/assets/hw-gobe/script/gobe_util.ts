import { sys } from "cc";
import config from "./config";
import { global } from "./hw_gobe_global_data";

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
 * 通过文件的arrayBuffer获取文件的sha256值
 * @param arrayBuffer
 */
export async function getFileHash (arrayBuffer: ArrayBuffer) {
    // Blob转ArrayBuffer
    // const arrayBuffer = await blob.arrayBuffer();
    // 计算消息的哈希值
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    // 将缓冲区转换为字节数组
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // 将字节数组转换为十六进制字符串 (hashHex)
    return hashArray.map((b) => {
        //.padStart(2, '0')
        let str = b.toString(16);
        let addCount = 2 - str.length;
        if (addCount > 0) {
            for (let i = 0; i < addCount; i++) {
                str = "0" + str;
            }
        }
        return str;
    }).join('');
}


export function download (remoteUrl: string) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = async function (e) {
            if (xhr.readyState != 4) {
                return;
            }
            if (xhr.status == 200) {
                const response = xhr.response;
                if (response) {
                    /*const blob = new Blob([response], {
                        type: 'application/zip,charset-UTF-8',
                    });*/

                    /*// H5解决方案
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = decodeURI(fileName);
                    link.click();
                    URL.revokeObjectURL(url);*/
                    resolve(response);
                }
                else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText,
                    });
                }
            }
        };

        xhr.onerror = function (e) {
            console.log('----下载出错----' + e);
            reject(e);
        };

        xhr.open('GET', remoteUrl, true);
        xhr.responseType = 'arraybuffer';
        xhr.send();
    });
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
