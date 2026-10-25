import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex as AuxiliaryTypesGridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { GridIndexAndPathInfo } from "../proto/schema/CommonProto/Structure/GridIndexAndPathInfo.ts";
import type { IUiContainer } from "../ui/interfaces/IUiContainer.ts";
import type { AnimationTypeId } from "./Constants.ts";
import type { IUnit } from "./IUnit.ts";

type UnitAnimationType  = AnimationTypeId;
type GridIndex          = AuxiliaryTypesGridIndex;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

export interface IUnitView extends IUiContainer {
    init(unit: IUnit): IUnitView;

    startRunningView(): IUnitView;
    stopRunningView(): void;

    getUnit(): IUnit | null;

    resetAllViews(): void;

    showUnitAnimation(type: UnitAnimationType): void;

    updateImageHp(): void;

    moveAlongPath({ path, isDiving, isBlocked, aiming, updateViewAfterMove }: {
        path                : GridIndex[];
        isDiving            : boolean;
        isBlocked           : boolean;
        aiming              : Undefinable<GridIndex>;
        updateViewAfterMove : boolean;
    }): Promise<void>;
    moveAlongExtraPath({ path, aiming, deleteViewAfterMoving }: {
        path                    : GridIndexAndPathInfo[];
        aiming                  : Undefinable<GridIndex>;
        deleteViewAfterMoving   : boolean;
    }): Promise<void>;
}
