import GOBERTS, { FrameInfo } from './GOBERTS';
import { CmdType, GameCmdInfo, GameInitInfo } from "./GameInterface";
import { Game } from "./Game";
import gameManage from "./GameManage";

const gameServer: GOBERTS.GameServer = {
    onDestroyRoom (args: GOBERTS.ActionArgs): void {
        let game = gameManage.getGame(args.roomId);
        if (game === undefined) {
            args.SDK.log.error('onStopFrameSync game not exist' + args.roomId);
            return;
        }
        game.stopFrameClock();
        gameManage.removeGame(args.roomId);
    },
    onCreateRoom (args: GOBERTS.ActionArgs): void {
        // do something
    },
    onRealTimeServerConnected (args: GOBERTS.ActionArgs): void {
        // do something
    },
    onRealTimeServerDisconnected (args: GOBERTS.ActionArgs): void {
        // do something
    },
    onConnect (args: GOBERTS.ActionArgs): void {
        // do something
    },
    onDisconnect (args: GOBERTS.ActionArgs): void {
        // do something
    },

    onJoin (playerInfo: GOBERTS.FramePlayerInfo, args: GOBERTS.ActionArgs): void {
        // do something
    },
    onLeave (playerInfo: GOBERTS.FramePlayerInfo, args: GOBERTS.ActionArgs): void {
        // do something
    },
    onRecvFrame (msg: GOBERTS.RecvFrameMessage | GOBERTS.RecvFrameMessage[], args: GOBERTS.ActionArgs): void {
        let frameMessages: GOBERTS.RecvFrameMessage[] = Array.isArray(msg) ? msg : [msg];
        frameMessages.forEach(gameFrame => {
            // 若为空帧则不处理
            if (!gameFrame.frameInfo || gameFrame.frameInfo.length < 1) {
                return;
            }
            gameFrame.frameInfo.forEach((frameData: FrameInfo) => {
                let frameDataList: string[] = frameData.data;
                if (frameDataList && frameDataList.length > 0) {
                    frameDataList.forEach(data => {
                        const gameCmd: GameCmdInfo = JSON.parse(data);
                        // 获取当前房间的游戏信息
                        let game = gameManage.getGame(args.roomId);
                        if (game === undefined) {
                            args.SDK.log.error('onRecvFrame, game not exist, roomId:' + args.roomId);
                            return;
                        }
                        switch (gameCmd.cmd) {
                            case CmdType.planeFly:
                                game.updatePlane(gameCmd);
                                break;
                            default:
                                break;
                        }
                    })
                }
            })
        })
    },


    onRecvFromClientV2 (msg: GOBERTS.RecvFromClientInfo, args: GOBERTS.ActionArgs): void {
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

    onRoomPropertiesChange (msg: GOBERTS.UpdateRoomInfo, args: GOBERTS.ActionArgs): void {
        // do something
    },
    onStartFrameSync (args: GOBERTS.ActionArgs): void {
        // do something
    },
    onStopFrameSync (args: GOBERTS.ActionArgs): void {
        let game = gameManage.getGame(args.roomId);
        if (game === undefined) {
            args.SDK.log.error('onStopFrameSync game not exist' + args.roomId);
            return;
        }
        game.stopFrameClock();
    },
    onUpdateCustomProperties (player: GOBERTS.FramePlayerPropInfo, args: GOBERTS.ActionArgs): void {
        // do something
    },
    onUpdateCustomStatus (msg: GOBERTS.PlayerStatusInfo, args: GOBERTS.ActionArgs): void {
        // do something
    },
    onRequestFrameError (error: GOBERTS.GOBEError, args: GOBERTS.ActionArgs): void {
        // do something
    }
}

/**
 * 处理游戏初始化
 * @param gameData
 * @param args
 */
function handleInitGame (gameData: any, args: GOBERTS.ActionArgs) {
    // 初始化游戏信息，并以房间维度保存
    let gameInitInfo = <GameInitInfo>gameData;
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
async function handleGameEnd (gameData: any, args: GOBERTS.ActionArgs, playerId: string) {
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
            if (!game.gameEnd?.isSend && game.gameEnd?.count !== game.planeInfo.size) {
                endInfo.result = 0;
                endInfo.gameEndCount = game.gameEnd?.count;
                game.gameEnd.isSend = true;
                args.SDK.sendData(JSON.stringify(endInfo))
                    .then()
                    .catch(err => {
                        args.SDK.log.error('roomId:' + args.roomId + 'handleGameEnd send GameEndData error:' + err);
                    });
            }
        }, 3000);
    } else if (game.gameEnd?.count === game.planeInfo.size) {
        endInfo.result = 1;
        endInfo.gameEndCount = game.gameEnd?.count;
        game.gameEnd.isSend = true;
        args.SDK.sendData(JSON.stringify(endInfo))
            .then()
            .catch(err => {
                args.SDK.log.error('roomId:' + args.roomId + 'handleGameEnd send GameEndData error:' + err);
            });
    }
}



export const gobeDeveloperCode = {
    gameServer: gameServer,
    appId: '108702107',
};