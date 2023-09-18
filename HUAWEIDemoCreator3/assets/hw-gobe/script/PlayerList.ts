
export interface PlayerData {
    playerId: string,
    x: number,
    y: number,
    direction: number,
    teamId: string,
}

export interface PlayerList {
    players: PlayerData[],
}
