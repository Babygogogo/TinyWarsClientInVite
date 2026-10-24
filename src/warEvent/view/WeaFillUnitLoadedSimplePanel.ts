import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as CommonModelCommonModel from "../../common/model/CommonModel.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as ProtoSchemaCommonProtoStructureWeightedGridIndex from "../../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaFillUnitLoadedSimple from "../../proto/schema/CommonProto/WarEvent/WeaFillUnitLoadedSimple.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialUnit from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiUnitViewData from "../../ui/types/UiUnitViewData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UnitsUtilsCommon from "../../units/utils/Common.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData   = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction     = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                 : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                                : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConPlayerFilter!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConPlayerFilter!                     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConUnitFilter!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConUnitFilter!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConTileFilter!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTileFilter!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActLoadCount!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActLoadCount!                        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _listUnit!                                 : UiInterfacesIUiScrollList.IUiScrollList<DataForUnitRenderer>;

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
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeActionTypeListPanel, {
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WePlayerFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            currentFilter           : action.getConPlayerFilter(),
            callback                : filter => {
                action.setConPlayerFilter(filter);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeUnitFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConUnitFilter(),
            callback                : filter => {
                action.setConUnitFilter(filter);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeTileFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConTileFilter(),
            callback                : filter => {
                action.setConTileFilter(filter);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActLoadCount(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B1424),
            minValue        : 1,
            maxValue        : 10,
            currentValue    : action.getActLoadCount() ?? 0,
            callback        : num => {
                action.setActLoadCount(num);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(LangConstants.TextType.B0516);

        this._btnConPlayerFilter.setLangText(LangConstants.TextType.PlayerFilter);
        this._btnConUnitFilter.setLangText(LangConstants.TextType.UnitFilter);
        this._btnConTileFilter.setLangText(LangConstants.TextType.TileFilter);
        this._btnActLoadCount.setLangText(LangConstants.TextType.B1424);

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
        const errorTip          = WarEventsActionsUtilsCommon.getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(WarEventsActionsUtilsCommon.getDetailDescForAction(action, war.getGcData()) || LangConstants.UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateLabelConPlayerFilter(): void {
        this._labelConPlayerFilter.setText(this._getAction()?.getConPlayerFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
    }

    private _updateLabelConUnitFilter(): void {
        this._labelConUnitFilter.setText(this._getAction()?.getConUnitFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
    }

    private _updateLabelConTileFilter(): void {
        this._labelConTileFilter.setText(this._getAction()?.getConTileFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
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
            unitData    : HelpersMisc.getExisted(action.getActUnitData()),
        }];

        await this._listUnit.bindData(dataArray);
    }

    private _getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaFillUnitLoadedSimple.WeaFillUnitLoadedSimple> {
        return this.getOpenData()?.action.getWeaFillUnitLoadedSimple();
    }
}

interface DataForUnitRenderer extends UiTypesUiListItemData.UiListItemData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    unitData    : ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit;
}
class UnitRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
    private readonly _labelError!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnAiMode!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelAiMode!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnUnitTag!               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelUnitTag!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnUnitType!              : UiInterfacesIUiButton.IUiButton;
    private readonly _conUnitView!              : UiInterfacesIUiContainer.IUiContainer;

    private readonly _btnActionState!           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActionState!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnAiDestination!         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelAiDestination!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnHp!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelHp!                  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnFuel!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _labelFuel!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnPromotion!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPromotion!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnCustomNameId!          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelCustomNameId!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnHasLoadedCo!           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelHasLoadedCo!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupPrimaryAmmo!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnPrimaryAmmo!           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPrimaryAmmo!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupFlareAmmo!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnFlareAmmo!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelFlareAmmo!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupIsDiving!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnIsDiving!              : UiInterfacesIUiButton.IUiButton;
    private readonly _labelIsDiving!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupBuildMaterial!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnBuildMaterial!         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelBuildMaterial!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupProduceMaterial!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnProduceMaterial!       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelProduceMaterial!     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _unitView                  = new (UiUtilsUiFactory.getUiUnitViewClass())();

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
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
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
        if (aiMode === UnitsConstants.AiModeId.NoMove) {
            unitData.setAiMode(UnitsConstants.AiModeId.Normal);
        } else if ((aiMode === UnitsConstants.AiModeId.Normal) || (aiMode == null)) {
            unitData.setAiMode(UnitsConstants.AiModeId.WaitUntilCanAttack);
        } else {
            unitData.setAiMode(UnitsConstants.AiModeId.NoMove);
        }
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnUnitTag(): void {
        const unitData = this.getOpenData()?.unitData;
        if (unitData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : UnitsUtilsCommon.getTagIdList(unitData.getGroupedTagId() ?? 0, true),
            availableIntegerArray   : UnitsConstants.AllTagIdArray,
            getTitleText            : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.Tags)),
            callbackOnConfirm       : tagIdArray => {
                unitData.setGroupedTagId(UnitsUtilsCommon.getEncodedTagId(tagIdArray));
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnIsDiving(): void {
        const unitData = this.getOpenData()?.unitData;
        if (unitData == null) {
            return;
        }

        unitData.setIsDiving(!unitData.getIsDiving());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnHasLoadedCo(): void {
        const unitData = this.getOpenData()?.unitData;
        if (unitData == null) {
            return;
        }

        unitData.setIsCoOnboard(unitData.getIsCoOnboard() ? null : true);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnActionState(): void {
        const unitData = this.getOpenData()?.unitData;
        if (unitData == null) {
            return;
        }

        if (unitData.getActionState() === UnitsConstants.ActionStateId.Acted) {
            unitData.setActionState(null);
        } else {
            unitData.setActionState(UnitsConstants.ActionStateId.Acted);
        }
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnAiDestination(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = openData.unitData;
        const destination   = unitData.getAiWeightedDestination();
        const mapSize       = openData.war.getTileMap().getMapSize();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B1071),
            minValue        : 0,
            maxValue        : mapSize.getWidth() - 1,
            currentValue    : destination?.getGridIndex()?.getX() ?? 0,
            callback        : newX => {
                if (newX == null) {
                    unitData.setAiWeightedDestination(null);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                        getTitle           : () => LangUtils.getText(LangConstants.TextType.B1072),
                        minValue        : 0,
                        maxValue        : mapSize.getHeight() - 1,
                        currentValue    : destination?.getGridIndex()?.getY() ?? 0,
                        callback        : newY => {
                            if (newY == null) {
                                unitData.setAiWeightedDestination(null);
                                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                            } else {
                                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                                    getTitle           : () => LangUtils.getText(LangConstants.TextType.B1094),
                                    currentValue    : destination?.getWeight() ?? 0,
                                    minValue        : -99999999,
                                    maxValue        : 99999999,
                                    getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0432),
                                    callback        : value => {
                                        unitData.setAiWeightedDestination(ProtoSchemaCommonProtoStructureWeightedGridIndex.WeightedGridIndex.fromJson({
                                            gridIndex   : { x: newX, y: newY },
                                            weight      : value,
                                        }));
                                        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        const unitData      = HelpersMisc.getExisted(openData.unitData);

        const playerIndexArray = HelpersCollection.createRange(PlayersConstants.PlayerIndex.First, war.getPlayersCountUnneutral() + 1, 1);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseUnitAndPlayerIndexPanel, {
            gameConfig          : gameConfig,
            currentUnitType     : unitData.getUnitType(),
            unitTypeArray       : gameConfig.getAllUnitTypeArray(),
            currentSkinId       : unitData.getPlayerIndex(),
            playerIndexArray    : playerIndexArray,
            finalSkinIdArray    : playerIndexArray.map(v => ForceSkinsUtils.getDefaultSkinId(v)),
            callback            : (unitType, skinId) => {
                unitData.setPlayerIndex(skinId);
                if (unitData.getUnitType() !== unitType) {
                    unitData.setUnitType(unitType);
                    UnitsUtilsSerialization.fillNonTrivialDefaultValues(unitData, gameConfig);
                }

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            }
        });
    }

    private _onTouchedBtnHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = HelpersMisc.getExisted(openData.unitData);
        const minValue      = 1;
        const maxValue      = HelpersMisc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getMaxHp());
        const defaultValue  = maxValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.Hp),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentHp() ?? defaultValue,
            callback        : value => {
                unitData.setCurrentHp(value);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = HelpersMisc.getExisted(openData.unitData);
        const minValue      = 0;
        const maxValue      = HelpersMisc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getMaxFuel());
        const defaultValue  = maxValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.Fuel),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentFuel() ?? defaultValue,
            callback        : value => {
                unitData.setCurrentFuel(value);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnPromotion(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = HelpersMisc.getExisted(openData.unitData);
        const minValue      = 0;
        const maxValue      = openData.war.getGcData().getUnitMaxPromotion();
        const defaultValue  = minValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.Promotion),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentPromotion() ?? defaultValue,
            callback        : value => {
                unitData.setCurrentPromotion(value);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnCustomNameId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData  = HelpersMisc.getExisted(openData.unitData);
        const arr       = openData.war.getUnitMap().getUnitCustomNameArray();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.CustomNameId),
            availableNumberArray    : HelpersCollection.createRange(0, UnitsConstants.CustomName.MaxId + 1, 1),
            currentNumber           : unitData.getCustomNameId() ?? 0,
            columnsCount            : 4,
            showNumber              : true,
            getNumberMainText       : num => {
                if (num === 0) {
                    return `(${LangUtils.getText(LangConstants.TextType.B0391)})`;
                } else {
                    return LangUtils.getLanguageText({ textArray: arr?.find(v => (v.getNameId() ?? 0) === num)?.getNameTextArray() }) ?? `----`;
                }
            },
            callbackOnConfirm       : num => {
                if (num == 0) {
                    unitData.setCustomNameId(null);
                } else {
                    unitData.setCustomNameId(num);
                }
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnPrimaryAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = HelpersMisc.getExisted(openData.unitData);
        const minValue      = 0;
        const maxValue      = HelpersMisc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getPrimaryWeaponMaxAmmo());
        const defaultValue  = maxValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.PrimaryWeaponAmmo),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getPrimaryWeaponCurrentAmmo() ?? defaultValue,
            callback        : value => {
                unitData.setPrimaryWeaponCurrentAmmo(value);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnFlareAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = HelpersMisc.getExisted(openData.unitData);
        const minValue      = 0;
        const maxValue      = HelpersMisc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getFlareMaxAmmo());
        const defaultValue  = maxValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.FlareAmmo),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getFlareCurrentAmmo() ?? defaultValue,
            callback        : value => {
                unitData.setFlareCurrentAmmo(value);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnBuildMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = HelpersMisc.getExisted(openData.unitData);
        const minValue      = 0;
        const maxValue      = HelpersMisc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getMaxBuildMaterial());
        const defaultValue  = maxValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.BuildMaterial),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentBuildMaterial() ?? defaultValue,
            callback        : value => {
                unitData.setCurrentBuildMaterial(value);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnProduceMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = HelpersMisc.getExisted(openData.unitData);
        const minValue      = 0;
        const maxValue      = HelpersMisc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getMaxProduceMaterial());
        const defaultValue  = maxValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.ProductionMaterial),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentProduceMaterial() ?? defaultValue,
            callback        : value => {
                unitData.setCurrentProduceMaterial(value);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForData();
    }
    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(CommonModelCommonModel.getUnitAnimationTickCount());
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForData();
    }

    private _updateComponentsForLanguage(): void {
        this._btnAiMode.setLangText(LangConstants.TextType.AiMode);
        this._btnUnitTag.setLangText(LangConstants.TextType.Tags);
        this._btnIsDiving.setLangText(LangConstants.TextType.B0371);
        this._btnHasLoadedCo.setLangText(LangConstants.TextType.CoOnboard);
        this._btnHp.setLangText(LangConstants.TextType.Hp);
        this._btnFuel.setLangText(LangConstants.TextType.Fuel);
        this._btnPromotion.setLangText(LangConstants.TextType.Promotion);
        this._btnCustomNameId.setLangText(LangConstants.TextType.CustomNameId);
        this._btnPrimaryAmmo.setLangText(LangConstants.TextType.PrimaryWeaponAmmo);
        this._btnFlareAmmo.setLangText(LangConstants.TextType.FlareAmmo);
        this._btnBuildMaterial.setLangText(LangConstants.TextType.BuildMaterial);
        this._btnProduceMaterial.setLangText(LangConstants.TextType.ProductionMaterial);
        this._btnActionState.setLangText(LangConstants.TextType.ActionState);
        this._btnAiDestination.setLangText(LangConstants.TextType.AiDestination);
        this._btnUnitType.setLangText(LangConstants.TextType.B0525);
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
        label.setText(errorTips || LangUtils.getText(LangConstants.TextType.B0493));
        label.setTextColor(errorTips ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
    }
    private _updateComponentsForAiMode(): void {
        this._labelAiMode.setText(LangUtils.getUnitAiModeName(this.getOpenData()?.unitData?.getAiMode() ?? UnitsConstants.AiModeId.Normal) ?? LangConstants.UndefinedError);
    }
    private _updateComponentsForUnitTag(): void {
        const tagIdArray        = UnitsUtilsCommon.getTagIdList(this.getOpenData()?.unitData?.getGroupedTagId() ?? 0, true);
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
            this._labelIsDiving.setText(LangUtils.getTextForYesOrNo(unitData.getIsDiving()));
        }
    }
    private _updateComponentsForIsCoOnboard(): void {
        this._labelHasLoadedCo.setText(LangUtils.getTextForYesOrNo(this.getOpenData()?.unitData?.getIsCoOnboard()));
    }
    private _updateComponentsForActionState(): void {
        const label = this._labelActionState;
        const state = this.getOpenData()?.unitData?.getActionState();
        label.setText(state == null
            ? (LangUtils.getUnitActionStateText(UnitsConstants.ActionStateId.Idle) ?? LangConstants.UndefinedError)
            : (LangUtils.getUnitActionStateText(state) ?? LangConstants.UndefinedError)
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

        this._labelHp.setText(`${HelpersMisc.getExisted(openData.unitData).getCurrentHp()}`);
    }
    private _updateComponentsForFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }
        this._labelFuel.setText(`${HelpersMisc.getExisted(openData.unitData).getCurrentFuel()}`);
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
        const unitData  = HelpersMisc.getExisted(openData.unitData);
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
        const unitData  = HelpersMisc.getExisted(openData.unitData);
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
        const unitData      = HelpersMisc.getExisted(openData.unitData);
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
        const unitData      = HelpersMisc.getExisted(openData.unitData);
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
        const playerIndex   = HelpersMisc.getExisted(unitData.getPlayerIndex());
        const gameConfig    = openData.war.getGcData();
        this._unitView.update(new UiTypesUiUnitViewData.UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : ForceSkinsUtils.getDefaultSkinId(playerIndex),
            overridingSkinId    : undefined,
            unitData            : UnitsUtilsSerialization.createDefault({
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
    unitData    : ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit;
    war         : MapEditorInterfaceIMeWar.IMeWar;
}): string | null {
    const gameConfig    = war.getGcData();
    const unitCfg       = gameConfig.getUnitTemplateCfg(unitData.getUnitType() ?? 0);
    if (unitCfg == null) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.B0525));
    }

    if (unitData.getGridIndex() != null) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.B0531));
    }

    {
        const playerIndex = unitData.getPlayerIndex() ?? 0;
        if ((playerIndex > war.getPlayersCountUnneutral())      ||
            (playerIndex < PlayersConstants.PlayerIndex.First)
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.PlayerIndex));
        }
    }

    {
        if (!UnitsUtilsCommon.checkIsValidActionStateId(unitData.getActionState())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.ActionState));
        }
    }

    {
        const currentFuel = unitData.getCurrentFuel();
        if ((currentFuel < 0) || (currentFuel > unitCfg.getMaxFuel())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.Fuel));
        }
    }

    {
        const currentHp = unitData.getCurrentHp();
        if ((currentHp < 0) || (currentHp > unitCfg.getMaxHp())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.Hp));
        }
    }

    {
        const currentBuildMaterial  = unitData.getCurrentBuildMaterial();
        if ((currentBuildMaterial < 0) || (currentBuildMaterial > (unitCfg.getMaxBuildMaterial() ?? 0))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.BuildMaterial));
        }
    }

    {
        const currentProduceMaterial  = unitData.getCurrentProduceMaterial();
        if ((currentProduceMaterial < 0) || (currentProduceMaterial > (unitCfg.getMaxProduceMaterial() ?? 0))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.ProductionMaterial));
        }
    }

    {
        const currentPromotion = unitData.getCurrentPromotion();
        if ((currentPromotion < 0) || (currentPromotion > gameConfig.getUnitMaxPromotion())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.Promotion));
        }
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const customNameId = unitData.getCustomNameId();
    }

    {
        const flareCurrentAmmo  = unitData.getFlareCurrentAmmo();
        if ((flareCurrentAmmo < 0) || (flareCurrentAmmo > (unitCfg.getFlareMaxAmmo() ?? 0))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.FlareAmmo));
        }
    }

    {
        const primaryCurrentAmmo  = unitData.getPrimaryWeaponCurrentAmmo();
        if ((primaryCurrentAmmo < 0) || (primaryCurrentAmmo > (unitCfg.getPrimaryWeaponMaxAmmo() ?? 0))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.PrimaryWeaponAmmo));
        }
    }

    // if (unitData.unitId != null) {
    //     return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0527));
    // }

    if (unitData.getLoaderUnitId() != null) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.B0528));
    }

    if ((unitData.getIsDiving()) && (unitCfg.getDiveCfg() == null)) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.B0371));
    }

    // unitData.hasLoadedCo的值不需要检查

    if (!UnitsUtilsCommon.checkIsValidEncodedTagId(unitData.getGroupedTagId() ?? 0)) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Tags));
    }

    // if (unitData.deprecatedIsBuildingTile) {
    //     return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0529));
    // }

    // if (unitData.deprecatedIsCapturingTile) {
    //     return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0530));
    // }

    return null;
}
