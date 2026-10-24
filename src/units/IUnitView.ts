import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import type * as ProtoSchemaCommonProtoStructureGridIndexAndPathInfo from "../proto/schema/CommonProto/Structure/GridIndexAndPathInfo.ts";
import type * as UiInterfacesIUiContainer from "../ui/interfaces/IUiContainer.ts";
import type * as UnitsConstants from "./Constants.ts";
import type * as UnitsIUnit from "./IUnit.ts";

type UnitAnimationType  = UnitsConstants.AnimationTypeId;
type GridIndex          = AuxiliaryTypesGridIndex.GridIndex;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export interface IUnitView extends UiInterfacesIUiContainer.IUiContainer {
    init(unit: UnitsIUnit.IUnit): IUnitView;

    startRunningView(): IUnitView;
    stopRunningView(): void;

    getUnit(): UnitsIUnit.IUnit | null;

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
        path                    : ProtoSchemaCommonProtoStructureGridIndexAndPathInfo.GridIndexAndPathInfo[];
        aiming                  : Undefinable<GridIndex>;
        deleteViewAfterMoving   : boolean;
    }): Promise<void>;
}
