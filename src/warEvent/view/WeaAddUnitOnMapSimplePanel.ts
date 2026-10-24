import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as CommonModelCommonModel from "../../common/model/CommonModel.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
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
import * as ProtoSchemaCommonProtoWarEventWeaAddUnitOnMapSimpleDataForAddUnit from "../../proto/schema/CommonProto/WarEvent/WeaAddUnitOnMapSimple/DataForAddUnit.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiUnitViewData from "../../ui/types/UiUnitViewData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UnitsUtilsCommon from "../../units/utils/Common.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";
import * as WarEventsActionsConstantsAddUnitOnMapSimple from "../../warEvents/actions/constants/AddUnitOnMapSimple.ts";

type WarEventFullData   = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction     = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnType!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAddUnit!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClear!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUnitsCount!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listUnit!             : UiInterfacesIUiScrollList.IUiScrollList<DataForUnitRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnAddUnit,         callback: this._onTouchedBtnAddUnit },
            { ui: this._btnClear,           callback: this._onTouchedBtnClear },
            { ui: this._btnType,            callback: this._onTouchedBtnType },
            { ui: this._btnClose,           callback: this.closePanel },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,    callback: this._onNotifyWarEventFullDataChanged },
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
        if (unitArray.length >= WarEventsActionsConstantsAddUnitOnMapSimple.Common.MaxCount) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0189));
        } else {
            unitArray.push(getDefaultAddUnitData(openData.war.getGcData()));
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
        }
    }

    private _onTouchedBtnClear(): void {
        const action = this.getOpenData()?.action.getWeaAddUnitOnMapSimple();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0190),
            callback: () => {
                action.getUnitArray().length = 0;
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            }
        });
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
        this._btnAddUnit.setLangText(LangConstants.TextType.B0535);
        this._btnClear.setLangText(LangConstants.TextType.B0391);
        this._btnClose.setLangText(LangConstants.TextType.B0146);
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
        const maxCount  = WarEventsActionsConstantsAddUnitOnMapSimple.Common.MaxCount;
        const currCount = dataArray.length;
        label.setText(`${LangUtils.getText(LangConstants.TextType.B0524)}: ${currCount} / ${maxCount}`);
        label.setTextColor(((currCount <= maxCount) && (currCount > 0)) ? GraphicsConstants.ColorValue.White : GraphicsConstants.ColorValue.Red);
    }
}

interface DataForUnitRenderer extends UiTypesUiListItemData.UiListItemData {
    panel           : Panel;
    war             : MapEditorInterfaceIMeWar.IMeWar;
    action          : WarEventAction;
    dataForAddUnit  : ProtoSchemaCommonProtoWarEventWeaAddUnitOnMapSimpleDataForAddUnit.DataForAddUnit;
}
class UnitRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
    private readonly _btnDelete!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClone!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelError!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnCanBeBlockedByUnit!    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelCanBeBlockedByUnit!  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnNeedMovableTile!       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelNeedMovableTile!     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnAiMode!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelAiMode!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnUnitTag!               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelUnitTag!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnGridIndex!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelGridIndex!           : UiInterfacesIUiLabel.IUiLabel;

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
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
        ]);

        this._updateComponentsForLanguage();

        this._conUnitView.addUiChild(this._unitView);
    }

    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0029),
            callback: () => {
                HelpersCollection.deleteElementFromList(HelpersMisc.getExisted(openData.action.getWeaAddUnitOnMapSimple()?.getUnitArray()), openData.dataForAddUnit);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnClone(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitArray = HelpersMisc.getExisted(openData.action.getWeaAddUnitOnMapSimple()?.getUnitArray());
        if (unitArray.length >= WarEventsActionsConstantsAddUnitOnMapSimple.Common.MaxCount) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.YouCanNotDoThisRightNow));
        } else {
            const srcData   = openData.dataForAddUnit;
            const index     = unitArray.indexOf(srcData);
            const dstData   = srcData.clone();
            if (index < 0) {
                unitArray.push(dstData);
            } else {
                unitArray.splice(index, 0, dstData);
            }

            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
        }
    }
    private _onTouchedBtnCanBeBlockedByUnit(): void {
        const data = this.getOpenData()?.dataForAddUnit;
        if (data == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent             : () => LangUtils.getText(LangConstants.TextType.A0414),
            getTextForConfirm      : () => LangUtils.getText(LangConstants.TextType.Yes),
            getTextForCancel       : () => LangUtils.getText(LangConstants.TextType.No),
            callback            : () => {
                data.setCanBeBlockedByUnit(true);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
            callbackOnCancel    : () => {
                data.setCanBeBlockedByUnit(false);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnNeedMovableTile(): void {
        const data = this.getOpenData()?.dataForAddUnit;
        if (data == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent             : () => LangUtils.getText(LangConstants.TextType.A0415),
            getTextForConfirm      : () => LangUtils.getText(LangConstants.TextType.Yes),
            getTextForCancel       : () => LangUtils.getText(LangConstants.TextType.No),
            callback            : () => {
                data.setNeedMovableTile(true);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
            callbackOnCancel    : () => {
                data.setNeedMovableTile(false);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnAiMode(): void {
        const unitData  = HelpersMisc.getExisted(this.getOpenData()?.dataForAddUnit.getUnitData());
        const aiMode    = unitData.getAiMode();
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
        const unitData = HelpersMisc.getExisted(this.getOpenData()?.dataForAddUnit.getUnitData());
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
        const unitData          = HelpersMisc.getExisted(this.getOpenData()?.dataForAddUnit.getUnitData());
        unitData.setIsDiving(!unitData.getIsDiving());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnHasLoadedCo(): void {
        const unitData          = HelpersMisc.getExisted(this.getOpenData()?.dataForAddUnit.getUnitData());
        unitData.setIsCoOnboard(unitData.getIsCoOnboard() ? null : true);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnActionState(): void {
        const unitData = HelpersMisc.getExisted(this.getOpenData()?.dataForAddUnit.getUnitData());
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

        const unitData      = HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData());
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
        const unitData      = HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData());

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

    private _onTouchedBtnGridIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const mapSize   = openData.war.getTileMap().getMapSize();
        const gridIndex = openData.dataForAddUnit.createIfNotExistsUnitData().createIfNotExistsGridIndex();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B1071),
            minValue        : 0,
            maxValue        : mapSize.getWidth() - 1,
            currentValue    : gridIndex.getX() ?? 0,
            callback        : gridX => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                    getTitle           : () => LangUtils.getText(LangConstants.TextType.B1072),
                    minValue        : 0,
                    maxValue        : mapSize.getHeight() - 1,
                    currentValue    : gridIndex.getY() ?? 0,
                    callback        : gridY => {
                        gridIndex.setX(gridX);
                        gridIndex.setY(gridY);
                        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        const unitData      = HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData());
        const minValue      = 1;
        const maxValue      = HelpersMisc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0)?.getMaxHp());
        const defaultValue  = maxValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.Hp),
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

        const unitData      = HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData());
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

        const unitData      = HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData());
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

        const unitData  = HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData());
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

        const unitData      = HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData());
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

        const unitData      = HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData());
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

        const unitData      = HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData());
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

        const unitData      = HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData());
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
        this._btnClone.setLangText(LangConstants.TextType.B0748);
        this._btnDelete.setLangText(LangConstants.TextType.B0220);
        this._btnCanBeBlockedByUnit.setLangText(LangConstants.TextType.B0532);
        this._btnNeedMovableTile.setLangText(LangConstants.TextType.B0534);
        this._btnAiMode.setLangText(LangConstants.TextType.AiMode);
        this._btnUnitTag.setLangText(LangConstants.TextType.Tags);
        this._btnIsDiving.setLangText(LangConstants.TextType.B0371);
        this._btnHasLoadedCo.setLangText(LangConstants.TextType.CoOnboard);
        this._btnGridIndex.setLangText(LangConstants.TextType.B0531);
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
        label.setText(`${HelpersMisc.getExisted(openData.action.getWeaAddUnitOnMapSimple()?.getUnitArray().indexOf(dataForAddUnit)) + 1}. ${errorTips || LangUtils.getText(LangConstants.TextType.B0493)}`);
        label.setTextColor(errorTips ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
    }
    private _updateComponentsForCanBeBlockedByUnit(): void {
        this._labelCanBeBlockedByUnit.setText(LangUtils.getTextForYesOrNo(this.getOpenData()?.dataForAddUnit.getCanBeBlockedByUnit()));
    }
    private _updateComponentsForNeedMovableTile(): void {
        this._labelNeedMovableTile.setText(LangUtils.getTextForYesOrNo(this.getOpenData()?.dataForAddUnit.getNeedMovableTile()));
    }
    private _updateComponentsForAiMode(): void {
        this._labelAiMode.setText(LangUtils.getUnitAiModeName(this.getOpenData()?.dataForAddUnit.getUnitData()?.getAiMode() ?? UnitsConstants.AiModeId.Normal) ?? LangConstants.UndefinedError);
    }
    private _updateComponentsForUnitTag(): void {
        const tagIdArray = UnitsUtilsCommon.getTagIdList(this.getOpenData()?.dataForAddUnit.getUnitData()?.getGroupedTagId() ?? 0, true);
        this._labelUnitTag.setText(tagIdArray.length <= 0 ? `--` : tagIdArray.join(`/`));
    }
    private _updateComponentsForIsDiving(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group     = this._groupIsDiving;
        const unitData  = HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData());
        const unitCfg   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType() ?? 0);
        if ((!unitCfg) || (unitCfg.getDiveCfg() == null)) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._labelIsDiving.setText(LangUtils.getTextForYesOrNo(unitData.getIsDiving()));
        }
    }
    private _updateComponentsForIsCoOnboard(): void {
        this._labelHasLoadedCo.setText(LangUtils.getTextForYesOrNo(this.getOpenData()?.dataForAddUnit.getUnitData()?.getIsCoOnboard()));
    }
    private _updateComponentsForActionState(): void {
        const label = this._labelActionState;
        const state = this.getOpenData()?.dataForAddUnit.getUnitData()?.getActionState();
        label.setText(state == null
            ? (LangUtils.getUnitActionStateText(UnitsConstants.ActionStateId.Idle) ?? LangConstants.UndefinedError)
            : (LangUtils.getUnitActionStateText(state) ?? LangConstants.UndefinedError)
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

        this._labelHp.setText(`${(HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData())).getCurrentHp()}`);
    }
    private _updateComponentsForFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelFuel.setText(`${(HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData())).getCurrentFuel()}`);
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
        const unitData  = HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData());
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
        const unitData  = HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData());
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
        const unitData      = HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData());
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
        const unitData      = HelpersMisc.getExisted(openData.dataForAddUnit.getUnitData());
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
        const playerIndex   = HelpersMisc.getExisted(unitData?.getPlayerIndex());
        const gameConfig    = openData.war.getGcData();
        this._unitView.update(new UiTypesUiUnitViewData.UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : ForceSkinsUtils.getDefaultSkinId(playerIndex),
            overridingSkinId    : undefined,
            unitData            : UnitsUtilsSerialization.createDefault({
                gridIndex   : { x: 0, y: 0 },
                playerIndex : playerIndex,
                unitTypeId  : unitData?.getUnitType() ?? UnitsConstants.UnitTypeId.First,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }));
    }
}

function getErrorTipsForAddUnit({ dataForAddUnit, war }: {
    dataForAddUnit  : ProtoSchemaCommonProtoWarEventWeaAddUnitOnMapSimpleDataForAddUnit.DataForAddUnit;
    war             : MapEditorInterfaceIMeWar.IMeWar;
}): string | null {
    if (dataForAddUnit.getCanBeBlockedByUnit() == null) {
        return LangUtils.getText(LangConstants.TextType.A0192);
    }

    if (dataForAddUnit.getNeedMovableTile() == null) {
        return LangUtils.getText(LangConstants.TextType.A0193);
    }

    const unitData      = HelpersMisc.getExisted(dataForAddUnit.getUnitData());
    const gameConfig    = war.getGcData();
    const unitCfg       = gameConfig.getUnitTemplateCfg(unitData.getUnitType() ?? 0);
    if (unitCfg == null) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.B0525));
    }

    if (!AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(unitData.getGridIndex())?.checkIsInsideMap(war.getTileMap().getMapSize())) {
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
        const currentProduceMaterial = unitData.getCurrentProduceMaterial();
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

function getDefaultAddUnitData(gameConfig: GameConfigGcData.GcData): ProtoSchemaCommonProtoWarEventWeaAddUnitOnMapSimpleDataForAddUnit.DataForAddUnit {
    return ProtoSchemaCommonProtoWarEventWeaAddUnitOnMapSimpleDataForAddUnit.DataForAddUnit.fromJson({
        canBeBlockedByUnit  : true,
        needMovableTile     : true,
        unitData            : UnitsUtilsSerialization.createDefault({
            gridIndex       : { x: 0, y: 0 },
            playerIndex     : PlayersConstants.PlayerIndex.First,
            unitTypeId      : gameConfig.getFirstUnitType(),
            unitId          : -1,
            gcData          : gameConfig,
        }).toJson(),
    });
}
