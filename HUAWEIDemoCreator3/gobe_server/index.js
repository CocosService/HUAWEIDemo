'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var _Game_roomId, _Game_frameClock, _Game_frameInterval, _Game_direction;
class Game {
    constructor(initInfo, logger, frameInterval, roomId) {
        _Game_roomId.set(this, void 0);
        _Game_frameClock.set(this, null);
        _Game_frameInterval.set(this, void 0);
        _Game_direction.set(this, [[0, 1], [-1, 0], [0, -1], [1, 0]]);
        this.gameBasicInfo = {};
        this.planeInfo = new Map();
        this.logger = logger;
        __classPrivateFieldSet(this, _Game_frameInterval, frameInterval, "f");
        __classPrivateFieldSet(this, _Game_roomId, roomId, "f");
        this.gameEnd = {
            count: 0,
            value: '',
            isSend: false
        };
    }
    /**
     * 初始化飞机
     */
    addPlane(planeInitInfo) {
        let plane = {
            playerId: planeInitInfo.playerId,
            x: planeInitInfo.position.x,
            y: planeInitInfo.position.y,
            direction: this.transferDir(planeInitInfo.direction),
        };
        this.planeInfo.set(planeInitInfo.playerId, plane);
        return plane;
    }
    /**
     * 更新飞机信息
     * @param gameCmdInfo 飞机信息 包含playerId，x，y，direction
     */
    updatePlane(gameCmdInfo) {
        let plane = this.planeInfo.get(gameCmdInfo.playerId);
        if (plane === undefined) {
            this.logger.warn('updatePlane, playerId:' + gameCmdInfo.playerId + 'not exist');
            return;
        }
        plane.x = gameCmdInfo.x;
        plane.y = gameCmdInfo.y;
    }
    /**
     * 方向映射
     * @param direction 枚举值
     * @private 方向数组index
     */
    transferDir(direction) {
        return ((direction + 360) % 360) / 90;
    }
    startFrameClock(args) {
        if (__classPrivateFieldGet(this, _Game_frameClock, "f") !== null)
            return;
        __classPrivateFieldSet(this, _Game_frameClock, setInterval(() => {
            this.planeInfo.forEach((plane) => {
                //none
            });
        }, __classPrivateFieldGet(this, _Game_frameInterval, "f")), "f");
    }
    stopFrameClock() {
        clearInterval(__classPrivateFieldGet(this, _Game_frameClock, "f"));
        __classPrivateFieldSet(this, _Game_frameClock, null, "f");
    }
}
_Game_roomId = new WeakMap(), _Game_frameClock = new WeakMap(), _Game_frameInterval = new WeakMap(), _Game_direction = new WeakMap();

var _GameManage_gameMapping;
class GameManage {
    constructor() {
        _GameManage_gameMapping.set(this, new Map());
    }
    saveGame(roomId, game) {
        __classPrivateFieldGet(this, _GameManage_gameMapping, "f").set(roomId, game);
    }
    getGame(roomId) {
        var _a;
        return (_a = __classPrivateFieldGet(this, _GameManage_gameMapping, "f").get(roomId)) !== null && _a !== void 0 ? _a : undefined;
    }
    removeGame(roomId) {
        __classPrivateFieldGet(this, _GameManage_gameMapping, "f").delete(roomId);
    }
}
_GameManage_gameMapping = new WeakMap();
var gameManage = new GameManage();

const gameServer = {
    onDestroyRoom(args) {
        let game = gameManage.getGame(args.roomId);
        if (game === undefined) {
            args.SDK.log.error('onStopFrameSync game not exist' + args.roomId);
            return;
        }
        game.stopFrameClock();
        gameManage.removeGame(args.roomId);
    },
    onCreateRoom(args) {
        // do something
    },
    onRealTimeServerConnected(args) {
        // do something
    },
    onRealTimeServerDisconnected(args) {
        // do something
    },
    onConnect(args) {
        // do something
    },
    onDisconnect(args) {
        // do something
    },
    onJoin(playerInfo, args) {
        // do something
    },
    onLeave(playerInfo, args) {
        // do something
    },
    onRecvFrame(msg, args) {
        let frameMessages = Array.isArray(msg) ? msg : [msg];
        frameMessages.forEach(gameFrame => {
            // 若为空帧则不处理
            if (!gameFrame.frameInfo || gameFrame.frameInfo.length < 1) {
                return;
            }
            gameFrame.frameInfo.forEach((frameData) => {
                let frameDataList = frameData.data;
                if (frameDataList && frameDataList.length > 0) {
                    frameDataList.forEach(data => {
                        const gameCmd = JSON.parse(data);
                        // 获取当前房间的游戏信息
                        let game = gameManage.getGame(args.roomId);
                        if (game === undefined) {
                            args.SDK.log.error('onRecvFrame, game not exist, roomId:' + args.roomId);
                            return;
                        }
                        switch (gameCmd.cmd) {
                            case 0 /* CmdType.planeFly */:
                                game.updatePlane(gameCmd);
                                break;
                        }
                    });
                }
            });
        });
    },
    onRecvFromClientV2(msg, args) {
        let gameData = JSON.parse(msg.msg);
        switch (gameData.type) {
            case 'InitGame':
                handleInitGame(gameData, args);
                break;
            case 'GameEnd':
                handleGameEnd(gameData, args, msg.srcPlayer).then().catch();
                break;
            default:
                args.SDK.log.error('onRecvFromClientV2 unsupported gameData type');
                break;
        }
    },
    onRoomPropertiesChange(msg, args) {
        // do something
    },
    onStartFrameSync(args) {
        // do something
    },
    onStopFrameSync(args) {
        let game = gameManage.getGame(args.roomId);
        if (game === undefined) {
            args.SDK.log.error('onStopFrameSync game not exist' + args.roomId);
            return;
        }
        game.stopFrameClock();
    },
    onUpdateCustomProperties(player, args) {
        // do something
    },
    onUpdateCustomStatus(msg, args) {
        // do something
    },
    onRequestFrameError(error, args) {
        // do something
    }
};
/**
 * 处理游戏初始化
 * @param gameData
 * @param args
 */
function handleInitGame(gameData, args) {
    // 初始化游戏信息，并以房间维度保存
    let gameInitInfo = gameData;
    let game = new Game(gameInitInfo, args.SDK.log, 30, args.roomId);
    for (let i = 0; i < gameInitInfo.playerArr.length; i++) {
        game.addPlane(gameInitInfo.playerArr[i]);
    }
    gameManage.saveGame(args.roomId, game);
    game.startFrameClock(args);
}
/**
 * 处理游戏结算
 * @param gameData
 * @param args
 * @param playerId
 */
function handleGameEnd(gameData, args, playerId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // 游戏结束  设置缓存
        args.SDK.log.info('handleGameEnd begin, playerId: ' + playerId);
        let game = gameManage.getGame(args.roomId);
        if (game === undefined) {
            args.SDK.log.error('handleGameEnd game not exist' + args.roomId);
            return;
        }
        let endInfo = { type: "GameEnd", result: -1, gameEndCount: 0 };
        if (game.gameEnd.isSend) {
            return;
        }
        //数量递增
        game.gameEnd.count++;
        if (game.gameEnd.count === 1) {
            // 3秒后未收到所有玩家消息，则认为异常
            setTimeout(() => {
                var _a, _b, _c;
                if (!((_a = game.gameEnd) === null || _a === void 0 ? void 0 : _a.isSend) && ((_b = game.gameEnd) === null || _b === void 0 ? void 0 : _b.count) !== game.planeInfo.size) {
                    endInfo.result = 0;
                    endInfo.gameEndCount = (_c = game.gameEnd) === null || _c === void 0 ? void 0 : _c.count;
                    game.gameEnd.isSend = true;
                    args.SDK.sendData(JSON.stringify(endInfo))
                        .then()
                        .catch(err => {
                        args.SDK.log.error('roomId:' + args.roomId + 'handleGameEnd send GameEndData error:' + err);
                    });
                }
            }, 3000);
        }
        else if (((_a = game.gameEnd) === null || _a === void 0 ? void 0 : _a.count) === game.planeInfo.size) {
            endInfo.result = 1;
            endInfo.gameEndCount = (_b = game.gameEnd) === null || _b === void 0 ? void 0 : _b.count;
            game.gameEnd.isSend = true;
            args.SDK.sendData(JSON.stringify(endInfo))
                .then()
                .catch(err => {
                args.SDK.log.error('roomId:' + args.roomId + 'handleGameEnd send GameEndData error:' + err);
            });
        }
    });
}
const gobeDeveloperCode = {
    gameServer: gameServer,
    appId: '108702107',
};

exports.gobeDeveloperCode = gobeDeveloperCode;
