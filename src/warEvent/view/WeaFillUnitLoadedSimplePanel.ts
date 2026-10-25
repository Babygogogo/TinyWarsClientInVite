import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getUnitAnimationTickCount } from "../../common/model/CommonModel.ts";
import { getDefaultSkinId } from "../../forceSkins/Utils.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { createRange } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
    getLanguageText,
    getUnitAiModeName,
    getTextForYesOrNo,
    getUnitActionStateText,
} from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { WeightedGridIndex } from "../../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import type {
    WarEventAction as ProtoSchemaCommonProtoWarEventWarEventAction,
} from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type {
    WarEventFullData as ProtoSchemaCommonProtoWarEventWarEventFullData,
} from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaFillUnitLoadedSimple } from "../../proto/schema/CommonProto/WarEvent/WeaFillUnitLoadedSimple.ts";
import type { SerialUnit } from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UiUnitViewData } from "../../ui/types/UiUnitViewData.ts";
import { getUiUnitViewClass } from "../../ui/utils/UiFactory.ts";
import { AiModeId, AllTagIdArray, ActionStateId, CustomName } from "../../units/Constants.ts";
import { getTagIdList, getEncodedTagId, checkIsValidActionStateId, checkIsValidEncodedTagId } from "../../units/utils/Common.ts";
import { fillNonTrivialDefaultValues, createDefault } from "../../units/utils/Serialization.ts";
import { getErrorTipForAction, getDetailDescForAction } from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData   = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEventAction     = ProtoSchemaCommonProtoWarEventWarEventAction;

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                  : IUiImage;
    private readonly _group!                                    : IUiContainer;
    private readonly _labelTitle!                               : IUiLabel;
    private readonly _btnType!                                  : IUiButton;
    private readonly _btnClose!                                 : IUiButton;

    private readonly _groupDesc!                                : IUiLayout;
    private readonly _labelDesc!                                : IUiLabel;
    private readonly _labelError!                               : IUiLabel;

    private readonly _btnConPlayerFilter!                       : IUiButton;
    private readonly _labelConPlayerFilter!                     : IUiLabel;

    private readonly _btnConUnitFilter!                         : IUiButton;
    private readonly _labelConUnitFilter!                       : IUiLabel;

    private readonly _btnConTileFilter!                         : IUiButton;
    private readonly _labelConTileFilter!                       : IUiLabel;

    private readonly _btnActLoadCount!                          : IUiButton;
    private readonly _labelActLoadCount!                        : IUiLabel;

    private readonly _listUnit!                                 : IUiScrollList<DataForUnitRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnConPlayerFilter,                     callback: this._onTouchedBtnConPlayerFilter },

            { ui: this._btnConUnitFilter,                       callback: this._onTouchedBtnConUnitFilter },

            { ui: this._btnConTileFilter,                       callback: this._onTouchedBtnConTileFilter },

            { ui: this._btnActLoadCount,                        callback: this._onTouchedBtnActLoadCount },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listUnit.setItemRendererClass(UnitRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listUnit.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyWarEventFullDataChanged(): void {
        this._updateView();
    }

    private _onTouchedBtnType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().WeActionTypeListPanel, {
            war         : openData.war,
            fullData    : openData.fullData,
            action      : openData.action,
        });
    }

    private _onTouchedBtnConPlayerFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().WePlayerFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            currentFilter           : action.getConPlayerFilter(),
            callback                : filter => {
                action.setConPlayerFilter(filter);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnConUnitFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().WeUnitFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConUnitFilter(),
            callback                : filter => {
                action.setConUnitFilter(filter);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnConTileFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().WeTileFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConTileFilter(),
            callback                : filter => {
                action.setConTileFilter(filter);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActLoadCount(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B1424),
            minValue        : 1,
            maxValue        : 10,
            currentValue    : action.getActLoadCount() ?? 0,
            callback        : num => {
                action.setActLoadCount(num);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForUnits();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(TextType.B0516);

        this._btnConPlayerFilter.setLangText(TextType.PlayerFilter);
        this._btnConUnitFilter.setLangText(TextType.UnitFilter);
        this._btnConTileFilter.setLangText(TextType.TileFilter);
        this._btnActLoadCount.setLangText(TextType.B1424);

        this._updateLabelDescAndLabelError();

        this._updateLabelConPlayerFilter();
        this._updateLabelConUnitFilter();
        this._updateLabelConTileFilter();
        this._updateBtnActIsInTurn();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action            = openData.action;
        const war               = openData.war;
        const errorTip          = getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getDetailDescForAction(action, war.getGcData()) || UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateLabelConPlayerFilter(): void {
        this._labelConPlayerFilter.setText(this._getAction()?.getConPlayerFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelConUnitFilter(): void {
        this._labelConUnitFilter.setText(this._getAction()?.getConUnitFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelConTileFilter(): void {
        this._labelConTileFilter.setText(this._getAction()?.getConTileFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateBtnActIsInTurn(): void {
        this._labelActLoadCount.setText(`${this._getAction()?.getActLoadCount()}`);
    }

    private async _updateComponentsForUnits(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        const dataArray : DataForUnitRenderer[] = [{
            war         : war,
            unitData    : getExisted(action.getActUnitData()),
        }];

        await this._listUnit.bindData(dataArray);
    }

    private _getAction(): Undefinable<WeaFillUnitLoadedSimple> {
        return this.getOpenData()?.action.getWeaFillUnitLoadedSimple();
    }
}

interface DataForUnitRenderer extends UiListItemData {
    war         : IMeWar;
    unitData    : SerialUnit;
}
class UnitRenderer extends UiListItemRenderer<DataForUnitRenderer> {
    private readonly _labelError!               : IUiLabel;

    private readonly _btnAiMode!                : IUiButton;
    private readonly _labelAiMode!              : IUiLabel;

    private readonly _btnUnitTag!               : IUiButton;
    private readonly _labelUnitTag!             : IUiLabel;

    private readonly _btnUnitType!              : IUiButton;
    private readonly _conUnitView!              : IUiContainer;

    private readonly _btnActionState!           : IUiButton;
    private readonly _labelActionState!         : IUiLabel;

    private readonly _btnAiDestination!         : IUiButton;
    private readonly _labelAiDestination!       : IUiLabel;

    private readonly _btnHp!                    : IUiButton;
    private readonly _labelHp!                  : IUiLabel;

    private readonly _btnFuel!                  : IUiButton;
    private readonly _labelFuel!                : IUiLabel;

    private readonly _btnPromotion!             : IUiButton;
    private readonly _labelPromotion!           : IUiLabel;

    private readonly _btnCustomNameId!          : IUiButton;
    private readonly _labelCustomNameId!        : IUiLabel;

    private readonly _btnHasLoadedCo!           : IUiButton;
    private readonly _labelHasLoadedCo!         : IUiLabel;

    private readonly _groupPrimaryAmmo!         : IUiContainer;
    private readonly _btnPrimaryAmmo!           : IUiButton;
    private readonly _labelPrimaryAmmo!         : IUiLabel;

    private readonly _groupFlareAmmo!           : IUiContainer;
    private readonly _btnFlareAmmo!             : IUiButton;
    private readonly _labelFlareAmmo!           : IUiLabel;

    private readonly _groupIsDiving!            : IUiContainer;
    private readonly _btnIsDiving!              : IUiButton;
    private readonly _labelIsDiving!            : IUiLabel;

    private readonly _groupBuildMaterial!       : IUiContainer;
    private readonly _btnBuildMaterial!         : IUiButton;
    private readonly _labelBuildMaterial!       : IUiLabel;

    private readonly _groupProduceMaterial!     : IUiContainer;
    private readonly _btnProduceMaterial!       : IUiButton;
    private readonly _labelProduceMaterial!     : IUiLabel;

    private readonly _unitView                  = new (getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnAiMode,                  callback: this._onTouchedBtnAiMode },
            { ui: this._btnUnitTag,                 callback: this._onTouchedBtnUnitTag },
            { ui: this._btnIsDiving,                callback: this._onTouchedBtnIsDiving },
            { ui: this._btnHasLoadedCo,             callback: this._onTouchedBtnHasLoadedCo },
            { ui: this._btnActionState,             callback: this._onTouchedBtnActionState },
            { ui: this._btnAiDestination,           callback: this._onTouchedBtnAiDestination },
            { ui: this._btnUnitType,                callback: this._onTouchedBtnUnitType },

            { ui: this._btnHp,                      callback: this._onTouchedBtnHp },

            { ui: this._btnFuel,                    callback: this._onTouchedBtnFuel },

            { ui: this._btnPromotion,               callback: this._onTouchedBtnPromotion },

            { ui: this._btnCustomNameId,            callback: this._onTouchedBtnCustomNameId },

            { ui: this._btnPrimaryAmmo,             callback: this._onTouchedBtnPrimaryAmmo },

            { ui: this._btnFlareAmmo,               callback: this._onTouchedBtnFlareAmmo },

            { ui: this._btnBuildMaterial,           callback: this._onTouchedBtnBuildMaterial },

            { ui: this._btnProduceMaterial,         callback: this._onTouchedBtnProduceMaterial },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: TypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
        ]);

        this._updateComponentsForLanguage();

        this._conUnitView.addUiChild(this._unitView);
    }

    private _onTouchedBtnAiMode(): void {
        const unitData  = this.getOpenData()?.unitData;
        if (unitData == null) {
            return;
        }

        const aiMode = unitData.getAiMode();
        if (aiMode === AiModeId.NoMove) {
            unitData.setAiMode(AiModeId.Normal);
        } else if ((aiMode === AiModeId.Normal) || (aiMode == null)) {
            unitData.setAiMode(AiModeId.WaitUntilCanAttack);
        } else {
            unitData.setAiMode(AiModeId.NoMove);
        }
        dispatch(TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnUnitTag(): void {
        const unitData = this.getOpenData()?.unitData;
        if (unitData == null) {
            return;
        }

        openPanel(getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : getTagIdList(unitData.getGroupedTagId() ?? 0, true),
            availableIntegerArray   : AllTagIdArray,
            getTitleText            : () => getFormattedText(TextType.F0092, getText(TextType.Tags)),
            callbackOnConfirm       : tagIdArray => {
                unitData.setGroupedTagId(getEncodedTagId(tagIdArray));
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnIsDiving(): void {
        const unitData = this.getOpenData()?.unitData;
        if (unitData == null) {
            return;
        }

        unitData.setIsDiving(!unitData.getIsDiving());
        dispatch(TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnHasLoadedCo(): void {
        const unitData = this.getOpenData()?.unitData;
        if (unitData == null) {
            return;
        }

        unitData.setIsCoOnboard(unitData.getIsCoOnboard() ? null : true);
        dispatch(TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnActionState(): void {
        const unitData = this.getOpenData()?.unitData;
        if (unitData == null) {
            return;
        }

        if (unitData.getActionState() === ActionStateId.Acted) {
            unitData.setActionState(null);
        } else {
            unitData.setActionState(ActionStateId.Acted);
        }
        dispatch(TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnAiDestination(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = openData.unitData;
        const destination   = unitData.getAiWeightedDestination();
        const mapSize       = openData.war.getTileMap().getMapSize();
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B1071),
            minValue        : 0,
            maxValue        : mapSize.getWidth() - 1,
            currentValue    : destination?.getGridIndex()?.getX() ?? 0,
            callback        : newX => {
                if (newX == null) {
                    unitData.setAiWeightedDestination(null);
                    dispatch(TypeId.WarEventFullDataChanged);
                } else {
                    openPanel(getDict().CommonInputNullableIntegerPanel, {
                        getTitle           : () => getText(TextType.B1072),
                        minValue        : 0,
                        maxValue        : mapSize.getHeight() - 1,
                        currentValue    : destination?.getGridIndex()?.getY() ?? 0,
                        callback        : newY => {
                            if (newY == null) {
                                unitData.setAiWeightedDestination(null);
                                dispatch(TypeId.WarEventFullDataChanged);
                            } else {
                                openPanel(getDict().CommonInputIntegerPanel, {
                                    getTitle           : () => getText(TextType.B1094),
                                    currentValue    : destination?.getWeight() ?? 0,
                                    minValue        : -99999999,
                                    maxValue        : 99999999,
                                    getHelpText     : () => getText(TextType.A0432),
                                    callback        : value => {
                                        unitData.setAiWeightedDestination(WeightedGridIndex.fromJson({
                                            gridIndex   : { x: newX, y: newY },
                                            weight      : value,
                                        }));
                                        dispatch(TypeId.WarEventFullDataChanged);
                                    },
                                });
                            }
                        },
                    });
                }
            },
        });
    }
    private _onTouchedBtnUnitType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const gameConfig    = war.getGcData();
        const unitData      = getExisted(openData.unitData);

        const playerIndexArray = createRange(PlayerIndex.First, war.getPlayersCountUnneutral() + 1, 1);
        openPanel(getDict().CommonChooseUnitAndPlayerIndexPanel, {
            gameConfig          : gameConfig,
            currentUnitType     : unitData.getUnitType(),
            unitTypeArray       : gameConfig.getAllUnitTypeArray(),
            currentSkinId       : unitData.getPlayerIndex(),
            playerIndexArray    : playerIndexArray,
            finalSkinIdArray    : playerIndexArray.map(v => getDefaultSkinId(v)),
            callback            : (unitType, skinId) => {
                unitData.setPlayerIndex(skinId);
                if (unitData.getUnitType() !== unitType) {
                    unitData.setUnitType(unitType);
                    fillNonTrivialDefaultValues(unitData, gameConfig);
                }

                dispatch(TypeId.WarEventFullDataChanged);
            }
        });
    }

    private _onTouchedBtnHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = getExisted(openData.unitData);
        const minValue      = 1;
        const maxValue      = getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getMaxHp());
        const defaultValue  = maxValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Hp),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentHp() ?? defaultValue,
            callback        : value => {
                unitData.setCurrentHp(value);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = getExisted(openData.unitData);
        const minValue      = 0;
        const maxValue      = getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getMaxFuel());
        const defaultValue  = maxValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Fuel),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentFuel() ?? defaultValue,
            callback        : value => {
                unitData.setCurrentFuel(value);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnPromotion(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = getExisted(openData.unitData);
        const minValue      = 0;
        const maxValue      = openData.war.getGcData().getUnitMaxPromotion();
        const defaultValue  = minValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Promotion),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentPromotion() ?? defaultValue,
            callback        : value => {
                unitData.setCurrentPromotion(value);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnCustomNameId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData  = getExisted(openData.unitData);
        const arr       = openData.war.getUnitMap().getUnitCustomNameArray();
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.CustomNameId),
            availableNumberArray    : createRange(0, CustomName.MaxId + 1, 1),
            currentNumber           : unitData.getCustomNameId() ?? 0,
            columnsCount            : 4,
            showNumber              : true,
            getNumberMainText       : num => {
                if (num === 0) {
                    return `(${getText(TextType.B0391)})`;
                } else {
                    return getLanguageText({ textArray: arr?.find(v => (v.getNameId() ?? 0) === num)?.getNameTextArray() }) ?? `----`;
                }
            },
            callbackOnConfirm       : num => {
                if (num == 0) {
                    unitData.setCustomNameId(null);
                } else {
                    unitData.setCustomNameId(num);
                }
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnPrimaryAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = getExisted(openData.unitData);
        const minValue      = 0;
        const maxValue      = getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getPrimaryWeaponMaxAmmo());
        const defaultValue  = maxValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.PrimaryWeaponAmmo),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getPrimaryWeaponCurrentAmmo() ?? defaultValue,
            callback        : value => {
                unitData.setPrimaryWeaponCurrentAmmo(value);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnFlareAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = getExisted(openData.unitData);
        const minValue      = 0;
        const maxValue      = getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getFlareMaxAmmo());
        const defaultValue  = maxValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.FlareAmmo),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getFlareCurrentAmmo() ?? defaultValue,
            callback        : value => {
                unitData.setFlareCurrentAmmo(value);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnBuildMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = getExisted(openData.unitData);
        const minValue      = 0;
        const maxValue      = getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getMaxBuildMaterial());
        const defaultValue  = maxValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.BuildMaterial),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentBuildMaterial() ?? defaultValue,
            callback        : value => {
                unitData.setCurrentBuildMaterial(value);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnProduceMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = getExisted(openData.unitData);
        const minValue      = 0;
        const maxValue      = getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getMaxProduceMaterial());
        const defaultValue  = maxValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.ProductionMaterial),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentProduceMaterial() ?? defaultValue,
            callback        : value => {
                unitData.setCurrentProduceMaterial(value);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForData();
    }
    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(getUnitAnimationTickCount());
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForData();
    }

    private _updateComponentsForLanguage(): void {
        this._btnAiMode.setLangText(TextType.AiMode);
        this._btnUnitTag.setLangText(TextType.Tags);
        this._btnIsDiving.setLangText(TextType.B0371);
        this._btnHasLoadedCo.setLangText(TextType.CoOnboard);
        this._btnHp.setLangText(TextType.Hp);
        this._btnFuel.setLangText(TextType.Fuel);
        this._btnPromotion.setLangText(TextType.Promotion);
        this._btnCustomNameId.setLangText(TextType.CustomNameId);
        this._btnPrimaryAmmo.setLangText(TextType.PrimaryWeaponAmmo);
        this._btnFlareAmmo.setLangText(TextType.FlareAmmo);
        this._btnBuildMaterial.setLangText(TextType.BuildMaterial);
        this._btnProduceMaterial.setLangText(TextType.ProductionMaterial);
        this._btnActionState.setLangText(TextType.ActionState);
        this._btnAiDestination.setLangText(TextType.AiDestination);
        this._btnUnitType.setLangText(TextType.B0525);
    }
    private _updateComponentsForData(): void {
        this._updateLabelError();
        this._updateComponentsForAiMode();
        this._updateComponentsForUnitTag();
        this._updateComponentsForIsDiving();
        this._updateComponentsForIsCoOnboard();
        this._updateComponentsForActionState();
        this._updateComponentsForAiDestination();
        this._updateComponentsForHp();
        this._updateComponentsForFuel();
        this._updateComponentsForPromotion();
        this._updateComponentsForCustomNameId();
        this._updateComponentsForPrimaryAmmo();
        this._updateComponentsForFlareAmmo();
        this._updateComponentsForBuildMaterial();
        this._updateComponentsForProduceMaterial();

        this._updateUnitView();
    }
    private _updateLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const label             = this._labelError;
        const dataForAddUnit    = openData.unitData;
        const errorTips         = getErrorTipsForAddUnit({
            unitData: dataForAddUnit,
            war             : openData.war,
        });
        label.setText(errorTips || getText(TextType.B0493));
        label.setTextColor(errorTips ? ColorValue.Red : ColorValue.Green);
    }
    private _updateComponentsForAiMode(): void {
        this._labelAiMode.setText(getUnitAiModeName(this.getOpenData()?.unitData?.getAiMode() ?? AiModeId.Normal) ?? UndefinedError);
    }
    private _updateComponentsForUnitTag(): void {
        const tagIdArray        = getTagIdList(this.getOpenData()?.unitData?.getGroupedTagId() ?? 0, true);
        this._labelUnitTag.setText(tagIdArray.length <= 0 ? `--` : tagIdArray.join(`/`));
    }
    private _updateComponentsForIsDiving(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group     = this._groupIsDiving;
        const unitData  = openData.unitData;
        const unitCfg   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0);
        if ((!unitCfg) || (unitCfg.getDiveCfg() == null)) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._labelIsDiving.setText(getTextForYesOrNo(unitData.getIsDiving()));
        }
    }
    private _updateComponentsForIsCoOnboard(): void {
        this._labelHasLoadedCo.setText(getTextForYesOrNo(this.getOpenData()?.unitData?.getIsCoOnboard()));
    }
    private _updateComponentsForActionState(): void {
        const label = this._labelActionState;
        const state = this.getOpenData()?.unitData?.getActionState();
        label.setText(state == null
            ? (getUnitActionStateText(ActionStateId.Idle) ?? UndefinedError)
            : (getUnitActionStateText(state) ?? UndefinedError)
        );
    }
    private _updateComponentsForAiDestination(): void {
        const destination = this.getOpenData()?.unitData?.getAiWeightedDestination();
        const gridIndex   = destination?.getGridIndex();
        this._labelAiDestination.setText(destination == null ? `--` : `${gridIndex?.getX()}, ${gridIndex?.getY()} (${destination.getWeight()})`);
    }
    private _updateComponentsForHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelHp.setText(`${getExisted(openData.unitData).getCurrentHp()}`);
    }
    private _updateComponentsForFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }
        this._labelFuel.setText(`${getExisted(openData.unitData).getCurrentFuel()}`);
    }
    private _updateComponentsForPromotion(): void {
        this._labelPromotion.setText(`${this.getOpenData()?.unitData?.getCurrentPromotion() ?? 0}`);
    }
    private _updateComponentsForCustomNameId(): void {
        this._labelCustomNameId.setText(`${this.getOpenData()?.unitData?.getCustomNameId() ?? ``}`);
    }
    private _updateComponentsForPrimaryAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group     = this._groupPrimaryAmmo;
        const unitData  = getExisted(openData.unitData);
        const maxAmmo   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getPrimaryWeaponMaxAmmo();
        if (!maxAmmo) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._labelPrimaryAmmo.setText(`${unitData.getPrimaryWeaponCurrentAmmo()}`);
        }
    }
    private _updateComponentsForFlareAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group     = this._groupFlareAmmo;
        const unitData  = getExisted(openData.unitData);
        const maxAmmo   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getFlareMaxAmmo();
        if (!maxAmmo) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._labelFlareAmmo.setText(`${unitData.getFlareCurrentAmmo()}`);
        }
    }
    private _updateComponentsForBuildMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group         = this._groupBuildMaterial;
        const unitData      = getExisted(openData.unitData);
        const maxMaterial   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getMaxBuildMaterial();
        if (!maxMaterial) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._labelBuildMaterial.setText(`${unitData.getCurrentBuildMaterial()}`);
        }
    }
    private _updateComponentsForProduceMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group         = this._groupProduceMaterial;
        const unitData      = getExisted(openData.unitData);
        const maxMaterial   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getMaxProduceMaterial();
        if (!maxMaterial) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._labelProduceMaterial.setText(`${unitData.getCurrentProduceMaterial()}`);
        }
    }

    private _updateUnitView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = openData.unitData;
        const playerIndex   = getExisted(unitData.getPlayerIndex());
        const gameConfig    = openData.war.getGcData();
        this._unitView.update(new UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : getDefaultSkinId(playerIndex),
            overridingSkinId    : undefined,
            unitData            : createDefault({
                gridIndex   : { x: 0, y: 0 },
                playerIndex : playerIndex,
                unitTypeId  : unitData.getUnitType(),
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }));
    }
}

function getErrorTipsForAddUnit({ unitData, war }: {
    unitData    : SerialUnit;
    war         : IMeWar;
}): string | null {
    const gameConfig    = war.getGcData();
    const unitCfg       = gameConfig.getUnitTemplateCfg(unitData.getUnitType() ?? 0);
    if (unitCfg == null) {
        return getFormattedText(TextType.F0064, getText(TextType.B0525));
    }

    if (unitData.getGridIndex() != null) {
        return getFormattedText(TextType.F0064, getText(TextType.B0531));
    }

    {
        const playerIndex = unitData.getPlayerIndex() ?? 0;
        if ((playerIndex > war.getPlayersCountUnneutral())      ||
            (playerIndex < PlayerIndex.First)
        ) {
            return getFormattedText(TextType.F0064, getText(TextType.PlayerIndex));
        }
    }

    {
        if (!checkIsValidActionStateId(unitData.getActionState())) {
            return getFormattedText(TextType.F0064, getText(TextType.ActionState));
        }
    }

    {
        const currentFuel = unitData.getCurrentFuel();
        if ((currentFuel < 0) || (currentFuel > unitCfg.getMaxFuel())) {
            return getFormattedText(TextType.F0064, getText(TextType.Fuel));
        }
    }

    {
        const currentHp = unitData.getCurrentHp();
        if ((currentHp < 0) || (currentHp > unitCfg.getMaxHp())) {
            return getFormattedText(TextType.F0064, getText(TextType.Hp));
        }
    }

    {
        const currentBuildMaterial  = unitData.getCurrentBuildMaterial();
        if ((currentBuildMaterial < 0) || (currentBuildMaterial > (unitCfg.getMaxBuildMaterial() ?? 0))) {
            return getFormattedText(TextType.F0064, getText(TextType.BuildMaterial));
        }
    }

    {
        const currentProduceMaterial  = unitData.getCurrentProduceMaterial();
        if ((currentProduceMaterial < 0) || (currentProduceMaterial > (unitCfg.getMaxProduceMaterial() ?? 0))) {
            return getFormattedText(TextType.F0064, getText(TextType.ProductionMaterial));
        }
    }

    {
        const currentPromotion = unitData.getCurrentPromotion();
        if ((currentPromotion < 0) || (currentPromotion > gameConfig.getUnitMaxPromotion())) {
            return getFormattedText(TextType.F0064, getText(TextType.Promotion));
        }
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const customNameId = unitData.getCustomNameId();
    }

    {
        const flareCurrentAmmo  = unitData.getFlareCurrentAmmo();
        if ((flareCurrentAmmo < 0) || (flareCurrentAmmo > (unitCfg.getFlareMaxAmmo() ?? 0))) {
            return getFormattedText(TextType.F0064, getText(TextType.FlareAmmo));
        }
    }

    {
        const primaryCurrentAmmo  = unitData.getPrimaryWeaponCurrentAmmo();
        if ((primaryCurrentAmmo < 0) || (primaryCurrentAmmo > (unitCfg.getPrimaryWeaponMaxAmmo() ?? 0))) {
            return getFormattedText(TextType.F0064, getText(TextType.PrimaryWeaponAmmo));
        }
    }

    // if (unitData.unitId != null) {
    //     return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0527));
    // }

    if (unitData.getLoaderUnitId() != null) {
        return getFormattedText(TextType.F0064, getText(TextType.B0528));
    }

    if ((unitData.getIsDiving()) && (unitCfg.getDiveCfg() == null)) {
        return getFormattedText(TextType.F0064, getText(TextType.B0371));
    }

    // unitData.hasLoadedCo的值不需要检查

    if (!checkIsValidEncodedTagId(unitData.getGroupedTagId() ?? 0)) {
        return getFormattedText(TextType.F0091, getText(TextType.Tags));
    }

    // if (unitData.deprecatedIsBuildingTile) {
    //     return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0529));
    // }

    // if (unitData.deprecatedIsCapturingTile) {
    //     return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0530));
    // }

    return null;
}
