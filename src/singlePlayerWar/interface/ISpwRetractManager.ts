export interface ISpwRetractManager {
    setCanRetract(canRetract: boolean): void;
    getCanRetract(): boolean;

    addRetractState(state: Uint8Array): void;
    getRetractState(retractId: number): Uint8Array | null;

    getNextRetractId(): number;
    setNextRetractId(retractId: number): void;
}
