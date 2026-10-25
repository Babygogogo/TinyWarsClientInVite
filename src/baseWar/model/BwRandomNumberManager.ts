import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwRandomNumberManager } from "../interface/IBwRandomNumberManager.ts";
import { newError, getExisted, getDefined } from "../../helpers/Misc.ts";
import { type IGenerator, Generator } from "../../helpers/SeedRandom.ts";
import type {
    SeedRandomStateJson,
    SeedRandomState,
} from "../../proto/schema/CommonProto/Structure/SeedRandomState.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class BwRandomNumberManager implements IBwRandomNumberManager {
    private _isNeedSeedRandom?          : boolean;
    private _seedRandomInitialState?    : SeedRandomState | null;
    private _randomNumberGenerator?     : IGenerator | null;

    public init({ isNeedSeedRandom, initialState, currentState }: {
        isNeedSeedRandom: boolean;
        initialState    : Undefinable<SeedRandomState>;
        currentState    : Undefinable<SeedRandomState>;
    }): void {
        this._setIsNeedSeedRandom(isNeedSeedRandom);

        if (isNeedSeedRandom) {
            // TODO: check if the states are valid.
            if (initialState == null) {
                throw newError(`Empty initialState.`);
            }
            this._setSeedRandomInitialState(initialState);

            if (currentState == null) {
                throw newError(`Empty currentState.`);
            }
            this._setRandomNumberGenerator(new Generator("", { state: currentState.toJson() }));
        }
    }

    private _setIsNeedSeedRandom(isNeedReplay: boolean): void {
        this._isNeedSeedRandom = isNeedReplay;
    }
    public getIsNeedSeedRandom(): boolean {
        return getExisted(this._isNeedSeedRandom);
    }

    private _setRandomNumberGenerator(generator: IGenerator): void {
        this._randomNumberGenerator = generator;
    }
    private _getRandomNumberGenerator(): IGenerator | null {
        return getDefined(this._randomNumberGenerator, ClientErrorCode.BwRandomNumberManager_GetRandomNumberGenerator_00);
    }

    public getAndTickNextNumber(): number {
        if (!this.getIsNeedSeedRandom()) {
            return Math.random();
        }

        return getExisted(this._getRandomNumberGenerator()).getNext();
    }
    public getNextNumberWithoutTick(): number {
        if (!this.getIsNeedSeedRandom()) {
            return Math.random();
        }

        const generator = getExisted(this._getRandomNumberGenerator());
        const state     = generator.state();
        const number    = generator.getNext();
        this._setRandomNumberGenerator(new Generator("", { state: state }));
        return number;
    }

    public getSeedRandomCurrentStateJson(): SeedRandomStateJson {
        return getExisted(this._getRandomNumberGenerator()).state();
    }
    public setSeedRandomCurrentStateJson(state: SeedRandomStateJson): void {
        this._setRandomNumberGenerator(new Generator("", { state: state }));
    }

    private _setSeedRandomInitialState(state: SeedRandomState): void {
        this._seedRandomInitialState = state;
    }
    public getSeedRandomInitialState(): SeedRandomState | null {
        return getDefined(this._seedRandomInitialState, ClientErrorCode.BwRandomNumberManager_GetSeedRandomInitialState_00);
    }
}
