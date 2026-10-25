import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import { getUnitAnimationTickCount } from "../../common/model/CommonModel.ts";
import { show } from "../../FloatText.ts";
import { getDefaultSkinId } from "../../forceSkins/Utils.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { deleteElementFromList, createRange } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
    getLanguageText,
    getTextForYesOrNo,
    getUnitAiModeName,
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
import { DataForAddUnit } from "../../proto/schema/CommonProto/WarEvent/WeaAddUnitOnMapSimple/DataForAddUnit.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UiUnitViewData } from "../../ui/types/UiUnitViewData.ts";
import { getUiUnitViewClass } from "../../ui/utils/UiFactory.ts";
import { AiModeId, AllTagIdArray, ActionStateId, CustomName, UnitTypeId } from "../../units/Constants.ts";
import { getTagIdList, getEncodedTagId, checkIsValidActionStateId, checkIsValidEncodedTagId } from "../../units/utils/Common.ts";
import { fillNonTrivialDefaultValues, createDefault } from "../../units/utils/Serialization.ts";
import { Common } from "../../warEvents/actions/constants/AddUnitOnMapSimple.ts";

type WarEventFullData   = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEventAction     = ProtoSchemaCommonProtoWarEventWarEventAction;

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnType!              : IUiButton;
    private readonly _btnAddUnit!           : IUiButton;
    private readonly _btnClear!             : IUiButton;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _labelUnitsCount!      : IUiLabel;
    private readonly _listUnit!             : IUiScrollList<DataForUnitRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnAddUnit,         callback: this._onTouchedBtnAddUnit },
            { ui: this._btnClear,           callback: this._onTouchedBtnClear },
            { ui: this._btnType,            callback: this._onTouchedBtnType },
            { ui: this._btnClose,           callback: this.closePanel },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,    callback: this._onNotifyWarEventFullDataChanged },
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
        this._updateComponentsForUnits();
    }

    private _onTouchedBtnAddUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = openData.action.getWeaAddUnitOnMapSimple();
        if (action == null) {
            return;
        }

        const unitArray = action.getUnitArray();
        if (unitArray.length >= Common.MaxCount) {
            show(getText(TextType.A0189));
        } else {
            unitArray.push(getDefaultAddUnitData(openData.war.getGcData()));
            dispatch(TypeId.WarEventFullDataChanged);
        }
    }

    private _onTouchedBtnClear(): void {
        const action = this.getOpenData()?.action.getWeaAddUnitOnMapSimple();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0190),
            callback: () => {
                action.getUnitArray().length = 0;
                dispatch(TypeId.WarEventFullDataChanged);
            }
        });
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
        this._btnAddUnit.setLangText(TextType.B0535);
        this._btnClear.setLangText(TextType.B0391);
        this._btnClose.setLangText(TextType.B0146);
    }

    private async _updateComponentsForUnits(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action    = openData.action;
        const war       = openData.war;
        const dataArray : DataForUnitRenderer[] = [];
        for (const dataForAddUnit of action.getWeaAddUnitOnMapSimple()?.getUnitArray() ?? []) {
            dataArray.push({
                panel           : this,
                war             : war,
                action          : action,
                dataForAddUnit  : dataForAddUnit,
            });
        }

        await this._listUnit.bindData(dataArray);

        const label     = this._labelUnitsCount;
        const maxCount  = Common.MaxCount;
        const currCount = dataArray.length;
        label.setText(`${getText(TextType.B0524)}: ${currCount} / ${maxCount}`);
        label.setTextColor(((currCount <= maxCount) && (currCount > 0)) ? ColorValue.White : ColorValue.Red);
    }
}

interface DataForUnitRenderer extends UiListItemData {
    panel           : Panel;
    war             : IMeWar;
    action          : WarEventAction;
    dataForAddUnit  : DataForAddUnit;
}
class UnitRenderer extends UiListItemRenderer<DataForUnitRenderer> {
    private readonly _btnDelete!                : IUiButton;
    private readonly _btnClone!                 : IUiButton;
    private readonly _labelError!               : IUiLabel;

    private readonly _btnCanBeBlockedByUnit!    : IUiButton;
    private readonly _labelCanBeBlockedByUnit!  : IUiLabel;

    private readonly _btnNeedMovableTile!       : IUiButton;
    private readonly _labelNeedMovableTile!     : IUiLabel;

    private readonly _btnAiMode!                : IUiButton;
    private readonly _labelAiMode!              : IUiLabel;

    private readonly _btnUnitTag!               : IUiButton;
    private readonly _labelUnitTag!             : IUiLabel;

    private readonly _btnGridIndex!             : IUiButton;
    private readonly _labelGridIndex!           : IUiLabel;

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
            { ui: this._btnDelete,                  callback: this._onTouchedBtnDelete },
            { ui: this._btnClone,                   callback: this._onTouchedBtnClone },
            { ui: this._btnCanBeBlockedByUnit,      callback: this._onTouchedBtnCanBeBlockedByUnit },
            { ui: this._btnNeedMovableTile,         callback: this._onTouchedBtnNeedMovableTile },
            { ui: this._btnAiMode,                  callback: this._onTouchedBtnAiMode },
            { ui: this._btnUnitTag,                 callback: this._onTouchedBtnUnitTag },
            { ui: this._btnIsDiving,                callback: this._onTouchedBtnIsDiving },
            { ui: this._btnHasLoadedCo,             callback: this._onTouchedBtnHasLoadedCo },
            { ui: this._btnActionState,             callback: this._onTouchedBtnActionState },
            { ui: this._btnAiDestination,           callback: this._onTouchedBtnAiDestination },
            { ui: this._btnUnitType,                callback: this._onTouchedBtnUnitType },
            { ui: this._btnGridIndex,               callback: this._onTouchedBtnGridIndex },

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

    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0029),
            callback: () => {
                deleteElementFromList(getExisted(openData.action.getWeaAddUnitOnMapSimple()?.getUnitArray()), openData.dataForAddUnit);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnClone(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitArray = getExisted(openData.action.getWeaAddUnitOnMapSimple()?.getUnitArray());
        if (unitArray.length >= Common.MaxCount) {
            show(getText(TextType.YouCanNotDoThisRightNow));
        } else {
            const srcData   = openData.dataForAddUnit;
            const index     = unitArray.indexOf(srcData);
            const dstData   = srcData.clone();
            if (index < 0) {
                unitArray.push(dstData);
            } else {
                unitArray.splice(index, 0, dstData);
            }

            dispatch(TypeId.WarEventFullDataChanged);
        }
    }
    private _onTouchedBtnCanBeBlockedByUnit(): void {
        const data = this.getOpenData()?.dataForAddUnit;
        if (data == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent             : () => getText(TextType.A0414),
            getTextForConfirm      : () => getText(TextType.Yes),
            getTextForCancel       : () => getText(TextType.No),
            callback            : () => {
                data.setCanBeBlockedByUnit(true);
                dispatch(TypeId.WarEventFullDataChanged);
            },
            callbackOnCancel    : () => {
                data.setCanBeBlockedByUnit(false);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnNeedMovableTile(): void {
        const data = this.getOpenData()?.dataForAddUnit;
        if (data == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent             : () => getText(TextType.A0415),
            getTextForConfirm      : () => getText(TextType.Yes),
            getTextForCancel       : () => getText(TextType.No),
            callback            : () => {
                data.setNeedMovableTile(true);
                dispatch(TypeId.WarEventFullDataChanged);
            },
            callbackOnCancel    : () => {
                data.setNeedMovableTile(false);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnAiMode(): void {
        const unitData  = getExisted(this.getOpenData()?.dataForAddUnit.getUnitData());
        const aiMode    = unitData.getAiMode();
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
        const unitData = getExisted(this.getOpenData()?.dataForAddUnit.getUnitData());
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
        const unitData          = getExisted(this.getOpenData()?.dataForAddUnit.getUnitData());
        unitData.setIsDiving(!unitData.getIsDiving());
        dispatch(TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnHasLoadedCo(): void {
        const unitData          = getExisted(this.getOpenData()?.dataForAddUnit.getUnitData());
        unitData.setIsCoOnboard(unitData.getIsCoOnboard() ? null : true);
        dispatch(TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnActionState(): void {
        const unitData = getExisted(this.getOpenData()?.dataForAddUnit.getUnitData());
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

        const unitData      = getExisted(openData.dataForAddUnit.getUnitData());
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
        const unitData      = getExisted(openData.dataForAddUnit.getUnitData());

        // const data      = this.getOpenData();
        // const unitData  = data.dataForAddUnit.unitData ??= {};
        // GamePanels.openPanel(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
        //     title           : Lang.getText(LangTextType.B0521),
        //     minValue        : GameConfig.Player.PlayerIndex.Const.First,
        //     maxValue        : data.war.getPlayersCountUnneutral(),
        //     currentValue    : unitData.playerIndex ?? 0,
        //     callback        : playerIndex => {
        //         unitData.playerIndex = playerIndex;
        //         Notify.Dispatcher.dispatch(NotifyType.WarEventFullDataChanged);
        //     }
        // });

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

    private _onTouchedBtnGridIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const mapSize   = openData.war.getTileMap().getMapSize();
        const gridIndex = openData.dataForAddUnit.createIfNotExistsUnitData().createIfNotExistsGridIndex();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B1071),
            minValue        : 0,
            maxValue        : mapSize.getWidth() - 1,
            currentValue    : gridIndex.getX() ?? 0,
            callback        : gridX => {
                openPanel(getDict().CommonInputIntegerPanel, {
                    getTitle           : () => getText(TextType.B1072),
                    minValue        : 0,
                    maxValue        : mapSize.getHeight() - 1,
                    currentValue    : gridIndex.getY() ?? 0,
                    callback        : gridY => {
                        gridIndex.setX(gridX);
                        gridIndex.setY(gridY);
                        dispatch(TypeId.WarEventFullDataChanged);
                    }
                });
            }
        });
    }

    private _onTouchedBtnHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = getExisted(openData.dataForAddUnit.getUnitData());
        const minValue      = 1;
        const maxValue      = getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getMaxHp());
        const defaultValue  = maxValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.Hp),
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

        const unitData      = getExisted(openData.dataForAddUnit.getUnitData());
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

        const unitData      = getExisted(openData.dataForAddUnit.getUnitData());
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

        const unitData  = getExisted(openData.dataForAddUnit.getUnitData());
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

        const unitData      = getExisted(openData.dataForAddUnit.getUnitData());
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

        const unitData      = getExisted(openData.dataForAddUnit.getUnitData());
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

        const unitData      = getExisted(openData.dataForAddUnit.getUnitData());
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

        const unitData      = getExisted(openData.dataForAddUnit.getUnitData());
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
        this._btnClone.setLangText(TextType.B0748);
        this._btnDelete.setLangText(TextType.B0220);
        this._btnCanBeBlockedByUnit.setLangText(TextType.B0532);
        this._btnNeedMovableTile.setLangText(TextType.B0534);
        this._btnAiMode.setLangText(TextType.AiMode);
        this._btnUnitTag.setLangText(TextType.Tags);
        this._btnIsDiving.setLangText(TextType.B0371);
        this._btnHasLoadedCo.setLangText(TextType.CoOnboard);
        this._btnGridIndex.setLangText(TextType.B0531);
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
        this._updateComponentsForCanBeBlockedByUnit();
        this._updateComponentsForNeedMovableTile();
        this._updateComponentsForAiMode();
        this._updateComponentsForUnitTag();
        this._updateComponentsForIsDiving();
        this._updateComponentsForIsCoOnboard();
        this._updateComponentsForActionState();
        this._updateComponentsForAiDestination();
        this._updateComponentsForGridIndex();
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
        const dataForAddUnit    = openData.dataForAddUnit;
        const errorTips         = getErrorTipsForAddUnit({
            dataForAddUnit  : dataForAddUnit,
            war             : openData.war,
        });
        label.setText(`${getExisted(openData.action.getWeaAddUnitOnMapSimple()?.getUnitArray().indexOf(dataForAddUnit)) + 1}. ${errorTips || getText(TextType.B0493)}`);
        label.setTextColor(errorTips ? ColorValue.Red : ColorValue.Green);
    }
    private _updateComponentsForCanBeBlockedByUnit(): void {
        this._labelCanBeBlockedByUnit.setText(getTextForYesOrNo(this.getOpenData()?.dataForAddUnit.getCanBeBlockedByUnit()));
    }
    private _updateComponentsForNeedMovableTile(): void {
        this._labelNeedMovableTile.setText(getTextForYesOrNo(this.getOpenData()?.dataForAddUnit.getNeedMovableTile()));
    }
    private _updateComponentsForAiMode(): void {
        this._labelAiMode.setText(getUnitAiModeName(this.getOpenData()?.dataForAddUnit.getUnitData()?.getAiMode() ?? AiModeId.Normal) ?? UndefinedError);
    }
    private _updateComponentsForUnitTag(): void {
        const tagIdArray = getTagIdList(this.getOpenData()?.dataForAddUnit.getUnitData()?.getGroupedTagId() ?? 0, true);
        this._labelUnitTag.setText(tagIdArray.length <= 0 ? `--` : tagIdArray.join(`/`));
    }
    private _updateComponentsForIsDiving(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group     = this._groupIsDiving;
        const unitData  = getExisted(openData.dataForAddUnit.getUnitData());
        const unitCfg   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0);
        if ((!unitCfg) || (unitCfg.getDiveCfg() == null)) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._labelIsDiving.setText(getTextForYesOrNo(unitData.getIsDiving()));
        }
    }
    private _updateComponentsForIsCoOnboard(): void {
        this._labelHasLoadedCo.setText(getTextForYesOrNo(this.getOpenData()?.dataForAddUnit.getUnitData()?.getIsCoOnboard()));
    }
    private _updateComponentsForActionState(): void {
        const label = this._labelActionState;
        const state = this.getOpenData()?.dataForAddUnit.getUnitData()?.getActionState();
        label.setText(state == null
            ? (getUnitActionStateText(ActionStateId.Idle) ?? UndefinedError)
            : (getUnitActionStateText(state) ?? UndefinedError)
        );
    }
    private _updateComponentsForAiDestination(): void {
        const destination   = this.getOpenData()?.dataForAddUnit.getUnitData()?.getAiWeightedDestination();
        const gridIndex     = destination?.getGridIndex();
        this._labelAiDestination.setText(destination == null ? `--` : `${gridIndex?.getX()}, ${gridIndex?.getY()} (${destination.getWeight()})`);
    }
    private _updateComponentsForGridIndex(): void {
        const gridIndex = this.getOpenData()?.dataForAddUnit.getUnitData()?.getGridIndex();
        this._labelGridIndex.setText(`${gridIndex?.getX()}, ${gridIndex?.getY()}`);
    }
    private _updateComponentsForHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelHp.setText(`${(getExisted(openData.dataForAddUnit.getUnitData())).getCurrentHp()}`);
    }
    private _updateComponentsForFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelFuel.setText(`${(getExisted(openData.dataForAddUnit.getUnitData())).getCurrentFuel()}`);
    }
    private _updateComponentsForPromotion(): void {
        this._labelPromotion.setText(`${this.getOpenData()?.dataForAddUnit.getUnitData()?.getCurrentPromotion() ?? 0}`);
    }
    private _updateComponentsForCustomNameId(): void {
        this._labelCustomNameId.setText(`${this.getOpenData()?.dataForAddUnit.getUnitData()?.getCustomNameId() ?? ``}`);
    }
    private _updateComponentsForPrimaryAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group     = this._groupPrimaryAmmo;
        const unitData  = getExisted(openData.dataForAddUnit.getUnitData());
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
        const unitData  = getExisted(openData.dataForAddUnit.getUnitData());
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
        const unitData      = getExisted(openData.dataForAddUnit.getUnitData());
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
        const unitData      = getExisted(openData.dataForAddUnit.getUnitData());
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

        const unitData      = openData.dataForAddUnit.getUnitData();
        const playerIndex   = getExisted(unitData?.getPlayerIndex());
        const gameConfig    = openData.war.getGcData();
        this._unitView.update(new UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : getDefaultSkinId(playerIndex),
            overridingSkinId    : undefined,
            unitData            : createDefault({
                gridIndex   : { x: 0, y: 0 },
                playerIndex : playerIndex,
                unitTypeId  : unitData?.getUnitType() ?? UnitTypeId.First,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }));
    }
}

function getErrorTipsForAddUnit({ dataForAddUnit, war }: {
    dataForAddUnit  : DataForAddUnit;
    war             : IMeWar;
}): string | null {
    if (dataForAddUnit.getCanBeBlockedByUnit() == null) {
        return getText(TextType.A0192);
    }

    if (dataForAddUnit.getNeedMovableTile() == null) {
        return getText(TextType.A0193);
    }

    const unitData      = getExisted(dataForAddUnit.getUnitData());
    const gameConfig    = war.getGcData();
    const unitCfg       = gameConfig.getUnitTemplateCfg(unitData.getUnitType() ?? 0);
    if (unitCfg == null) {
        return getFormattedText(TextType.F0064, getText(TextType.B0525));
    }

    if (!GridIndex.convertGridIndex(unitData.getGridIndex())?.checkIsInsideMap(war.getTileMap().getMapSize())) {
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
        const currentProduceMaterial = unitData.getCurrentProduceMaterial();
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

function getDefaultAddUnitData(gameConfig: GcData): DataForAddUnit {
    return DataForAddUnit.fromJson({
        canBeBlockedByUnit  : true,
        needMovableTile     : true,
        unitData            : createDefault({
            gridIndex       : { x: 0, y: 0 },
            playerIndex     : PlayerIndex.First,
            unitTypeId      : gameConfig.getFirstUnitType(),
            unitId          : -1,
            gcData          : gameConfig,
        }).toJson(),
    });
}
