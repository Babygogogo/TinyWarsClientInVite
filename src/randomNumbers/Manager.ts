import {
    Helpers_Misc,
    RandomNumbers_SeedRandom,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type {
    SeedRandomState,
    SeedRandomStateJson,
} from "../proto/schema/CommonProto/Structure/SeedRandomState.ts";

export class Manager {
    private _seedRandomInitialState : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SeedRandomState>;
    private _randomNumberGenerator  : RandomNumbers_SeedRandom.IGenerator | undefined;

    public init({ initialState, currentState }: {
        initialState    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SeedRandomState>;
        currentState    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SeedRandomState>;
    }): void {
        if ((initialState == null) !== (currentState == null)) {
            throw Helpers_Misc.newError(`Invalid initialState and currentState.`);
        }

        // TODO: check if the states are valid.
        this._setSeedRandomInitialState(initialState);
        this.setSeedRandomCurrentStateJson(currentState?.toJson());
    }

    private _getRandomNumberGenerator(): RandomNumbers_SeedRandom.IGenerator | undefined {
        return this._randomNumberGenerator;
    }
    private _setRandomNumberGenerator(generator: RandomNumbers_SeedRandom.IGenerator | undefined): void {
        this._randomNumberGenerator = generator;
    }

    public getAndTickNextNumber(): number {
        return this._getRandomNumberGenerator()?.getNext() ?? Math.random();
    }
    public getNextNumberWithoutTick(): number {
        const generator = this._getRandomNumberGenerator();
        if (generator == null) {
            return Math.random();
        }

        const state = generator.state();
        const num   = generator.getNext();
        this.setSeedRandomCurrentStateJson(state);
        return num;
    }

    public getSeedRandomCurrentStateJson(): SeedRandomStateJson | undefined {
        return this._getRandomNumberGenerator()?.state();
    }
    public setSeedRandomCurrentStateJson(state: SeedRandomStateJson | undefined): void {
        this._setRandomNumberGenerator(state == null
            ? undefined
            : new RandomNumbers_SeedRandom.Generator("", { state : state }),
        );
    }

    private _setSeedRandomInitialState(state: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SeedRandomState>): void {
        this._seedRandomInitialState = state;
    }
    public getSeedRandomInitialState(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SeedRandomState>{
        return this._seedRandomInitialState;
    }
}
