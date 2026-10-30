import {
    type AuxiliaryTypes_AuxiliaryTypes,
    type AuxiliaryTypes_GridIndex,
    type Ui_Interfaces_IUiContainer,
    type Units_Constants,
    type Units_IUnit,
} from "../internal.ts";
import type { GridIndexAndPathInfo } from "../proto/schema/CommonProto/Structure/GridIndexAndPathInfo.ts";

export interface IUnitView extends Ui_Interfaces_IUiContainer.IUiContainer {
    init(unit: Units_IUnit.IUnit): IUnitView;

    startRunningView(): IUnitView;
    stopRunningView(): void;

    getUnit(): Units_IUnit.IUnit | null;

    resetAllViews(): void;

    showUnitAnimation(type: Units_Constants.AnimationTypeId): void;

    updateImageHp(): void;

    moveAlongPath({ path, isDiving, isBlocked, aiming, updateViewAfterMove }: {
        path                : AuxiliaryTypes_GridIndex.GridIndex[];
        isDiving            : boolean;
        isBlocked           : boolean;
        aiming              : AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_GridIndex.GridIndex[]>;
        updateViewAfterMove : boolean;
    }): Promise<void>;
    moveAlongExtraPath({ path, aiming, deleteViewAfterMoving }: {
        path                    : GridIndexAndPathInfo[];
        aiming                  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_GridIndex.GridIndex[]>;
        deleteViewAfterMoving   : boolean;
    }): Promise<void>;
}
