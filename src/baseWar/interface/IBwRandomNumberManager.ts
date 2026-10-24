import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as ProtoSchemaCommonProtoStructureSeedRandomState from "../../proto/schema/CommonProto/Structure/SeedRandomState.ts";

type SeedRandomState        = ProtoSchemaCommonProtoStructureSeedRandomState.SeedRandomState;
type SeedRandomStateJson    = ProtoSchemaCommonProtoStructureSeedRandomState.SeedRandomStateJson;

export interface IBwRandomNumberManager {
    init({ isNeedSeedRandom, initialState, currentState }: {
        isNeedSeedRandom: boolean;
        initialState    : AuxiliaryTypesAuxiliaryTypes.Undefinable<SeedRandomState>;
        currentState    : AuxiliaryTypesAuxiliaryTypes.Undefinable<SeedRandomState>;
    }): void;

    getIsNeedSeedRandom(): boolean;

    getAndTickNextNumber(): number;
    getNextNumberWithoutTick(): number;

    getSeedRandomCurrentStateJson(): SeedRandomStateJson;
    setSeedRandomCurrentStateJson(state: SeedRandomStateJson): void;

    getSeedRandomInitialState(): SeedRandomState | null;
}
