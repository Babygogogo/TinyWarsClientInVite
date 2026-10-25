import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { getUnitAnimationTickCount } from "../model/CommonModel.ts";
import { showLang } from "../../FloatText.ts";
import { getFinalSkinIdArray, getRawOverridingSkinId } from "../../forceSkins/Utils.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { createRange } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getFormattedText, getText, getUnitAiModeName, getTextForYesOrNo, getUnitActionStateText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { GridIndex } from "../../proto/schema/CommonProto/Structure/GridIndex.ts";
import { WeightedGridIndex } from "../../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import type { SerialUnit } from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import { UiUnitViewData } from "../../ui/types/UiUnitViewData.ts";
import { getUiUnitViewClass } from "../../ui/utils/UiFactory.ts";
import { UnitTypeId, AiModeId, AllTagIdArray, ActionStateId } from "../../units/Constants.ts";
import { getTagIdList, getEncodedTagId, checkIsValidActionStateId, checkIsValidEncodedTagId } from "../../units/utils/Common.ts";
import { createDefault, fillNonTrivialDefaultValues } from "../../units/utils/Serialization.ts";

export interface OpenData {
    war             : IBwWar;
    getTitleText    : () => string;
    callback        : (unitData: SerialUnit) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnClose!                 : IUiButton;
    private readonly _btnConfirm!               : IUiButton;

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
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.UnitAnimationTick,           callback: this._onNotifyUnitAnimationTick },
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
            const unitData = this._unitData ??= createDefault({
                unitTypeId  : UnitTypeId.First,
                playerIndex : PlayerIndex.First,
                unitId      : -1,
                gridIndex   : { x: 0, y: 0 },
                gcData      : war.getGcData(),
            });
            unitData.setGridIndex(null);
            unitData.setPlayerIndex(Math.max(PlayerIndex.First, war.getPlayerIndexInTurn()));
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
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        openData.callback(unitData);
        this.closePanel();
    }

    private _onTouchedBtnAiMode(): void {
        const unitData  = this._getUnitData();
        const aiMode    = unitData.getAiMode();
        if (aiMode === AiModeId.NoMove) {
            unitData.setAiMode(AiModeId.Normal);
        } else if ((aiMode === AiModeId.Normal) || (aiMode == null)) {
            unitData.setAiMode(AiModeId.WaitUntilCanAttack);
        } else {
            unitData.setAiMode(AiModeId.NoMove);
        }
        this._updateComponentsForAiMode();
    }
    private _onTouchedBtnUnitTag(): void {
        const unitData = this._getUnitData();
        openPanel(getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : getTagIdList(unitData.getGroupedTagId() ?? 0, true),
            availableIntegerArray   : AllTagIdArray,
            getTitleText            : () => getFormattedText(TextType.F0092, getText(TextType.Tags)),
            callbackOnConfirm       : tagIdArray => {
                unitData.setGroupedTagId(getEncodedTagId(tagIdArray));
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
        if (unitData.getActionState() === ActionStateId.Acted) {
            unitData.setActionState(null);
        } else {
            unitData.setActionState(ActionStateId.Acted);
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
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B1071),
            minValue        : 0,
            maxValue        : mapSize.getWidth() - 1,
            currentValue    : destination?.getGridIndex()?.getX() ?? 0,
            callback        : newX => {
                if (newX == null) {
                    unitData.setAiWeightedDestination(null);
                    this._updateComponentsForAiDestination();
                } else {
                    openPanel(getDict().CommonInputNullableIntegerPanel, {
                        getTitle           : () => getText(TextType.B1072),
                        minValue        : 0,
                        maxValue        : mapSize.getHeight() - 1,
                        currentValue    : destination?.getGridIndex()?.getY() ?? 0,
                        callback        : newY => {
                            if (newY == null) {
                                unitData.setAiWeightedDestination(null);
                                this._updateComponentsForAiDestination();
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

        openPanel(getDict().CommonChooseUnitAndPlayerIndexPanel, {
            gameConfig          : gameConfig,
            currentUnitType     : unitData.getUnitType() ?? undefined,
            unitTypeArray       : gameConfig.getAllUnitTypeArray(),
            currentSkinId       : unitData.getPlayerIndex() ?? undefined,
            playerIndexArray    : createRange(PlayerIndex.First, war.getPlayersCountUnneutral() + 1, 1),
            finalSkinIdArray    : getFinalSkinIdArray(war, false),
            callback            : (unitType, skinId) => {
                unitData.setPlayerIndex(skinId);
                if (unitData.getUnitType() !== unitType) {
                    unitData.setUnitType(unitType);
                    fillNonTrivialDefaultValues(unitData, gameConfig);
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
        const maxValue      = getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxHp());
        const defaultValue  = maxValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Hp),
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
        const maxValue      = getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxFuel());
        const defaultValue  = maxValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Fuel),
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
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Promotion),
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
        const maxValue      = getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getPrimaryWeaponMaxAmmo());
        const defaultValue  = maxValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.PrimaryWeaponAmmo),
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
        const maxValue      = getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getFlareMaxAmmo());
        const defaultValue  = maxValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.FlareAmmo),
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
        const maxValue      = getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxBuildMaterial());
        const defaultValue  = maxValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.BuildMaterial),
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
        const maxValue      = getExisted(openData.war.getGcData().getUnitTemplateCfg(unitData.getUnitType())?.getMaxProduceMaterial());
        const defaultValue  = maxValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.ProductionMaterial),
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
        this._unitView.updateOnAnimationTick(getUnitAnimationTickCount());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? UndefinedError);
        this._btnConfirm.setLangText(TextType.B0026);

        this._btnAiMode.setLangText(TextType.AiMode);
        this._btnUnitTag.setLangText(TextType.Tags);
        this._btnIsDiving.setLangText(TextType.B0371);
        this._btnHasLoadedCo.setLangText(TextType.CoOnboard);
        this._btnHp.setLangText(TextType.Hp);
        this._btnFuel.setLangText(TextType.Fuel);
        this._btnPromotion.setLangText(TextType.Promotion);
        this._btnPrimaryAmmo.setLangText(TextType.PrimaryWeaponAmmo);
        this._btnFlareAmmo.setLangText(TextType.FlareAmmo);
        this._btnBuildMaterial.setLangText(TextType.BuildMaterial);
        this._btnProduceMaterial.setLangText(TextType.ProductionMaterial);
        this._btnActionState.setLangText(TextType.ActionState);
        this._btnAiDestination.setLangText(TextType.AiDestination);
        this._btnUnitType.setLangText(TextType.B0525);
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
        label.setText(errorTips || getText(TextType.B0493));
        label.setTextColor(errorTips ? ColorValue.Red : ColorValue.Green);
    }
    private _updateComponentsForAiMode(): void {
        this._labelAiMode.setText(getUnitAiModeName(this._getUnitData().getAiMode() ?? AiModeId.Normal) ?? UndefinedError);
    }
    private _updateComponentsForUnitTag(): void {
        const tagIdArray        = getTagIdList(this._getUnitData().getGroupedTagId() ?? 0, true);
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
            this._labelIsDiving.setText(getTextForYesOrNo(unitData.getIsDiving()));
        }
    }
    private _updateComponentsForIsCoOnboard(): void {
        this._labelHasLoadedCo.setText(getTextForYesOrNo(this._getUnitData().getIsCoOnboard()));
    }
    private _updateComponentsForActionState(): void {
        const label = this._labelActionState;
        const state = this._getUnitData().getActionState();
        label.setText(state == null
            ? (getUnitActionStateText(ActionStateId.Idle) ?? UndefinedError)
            : (getUnitActionStateText(state) ?? UndefinedError)
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
        this._unitView.update(new UiUnitViewData({
            gameConfig          : war.getGcData(),
            skinId              : war.getPlayer(playerIndex).getUnitAndTileSkinId(),
            overridingSkinId    : getRawOverridingSkinId(war, playerIndex),
            unitData            : unitData,
        }));
    }

    private _getUnitData(): SerialUnit {
        return getExisted(this._unitData);
    }
}

function getErrorTipsForAddUnit({ unitData, war }: {
    unitData    : SerialUnit;
    war         : IBwWar;
}): string | null {
    const gameConfig    = war.getGcData();
    const unitCfg       = gameConfig.getUnitTemplateCfg(unitData.getUnitType());
    if (unitCfg == null) {
        return getFormattedText(TextType.F0064, getText(TextType.B0525));
    }

    if (unitData.getGridIndex() != null) {
        return getFormattedText(TextType.F0064, getText(TextType.B0531));
    }

    {
        const playerIndex = unitData.getPlayerIndex();
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
