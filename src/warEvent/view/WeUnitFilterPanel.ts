import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocationsConstants from "../../locations/Constants.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as ProtoSchemaCommonProtoStructureUnitFilter from "../../proto/schema/CommonProto/Structure/UnitFilter.ts";
import * as ProtoSchemaCommonProtoStructureValueAndComparator from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TeamsConstants from "../../teams/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as UnitBuffsConstants from "../../unitBuffs/Constants.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UnitsUtilsFilter from "../../units/utils/Filter.ts";
import * as ValueAndComparatorsConstants from "../../valueAndComparators/Constants.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as ValueSetAndRelationsConstants from "../../valueSetAndRelations/Constants.ts";

export interface OpenData {
    gameConfig              : GameConfigGcData.GcData;
    playersCountUnneutral   : number;
    mapSize                 : AuxiliaryTypesMapSize.MapSize;
    currentFilter           : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureUnitFilter.UnitFilter>;
    callback                : ((unitFilter: ProtoSchemaCommonProtoStructureUnitFilter.UnitFilter | null) => void) | null;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClear!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                 : UiInterfacesIUiButton.IUiButton;

    private readonly _scrDesc!                                  : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupDesc!                                : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConPlayerIndexArray!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConPlayerIndexArray!                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConPlayerIndexPredicate!               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConPlayerIndexPredicate!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConTeamIndexArray!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTeamIndexArray!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConTeamIndexPredicate!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTeamIndexPredicate!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConUnitTypeArray!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConUnitTypeArray!                    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConUnitTypePredicate!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConUnitTypePredicate!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConActionStateArray!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConActionStateArray!                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConActionStatePredicate!               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConActionStatePredicate!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConIsCoOnboard!                        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConIsCoOnboard!                      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConHp!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConHp!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConFuel!                               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConFuel!                             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConPriAmmo!                            : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConPriAmmo!                          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConPromotion!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConPromotion!                        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConIsOwnerPlayerInTurn!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConIsOwnerPlayerInTurn!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConIsDiving!                           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConIsDiving!                         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConTagIdArray!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTagIdArray!                       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConTagIdPredicate!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTagIdPredicate!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConLoadedUnitsCount!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConLoadedUnitsCount!                 : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConIsLoaded!                           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConIsLoaded!                         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConFlareAmmo!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConFlareAmmo!                        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConBuildMaterial!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConBuildMaterial!                    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConProduceMaterial!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConProduceMaterial!                  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConCustomNameId!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConCustomNameId!                     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConForbiddenLocationIdArray!           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConForbiddenLocationIdArray!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConForbiddenLocationIdPredicate!       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConForbiddenLocationIdPredicate!     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConAiModeArray!                        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConAiModeArray!                      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConAiModePredicate!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConAiModePredicate!                  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConGridIndexArray!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConGridIndexArray!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConGridIndexPredicate!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConGridIndexPredicate!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConLocationIdArray!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConLocationIdArray!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConLocationIdPredicate!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConLocationIdPredicate!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConBuffTypeIdArray!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConBuffTypeIdArray!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConBuffTypeIdPredicate!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConBuffTypeIdPredicate!              : UiInterfacesIUiLabel.IUiLabel;

    private _unitFilter = new ProtoSchemaCommonProtoStructureUnitFilter.UnitFilter();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                               callback: this._onTouchedBtnClose },
            { ui: this._btnClear,                               callback: this._onTouchedBtnClear },

            { ui: this._btnConPlayerIndexArray,                 callback: this._onTouchedBtnConPlayerIndexArray },
            { ui: this._btnConPlayerIndexPredicate,             callback: this._onTouchedBtnConPlayerIndexPredicate },

            { ui: this._btnConTeamIndexArray,                   callback: this._onTouchedBtnConTeamIndexArray },
            { ui: this._btnConTeamIndexPredicate,               callback: this._onTouchedBtnConTeamIndexPredicate },

            { ui: this._btnConUnitTypeArray,                    callback: this._onTouchedBtnConUnitTypeArray },
            { ui: this._btnConUnitTypePredicate,                callback: this._onTouchedBtnConUnitTypePredicate },

            { ui: this._btnConActionStateArray,                 callback: this._onTouchedBtnConActionStateArray },
            { ui: this._btnConActionStatePredicate,             callback: this._onTouchedBtnConActionStatePredicate },

            { ui: this._btnConIsCoOnboard,                      callback: this._onTouchedBtnConIsCoOnboard },

            { ui: this._btnConHp,                               callback: this._onTouchedBtnConHp },

            { ui: this._btnConFuel,                             callback: this._onTouchedBtnConFuel },

            { ui: this._btnConPriAmmo,                          callback: this._onTouchedBtnConPriAmmo },

            { ui: this._btnConPromotion,                        callback: this._onTouchedBtnConPromotion },

            { ui: this._btnConIsOwnerPlayerInTurn,              callback: this._onTouchedBtnConIsOwnerPlayerInTurn },

            { ui: this._btnConIsDiving,                         callback: this._onTouchedBtnConIsDiving },

            { ui: this._btnConTagIdArray,                       callback: this._onTouchedBtnConTagIdArray },
            { ui: this._btnConTagIdPredicate,                   callback: this._onTouchedBtnConTagIdPredicate },

            { ui: this._btnConLoadedUnitsCount,                 callback: this._onTouchedBtnConLoadedUnitsCount },

            { ui: this._btnConIsLoaded,                         callback: this._onTouchedBtnConIsLoaded },

            { ui: this._btnConFlareAmmo,                        callback: this._onTouchedBtnConFlareAmmo },

            { ui: this._btnConBuildMaterial,                    callback: this._onTouchedBtnConBuildMaterial },

            { ui: this._btnConProduceMaterial,                  callback: this._onTouchedBtnConProduceMaterial },

            { ui: this._btnConCustomNameId,                     callback: this._onTouchedBtnConCustomNameId },

            { ui: this._btnConForbiddenLocationIdArray,         callback: this._onTouchedBtnConForbiddenLocationIdArray },
            { ui: this._btnConForbiddenLocationIdPredicate,     callback: this._onTouchedBtnConForbiddenLocationIdPredicate },

            { ui: this._btnConAiModeArray,                      callback: this._onTouchedBtnConAiModeArray },
            { ui: this._btnConAiModePredicate,                  callback: this._onTouchedBtnConAiModePredicate },

            { ui: this._btnConGridIndexArray,                   callback: this._onTouchedBtnConGridIndexArray },
            { ui: this._btnConGridIndexPredicate,               callback: this._onTouchedBtnConGridIndexPredicate },

            { ui: this._btnConLocationIdArray,                  callback: this._onTouchedBtnConLocationIdArray },
            { ui: this._btnConLocationIdPredicate,              callback: this._onTouchedBtnConLocationIdPredicate },

            { ui: this._btnConBuffTypeIdArray,                  callback: this._onTouchedBtnConBuffTypeIdArray },
            { ui: this._btnConBuffTypeIdPredicate,              callback: this._onTouchedBtnConBuffTypeIdPredicate },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._unitFilter = this.getOpenData()?.currentFilter?.clone() ?? new ProtoSchemaCommonProtoStructureUnitFilter.UnitFilter();

        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyWarEventFullDataChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnClose(): void {
        const callback = this.getOpenData()?.callback;
        if (callback == null) {
            this.closePanel();
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent             : () => LangUtils.getText(LangConstants.TextType.A0418),
                getTextForConfirm      : () => LangUtils.getText(LangConstants.TextType.Yes),
                getTextForCancel       : () => LangUtils.getText(LangConstants.TextType.No),
                callback            : () => {
                    const unitFilter = this._getUnitFilter();
                    callback(UnitsUtilsFilter.checkIsEmpty(unitFilter) ? null : unitFilter);
                    this.closePanel();
                },
                callbackOnCancel    : () => this.closePanel(),
                showButtonClose     : true,
            });
        }
    }
    private _onTouchedBtnClear(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                this._unitFilter = new ProtoSchemaCommonProtoStructureUnitFilter.UnitFilter();
                this._updateView();
            }
        });
    }

    private _onTouchedBtnConPlayerIndexArray(): void {
        const playersCountUnneutral = this.getOpenData()?.playersCountUnneutral;
        if (playersCountUnneutral == null) {
            return;
        }

        const filter = this._getUnitFilter();
        const oldCon = filter.getConPlayerIndex();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : oldCon?.getValueArray() ?? [],
            availableNumberArray    : HelpersCollection.createRange(PlayersConstants.PlayerIndex.Neutral, playersCountUnneutral + 1, 1),
            getTitleText            : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B0031)),
            getNumberMainText       : num => `P${num}`,
            callbackOnConfirm       : valueArray => {
                if (!valueArray.length) {
                    filter.setConPlayerIndex(null);
                } else {
                    const con = filter.createIfNotExistsConPlayerIndex();
                    con.setValueArray(valueArray);
                    con.setIsOneOf(!!con.getIsOneOf());
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConPlayerIndexPredicate(): void {
        const con = this._getUnitFilter().createIfNotExistsConPlayerIndex();
        con.setIsOneOf(!con.getIsOneOf());
        this._updateView();
    }

    private _onTouchedBtnConTeamIndexArray(): void {
        const playersCountUnneutral = this.getOpenData()?.playersCountUnneutral;
        if (playersCountUnneutral == null) {
            return;
        }

        const filter = this._getUnitFilter();
        const oldCon = filter.getConTeamIndex();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : oldCon?.getValueArray() ?? [],
            availableNumberArray    : HelpersCollection.createRange(TeamsConstants.TeamIndex.Neutral, playersCountUnneutral + 1, 1),
            getTitleText            : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B0019)),
            getNumberMainText       : num => LangUtils.getPlayerTeamName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : valueArray => {
                if (!valueArray.length) {
                    filter.setConTeamIndex(null);
                } else {
                    const con = filter.createIfNotExistsConTeamIndex();
                    con.setValueArray(valueArray);
                    con.setIsOneOf(!!con.getIsOneOf());
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConTeamIndexPredicate(): void {
        const con = this._getUnitFilter().createIfNotExistsConTeamIndex();
        con.setIsOneOf(!con.getIsOneOf());
        this._updateView();
    }

    private _onTouchedBtnConUnitTypeArray(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const filter = this._getUnitFilter();
        const oldCon = filter.getConUnitType();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
            gameConfig              : gameConfig,
            currentUnitTypeArray    : oldCon?.getValueArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            callbackOnConfirm       : unitTypeArray => {
                if (!unitTypeArray.length) {
                    filter.setConUnitType(null);
                } else {
                    const con = filter.createIfNotExistsConUnitType();
                    con.setValueArray(unitTypeArray);
                    con.setIsOneOf(!!con.getIsOneOf());
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConUnitTypePredicate(): void {
        const con = this._getUnitFilter().createIfNotExistsConUnitType();
        con.setIsOneOf(!con.getIsOneOf());
        this._updateView();
    }

    private _onTouchedBtnConActionStateArray(): void {
        const filter = this._getUnitFilter();
        const oldCon = filter.getConActionState();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : oldCon?.getValueArray() ?? [],
            availableNumberArray    : UnitsConstants.AllActionStateIdArray,
            getTitleText            : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B0525)),
            getNumberMainText       : num => LangUtils.getUnitActionStateText(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : valueArray => {
                if (!valueArray.length) {
                    filter.setConActionState(null);
                } else {
                    const con = filter.createIfNotExistsConActionState();
                    con.setValueArray(valueArray);
                    con.setIsOneOf(!!con.getIsOneOf());
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConActionStatePredicate(): void {
        const con = this._getUnitFilter().createIfNotExistsConActionState();
        con.setIsOneOf(!con.getIsOneOf());
        this._updateView();
    }

    private _onTouchedBtnConIsCoOnboard(): void {
        const filter    = this._getUnitFilter();
        const con       = filter.getConIsCoOnboard();
        if (con) {
            filter.setConIsCoOnboard(false);
        } else if (con == false) {
            filter.setConIsCoOnboard(null);
        } else {
            filter.setConIsCoOnboard(true);
        }
        this._updateView();
    }

    private _onTouchedBtnConHp(): void {
        const filter = this._getUnitFilter();
        const oldCon = filter.getConHp();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0807),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.B0807),
                minValue        : 0,
                maxValue        : 100,
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConHp(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConHp(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                                value       : value,
                                comparator  : sign,
                            }));
                        }
                    }

                    this._updateView();
                },
            }),
        });
    }

    private _onTouchedBtnConFuel(): void {
        const filter = this._getUnitFilter();
        const oldCon = filter.getConFuel();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.Fuel),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.Fuel),
                minValue        : 0,
                maxValue        : 100,
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConFuel(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConFuel(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                                value       : value,
                                comparator  : sign,
                            }));
                        }
                    }

                    this._updateView();
                },
            }),
        });
    }

    private _onTouchedBtnConPriAmmo(): void {
        const filter = this._getUnitFilter();
        const oldCon = filter.getConPriAmmo();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.PrimaryWeaponAmmo),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.PrimaryWeaponAmmo),
                minValue        : 0,
                maxValue        : 100,
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConPriAmmo(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConPriAmmo(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                                value       : value,
                                comparator  : sign,
                            }));
                        }
                    }

                    this._updateView();
                },
            }),
        });
    }

    private _onTouchedBtnConPromotion(): void {
        const filter = this._getUnitFilter();
        const oldCon = filter.getConPromotion();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.Promotion),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.Promotion),
                minValue        : 0,
                maxValue        : 100,
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConPromotion(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConPromotion(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                                value       : value,
                                comparator  : sign,
                            }));
                        }
                    }

                    this._updateView();
                },
            }),
        });
    }

    private _onTouchedBtnConIsOwnerPlayerInTurn(): void {
        const filter    = this._getUnitFilter();
        const con       = filter.getConIsOwnerPlayerInTurn();
        if (con == null) {
            filter.setConIsOwnerPlayerInTurn(true);
        } else if (con) {
            filter.setConIsOwnerPlayerInTurn(false);
        } else {
            filter.setConIsOwnerPlayerInTurn(null);
        }
        this._updateView();
    }

    private _onTouchedBtnConIsDiving(): void {
        const filter    = this._getUnitFilter();
        const con       = filter.getConIsDiving();
        if (con == null) {
            filter.setConIsDiving(true);
        } else if (con) {
            filter.setConIsDiving(false);
        } else {
            filter.setConIsDiving(null);
        }
        this._updateView();
    }

    private _onTouchedBtnConTagIdArray(): void {
        const filter = this._getUnitFilter();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : filter.getConTagId()?.getValueArray() ?? [],
            availableIntegerArray   : UnitsConstants.AllTagIdArray,
            getTitleText            : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.Tags)),
            callbackOnConfirm       : valueArray => {
                if (!valueArray.length) {
                    filter.setConTagId(null);
                } else {
                    const con = filter.createIfNotExistsConTagId();
                    con.setValueArray(valueArray);
                    if (con.getSetRelation() == null) {
                        con.setSetRelation(ValueSetAndRelationsConstants.SetRelationId.EqualTo);
                    }
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConTagIdPredicate(): void {
        const filter = this._getUnitFilter();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.Tags),
            availableNumberArray    : ValueSetAndRelationsConstants.AllSetRelationIdArray,
            currentNumber           : filter.getConTagId()?.getSetRelation(),
            getNumberMainText       : num => LangUtils.getSetRelationName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : setRelation => {
                filter.createIfNotExistsConTagId().setSetRelation(setRelation);
                this._updateView();
            },
        });
    }

    private _onTouchedBtnConLoadedUnitsCount(): void {
        const filter = this._getUnitFilter();
        const oldCon = filter.getConLoadedUnitsCount();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0698),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.B0698),
                minValue        : 0,
                maxValue        : 100,
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConLoadedUnitsCount(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConLoadedUnitsCount(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                                value       : value,
                                comparator  : sign,
                            }));
                        }
                    }

                    this._updateView();
                },
            }),
        });
    }

    private _onTouchedBtnConIsLoaded(): void {
        const filter    = this._getUnitFilter();
        const con       = filter.getConIsLoaded();
        if (con == null) {
            filter.setConIsLoaded(true);
        } else if (con) {
            filter.setConIsLoaded(false);
        } else {
            filter.setConIsLoaded(null);
        }
        this._updateView();
    }

    private _onTouchedBtnConFlareAmmo(): void {
        const filter = this._getUnitFilter();
        const oldCon = filter.getConFlareAmmo();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.FlareAmmo),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.FlareAmmo),
                minValue        : 0,
                maxValue        : 100,
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConFlareAmmo(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConFlareAmmo(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                                value       : value,
                                comparator  : sign,
                            }));
                        }
                    }

                    this._updateView();
                },
            }),
        });
    }

    private _onTouchedBtnConBuildMaterial(): void {
        const filter = this._getUnitFilter();
        const oldCon = filter.getConBuildMaterial();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.BuildMaterial),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.BuildMaterial),
                minValue        : 0,
                maxValue        : 100,
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConBuildMaterial(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConBuildMaterial(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                                value       : value,
                                comparator  : sign,
                            }));
                        }
                    }

                    this._updateView();
                },
            }),
        });
    }

    private _onTouchedBtnConProduceMaterial(): void {
        const filter = this._getUnitFilter();
        const oldCon = filter.getConProduceMaterial();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.ProductionMaterial),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.ProductionMaterial),
                minValue        : 0,
                maxValue        : 100,
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConProduceMaterial(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConProduceMaterial(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                                value       : value,
                                comparator  : sign,
                            }));
                        }
                    }

                    this._updateView();
                },
            }),
        });
    }

    private _onTouchedBtnConCustomNameId(): void {
        const filter = this._getUnitFilter();
        const oldCon = filter.getConCustomNameId();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.CustomNameId),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.CustomNameId),
                minValue        : UnitsConstants.CustomName.MinId,
                maxValue        : UnitsConstants.CustomName.MaxId,
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConCustomNameId(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConCustomNameId(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                                value       : value,
                                comparator  : sign,
                            }));
                        }
                    }

                    this._updateView();
                },
            }),
        });
    }

    private _onTouchedBtnConForbiddenLocationIdArray(): void {
        const filter = this._getUnitFilter();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : filter.getConForbiddenLocationId()?.getValueArray() ?? [],
            availableIntegerArray   : LocationsConstants.AllLocationIdArray,
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.NoEntryLocations),
            callbackOnConfirm       : valueArray => {
                if (!valueArray.length) {
                    filter.setConForbiddenLocationId(null);
                } else {
                    const con = filter.createIfNotExistsConForbiddenLocationId();
                    con.setValueArray(valueArray);
                    con.setSetRelation(con.getSetRelation() ?? ValueSetAndRelationsConstants.SetRelationId.EqualTo);
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConForbiddenLocationIdPredicate(): void {
        const filter = this._getUnitFilter();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.NoEntryLocations),
            availableNumberArray    : ValueSetAndRelationsConstants.AllSetRelationIdArray,
            currentNumber           : filter.getConForbiddenLocationId()?.getSetRelation(),
            getNumberMainText       : num => LangUtils.getSetRelationName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : setRelation => {
                filter.createIfNotExistsConForbiddenLocationId().setSetRelation(setRelation);
                this._updateView();
            },
        });
    }

    private _onTouchedBtnConAiModeArray(): void {
        const filter = this._getUnitFilter();
        const oldCon = filter.getConAiMode();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : oldCon == null ? [] : (oldCon.getValueArray() ?? []),
            availableNumberArray    : UnitsConstants.AllAiModeIdArray,
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.AiMode),
            getNumberMainText       : num => LangUtils.getUnitAiModeName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : valueArray => {
                if (!valueArray.length) {
                    filter.setConAiMode(null);
                } else {
                    const con = filter.createIfNotExistsConAiMode();
                    con.setValueArray(valueArray);
                    con.setIsOneOf(con.getIsOneOf() ?? true);
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConAiModePredicate(): void {
        const con = this._getUnitFilter().createIfNotExistsConAiMode();
        con.setIsOneOf(!con.getIsOneOf());
        this._updateView();
    }

    private _onTouchedBtnConGridIndexArray(): void {
        const mapSize = this.getOpenData()?.mapSize;
        if (mapSize == null) {
            return;
        }

        const filter = this._getUnitFilter();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseGridIndexPanel, {
            currentGridIndexArray   : HelpersCollection.getNonNullElements(filter.getConGridIndex()?.getGridIndexArray()?.map(v => AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v)) ?? []),
            mapSize                 : mapSize,
            callbackOnConfirm       : valueArray => {
                if (!valueArray.length) {
                    filter.setConGridIndex(null);
                } else {
                    const con = filter.createIfNotExistsConGridIndex();
                    con.setGridIndexArray(valueArray.map(v => v.toProto()));
                    con.setIsOneOf(con.getIsOneOf() ?? true);
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConGridIndexPredicate(): void {
        const con = this._getUnitFilter().createIfNotExistsConGridIndex();
        con.setIsOneOf(!con.getIsOneOf());
        this._updateView();
    }

    private _onTouchedBtnConLocationIdArray(): void {
        const filter = this._getUnitFilter();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : filter.getConLocationId()?.getValueArray() ?? [],
            availableIntegerArray   : LocationsConstants.AllLocationIdArray,
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.Location),
            callbackOnConfirm       : valueArray => {
                if (!valueArray.length) {
                    filter.setConLocationId(null);
                } else {
                    const con = filter.createIfNotExistsConLocationId();
                    con.setValueArray(valueArray);
                    con.setSetRelation(con.getSetRelation() ?? ValueSetAndRelationsConstants.SetRelationId.EqualTo);
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConLocationIdPredicate(): void {
        const filter = this._getUnitFilter();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.Location),
            availableNumberArray    : ValueSetAndRelationsConstants.AllSetRelationIdArray,
            currentNumber           : filter.getConLocationId()?.getSetRelation(),
            getNumberMainText       : num => LangUtils.getSetRelationName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : setRelation => {
                filter.createIfNotExistsConLocationId().setSetRelation(setRelation);
                this._updateView();
            },
        });
    }

    private _onTouchedBtnConBuffTypeIdArray(): void {
        const filter = this._getUnitFilter();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : filter.getConBuffTypeId()?.getValueArray() ?? [],
            availableNumberArray    : UnitBuffsConstants.AllBuffTypeIdArray,
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId),
            getNumberMainText       : v => LangUtils.getUnitBuffName(v) ?? LangConstants.UndefinedError,
            showNumber              : true,
            callbackOnConfirm       : valueArray => {
                if (!valueArray.length) {
                    filter.setConBuffTypeId(null);
                } else {
                    const con = filter.createIfNotExistsConBuffTypeId();
                    con.setValueArray(valueArray);
                    con.setSetRelation(con.getSetRelation() ?? ValueSetAndRelationsConstants.SetRelationId.EqualTo);
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConBuffTypeIdPredicate(): void {
        const filter = this._getUnitFilter();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId),
            availableNumberArray    : ValueSetAndRelationsConstants.AllSetRelationIdArray,
            currentNumber           : filter.getConBuffTypeId()?.getSetRelation(),
            getNumberMainText       : num => LangUtils.getSetRelationName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : setRelation => {
                filter.createIfNotExistsConBuffTypeId().setSetRelation(setRelation);
                this._updateView();
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // view functions
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.UnitFilter);
        this._btnClear.setLangText(LangConstants.TextType.B0391);

        this._btnConPlayerIndexArray.setLangText(LangConstants.TextType.PlayerIndex);
        this._btnConTeamIndexArray.setLangText(LangConstants.TextType.B0019);
        this._btnConUnitTypeArray.setLangText(LangConstants.TextType.B0525);
        this._btnConActionStateArray.setLangText(LangConstants.TextType.ActionState);
        this._btnConIsCoOnboard.setLangText(LangConstants.TextType.CoOnboard);
        this._btnConHp.setLangText(LangConstants.TextType.B0934);
        this._btnConFuel.setLangText(LangConstants.TextType.Fuel);
        this._btnConPriAmmo.setLangText(LangConstants.TextType.PrimaryWeaponAmmo);
        this._btnConPromotion.setLangText(LangConstants.TextType.Promotion);
        this._btnConIsOwnerPlayerInTurn.setLangText(LangConstants.TextType.B0086);
        this._btnConIsDiving.setLangText(LangConstants.TextType.B0371);
        this._btnConTagIdArray.setLangText(LangConstants.TextType.Tags);
        this._btnConLoadedUnitsCount.setLangText(LangConstants.TextType.B0698);
        this._btnConIsLoaded.setLangText(LangConstants.TextType.B1056);
        this._btnConFlareAmmo.setLangText(LangConstants.TextType.FlareAmmo);
        this._btnConBuildMaterial.setLangText(LangConstants.TextType.BuildMaterial);
        this._btnConProduceMaterial.setLangText(LangConstants.TextType.ProductionMaterial);
        this._btnConCustomNameId.setLangText(LangConstants.TextType.CustomNameId);
        this._btnConForbiddenLocationIdArray.setLangText(LangConstants.TextType.NoEntryLocations);
        this._btnConAiModeArray.setLangText(LangConstants.TextType.AiMode);
        this._btnConGridIndexArray.setLangText(LangConstants.TextType.B0531);
        this._btnConLocationIdArray.setLangText(LangConstants.TextType.Location);
        this._btnConBuffTypeIdArray.setLangText(LangConstants.TextType.AbnormalStateTypeId);

        this._btnConPlayerIndexPredicate.setLangText(LangConstants.TextType.B1403);
        this._btnConTeamIndexPredicate.setLangText(LangConstants.TextType.B1403);
        this._btnConUnitTypePredicate.setLangText(LangConstants.TextType.B1403);
        this._btnConActionStatePredicate.setLangText(LangConstants.TextType.B1403);
        this._btnConTagIdPredicate.setLangText(LangConstants.TextType.B1417);
        this._btnConForbiddenLocationIdPredicate.setLangText(LangConstants.TextType.B1417);
        this._btnConAiModePredicate.setLangText(LangConstants.TextType.B1403);
        this._btnConGridIndexPredicate.setLangText(LangConstants.TextType.B1403);
        this._btnConLocationIdPredicate.setLangText(LangConstants.TextType.B1417);
        this._btnConBuffTypeIdPredicate.setLangText(LangConstants.TextType.B1417);

        this._updateLabelDescAndLabelError();

        this._updateLabelsForConPlayerIndex();
        this._updateLabelsForConTeamIndex();
        this._updateLabelsForConUnitType();
        this._updateLabelsForConActionState();
        this._updateLabelsForConIsCoOnboard();
        this._updateLabelsForConHp();
        this._updateLabelsForConFuel();
        this._updateLabelsForConPriAmmo();
        this._updateLabelsForConPromotion();
        this._updateLabelsForConIsOwnerPlayerInTurn();
        this._updateLabelsForConIsDiving();
        this._updateLabelsForConTagId();
        this._updateLabelsForConLoadedUnitsCount();
        this._updateLabelsForConIsLoaded();
        this._updateLabelsForConFlareAmmo();
        this._updateLabelsForConBuildMaterial();
        this._updateLabelsForConProduceMaterial();
        this._updateLabelsForConCustomNameId();
        this._updateLabelsForConForbiddenLocationIdArray();
        this._updateLabelsForConAiMode();
        this._updateLabelsForConGridIndex();
        this._updateLabelsForConLocationId();
        this._updateLabelsForConBuffTypeId();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitFilter        = this._getUnitFilter();
        const gameConfig        = openData.gameConfig;
        const errorTip          = UnitsUtilsFilter.getErrorTip(unitFilter, openData.playersCountUnneutral, openData.mapSize, gameConfig);
        const labelError        = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(UnitsUtilsFilter.getDesc(unitFilter, gameConfig));
        this._groupDesc.arrangeItems();
        this._scrDesc.updateOnItemsChanged();
    }
    private _updateLabelsForConPlayerIndex(): void {
        const con           = this._getUnitFilter().getConPlayerIndex();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConPlayerIndexArray.setText(valueArray?.map(v => `P${v}`).join(`, `) ?? ``);
        this._labelConPlayerIndexPredicate.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConTeamIndex(): void {
        const con           = this._getUnitFilter().getConTeamIndex();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConTeamIndexArray.setText(valueArray?.map(v => LangUtils.getPlayerTeamName(v)).join(`, `) ?? ``);
        this._labelConTeamIndexPredicate.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConUnitType(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const con           = this._getUnitFilter().getConUnitType();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConUnitTypeArray.setText(valueArray?.map(v => LangUtils.getUnitName(v, gameConfig)).join(`, `) ?? ``);
        this._labelConUnitTypePredicate.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConActionState(): void {
        const con           = this._getUnitFilter().getConActionState();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConActionStateArray.setText(valueArray?.map(v => LangUtils.getUnitActionStateText(v)).join(`, `) ?? ``);
        this._labelConActionStatePredicate.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConIsCoOnboard(): void {
        const con = this._getUnitFilter().getConIsCoOnboard();
        this._labelConIsCoOnboard.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con));
    }
    private _updateLabelsForConHp(): void {
        const con = this._getUnitFilter().getConHp();
        this._labelConHp.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }
    private _updateLabelsForConFuel(): void {
        const con = this._getUnitFilter().getConFuel();
        this._labelConFuel.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }
    private _updateLabelsForConPriAmmo(): void {
        const con = this._getUnitFilter().getConPriAmmo();
        this._labelConPriAmmo.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }
    private _updateLabelsForConPromotion(): void {
        const con = this._getUnitFilter().getConPromotion();
        this._labelConPromotion.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }
    private _updateLabelsForConIsOwnerPlayerInTurn(): void {
        const con = this._getUnitFilter().getConIsOwnerPlayerInTurn();
        this._labelConIsOwnerPlayerInTurn.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con));
    }
    private _updateLabelsForConIsDiving(): void {
        const con = this._getUnitFilter().getConIsDiving();
        this._labelConIsDiving.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con));
    }
    private _updateLabelsForConTagId(): void {
        const con = this._getUnitFilter().getConTagId();
        this._labelConTagIdArray.setText(con?.getValueArray().join(`, `) ?? ``);
        this._labelConTagIdPredicate.setText(con == null ? `` : LangUtils.getSetRelationName(con.getSetRelation()));
    }
    private _updateLabelsForConLoadedUnitsCount(): void {
        const con = this._getUnitFilter().getConLoadedUnitsCount();
        this._labelConLoadedUnitsCount.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }
    private _updateLabelsForConIsLoaded(): void {
        const con = this._getUnitFilter().getConIsLoaded();
        this._labelConIsLoaded.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con));
    }
    private _updateLabelsForConFlareAmmo(): void {
        const con = this._getUnitFilter().getConFlareAmmo();
        this._labelConFlareAmmo.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }
    private _updateLabelsForConBuildMaterial(): void {
        const con = this._getUnitFilter().getConBuildMaterial();
        this._labelConBuildMaterial.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }
    private _updateLabelsForConProduceMaterial(): void {
        const con = this._getUnitFilter().getConProduceMaterial();
        this._labelConProduceMaterial.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }
    private _updateLabelsForConCustomNameId(): void {
        const con = this._getUnitFilter().getConCustomNameId();
        this._labelConCustomNameId.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }
    private _updateLabelsForConForbiddenLocationIdArray(): void {
        const con = this._getUnitFilter().getConForbiddenLocationId();
        this._labelConForbiddenLocationIdArray.setText(con?.getValueArray().join(`, `) ?? ``);
        this._labelConForbiddenLocationIdPredicate.setText(con == null ? `` : LangUtils.getSetRelationName(con.getSetRelation()));
    }
    private _updateLabelsForConAiMode(): void {
        const con           = this._getUnitFilter().getConAiMode();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConAiModeArray.setText(valueArray?.map(v => LangUtils.getUnitAiModeName(v)).join(`, `) ?? ``);
        this._labelConAiModePredicate.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConGridIndex() {
        const con = this._getUnitFilter().getConGridIndex();
        this._labelConGridIndexArray.setText(con?.getGridIndexArray().map(v => `(${v.getX()},${v.getY()})`).join(`, `) ?? ``);
        this._labelConGridIndexPredicate.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConLocationId() {
        const con = this._getUnitFilter().getConLocationId();
        this._labelConLocationIdArray.setText(con?.getValueArray().join(`, `) ?? ``);
        this._labelConLocationIdPredicate.setText(con == null ? `` : LangUtils.getSetRelationName(con.getSetRelation()));
    }
    private _updateLabelsForConBuffTypeId() {
        const con = this._getUnitFilter().getConBuffTypeId();
        this._labelConBuffTypeIdArray.setText(con?.getValueArray().map(v => LangUtils.getUnitBuffName(v))?.join(`, `) ?? ``);
        this._labelConBuffTypeIdPredicate.setText(con == null ? `` : LangUtils.getSetRelationName(con.getSetRelation()));
    }

    private _getUnitFilter(): ProtoSchemaCommonProtoStructureUnitFilter.UnitFilter {
        return this._unitFilter;
    }
}
