import {
    ForceSkins_Utils,
    Common_Model_CommonModel,
    MapEditor_Model_MeWar,
    Ui_Components_UiUnitView,
    type AuxiliaryTypes_AuxiliaryTypes,
    Tiles_Utils_Filter,
    Graphics_Constants,
    Helpers_Collection,
    Notifications_Dispatcher,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GamePanels_Manager,
    Players_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Types_UiUnitViewData,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    Units_Constants,
    Units_Utils_Common,
    Units_Utils_Serialization,
    WarEvents_Actions_Utils_Common,
} from "../../internal.ts";

import { WeightedGridIndex } from "../../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaFillUnitOnMapSimple } from "../../proto/schema/CommonProto/WarEvent/WeaFillUnitOnMapSimple.ts";
import type { SerialUnit } from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";

export interface OpenData {
    war         : MapEditor_Interface_IMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnType!                                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDesc!                                : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnBlockableByUnit!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelBlockableByUnit!                     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnFindSuitableTile!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelFindSuitableTile!                    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConTileFilter!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTileFilter!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActIsInTurn!                           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActIsInTurn!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _listUnit!                                 : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUnitRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnType,                                callback : this._onTouchedBtnType },
            { ui : this._btnClose,                               callback : this.closePanel },

            { ui : this._btnBlockableByUnit,                     callback : this._onTouchedBtnBlockableByUnit },
            { ui : this._btnFindSuitableTile,                    callback : this._onTouchedBtnFindSuitableTile },

            { ui : this._btnConTileFilter,                       callback : this._onTouchedBtnTileFilter },

            { ui : this._btnActIsInTurn,                         callback : this._onTouchedBtnActIsInTurn },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,            callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.WarEventFullDataChanged,    callback : this._onNotifyWarEventFullDataChanged },
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeActionTypeListPanel, {
            war      : openData.war,
            fullData : openData.fullData,
            action   : openData.action,
        });
    }

    private _onTouchedBtnBlockableByUnit(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0414),
            getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.Yes),
            getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.No),
            callback          : () => {
                action.setActCanBeBlockedByUnit(true);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
            callbackOnCancel : () => {
                action.setActCanBeBlockedByUnit(false);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnFindSuitableTile(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0415),
            getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.Yes),
            getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.No),
            callback          : () => {
                action.setActNeedMovableTile(true);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
            callbackOnCancel : () => {
                action.setActNeedMovableTile(false);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnTileFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeTileFilterPanel, {
            currentFilter         : action.getConTileFilter(),
            playersCountUnneutral : war.getPlayersCountUnneutral(),
            gameConfig            : war.getGcData(),
            mapSize               : war.getTileMap().getMapSize(),
            callback              : ((war instanceof MapEditor_Model_MeWar.MeWar) && (!war.getIsReviewingMap()))
                ? tileFilter => {
                    action.setConTileFilter(tileFilter);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
                : null,
        });
    }

    private _onTouchedBtnActIsInTurn(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        if (action.getActIsInTurn()) {
            action.setActIsInTurn(null);
        } else {
            action.setActIsInTurn(true);
        }
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForUnits();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);

        this._btnBlockableByUnit.setLangText(Lang_Constants.TextType.B0532);
        this._btnFindSuitableTile.setLangText(Lang_Constants.TextType.B0534);

        this._btnConTileFilter.setLangText(Lang_Constants.TextType.TileFilter);

        this._btnActIsInTurn.setLangText(Lang_Constants.TextType.B0086);

        this._updateLabelDescAndLabelError();
        this._updateLabelBlockableByUnit();
        this._updateLabelFindSuitableTile();

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
        const errorTip          = WarEvents_Actions_Utils_Common.getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(WarEvents_Actions_Utils_Common.getBriefDescForAction(action, war.getGcData()) || Lang_Constants.UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateLabelBlockableByUnit(): void {
        this._labelBlockableByUnit.setLangText(this._getAction()?.getActCanBeBlockedByUnit() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
    }

    private _updateLabelFindSuitableTile(): void {
        this._labelFindSuitableTile.setLangText(this._getAction()?.getActNeedMovableTile() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
    }

    private _updateLabelConTileFilter(): void {
        const tileFilter = this._getAction()?.getConTileFilter();
        this._labelConTileFilter.setLangText((tileFilter != null) && (!Tiles_Utils_Filter.checkIsEmpty(tileFilter)) ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.None);
    }

    private _updateBtnActIsInTurn(): void {
        this._labelActIsInTurn.setText(this._getAction()?.getActIsInTurn() ? Lang_Utils.getText(Lang_Constants.TextType.Yes) : `--`);
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
            war      : war,
            unitData : Helpers_Misc.getExisted(action.getActUnitData()),
        }];

        await this._listUnit.bindData(dataArray);
    }

    private _getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaFillUnitOnMapSimple> {
        return this.getOpenData()?.action.getWeaFillUnitOnMapSimple();
    }
}

interface DataForUnitRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war         : MapEditor_Interface_IMeWar.IMeWar;
    unitData    : SerialUnit;
}
class UnitRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
    private readonly _labelError!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnAiMode!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelAiMode!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnUnitTag!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelUnitTag!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnUnitType!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _conUnitView!              : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _btnActionState!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActionState!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnAiDestination!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelAiDestination!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnHp!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelHp!                  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnFuel!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelFuel!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnPromotion!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPromotion!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnCustomNameId!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelCustomNameId!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnHasLoadedCo!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelHasLoadedCo!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupPrimaryAmmo!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnPrimaryAmmo!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPrimaryAmmo!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupFlareAmmo!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnFlareAmmo!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelFlareAmmo!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupIsDiving!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnIsDiving!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelIsDiving!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupBuildMaterial!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnBuildMaterial!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelBuildMaterial!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupProduceMaterial!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnProduceMaterial!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelProduceMaterial!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _unitView                  = new Ui_Components_UiUnitView.UiUnitView();

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnAiMode,                  callback : this._onTouchedBtnAiMode },
            { ui : this._btnUnitTag,                 callback : this._onTouchedBtnUnitTag },
            { ui : this._btnIsDiving,                callback : this._onTouchedBtnIsDiving },
            { ui : this._btnHasLoadedCo,             callback : this._onTouchedBtnHasLoadedCo },
            { ui : this._btnActionState,             callback : this._onTouchedBtnActionState },
            { ui : this._btnAiDestination,           callback : this._onTouchedBtnAiDestination },
            { ui : this._btnUnitType,                callback : this._onTouchedBtnUnitType },

            { ui : this._btnHp,                      callback : this._onTouchedBtnHp },

            { ui : this._btnFuel,                    callback : this._onTouchedBtnFuel },

            { ui : this._btnPromotion,               callback : this._onTouchedBtnPromotion },

            { ui : this._btnCustomNameId,            callback : this._onTouchedBtnCustomNameId },

            { ui : this._btnPrimaryAmmo,             callback : this._onTouchedBtnPrimaryAmmo },

            { ui : this._btnFlareAmmo,               callback : this._onTouchedBtnFlareAmmo },

            { ui : this._btnBuildMaterial,           callback : this._onTouchedBtnBuildMaterial },

            { ui : this._btnProduceMaterial,         callback : this._onTouchedBtnProduceMaterial },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.UnitAnimationTick,   callback : this._onNotifyUnitAnimationTick },
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
        if (aiMode === Units_Constants.AiModeId.NoMove) {
            unitData.setAiMode(Units_Constants.AiModeId.Normal);
        } else if ((aiMode === Units_Constants.AiModeId.Normal) || (aiMode == null)) {
            unitData.setAiMode(Units_Constants.AiModeId.WaitUntilCanAttack);
        } else {
            unitData.setAiMode(Units_Constants.AiModeId.NoMove);
        }
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnUnitTag(): void {
        const unitData = this.getOpenData()?.unitData;
        if (unitData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray   : Units_Utils_Common.getTagIdList(unitData.getGroupedTagId(), true),
            availableIntegerArray : Units_Constants.AllTagIdArray,
            getTitleText          : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.Tags)),
            callbackOnConfirm     : tagIdArray => {
                unitData.setGroupedTagId(Units_Utils_Common.getEncodedTagId(tagIdArray));
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnIsDiving(): void {
        const unitData = this.getOpenData()?.unitData;
        if (unitData == null) {
            return;
        }

        unitData.setIsDiving(!unitData.getIsDiving());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnHasLoadedCo(): void {
        const unitData = this.getOpenData()?.unitData;
        if (unitData == null) {
            return;
        }

        unitData.setIsCoOnboard(unitData.getIsCoOnboard() ? null : true);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnActionState(): void {
        const unitData = this.getOpenData()?.unitData;
        if (unitData == null) {
            return;
        }

        if (unitData.getActionState() === Units_Constants.ActionStateId.Acted) {
            unitData.setActionState(null);
        } else {
            unitData.setActionState(Units_Constants.ActionStateId.Acted);
        }
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnAiDestination(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = openData.unitData;
        const destination   = unitData.getAiWeightedDestination();
        const mapSize       = openData.war.getTileMap().getMapSize();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1071),
            minValue     : 0,
            maxValue     : mapSize.getWidth() - 1,
            currentValue : destination?.getGridIndex()?.getX() ?? 0,
            callback     : newX => {
                if (newX == null) {
                    unitData.setAiWeightedDestination(null);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                        getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1072),
                        minValue     : 0,
                        maxValue     : mapSize.getHeight() - 1,
                        currentValue : destination?.getGridIndex()?.getY() ?? 0,
                        callback     : newY => {
                            if (newY == null) {
                                unitData.setAiWeightedDestination(null);
                                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                            } else {
                                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                                    getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1094),
                                    currentValue : destination?.getWeight() ?? 0,
                                    minValue     : -99999999,
                                    maxValue     : 99999999,
                                    getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0432),
                                    callback     : value => {
                                        unitData.setAiWeightedDestination(WeightedGridIndex.fromJson({
                                            gridIndex : { x : newX, y : newY },
                                            weight    : value,
                                        }));
                                        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
        const unitData      = openData.unitData;

        const playerIndexArray = Helpers_Collection.createRange(Players_Constants.PlayerIndex.First, war.getPlayersCountUnneutral() + 1, 1);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseUnitAndPlayerIndexPanel, {
            gameConfig       : gameConfig,
            currentUnitType  : unitData.getUnitType(),
            unitTypeArray    : gameConfig.getAllUnitTypeArray(),
            currentSkinId    : unitData.getPlayerIndex(),
            playerIndexArray : playerIndexArray,
            finalSkinIdArray : playerIndexArray.map(v => ForceSkins_Utils.getDefaultSkinId(v)),
            callback         : (unitType, skinId) => {
                unitData.setPlayerIndex(skinId);
                if (unitData.getUnitType() !== unitType) {
                    unitData.setUnitType(unitType);
                    Units_Utils_Serialization.fillNonTrivialDefaultValues(unitData, gameConfig);
                }

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = openData.unitData;
        const minValue      = 1;
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxHp());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Hp),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : unitData.getCurrentHp(),
            callback     : value => {
                unitData.setCurrentHp(value);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = openData.unitData;
        const minValue      = 0;
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxFuel());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Fuel),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : unitData.getCurrentFuel(),
            callback     : value => {
                unitData.setCurrentFuel(value);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnPromotion(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = openData.unitData;
        const minValue      = 0;
        const maxValue      = openData.war.getGcData().getUnitMaxPromotion();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Promotion),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : unitData.getCurrentPromotion(),
            callback     : value => {
                unitData.setCurrentPromotion(value);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnCustomNameId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData  = openData.unitData;
        const arr       = openData.war.getUnitMap().getUnitCustomNameArray();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.CustomNameId),
            availableNumberArray : Helpers_Collection.createRange(0, Units_Constants.CustomName.MaxId + 1, 1),
            currentNumber        : unitData.getCustomNameId() ?? 0,
            columnsCount         : 4,
            showNumber           : true,
            getNumberMainText    : num => {
                if (num === 0) {
                    return `(${Lang_Utils.getText(Lang_Constants.TextType.B0391)})`;
                } else {
                    return Lang_Utils.getLanguageText({ textArray : arr?.find(v => (v.getNameId()) === num)?.getNameTextArray() }) ?? `----`;
                }
            },
            callbackOnConfirm : num => {
                if (num == 0) {
                    unitData.setCustomNameId(null);
                } else {
                    unitData.setCustomNameId(num);
                }
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnPrimaryAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = openData.unitData;
        const minValue      = 0;
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getPrimaryWeaponMaxAmmo());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.PrimaryWeaponAmmo),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : unitData.getPrimaryWeaponCurrentAmmo(),
            callback     : value => {
                unitData.setPrimaryWeaponCurrentAmmo(value);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnFlareAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = openData.unitData;
        const minValue      = 0;
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getFlareMaxAmmo());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.FlareAmmo),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : unitData.getFlareCurrentAmmo(),
            callback     : value => {
                unitData.setFlareCurrentAmmo(value);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnBuildMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = openData.unitData;
        const minValue      = 0;
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxBuildMaterial());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.BuildMaterial),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : unitData.getCurrentBuildMaterial(),
            callback     : value => {
                unitData.setCurrentBuildMaterial(value);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnProduceMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = openData.unitData;
        const minValue      = 0;
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxProduceMaterial());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.ProductionMaterial),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : unitData.getCurrentProduceMaterial(),
            callback     : value => {
                unitData.setCurrentProduceMaterial(value);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForData();
    }
    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(Common_Model_CommonModel.getUnitAnimationTickCount());
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForData();
    }

    private _updateComponentsForLanguage(): void {
        this._btnAiMode.setLangText(Lang_Constants.TextType.AiMode);
        this._btnUnitTag.setLangText(Lang_Constants.TextType.Tags);
        this._btnIsDiving.setLangText(Lang_Constants.TextType.B0371);
        this._btnHasLoadedCo.setLangText(Lang_Constants.TextType.CoOnboard);
        this._btnHp.setLangText(Lang_Constants.TextType.Hp);
        this._btnFuel.setLangText(Lang_Constants.TextType.Fuel);
        this._btnPromotion.setLangText(Lang_Constants.TextType.Promotion);
        this._btnCustomNameId.setLangText(Lang_Constants.TextType.CustomNameId);
        this._btnPrimaryAmmo.setLangText(Lang_Constants.TextType.PrimaryWeaponAmmo);
        this._btnFlareAmmo.setLangText(Lang_Constants.TextType.FlareAmmo);
        this._btnBuildMaterial.setLangText(Lang_Constants.TextType.BuildMaterial);
        this._btnProduceMaterial.setLangText(Lang_Constants.TextType.ProductionMaterial);
        this._btnActionState.setLangText(Lang_Constants.TextType.ActionState);
        this._btnAiDestination.setLangText(Lang_Constants.TextType.AiDestination);
        this._btnUnitType.setLangText(Lang_Constants.TextType.B0525);
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
            unitData : dataForAddUnit,
            war      : openData.war,
        });
        label.setText(errorTips || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        label.setTextColor(errorTips ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
    }
    private _updateComponentsForAiMode(): void {
        this._labelAiMode.setText(Lang_Utils.getUnitAiModeName(this.getOpenData()?.unitData?.getAiMode() ?? Units_Constants.AiModeId.Normal) ?? Lang_Constants.UndefinedError);
    }
    private _updateComponentsForUnitTag(): void {
        const tagIdArray        = Units_Utils_Common.getTagIdList(this.getOpenData()?.unitData?.getGroupedTagId() ?? 0, true);
        this._labelUnitTag.setText(tagIdArray.length <= 0 ? `--` : tagIdArray.join(`/`));
    }
    private _updateComponentsForIsDiving(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group     = this._groupIsDiving;
        const unitData  = openData.unitData;
        const unitCfg   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType());
        if ((!unitCfg) || (unitCfg.getDiveCfg() == null)) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._labelIsDiving.setLangText(unitData.getIsDiving() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        }
    }
    private _updateComponentsForIsCoOnboard(): void {
        this._labelHasLoadedCo.setLangText(this.getOpenData()?.unitData?.getIsCoOnboard() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
    }
    private _updateComponentsForActionState(): void {
        const label = this._labelActionState;
        const state = this.getOpenData()?.unitData?.getActionState();
        label.setText(state == null
            ? (Lang_Utils.getUnitActionStateText(Units_Constants.ActionStateId.Idle) ?? Lang_Constants.UndefinedError)
            : (Lang_Utils.getUnitActionStateText(state) ?? Lang_Constants.UndefinedError),
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

        this._labelHp.setText(`${openData.unitData.getCurrentHp()}`);
    }
    private _updateComponentsForFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelFuel.setText(`${openData.unitData.getCurrentFuel()}`);
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
        const unitData  = openData.unitData;
        const maxAmmo   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getPrimaryWeaponMaxAmmo();
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
        const unitData  = openData.unitData;
        const maxAmmo   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getFlareMaxAmmo();
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
        const unitData      = openData.unitData;
        const maxMaterial   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxBuildMaterial();
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
        const unitData      = openData.unitData;
        const maxMaterial   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxProduceMaterial();
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
        const playerIndex   = unitData.getPlayerIndex();
        const gameConfig    = openData.war.getGcData();
        this._unitView.update(new Ui_Types_UiUnitViewData.UiUnitViewData({
            gameConfig       : gameConfig,
            skinId           : ForceSkins_Utils.getDefaultSkinId(playerIndex),
            overridingSkinId : undefined,
            unitData         : Units_Utils_Serialization.createDefault({
                gridIndex   : { x : 0, y : 0 },
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
    war         : MapEditor_Interface_IMeWar.IMeWar;
}): string | null {
    const gameConfig    = war.getGcData();
    const unitCfg       = gameConfig.getUnitTemplateCfg(unitData.getUnitType());
    if (unitCfg == null) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0064, Lang_Utils.getText(Lang_Constants.TextType.B0525));
    }

    if (unitData.getGridIndex() != null) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0064, Lang_Utils.getText(Lang_Constants.TextType.B0531));
    }

    {
        const playerIndex = unitData.getPlayerIndex();
        if ((playerIndex > war.getPlayersCountUnneutral())      ||
            (playerIndex < Players_Constants.PlayerIndex.First)
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0064, Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex));
        }
    }

    {
        if (!Units_Utils_Common.checkIsValidActionStateId(unitData.getActionState())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0064, Lang_Utils.getText(Lang_Constants.TextType.ActionState));
        }
    }

    {
        const currentFuel = unitData.getCurrentFuel();
        if ((currentFuel < 0) || (currentFuel > unitCfg.getMaxFuel())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0064, Lang_Utils.getText(Lang_Constants.TextType.Fuel));
        }
    }

    {
        const currentHp = unitData.getCurrentHp();
        if ((currentHp < 0) || (currentHp > unitCfg.getMaxHp())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0064, Lang_Utils.getText(Lang_Constants.TextType.Hp));
        }
    }

    {
        const currentBuildMaterial = unitData.getCurrentBuildMaterial();
        if ((currentBuildMaterial < 0) || (currentBuildMaterial > (unitCfg.getMaxBuildMaterial() ?? 0))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0064, Lang_Utils.getText(Lang_Constants.TextType.BuildMaterial));
        }
    }

    {
        const currentProduceMaterial = unitData.getCurrentProduceMaterial();
        if ((currentProduceMaterial < 0) || (currentProduceMaterial > (unitCfg.getMaxProduceMaterial() ?? 0))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0064, Lang_Utils.getText(Lang_Constants.TextType.ProductionMaterial));
        }
    }

    {
        const currentPromotion = unitData.getCurrentPromotion();
        if ((currentPromotion < 0) || (currentPromotion > gameConfig.getUnitMaxPromotion())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0064, Lang_Utils.getText(Lang_Constants.TextType.Promotion));
        }
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const customNameId = unitData.getCustomNameId();
    }

    {
        const flareCurrentAmmo  = unitData.getFlareCurrentAmmo();
        if ((flareCurrentAmmo < 0) || (flareCurrentAmmo > (unitCfg.getFlareMaxAmmo() ?? 0))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0064, Lang_Utils.getText(Lang_Constants.TextType.FlareAmmo));
        }
    }

    {
        const primaryCurrentAmmo  = unitData.getPrimaryWeaponCurrentAmmo();
        if ((primaryCurrentAmmo < 0) || (primaryCurrentAmmo > (unitCfg.getPrimaryWeaponMaxAmmo() ?? 0))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0064, Lang_Utils.getText(Lang_Constants.TextType.PrimaryWeaponAmmo));
        }
    }

    // if (unitData.unitId != null) {
    //     return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0527));
    // }

    if (unitData.getLoaderUnitId() != null) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0064, Lang_Utils.getText(Lang_Constants.TextType.B0528));
    }

    if ((unitData.getIsDiving()) && (unitCfg.getDiveCfg() == null)) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0064, Lang_Utils.getText(Lang_Constants.TextType.B0371));
    }

    // unitData.hasLoadedCo的值不需要检查

    if (!Units_Utils_Common.checkIsValidEncodedTagId(unitData.getGroupedTagId())) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Tags));
    }

    return null;
}
