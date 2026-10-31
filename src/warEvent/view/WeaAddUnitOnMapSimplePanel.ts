import {
    Graphics_Constants,
    Helpers_Collection,
    Notifications_Dispatcher,
    ForceSkins_Utils,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    Common_Model_CommonModel,
    AuxiliaryTypes_GridIndex,
    GamePanels_Manager,
    Players_Constants,
    FloatText,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiUnitView,
    Ui_Types_UiUnitViewData,
    type GameConfigs_GameConfig,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    Units_Constants,
    Units_Utils_Common,
    WarEvents_Actions_Constants_AddUnitOnMapSimple,
    Units_Utils_Serialization,
} from "../../internal.ts";
import { WeightedGridIndex } from "../../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { DataForAddUnit } from "../../proto/schema/CommonProto/WarEvent/WeaAddUnitOnMapSimple/DataForAddUnit.ts";

export interface OpenData {
    war         : MapEditor_Interface_IMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnType!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAddUnit!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClear!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUnitsCount!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listUnit!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUnitRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnAddUnit,         callback : this._onTouchedBtnAddUnit },
            { ui : this._btnClear,           callback : this._onTouchedBtnClear },
            { ui : this._btnType,            callback : this._onTouchedBtnType },
            { ui : this._btnClose,           callback : this.closePanel },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",            callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged",    callback : this._onNotifyWarEventFullDataChanged },
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
        if (unitArray.length >= WarEvents_Actions_Constants_AddUnitOnMapSimple.Common.MaxCount) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0189));
        } else {
            unitArray.push(getDefaultAddUnitData(openData.war.getGcData()));
            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
        }
    }

    private _onTouchedBtnClear(): void {
        const action = this.getOpenData()?.action.getWeaAddUnitOnMapSimple();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0190),
            callback   : () => {
                action.getUnitArray().length = 0;
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
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
        this._btnAddUnit.setLangText(Lang_Constants.TextType.B0535);
        this._btnClear.setLangText(Lang_Constants.TextType.B0391);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
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
                panel          : this,
                war            : war,
                action         : action,
                dataForAddUnit : dataForAddUnit,
            });
        }

        await this._listUnit.bindData(dataArray);

        const label     = this._labelUnitsCount;
        const maxCount  = WarEvents_Actions_Constants_AddUnitOnMapSimple.Common.MaxCount;
        const currCount = dataArray.length;
        label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0524)}: ${currCount} / ${maxCount}`);
        label.setTextColor(((currCount <= maxCount) && (currCount > 0)) ? Graphics_Constants.ColorValue.White : Graphics_Constants.ColorValue.Red);
    }
}

interface DataForUnitRenderer extends Ui_Types_UiListItemData.UiListItemData {
    panel           : Panel;
    war             : MapEditor_Interface_IMeWar.IMeWar;
    action          : WarEventAction;
    dataForAddUnit  : DataForAddUnit;
}
class UnitRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
    private readonly _btnDelete!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClone!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelError!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnCanBeBlockedByUnit!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelCanBeBlockedByUnit!  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnNeedMovableTile!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelNeedMovableTile!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnAiMode!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelAiMode!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnUnitTag!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelUnitTag!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnGridIndex!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelGridIndex!           : Ui_Interfaces_IUiLabel.IUiLabel;

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
            { ui : this._btnDelete,                  callback : this._onTouchedBtnDelete },
            { ui : this._btnClone,                   callback : this._onTouchedBtnClone },
            { ui : this._btnCanBeBlockedByUnit,      callback : this._onTouchedBtnCanBeBlockedByUnit },
            { ui : this._btnNeedMovableTile,         callback : this._onTouchedBtnNeedMovableTile },
            { ui : this._btnAiMode,                  callback : this._onTouchedBtnAiMode },
            { ui : this._btnUnitTag,                 callback : this._onTouchedBtnUnitTag },
            { ui : this._btnIsDiving,                callback : this._onTouchedBtnIsDiving },
            { ui : this._btnHasLoadedCo,             callback : this._onTouchedBtnHasLoadedCo },
            { ui : this._btnActionState,             callback : this._onTouchedBtnActionState },
            { ui : this._btnAiDestination,           callback : this._onTouchedBtnAiDestination },
            { ui : this._btnUnitType,                callback : this._onTouchedBtnUnitType },
            { ui : this._btnGridIndex,               callback : this._onTouchedBtnGridIndex },

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
            { type : "LanguageChanged",     callback : this._onNotifyLanguageChanged },
            { type : "UnitAnimationTick",   callback : this._onNotifyUnitAnimationTick },
        ]);

        this._updateComponentsForLanguage();

        this._conUnitView.addUiChild(this._unitView);
    }

    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0029),
            callback   : () => {
                Helpers_Collection.deleteElementFromList(Helpers_Misc.getExisted(openData.action.getWeaAddUnitOnMapSimple()?.getUnitArray()), openData.dataForAddUnit);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnClone(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitArray = Helpers_Misc.getExisted(openData.action.getWeaAddUnitOnMapSimple()?.getUnitArray());
        if (unitArray.length >= WarEvents_Actions_Constants_AddUnitOnMapSimple.Common.MaxCount) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.YouCanNotDoThisRightNow));
        } else {
            const srcData   = openData.dataForAddUnit;
            const index     = unitArray.indexOf(srcData);
            const dstData   = srcData.clone();
            if (index < 0) {
                unitArray.push(dstData);
            } else {
                unitArray.splice(index, 0, dstData);
            }

            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
        }
    }
    private _onTouchedBtnCanBeBlockedByUnit(): void {
        const data = this.getOpenData()?.dataForAddUnit;
        if (data == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0414),
            getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.Yes),
            getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.No),
            callback          : () => {
                data.setCanBeBlockedByUnit(true);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
            callbackOnCancel : () => {
                data.setCanBeBlockedByUnit(false);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnNeedMovableTile(): void {
        const data = this.getOpenData()?.dataForAddUnit;
        if (data == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0415),
            getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.Yes),
            getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.No),
            callback          : () => {
                data.setNeedMovableTile(true);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
            callbackOnCancel : () => {
                data.setNeedMovableTile(false);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnAiMode(): void {
        const unitData  = Helpers_Misc.getExisted(this.getOpenData()?.dataForAddUnit.getUnitData());
        const aiMode    = unitData.getAiMode();
        if (aiMode === Units_Constants.AiModeId.NoMove) {
            unitData.setAiMode(Units_Constants.AiModeId.Normal);
        } else if ((aiMode === Units_Constants.AiModeId.Normal) || (aiMode == null)) {
            unitData.setAiMode(Units_Constants.AiModeId.WaitUntilCanAttack);
        } else {
            unitData.setAiMode(Units_Constants.AiModeId.NoMove);
        }
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }
    private _onTouchedBtnUnitTag(): void {
        const unitData = Helpers_Misc.getExisted(this.getOpenData()?.dataForAddUnit.getUnitData());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray   : Units_Utils_Common.getTagIdList(unitData.getGroupedTagId(), true),
            availableIntegerArray : Units_Constants.AllTagIdArray,
            getTitleText          : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.Tags)),
            callbackOnConfirm     : tagIdArray => {
                unitData.setGroupedTagId(Units_Utils_Common.getEncodedTagId(tagIdArray));
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnIsDiving(): void {
        const unitData          = Helpers_Misc.getExisted(this.getOpenData()?.dataForAddUnit.getUnitData());
        unitData.setIsDiving(!unitData.getIsDiving());
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }
    private _onTouchedBtnHasLoadedCo(): void {
        const unitData          = Helpers_Misc.getExisted(this.getOpenData()?.dataForAddUnit.getUnitData());
        unitData.setIsCoOnboard(unitData.getIsCoOnboard() ? null : true);
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }
    private _onTouchedBtnActionState(): void {
        const unitData = Helpers_Misc.getExisted(this.getOpenData()?.dataForAddUnit.getUnitData());
        if (unitData.getActionState() === Units_Constants.ActionStateId.Acted) {
            unitData.setActionState(null);
        } else {
            unitData.setActionState(Units_Constants.ActionStateId.Acted);
        }
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }
    private _onTouchedBtnAiDestination(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData());
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
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                        getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1072),
                        minValue     : 0,
                        maxValue     : mapSize.getHeight() - 1,
                        currentValue : destination?.getGridIndex()?.getY() ?? 0,
                        callback     : newY => {
                            if (newY == null) {
                                unitData.setAiWeightedDestination(null);
                                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
                                        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
        const unitData      = Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData());

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

                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnGridIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const mapSize   = openData.war.getTileMap().getMapSize();
        const gridIndex = openData.dataForAddUnit.createIfNotExistsUnitData().createIfNotExistsGridIndex();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1071),
            minValue     : 0,
            maxValue     : mapSize.getWidth() - 1,
            currentValue : gridIndex.getX() ?? 0,
            callback     : gridX => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                    getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1072),
                    minValue     : 0,
                    maxValue     : mapSize.getHeight() - 1,
                    currentValue : gridIndex.getY() ?? 0,
                    callback     : gridY => {
                        gridIndex.setX(gridX);
                        gridIndex.setY(gridY);
                        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                    },
                });
            },
        });
    }

    private _onTouchedBtnHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData());
        const minValue      = 1;
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxHp());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Hp),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : unitData.getCurrentHp(),
            callback     : value => {
                unitData.setCurrentHp(value);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData());
        const minValue      = 0;
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxFuel());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Fuel),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : unitData.getCurrentFuel(),
            callback     : value => {
                unitData.setCurrentFuel(value);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnPromotion(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData());
        const minValue      = 0;
        const maxValue      = openData.war.getGcData().getUnitMaxPromotion();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Promotion),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : unitData.getCurrentPromotion(),
            callback     : value => {
                unitData.setCurrentPromotion(value);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnCustomNameId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData  = Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData());
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
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnPrimaryAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData());
        const minValue      = 0;
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getPrimaryWeaponMaxAmmo());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.PrimaryWeaponAmmo),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : unitData.getPrimaryWeaponCurrentAmmo(),
            callback     : value => {
                unitData.setPrimaryWeaponCurrentAmmo(value);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnFlareAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData());
        const minValue      = 0;
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getFlareMaxAmmo());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.FlareAmmo),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : unitData.getFlareCurrentAmmo(),
            callback     : value => {
                unitData.setFlareCurrentAmmo(value);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnBuildMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData());
        const minValue      = 0;
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxBuildMaterial());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.BuildMaterial),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : unitData.getCurrentBuildMaterial(),
            callback     : value => {
                unitData.setCurrentBuildMaterial(value);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnProduceMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData());
        const minValue      = 0;
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxProduceMaterial());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.ProductionMaterial),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : unitData.getCurrentProduceMaterial(),
            callback     : value => {
                unitData.setCurrentProduceMaterial(value);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
        this._btnClone.setLangText(Lang_Constants.TextType.B0748);
        this._btnDelete.setLangText(Lang_Constants.TextType.B0220);
        this._btnCanBeBlockedByUnit.setLangText(Lang_Constants.TextType.B0532);
        this._btnNeedMovableTile.setLangText(Lang_Constants.TextType.B0534);
        this._btnAiMode.setLangText(Lang_Constants.TextType.AiMode);
        this._btnUnitTag.setLangText(Lang_Constants.TextType.Tags);
        this._btnIsDiving.setLangText(Lang_Constants.TextType.B0371);
        this._btnHasLoadedCo.setLangText(Lang_Constants.TextType.CoOnboard);
        this._btnGridIndex.setLangText(Lang_Constants.TextType.B0531);
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
            dataForAddUnit : dataForAddUnit,
            war            : openData.war,
        });
        label.setText(`${Helpers_Misc.getExisted(openData.action.getWeaAddUnitOnMapSimple()?.getUnitArray().indexOf(dataForAddUnit)) + 1}. ${errorTips || Lang_Utils.getText(Lang_Constants.TextType.B0493)}`);
        label.setTextColor(errorTips ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
    }
    private _updateComponentsForCanBeBlockedByUnit(): void {
        this._labelCanBeBlockedByUnit.setLangText(this.getOpenData()?.dataForAddUnit.getCanBeBlockedByUnit() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
    }
    private _updateComponentsForNeedMovableTile(): void {
        this._labelNeedMovableTile.setLangText(this.getOpenData()?.dataForAddUnit.getNeedMovableTile() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
    }
    private _updateComponentsForAiMode(): void {
        this._labelAiMode.setText(Lang_Utils.getUnitAiModeName(this.getOpenData()?.dataForAddUnit.getUnitData()?.getAiMode() ?? Units_Constants.AiModeId.Normal) ?? Lang_Constants.UndefinedError);
    }
    private _updateComponentsForUnitTag(): void {
        const tagIdArray = Units_Utils_Common.getTagIdList(this.getOpenData()?.dataForAddUnit.getUnitData()?.getGroupedTagId() ?? 0, true);
        this._labelUnitTag.setText(tagIdArray.length <= 0 ? `--` : tagIdArray.join(`/`));
    }
    private _updateComponentsForIsDiving(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group     = this._groupIsDiving;
        const unitData  = Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData());
        const unitCfg   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType());
        if ((!unitCfg) || (unitCfg.getDiveCfg() == null)) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._labelIsDiving.setLangText(unitData.getIsDiving() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        }
    }
    private _updateComponentsForIsCoOnboard(): void {
        this._labelHasLoadedCo.setLangText(this.getOpenData()?.dataForAddUnit.getUnitData()?.getIsCoOnboard() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
    }
    private _updateComponentsForActionState(): void {
        const label = this._labelActionState;
        const state = this.getOpenData()?.dataForAddUnit.getUnitData()?.getActionState();
        label.setText(state == null
            ? (Lang_Utils.getUnitActionStateText(Units_Constants.ActionStateId.Idle) ?? Lang_Constants.UndefinedError)
            : (Lang_Utils.getUnitActionStateText(state) ?? Lang_Constants.UndefinedError),
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

        this._labelHp.setText(`${(Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData())).getCurrentHp()}`);
    }
    private _updateComponentsForFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelFuel.setText(`${(Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData())).getCurrentFuel()}`);
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
        const unitData  = Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData());
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
        const unitData  = Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData());
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
        const unitData      = Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData());
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
        const unitData      = Helpers_Misc.getExisted(openData.dataForAddUnit.getUnitData());
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

        const unitData      = openData.dataForAddUnit.getUnitData();
        const playerIndex   = Helpers_Misc.getExisted(unitData?.getPlayerIndex());
        const gameConfig    = openData.war.getGcData();
        this._unitView.update(new Ui_Types_UiUnitViewData.UiUnitViewData({
            gameConfig       : gameConfig,
            skinId           : ForceSkins_Utils.getDefaultSkinId(playerIndex),
            overridingSkinId : undefined,
            unitData         : Units_Utils_Serialization.createDefault({
                gridIndex   : { x : 0, y : 0 },
                playerIndex : playerIndex,
                unitTypeId  : unitData?.getUnitType() ?? Units_Constants.UnitTypeId.First,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }));
    }
}

function getErrorTipsForAddUnit({ dataForAddUnit, war }: {
    dataForAddUnit  : DataForAddUnit;
    war             : MapEditor_Interface_IMeWar.IMeWar;
}): string | null {
    if (dataForAddUnit.getCanBeBlockedByUnit() == null) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0192);
    }

    if (dataForAddUnit.getNeedMovableTile() == null) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0193);
    }

    const unitData      = Helpers_Misc.getExisted(dataForAddUnit.getUnitData());
    const gameConfig    = war.getGcData();
    const unitCfg       = gameConfig.getUnitTemplateCfg(unitData.getUnitType());
    if (unitCfg == null) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0064, Lang_Utils.getText(Lang_Constants.TextType.B0525));
    }

    if (!AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(unitData.getGridIndex())?.checkIsInsideMap(war.getTileMap().getMapSize())) {
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
        const currentBuildMaterial  = unitData.getCurrentBuildMaterial();
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

    // if (unitData.deprecatedIsBuildingTile) {
    //     return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0529));
    // }

    // if (unitData.deprecatedIsCapturingTile) {
    //     return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0530));
    // }

    return null;
}

function getDefaultAddUnitData(gameConfig: GameConfigs_GameConfig.GameConfig): DataForAddUnit {
    return DataForAddUnit.fromJson({
        canBeBlockedByUnit : true,
        needMovableTile    : true,
        unitData           : Units_Utils_Serialization.createDefault({
            gridIndex   : { x : 0, y : 0 },
            playerIndex : Players_Constants.PlayerIndex.First,
            unitTypeId  : gameConfig.getFirstUnitType(),
            unitId      : -1,
            gcData      : gameConfig,
        }).toJson(),
    });
}
