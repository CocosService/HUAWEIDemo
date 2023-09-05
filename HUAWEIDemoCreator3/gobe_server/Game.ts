import {
    Direction,
    GameBasicInfo,
    GameCmdInfo,
    GameData, GameEndInfo,
    GameInitInfo,
    Plane,
    PlaneInitInfo
} from "./GameInterface";
import GOBERTS from "./GOBERTS";

export class Game {
    planeInfo: Map<string, Plane>;     //playerId 为key

    gameBasicInfo: GameBasicInfo;

    #roomId: string;

    logger: any;
    gameEnd: GameEndInfo;
    #frameClock: any = null;

    #frameInterval: number;

    #direction = [[0, 1], [-1, 0], [0, -1], [1, 0]];

    public constructor (initInfo: GameInitInfo, logger: any, frameInterval: number, roomId: string) {
        this.gameBasicInfo = {

        };
        this.planeInfo = new Map<string, Plane>();
        this.logger = logger;
        this.#frameInterval = frameInterval;
        this.#roomId = roomId;
        this.gameEnd = {
            count: 0,
            value: '',
            isSend: false
        }
    }

    /**
     * 初始化飞机
     */
    public initPlane (planeInitInfo: PlaneInitInfo) {
        let plane: Plane = {
            playerId: planeInitInfo.playerId,
            x: planeInitInfo.position.x,
            y: planeInitInfo.position.y,
            direction: this.transferDir(planeInitInfo.direction),
        }
        this.planeInfo.set(planeInitInfo.playerId, plane);
    }

    /**
     * 更新飞机信息
     * @param gameCmdInfo 飞机信息 包含playerId，x，y，direction
     */
    public updatePlane (gameCmdInfo: GameCmdInfo) {
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
    private transferDir (direction: Direction): number {
        return ((direction + 360) % 360) / 90;
    }


    public startFrameClock (args: GOBERTS.ActionArgs) {
        if (this.#frameClock !== null) return;
        this.#frameClock = setInterval(() => {
            this.planeInfo.forEach((plane) => {
                //none
            });
        }, this.#frameInterval);
    }

    public stopFrameClock () {
        clearInterval(this.#frameClock);
        this.#frameClock = null;
    }
}