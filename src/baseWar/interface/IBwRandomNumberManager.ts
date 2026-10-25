import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type {
    SeedRandomState,
    SeedRandomStateJson,
} from "../../proto/schema/CommonProto/Structure/SeedRandomState.ts";

export interface IBwRandomNumberManager {
    init({ isNeedSeedRandom, initialState, currentState }: {
        isNeedSeedRandom: boolean;
        initialState    : Undefinable<SeedRandomState>;
        currentState    : Undefinable<SeedRandomState>;
    }): void;

    getIsNeedSeedRandom(): boolean;

    getAndTickNextNumber(): number;
    getNextNumberWithoutTick(): number;

    getSeedRandomCurrentStateJson(): SeedRandomStateJson;
    setSeedRandomCurrentStateJson(state: SeedRandomStateJson): void;

    getSeedRandomInitialState(): SeedRandomState | null;
}
