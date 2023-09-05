
export interface PlayerData {
    playerId: string,
    x: number,
    y: number,
    direction: number,
    teamId: string,
    robotName: string,
}

export interface PlayerList {
    players: PlayerData[],
}
