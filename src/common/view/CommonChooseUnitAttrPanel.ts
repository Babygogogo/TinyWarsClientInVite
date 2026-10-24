import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as CommonModelCommonModel from "../model/CommonModel.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as ProtoSchemaCommonProtoStructureGridIndex from "../../proto/schema/CommonProto/Structure/GridIndex.ts";
import * as ProtoSchemaCommonProtoStructureWeightedGridIndex from "../../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialUnit from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import * as UiTypesUiUnitViewData from "../../ui/types/UiUnitViewData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UnitsUtilsCommon from "../../units/utils/Common.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";

export interface OpenData {
    war             : BaseWarInterfaceIBwWar.IBwWar;
    getTitleText    : () => string;
    callback        : (unitData: ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!               : UiInterfacesIUiButton.IUiButton;

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
    private _unitData?                          : ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                           callback: this.closePanel },
            { ui: this._btnConfirm,                         callback: this._onTouchedBtnConfirm },

            { ui: this._btnAiMode,                          callback: this._onTouchedBtnAiMode },
            { ui: this._btnUnitTag,                         callback: this._onTouchedBtnUnitTag },
            { ui: this._btnIsDiving,                        callback: this._onTouchedBtnIsDiving },
            { ui: this._btnHasLoadedCo,                     callback: this._onTouchedBtnHasLoadedCo },
            { ui: this._btnActionState,                     callback: this._onTouchedBtnActionState },
            { ui: this._btnAiDestination,                   callback: this._onTouchedBtnAiDestination },
            { ui: this._btnUnitType,                        callback: this._onTouchedBtnUnitType },

            { ui: this._btnHp,                              callback: this._onTouchedBtnHp },

            { ui: this._btnFuel,                            callback: this._onTouchedBtnFuel },

            { ui: this._btnPromotion,                       callback: this._onTouchedBtnPromotion },

            { ui: this._btnPrimaryAmmo,                     callback: this._onTouchedBtnPrimaryAmmo },

            { ui: this._btnFlareAmmo,                       callback: this._onTouchedBtnFlareAmmo },

            { ui: this._btnBuildMaterial,                   callback: this._onTouchedBtnBuildMaterial },

            { ui: this._btnProduceMaterial,                 callback: this._onTouchedBtnProduceMaterial },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,           callback: this._onNotifyUnitAnimationTick },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._conUnitView.addUiChild(this._unitView);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const war = this.getOpenData()?.war;
        if (war) {
            const unitData = this._unitData ??= UnitsUtilsSerialization.createDefault({
                unitTypeId  : UnitsConstants.UnitTypeId.First,
                playerIndex : PlayersConstants.PlayerIndex.First,
                unitId      : -1,
                gridIndex   : { x: 0, y: 0 },
                gcData      : war.getGcData(),
            });
            unitData.setGridIndex(null);
            unitData.setPlayerIndex(Math.max(PlayersConstants.PlayerIndex.First, war.getPlayerIndexInTurn()));
        }

        this._updateComponentsForUnitData();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData = this._getUnitData();
        if (getErrorTipsForAddUnit({ unitData, war: openData.war })) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        openData.callback(unitData);
        this.closePanel();
    }

    private _onTouchedBtnAiMode(): void {
        const unitData  = this._getUnitData();
        const aiMode    = unitData.getAiMode();
        if (aiMode === UnitsConstants.AiModeId.NoMove) {
            unitData.setAiMode(UnitsConstants.AiModeId.Normal);
        } else if ((aiMode === UnitsConstants.AiModeId.Normal) || (aiMode == null)) {
            unitData.setAiMode(UnitsConstants.AiModeId.WaitUntilCanAttack);
        } else {
            unitData.setAiMode(UnitsConstants.AiModeId.NoMove);
        }
        this._updateComponentsForAiMode();
    }
    private _onTouchedBtnUnitTag(): void {
        const unitData = this._getUnitData();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : UnitsUtilsCommon.getTagIdList(unitData.getGroupedTagId() ?? 0, true),
            availableIntegerArray   : UnitsConstants.AllTagIdArray,
            getTitleText            : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.Tags)),
            callbackOnConfirm       : tagIdArray => {
                unitData.setGroupedTagId(UnitsUtilsCommon.getEncodedTagId(tagIdArray));
                this._updateComponentsForUnitTag();
            },
        });
    }
    private _onTouchedBtnIsDiving(): void {
        const unitData      = this._getUnitData();
        unitData.setIsDiving(!unitData.getIsDiving());
        this._updateComponentsForIsDiving();
    }
    private _onTouchedBtnHasLoadedCo(): void {
        const unitData = this._getUnitData();
        unitData.setIsCoOnboard(!unitData.getIsCoOnboard());
        this._updateComponentsForIsCoOnboard();
    }
    private _onTouchedBtnActionState(): void {
        const unitData = this._getUnitData();
        if (unitData.getActionState() === UnitsConstants.ActionStateId.Acted) {
            unitData.setActionState(null);
        } else {
            unitData.setActionState(UnitsConstants.ActionStateId.Acted);
        }
        this._updateComponentsForActionState();
    }
    private _onTouchedBtnAiDestination(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = this._getUnitData();
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
                    this._updateComponentsForAiDestination();
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                        getTitle           : () => LangUtils.getText(LangConstants.TextType.B1072),
                        minValue        : 0,
                        maxValue        : mapSize.getHeight() - 1,
                        currentValue    : destination?.getGridIndex()?.getY() ?? 0,
                        callback        : newY => {
                            if (newY == null) {
                                unitData.setAiWeightedDestination(null);
                                this._updateComponentsForAiDestination();
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
                                        this._updateComponentsForAiDestination();
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
        const unitData      = this._getUnitData();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseUnitAndPlayerIndexPanel, {
            gameConfig          : gameConfig,
            currentUnitType     : unitData.getUnitType() ?? undefined,
            unitTypeArray       : gameConfig.getAllUnitTypeArray(),
            currentSkinId       : unitData.getPlayerIndex() ?? undefined,
            playerIndexArray    : HelpersCollection.createRange(PlayersConstants.PlayerIndex.First, war.getPlayersCountUnneutral() + 1, 1),
            finalSkinIdArray    : ForceSkinsUtils.getFinalSkinIdArray(war, false),
            callback            : (unitType, skinId) => {
                unitData.setPlayerIndex(skinId);
                if (unitData.getUnitType() !== unitType) {
                    unitData.setUnitType(unitType);
                    UnitsUtilsSerialization.fillNonTrivialDefaultValues(unitData, gameConfig);
                }

                this._updateComponentsForUnitData();
            }
        });
    }
    private _onTouchedBtnHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = this._getUnitData();
        const minValue      = 1;
        const maxValue      = HelpersMisc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxHp());
        const defaultValue  = maxValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.Hp),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentHp() ?? defaultValue,
            callback        : value => {
                unitData.setCurrentHp(value === defaultValue ? null : value);
                this._updateComponentsForHp();
            },
        });
    }
    private _onTouchedBtnFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = this._getUnitData();
        const minValue      = 0;
        const maxValue      = HelpersMisc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxFuel());
        const defaultValue  = maxValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.Fuel),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentFuel() ?? defaultValue,
            callback        : value => {
                unitData.setCurrentFuel(value === defaultValue ? null : value);
                this._updateComponentsForFuel();
            },
        });
    }
    private _onTouchedBtnPromotion(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = this._getUnitData();
        const minValue      = 0;
        const maxValue      = openData.war.getGcData().getUnitMaxPromotion();
        const defaultValue  = minValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.Promotion),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentPromotion() ?? defaultValue,
            callback        : value => {
                unitData.setCurrentPromotion(value === defaultValue ? null : value);
                this._updateComponentsForPromotion();
            },
        });
    }
    private _onTouchedBtnPrimaryAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = this._getUnitData();
        const minValue      = 0;
        const maxValue      = HelpersMisc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getPrimaryWeaponMaxAmmo());
        const defaultValue  = maxValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.PrimaryWeaponAmmo),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getPrimaryWeaponCurrentAmmo() ?? defaultValue,
            callback        : value => {
                unitData.setPrimaryWeaponCurrentAmmo(value === defaultValue ? null : value);
                this._updateComponentsForPrimaryAmmo();
            },
        });
    }
    private _onTouchedBtnFlareAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = this._getUnitData();
        const minValue      = 0;
        const maxValue      = HelpersMisc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getFlareMaxAmmo());
        const defaultValue  = maxValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.FlareAmmo),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getFlareCurrentAmmo() ?? defaultValue,
            callback        : value => {
                unitData.setFlareCurrentAmmo(value === defaultValue ? null : value);
                this._updateComponentsForFlareAmmo();
            },
        });
    }
    private _onTouchedBtnBuildMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = this._getUnitData();
        const minValue      = 0;
        const maxValue      = HelpersMisc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxBuildMaterial());
        const defaultValue  = maxValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.BuildMaterial),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentBuildMaterial() ?? defaultValue,
            callback        : value => {
                unitData.setCurrentBuildMaterial(value === defaultValue ? null : value);
                this._updateComponentsForBuildMaterial();
            },
        });
    }
    private _onTouchedBtnProduceMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = this._getUnitData();
        const minValue      = 0;
        const maxValue      = HelpersMisc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxProduceMaterial());
        const defaultValue  = maxValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.ProductionMaterial),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentProduceMaterial() ?? defaultValue,
            callback        : value => {
                unitData.setCurrentProduceMaterial(value === defaultValue ? null : value);
                this._updateComponentsForProduceMaterial();
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForUnitData();
    }
    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(CommonModelCommonModel.getUnitAnimationTickCount());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? LangConstants.UndefinedError);
        this._btnConfirm.setLangText(LangConstants.TextType.B0026);

        this._btnAiMode.setLangText(LangConstants.TextType.AiMode);
        this._btnUnitTag.setLangText(LangConstants.TextType.Tags);
        this._btnIsDiving.setLangText(LangConstants.TextType.B0371);
        this._btnHasLoadedCo.setLangText(LangConstants.TextType.CoOnboard);
        this._btnHp.setLangText(LangConstants.TextType.Hp);
        this._btnFuel.setLangText(LangConstants.TextType.Fuel);
        this._btnPromotion.setLangText(LangConstants.TextType.Promotion);
        this._btnPrimaryAmmo.setLangText(LangConstants.TextType.PrimaryWeaponAmmo);
        this._btnFlareAmmo.setLangText(LangConstants.TextType.FlareAmmo);
        this._btnBuildMaterial.setLangText(LangConstants.TextType.BuildMaterial);
        this._btnProduceMaterial.setLangText(LangConstants.TextType.ProductionMaterial);
        this._btnActionState.setLangText(LangConstants.TextType.ActionState);
        this._btnAiDestination.setLangText(LangConstants.TextType.AiDestination);
        this._btnUnitType.setLangText(LangConstants.TextType.B0525);
    }

    private _updateComponentsForUnitData(): void {
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

        const label     = this._labelError;
        const unitData  = this._getUnitData();
        const errorTips = getErrorTipsForAddUnit({
            unitData    : unitData,
            war         : openData.war,
        });
        label.setText(errorTips || LangUtils.getText(LangConstants.TextType.B0493));
        label.setTextColor(errorTips ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
    }
    private _updateComponentsForAiMode(): void {
        this._labelAiMode.setText(LangUtils.getUnitAiModeName(this._getUnitData().getAiMode() ?? UnitsConstants.AiModeId.Normal) ?? LangConstants.UndefinedError);
    }
    private _updateComponentsForUnitTag(): void {
        const tagIdArray        = UnitsUtilsCommon.getTagIdList(this._getUnitData().getGroupedTagId() ?? 0, true);
        this._labelUnitTag.setText(tagIdArray.length <= 0 ? `--` : tagIdArray.join(`/`));
    }
    private _updateComponentsForIsDiving(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group     = this._groupIsDiving;
        const unitData  = this._getUnitData();
        const unitCfg   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType());
        if ((!unitCfg) || (unitCfg.getDiveCfg() == null)) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._labelIsDiving.setText(LangUtils.getTextForYesOrNo(unitData.getIsDiving()));
        }
    }
    private _updateComponentsForIsCoOnboard(): void {
        this._labelHasLoadedCo.setText(LangUtils.getTextForYesOrNo(this._getUnitData().getIsCoOnboard()));
    }
    private _updateComponentsForActionState(): void {
        const label = this._labelActionState;
        const state = this._getUnitData().getActionState();
        label.setText(state == null
            ? (LangUtils.getUnitActionStateText(UnitsConstants.ActionStateId.Idle) ?? LangConstants.UndefinedError)
            : (LangUtils.getUnitActionStateText(state) ?? LangConstants.UndefinedError)
        );
    }
    private _updateComponentsForAiDestination(): void {
        const destination = this._getUnitData().getAiWeightedDestination();
        const gridIndex   = destination?.getGridIndex();
        this._labelAiDestination.setText(destination == null ? `--` : `${gridIndex?.getX()}, ${gridIndex?.getY()} (${destination.getWeight()})`);
    }
    private _updateComponentsForHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const input     = this._labelHp;
        const unitData  = this._getUnitData();
        const currentHp = unitData.getCurrentHp();
        input.setText(currentHp == null
            ? `${openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxHp()}`
            : `${currentHp}`
        );
    }
    private _updateComponentsForFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const input         = this._labelFuel;
        const unitData      = this._getUnitData();
        const currentFuel   = unitData.getCurrentFuel();
        input.setText(currentFuel == null
            ? `${openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxFuel()}`
            : `${currentFuel}`
        );
    }
    private _updateComponentsForPromotion(): void {
        this._labelPromotion.setText(`${this._getUnitData().getCurrentPromotion() || 0}`);
    }
    private _updateComponentsForPrimaryAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group     = this._groupPrimaryAmmo;
        const unitData  = this._getUnitData();
        const maxAmmo   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getPrimaryWeaponMaxAmmo();
        if (!maxAmmo) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            const currentAmmo           = unitData.getPrimaryWeaponCurrentAmmo();
            this._labelPrimaryAmmo.setText(`${currentAmmo == null ? maxAmmo : currentAmmo}`);
        }
    }
    private _updateComponentsForFlareAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group     = this._groupFlareAmmo;
        const unitData  = this._getUnitData();
        const maxAmmo   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getFlareMaxAmmo();
        if (!maxAmmo) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            const currentAmmo           = unitData.getFlareCurrentAmmo();
            this._labelFlareAmmo.setText(`${currentAmmo == null ? maxAmmo : currentAmmo}`);
        }
    }
    private _updateComponentsForBuildMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group         = this._groupBuildMaterial;
        const unitData      = this._getUnitData();
        const maxMaterial   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxBuildMaterial();
        if (!maxMaterial) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            const currentMaterial           = unitData.getCurrentBuildMaterial();
            this._labelBuildMaterial.setText(`${currentMaterial == null ? maxMaterial : currentMaterial}`);
        }
    }
    private _updateComponentsForProduceMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const group         = this._groupProduceMaterial;
        const unitData      = this._getUnitData();
        const maxMaterial   = openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxProduceMaterial();
        if (!maxMaterial) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            const currentMaterial           = unitData.getCurrentProduceMaterial();
            this._labelProduceMaterial.setText(`${currentMaterial == null ? maxMaterial : currentMaterial}`);
        }
    }

    private _updateUnitView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitData      = this._getUnitData().clone();
        const playerIndex   = unitData.getPlayerIndex();
        const war           = openData.war;
        unitData.setGridIndex(ProtoSchemaCommonProtoStructureGridIndex.GridIndex.fromJson({ x: 0, y: 0 }));
        this._unitView.update(new UiTypesUiUnitViewData.UiUnitViewData({
            gameConfig          : war.getGcData(),
            skinId              : war.getPlayer(playerIndex).getUnitAndTileSkinId(),
            overridingSkinId    : ForceSkinsUtils.getRawOverridingSkinId(war, playerIndex),
            unitData            : unitData,
        }));
    }

    private _getUnitData(): ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit {
        return HelpersMisc.getExisted(this._unitData);
    }
}

function getErrorTipsForAddUnit({ unitData, war }: {
    unitData    : ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit;
    war         : BaseWarInterfaceIBwWar.IBwWar;
}): string | null {
    const gameConfig    = war.getGcData();
    const unitCfg       = gameConfig.getUnitTemplateCfg(unitData.getUnitType());
    if (unitCfg == null) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.B0525));
    }

    if (unitData.getGridIndex() != null) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0064, LangUtils.getText(LangConstants.TextType.B0531));
    }

    {
        const playerIndex = unitData.getPlayerIndex();
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
