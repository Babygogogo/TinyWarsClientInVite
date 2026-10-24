import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwRandomNumberManager from "../interface/IBwRandomNumberManager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersSeedRandom from "../../helpers/SeedRandom.ts";
import type * as ProtoSchemaCommonProtoStructureSeedRandomState from "../../proto/schema/CommonProto/Structure/SeedRandomState.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type SeedRandomStateJson    = ProtoSchemaCommonProtoStructureSeedRandomState.SeedRandomStateJson;

export class BwRandomNumberManager implements BaseWarInterfaceIBwRandomNumberManager.IBwRandomNumberManager {
    private _isNeedSeedRandom?          : boolean;
    private _seedRandomInitialState?    : ProtoSchemaCommonProtoStructureSeedRandomState.SeedRandomState | null;
    private _randomNumberGenerator?     : HelpersSeedRandom.IGenerator | null;

    public init({ isNeedSeedRandom, initialState, currentState }: {
        isNeedSeedRandom: boolean;
        initialState    : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureSeedRandomState.SeedRandomState>;
        currentState    : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureSeedRandomState.SeedRandomState>;
    }): void {
        this._setIsNeedSeedRandom(isNeedSeedRandom);

        if (isNeedSeedRandom) {
            // TODO: check if the states are valid.
            if (initialState == null) {
                throw HelpersMisc.newError(`Empty initialState.`);
            }
            this._setSeedRandomInitialState(initialState);

            if (currentState == null) {
                throw HelpersMisc.newError(`Empty currentState.`);
            }
            this._setRandomNumberGenerator(new HelpersSeedRandom.Generator("", { state: currentState.toJson() }));
        }
    }

    private _setIsNeedSeedRandom(isNeedReplay: boolean): void {
        this._isNeedSeedRandom = isNeedReplay;
    }
    public getIsNeedSeedRandom(): boolean {
        return HelpersMisc.getExisted(this._isNeedSeedRandom);
    }

    private _setRandomNumberGenerator(generator: HelpersSeedRandom.IGenerator): void {
        this._randomNumberGenerator = generator;
    }
    private _getRandomNumberGenerator(): HelpersSeedRandom.IGenerator | null {
        return HelpersMisc.getDefined(this._randomNumberGenerator, UtilsClientErrorCode.ClientErrorCode.BwRandomNumberManager_GetRandomNumberGenerator_00);
    }

    public getAndTickNextNumber(): number {
        if (!this.getIsNeedSeedRandom()) {
            return Math.random();
        }

        return HelpersMisc.getExisted(this._getRandomNumberGenerator()).getNext();
    }
    public getNextNumberWithoutTick(): number {
        if (!this.getIsNeedSeedRandom()) {
            return Math.random();
        }

        const generator = HelpersMisc.getExisted(this._getRandomNumberGenerator());
        const state     = generator.state();
        const number    = generator.getNext();
        this._setRandomNumberGenerator(new HelpersSeedRandom.Generator("", { state: state }));
        return number;
    }

    public getSeedRandomCurrentStateJson(): SeedRandomStateJson {
        return HelpersMisc.getExisted(this._getRandomNumberGenerator()).state();
    }
    public setSeedRandomCurrentStateJson(state: SeedRandomStateJson): void {
        this._setRandomNumberGenerator(new HelpersSeedRandom.Generator("", { state: state }));
    }

    private _setSeedRandomInitialState(state: ProtoSchemaCommonProtoStructureSeedRandomState.SeedRandomState): void {
        this._seedRandomInitialState = state;
    }
    public getSeedRandomInitialState(): ProtoSchemaCommonProtoStructureSeedRandomState.SeedRandomState | null {
        return HelpersMisc.getDefined(this._seedRandomInitialState, UtilsClientErrorCode.ClientErrorCode.BwRandomNumberManager_GetSeedRandomInitialState_00);
    }
}
