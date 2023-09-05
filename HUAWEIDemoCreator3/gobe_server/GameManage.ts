import { Game } from "./Game";
export class GameManage {
    #gameMapping = new Map();
    public saveGame (roomId: string, game: Game) {
        this.#gameMapping.set(roomId, game);
    }
    public getGame (roomId: string): Game {
        return this.#gameMapping.get(roomId) ?? undefined;
    }
    public removeGame (roomId: string) {
        this.#gameMapping.delete(roomId);
    }
}

export default new GameManage();