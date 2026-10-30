import {
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type {
    SeedRandomState,
    SeedRandomStateJson,
} from "../../proto/schema/CommonProto/Structure/SeedRandomState.ts";

export interface IBwRandomNumberManager {
    init({ isNeedSeedRandom, initialState, currentState }: {
        isNeedSeedRandom: boolean;
        initialState    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SeedRandomState>;
        currentState    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SeedRandomState>;
    }): void;

    getIsNeedSeedRandom(): boolean;

    getAndTickNextNumber(): number;
    getNextNumberWithoutTick(): number;

    getSeedRandomCurrentStateJson(): SeedRandomStateJson;
    setSeedRandomCurrentStateJson(state: SeedRandomStateJson): void;

    getSeedRandomInitialState(): SeedRandomState | null;
}
