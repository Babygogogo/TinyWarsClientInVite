
export function getKeyPrefix(): string {
    return `TinyWarsStorage_${window.GAME_VERSION}_`;
}
export function getOldDatabaseName(): string {
    return `TinyWarsDb_${window.GAME_VERSION}`;
}
export function getNewDatabaseName(): string {
    return "New" + getOldDatabaseName();
}
export function getNewDatabaseVersion(): number {
    return 8;
}
