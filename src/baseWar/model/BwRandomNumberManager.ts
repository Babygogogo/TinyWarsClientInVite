import {
    type BaseWar_Interface_IBwRandomNumberManager,
    Helpers_SeedRandom,
    type AuxiliaryTypes_AuxiliaryTypes,
    Utils_ClientErrorCode,
    Helpers_Misc,
} from "../../internal.ts";
import type {
SeedRandomState,
    SeedRandomStateJson,
} from "../../proto/schema/CommonProto/Structure/SeedRandomState.ts";

export class BwRandomNumberManager implements BaseWar_Interface_IBwRandomNumberManager.IBwRandomNumberManager {
    private _isNeedSeedRandom?          : boolean;
    private _seedRandomInitialState?    : SeedRandomState | null;
    private _randomNumberGenerator?     : Helpers_SeedRandom.IGenerator | null;

    public init({ isNeedSeedRandom, initialState, currentState }: {
        isNeedSeedRandom: boolean;
        initialState    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SeedRandomState>;
        currentState    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SeedRandomState>;
    }): void {
        this._setIsNeedSeedRandom(isNeedSeedRandom);

        if (isNeedSeedRandom) {
            // TODO: check if the states are valid.
            if (initialState == null) {
                throw Helpers_Misc.newError(`Empty initialState.`);
            }
            this._setSeedRandomInitialState(initialState);

            if (currentState == null) {
                throw Helpers_Misc.newError(`Empty currentState.`);
            }
            this._setRandomNumberGenerator(new Helpers_SeedRandom.Generator("", { state: currentState.toJson() }));
        }
    }

    private _setIsNeedSeedRandom(isNeedReplay: boolean): void {
        this._isNeedSeedRandom = isNeedReplay;
    }
    public getIsNeedSeedRandom(): boolean {
        return Helpers_Misc.getExisted(this._isNeedSeedRandom);
    }

    private _setRandomNumberGenerator(generator: Helpers_SeedRandom.IGenerator): void {
        this._randomNumberGenerator = generator;
    }
    private _getRandomNumberGenerator(): Helpers_SeedRandom.IGenerator | null {
        return Helpers_Misc.getDefined(this._randomNumberGenerator, Utils_ClientErrorCode.ClientErrorCode.BwRandomNumberManager_GetRandomNumberGenerator_00);
    }

    public getAndTickNextNumber(): number {
        if (!this.getIsNeedSeedRandom()) {
            return Math.random();
        }

        return Helpers_Misc.getExisted(this._getRandomNumberGenerator()).getNext();
    }
    public getNextNumberWithoutTick(): number {
        if (!this.getIsNeedSeedRandom()) {
            return Math.random();
        }

        const generator = Helpers_Misc.getExisted(this._getRandomNumberGenerator());
        const state     = generator.state();
        const number    = generator.getNext();
        this._setRandomNumberGenerator(new Helpers_SeedRandom.Generator("", { state: state }));
        return number;
    }

    public getSeedRandomCurrentStateJson(): SeedRandomStateJson {
        return Helpers_Misc.getExisted(this._getRandomNumberGenerator()).state();
    }
    public setSeedRandomCurrentStateJson(state: SeedRandomStateJson): void {
        this._setRandomNumberGenerator(new Helpers_SeedRandom.Generator("", { state: state }));
    }

    private _setSeedRandomInitialState(state: SeedRandomState): void {
        this._seedRandomInitialState = state;
    }
    public getSeedRandomInitialState(): SeedRandomState | null {
        return Helpers_Misc.getDefined(this._seedRandomInitialState, Utils_ClientErrorCode.ClientErrorCode.BwRandomNumberManager_GetSeedRandomInitialState_00);
    }
}
