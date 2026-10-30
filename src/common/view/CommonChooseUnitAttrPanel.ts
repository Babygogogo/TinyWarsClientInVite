import {
    Graphics_Constants,
    Helpers_Collection,
    GamePanels_Dict,
    Helpers_Misc,
    ForceSkins_Utils,
    Lang_Utils,
    Common_Model_CommonModel,
    GamePanels_Manager,
    Players_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    Ui_Components_UiUnitView,
    Ui_Types_UiUnitViewData,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    Units_Constants,
    Units_Utils_Common,
    Units_Utils_Serialization,
} from "../../internal.ts";
import { GridIndex } from "../../proto/schema/CommonProto/Structure/GridIndex.ts";
import { WeightedGridIndex } from "../../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import type { SerialUnit } from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";

export interface OpenData {
    war             : BaseWar_Interface_IBwWar.IBwWar;
    getTitleText    : () => string;
    callback        : (unitData: SerialUnit) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!               : Ui_Interfaces_IUiButton.IUiButton;

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
    private _unitData?                          : SerialUnit;

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
            { type: Notifications_TypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.UnitAnimationTick,           callback: this._onNotifyUnitAnimationTick },
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
            const unitData = this._unitData ??= Units_Utils_Serialization.createDefault({
                unitTypeId  : Units_Constants.UnitTypeId.First,
                playerIndex : Players_Constants.PlayerIndex.First,
                unitId      : -1,
                gridIndex   : { x: 0, y: 0 },
                gcData      : war.getGcData(),
            });
            unitData.setGridIndex(null);
            unitData.setPlayerIndex(Math.max(Players_Constants.PlayerIndex.First, war.getPlayerIndexInTurn()));
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
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        openData.callback(unitData);
        this.closePanel();
    }

    private _onTouchedBtnAiMode(): void {
        const unitData  = this._getUnitData();
        const aiMode    = unitData.getAiMode();
        if (aiMode === Units_Constants.AiModeId.NoMove) {
            unitData.setAiMode(Units_Constants.AiModeId.Normal);
        } else if ((aiMode === Units_Constants.AiModeId.Normal) || (aiMode == null)) {
            unitData.setAiMode(Units_Constants.AiModeId.WaitUntilCanAttack);
        } else {
            unitData.setAiMode(Units_Constants.AiModeId.NoMove);
        }
        this._updateComponentsForAiMode();
    }
    private _onTouchedBtnUnitTag(): void {
        const unitData = this._getUnitData();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : Units_Utils_Common.getTagIdList(unitData.getGroupedTagId(), true),
            availableIntegerArray   : Units_Constants.AllTagIdArray,
            getTitleText            : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.Tags)),
            callbackOnConfirm       : tagIdArray => {
                unitData.setGroupedTagId(Units_Utils_Common.getEncodedTagId(tagIdArray));
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
        if (unitData.getActionState() === Units_Constants.ActionStateId.Acted) {
            unitData.setActionState(null);
        } else {
            unitData.setActionState(Units_Constants.ActionStateId.Acted);
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.B1071),
            minValue        : 0,
            maxValue        : mapSize.getWidth() - 1,
            currentValue    : destination?.getGridIndex()?.getX() ?? 0,
            callback        : newX => {
                if (newX == null) {
                    unitData.setAiWeightedDestination(null);
                    this._updateComponentsForAiDestination();
                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                        getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.B1072),
                        minValue        : 0,
                        maxValue        : mapSize.getHeight() - 1,
                        currentValue    : destination?.getGridIndex()?.getY() ?? 0,
                        callback        : newY => {
                            if (newY == null) {
                                unitData.setAiWeightedDestination(null);
                                this._updateComponentsForAiDestination();
                            } else {
                                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                                    getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.B1094),
                                    currentValue    : destination?.getWeight() ?? 0,
                                    minValue        : -99999999,
                                    maxValue        : 99999999,
                                    getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0432),
                                    callback        : value => {
                                        unitData.setAiWeightedDestination(WeightedGridIndex.fromJson({
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseUnitAndPlayerIndexPanel, {
            gameConfig          : gameConfig,
            currentUnitType     : unitData.getUnitType(),
            unitTypeArray       : gameConfig.getAllUnitTypeArray(),
            currentSkinId       : unitData.getPlayerIndex(),
            playerIndexArray    : Helpers_Collection.createRange(Players_Constants.PlayerIndex.First, war.getPlayersCountUnneutral() + 1, 1),
            finalSkinIdArray    : ForceSkins_Utils.getFinalSkinIdArray(war, false),
            callback            : (unitType, skinId) => {
                unitData.setPlayerIndex(skinId);
                if (unitData.getUnitType() !== unitType) {
                    unitData.setUnitType(unitType);
                    Units_Utils_Serialization.fillNonTrivialDefaultValues(unitData, gameConfig);
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
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxHp());
        const defaultValue  = maxValue;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.Hp),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentHp(),
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
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxFuel());
        const defaultValue  = maxValue;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.Fuel),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentFuel(),
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.Promotion),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentPromotion(),
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
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getPrimaryWeaponMaxAmmo());
        const defaultValue  = maxValue;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.PrimaryWeaponAmmo),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getPrimaryWeaponCurrentAmmo(),
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
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getFlareMaxAmmo());
        const defaultValue  = maxValue;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.FlareAmmo),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getFlareCurrentAmmo(),
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
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxBuildMaterial());
        const defaultValue  = maxValue;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.BuildMaterial),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentBuildMaterial(),
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
        const maxValue      = Helpers_Misc.getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxProduceMaterial());
        const defaultValue  = maxValue;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.ProductionMaterial),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : unitData.getCurrentProduceMaterial(),
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
        this._unitView.updateOnAnimationTick(Common_Model_CommonModel.getUnitAnimationTickCount());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? Lang_Constants.UndefinedError);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);

        this._btnAiMode.setLangText(Lang_Constants.TextType.AiMode);
        this._btnUnitTag.setLangText(Lang_Constants.TextType.Tags);
        this._btnIsDiving.setLangText(Lang_Constants.TextType.B0371);
        this._btnHasLoadedCo.setLangText(Lang_Constants.TextType.CoOnboard);
        this._btnHp.setLangText(Lang_Constants.TextType.Hp);
        this._btnFuel.setLangText(Lang_Constants.TextType.Fuel);
        this._btnPromotion.setLangText(Lang_Constants.TextType.Promotion);
        this._btnPrimaryAmmo.setLangText(Lang_Constants.TextType.PrimaryWeaponAmmo);
        this._btnFlareAmmo.setLangText(Lang_Constants.TextType.FlareAmmo);
        this._btnBuildMaterial.setLangText(Lang_Constants.TextType.BuildMaterial);
        this._btnProduceMaterial.setLangText(Lang_Constants.TextType.ProductionMaterial);
        this._btnActionState.setLangText(Lang_Constants.TextType.ActionState);
        this._btnAiDestination.setLangText(Lang_Constants.TextType.AiDestination);
        this._btnUnitType.setLangText(Lang_Constants.TextType.B0525);
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
        label.setText(errorTips || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        label.setTextColor(errorTips ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
    }
    private _updateComponentsForAiMode(): void {
        this._labelAiMode.setText(Lang_Utils.getUnitAiModeName(this._getUnitData().getAiMode()) ?? Lang_Constants.UndefinedError);
    }
    private _updateComponentsForUnitTag(): void {
        const tagIdArray        = Units_Utils_Common.getTagIdList(this._getUnitData().getGroupedTagId(), true);
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
            this._labelIsDiving.setLangText(unitData.getIsDiving() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        }
    }
    private _updateComponentsForIsCoOnboard(): void {
        this._labelHasLoadedCo.setLangText(this._getUnitData().getIsCoOnboard() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
    }
    private _updateComponentsForActionState(): void {
        const label = this._labelActionState;
        const state = this._getUnitData().getActionState();
        label.setText(state == null
            ? (Lang_Utils.getUnitActionStateText(Units_Constants.ActionStateId.Idle) ?? Lang_Constants.UndefinedError)
            : (Lang_Utils.getUnitActionStateText(state) ?? Lang_Constants.UndefinedError)
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
        unitData.setGridIndex(GridIndex.fromJson({ x: 0, y: 0 }));
        this._unitView.update(new Ui_Types_UiUnitViewData.UiUnitViewData({
            gameConfig          : war.getGcData(),
            skinId              : war.getPlayer(playerIndex).getUnitAndTileSkinId(),
            overridingSkinId    : ForceSkins_Utils.getRawOverridingSkinId(war, playerIndex),
            unitData            : unitData,
        }));
    }

    private _getUnitData(): SerialUnit {
        return Helpers_Misc.getExisted(this._unitData);
    }
}

function getErrorTipsForAddUnit({ unitData, war }: {
    unitData    : SerialUnit;
    war         : BaseWar_Interface_IBwWar.IBwWar;
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
        const currentBuildMaterial  = unitData.getCurrentBuildMaterial();
        if ((currentBuildMaterial < 0) || (currentBuildMaterial > (unitCfg.getMaxBuildMaterial() ?? 0))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0064, Lang_Utils.getText(Lang_Constants.TextType.BuildMaterial));
        }
    }

    {
        const currentProduceMaterial  = unitData.getCurrentProduceMaterial();
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
