import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type {
    SeedRandomState as ProtoSchemaCommonProtoStructureSeedRandomState,
    SeedRandomStateJson as ProtoSchemaCommonProtoStructureSeedRandomStateSeedRandomStateJson,
} from "../../proto/schema/CommonProto/Structure/SeedRandomState.ts";

type SeedRandomState        = ProtoSchemaCommonProtoStructureSeedRandomState;
type SeedRandomStateJson    = ProtoSchemaCommonProtoStructureSeedRandomStateSeedRandomStateJson;

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
