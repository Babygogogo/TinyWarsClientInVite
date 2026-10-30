import {
    Units_Constants,
    UnitBuffs_Constants,
    ValueAndComparators_Constants,
    Locations_Constants,
    ValueSetAndRelations_Constants,
    Units_Utils_Filter,
    Graphics_Constants,
    Helpers_Collection,
    ValueAndComparators_Utils,
    Lang_Utils,
    GamePanels_Dict,
    AuxiliaryTypes_GridIndex,
    GamePanels_Manager,
    Players_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Teams_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScroller,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { UnitFilter } from "../../proto/schema/CommonProto/Structure/UnitFilter.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";

export interface OpenData {
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    playersCountUnneutral   : number;
    mapSize                 : AuxiliaryTypes_MapSize.MapSize;
    currentFilter           : AuxiliaryTypes_AuxiliaryTypes.Undefinable<UnitFilter>;
    callback                : ((unitFilter: UnitFilter | null) => void) | null;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClear!                                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _scrDesc!                                  : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _groupDesc!                                : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConPlayerIndexArray!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConPlayerIndexArray!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConPlayerIndexPredicate!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConPlayerIndexPredicate!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConTeamIndexArray!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTeamIndexArray!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConTeamIndexPredicate!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTeamIndexPredicate!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConUnitTypeArray!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConUnitTypeArray!                    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConUnitTypePredicate!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConUnitTypePredicate!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConActionStateArray!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConActionStateArray!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConActionStatePredicate!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConActionStatePredicate!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConIsCoOnboard!                        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConIsCoOnboard!                      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConHp!                                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConHp!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConFuel!                               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConFuel!                             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConPriAmmo!                            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConPriAmmo!                          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConPromotion!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConPromotion!                        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConIsOwnerPlayerInTurn!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConIsOwnerPlayerInTurn!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConIsDiving!                           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConIsDiving!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConTagIdArray!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTagIdArray!                       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConTagIdPredicate!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTagIdPredicate!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConLoadedUnitsCount!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConLoadedUnitsCount!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConIsLoaded!                           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConIsLoaded!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConFlareAmmo!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConFlareAmmo!                        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConBuildMaterial!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConBuildMaterial!                    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConProduceMaterial!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConProduceMaterial!                  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConCustomNameId!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConCustomNameId!                     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConForbiddenLocationIdArray!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConForbiddenLocationIdArray!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConForbiddenLocationIdPredicate!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConForbiddenLocationIdPredicate!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConAiModeArray!                        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConAiModeArray!                      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConAiModePredicate!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConAiModePredicate!                  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConGridIndexArray!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConGridIndexArray!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConGridIndexPredicate!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConGridIndexPredicate!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConLocationIdArray!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConLocationIdArray!                  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConLocationIdPredicate!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConLocationIdPredicate!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConBuffTypeIdArray!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConBuffTypeIdArray!                  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConBuffTypeIdPredicate!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConBuffTypeIdPredicate!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private _unitFilter = new UnitFilter();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                 callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.WarEventFullDataChanged,         callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                               callback : this._onTouchedBtnClose },
            { ui : this._btnClear,                               callback : this._onTouchedBtnClear },

            { ui : this._btnConPlayerIndexArray,                 callback : this._onTouchedBtnConPlayerIndexArray },
            { ui : this._btnConPlayerIndexPredicate,             callback : this._onTouchedBtnConPlayerIndexPredicate },

            { ui : this._btnConTeamIndexArray,                   callback : this._onTouchedBtnConTeamIndexArray },
            { ui : this._btnConTeamIndexPredicate,               callback : this._onTouchedBtnConTeamIndexPredicate },

            { ui : this._btnConUnitTypeArray,                    callback : this._onTouchedBtnConUnitTypeArray },
            { ui : this._btnConUnitTypePredicate,                callback : this._onTouchedBtnConUnitTypePredicate },

            { ui : this._btnConActionStateArray,                 callback : this._onTouchedBtnConActionStateArray },
            { ui : this._btnConActionStatePredicate,             callback : this._onTouchedBtnConActionStatePredicate },

            { ui : this._btnConIsCoOnboard,                      callback : this._onTouchedBtnConIsCoOnboard },

            { ui : this._btnConHp,                               callback : this._onTouchedBtnConHp },

            { ui : this._btnConFuel,                             callback : this._onTouchedBtnConFuel },

            { ui : this._btnConPriAmmo,                          callback : this._onTouchedBtnConPriAmmo },

            { ui : this._btnConPromotion,                        callback : this._onTouchedBtnConPromotion },

            { ui : this._btnConIsOwnerPlayerInTurn,              callback : this._onTouchedBtnConIsOwnerPlayerInTurn },

            { ui : this._btnConIsDiving,                         callback : this._onTouchedBtnConIsDiving },

            { ui : this._btnConTagIdArray,                       callback : this._onTouchedBtnConTagIdArray },
            { ui : this._btnConTagIdPredicate,                   callback : this._onTouchedBtnConTagIdPredicate },

            { ui : this._btnConLoadedUnitsCount,                 callback : this._onTouchedBtnConLoadedUnitsCount },

            { ui : this._btnConIsLoaded,                         callback : this._onTouchedBtnConIsLoaded },

            { ui : this._btnConFlareAmmo,                        callback : this._onTouchedBtnConFlareAmmo },

            { ui : this._btnConBuildMaterial,                    callback : this._onTouchedBtnConBuildMaterial },

            { ui : this._btnConProduceMaterial,                  callback : this._onTouchedBtnConProduceMaterial },

            { ui : this._btnConCustomNameId,                     callback : this._onTouchedBtnConCustomNameId },

            { ui : this._btnConForbiddenLocationIdArray,         callback : this._onTouchedBtnConForbiddenLocationIdArray },
            { ui : this._btnConForbiddenLocationIdPredicate,     callback : this._onTouchedBtnConForbiddenLocationIdPredicate },

            { ui : this._btnConAiModeArray,                      callback : this._onTouchedBtnConAiModeArray },
            { ui : this._btnConAiModePredicate,                  callback : this._onTouchedBtnConAiModePredicate },

            { ui : this._btnConGridIndexArray,                   callback : this._onTouchedBtnConGridIndexArray },
            { ui : this._btnConGridIndexPredicate,               callback : this._onTouchedBtnConGridIndexPredicate },

            { ui : this._btnConLocationIdArray,                  callback : this._onTouchedBtnConLocationIdArray },
            { ui : this._btnConLocationIdPredicate,              callback : this._onTouchedBtnConLocationIdPredicate },

            { ui : this._btnConBuffTypeIdArray,                  callback : this._onTouchedBtnConBuffTypeIdArray },
            { ui : this._btnConBuffTypeIdPredicate,              callback : this._onTouchedBtnConBuffTypeIdPredicate },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._unitFilter = this.getOpenData()?.currentFilter?.clone() ?? new UnitFilter();

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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0418),
                getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.Yes),
                getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.No),
                callback          : () => {
                    const unitFilter = this._getUnitFilter();
                    callback(Units_Utils_Filter.checkIsEmpty(unitFilter) ? null : unitFilter);
                    this.closePanel();
                },
                callbackOnCancel : () => this.closePanel(),
                showButtonClose  : true,
            });
        }
    }
    private _onTouchedBtnClear(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                this._unitFilter = new UnitFilter();
                this._updateView();
            },
        });
    }

    private _onTouchedBtnConPlayerIndexArray(): void {
        const playersCountUnneutral = this.getOpenData()?.playersCountUnneutral;
        if (playersCountUnneutral == null) {
            return;
        }

        const filter = this._getUnitFilter();
        const oldCon = filter.getConPlayerIndex();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray   : oldCon?.getValueArray() ?? [],
            availableNumberArray : Helpers_Collection.createRange(Players_Constants.PlayerIndex.Neutral, playersCountUnneutral + 1, 1),
            getTitleText         : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B0031)),
            getNumberMainText    : num => `P${num}`,
            callbackOnConfirm    : valueArray => {
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray   : oldCon?.getValueArray() ?? [],
            availableNumberArray : Helpers_Collection.createRange(Teams_Constants.TeamIndex.Neutral, playersCountUnneutral + 1, 1),
            getTitleText         : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B0019)),
            getNumberMainText    : num => Lang_Utils.getPlayerTeamName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : valueArray => {
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
            gameConfig             : gameConfig,
            currentUnitTypeArray   : oldCon?.getValueArray() ?? [],
            availableUnitTypeArray : gameConfig.getAllUnitTypeArray(),
            callbackOnConfirm      : unitTypeArray => {
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray   : oldCon?.getValueArray() ?? [],
            availableNumberArray : Units_Constants.AllActionStateIdArray,
            getTitleText         : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B0525)),
            getNumberMainText    : num => Lang_Utils.getUnitActionStateText(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : valueArray => {
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B0807),
            availableNumberArray : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber        : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText    : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0807),
                minValue     : 0,
                maxValue     : 100,
                currentValue : oldCon == null ? null : oldCon.getValue(),
                callback     : value => {
                    if (value == null) {
                        filter.setConHp(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConHp(ValueAndComparator.fromJson({
                                value      : value,
                                comparator : sign,
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.Fuel),
            availableNumberArray : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber        : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText    : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Fuel),
                minValue     : 0,
                maxValue     : 100,
                currentValue : oldCon == null ? null : oldCon.getValue(),
                callback     : value => {
                    if (value == null) {
                        filter.setConFuel(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConFuel(ValueAndComparator.fromJson({
                                value      : value,
                                comparator : sign,
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.PrimaryWeaponAmmo),
            availableNumberArray : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber        : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText    : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.PrimaryWeaponAmmo),
                minValue     : 0,
                maxValue     : 100,
                currentValue : oldCon == null ? null : oldCon.getValue(),
                callback     : value => {
                    if (value == null) {
                        filter.setConPriAmmo(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConPriAmmo(ValueAndComparator.fromJson({
                                value      : value,
                                comparator : sign,
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.Promotion),
            availableNumberArray : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber        : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText    : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Promotion),
                minValue     : 0,
                maxValue     : 100,
                currentValue : oldCon == null ? null : oldCon.getValue(),
                callback     : value => {
                    if (value == null) {
                        filter.setConPromotion(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConPromotion(ValueAndComparator.fromJson({
                                value      : value,
                                comparator : sign,
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray   : filter.getConTagId()?.getValueArray() ?? [],
            availableIntegerArray : Units_Constants.AllTagIdArray,
            getTitleText          : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.Tags)),
            callbackOnConfirm     : valueArray => {
                if (!valueArray.length) {
                    filter.setConTagId(null);
                } else {
                    const con = filter.createIfNotExistsConTagId();
                    con.setValueArray(valueArray);
                    if (con.getSetRelation() == null) {
                        con.setSetRelation(ValueSetAndRelations_Constants.SetRelationId.EqualTo);
                    }
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConTagIdPredicate(): void {
        const filter = this._getUnitFilter();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.Tags),
            availableNumberArray : ValueSetAndRelations_Constants.AllSetRelationIdArray,
            currentNumber        : filter.getConTagId()?.getSetRelation(),
            getNumberMainText    : num => Lang_Utils.getSetRelationName(num),
            callbackOnConfirm    : setRelation => {
                filter.createIfNotExistsConTagId().setSetRelation(setRelation);
                this._updateView();
            },
        });
    }

    private _onTouchedBtnConLoadedUnitsCount(): void {
        const filter = this._getUnitFilter();
        const oldCon = filter.getConLoadedUnitsCount();

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B0698),
            availableNumberArray : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber        : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText    : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0698),
                minValue     : 0,
                maxValue     : 100,
                currentValue : oldCon == null ? null : oldCon.getValue(),
                callback     : value => {
                    if (value == null) {
                        filter.setConLoadedUnitsCount(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConLoadedUnitsCount(ValueAndComparator.fromJson({
                                value      : value,
                                comparator : sign,
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.FlareAmmo),
            availableNumberArray : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber        : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText    : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.FlareAmmo),
                minValue     : 0,
                maxValue     : 100,
                currentValue : oldCon == null ? null : oldCon.getValue(),
                callback     : value => {
                    if (value == null) {
                        filter.setConFlareAmmo(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConFlareAmmo(ValueAndComparator.fromJson({
                                value      : value,
                                comparator : sign,
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.BuildMaterial),
            availableNumberArray : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber        : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText    : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.BuildMaterial),
                minValue     : 0,
                maxValue     : 100,
                currentValue : oldCon == null ? null : oldCon.getValue(),
                callback     : value => {
                    if (value == null) {
                        filter.setConBuildMaterial(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConBuildMaterial(ValueAndComparator.fromJson({
                                value      : value,
                                comparator : sign,
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.ProductionMaterial),
            availableNumberArray : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber        : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText    : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.ProductionMaterial),
                minValue     : 0,
                maxValue     : 100,
                currentValue : oldCon == null ? null : oldCon.getValue(),
                callback     : value => {
                    if (value == null) {
                        filter.setConProduceMaterial(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConProduceMaterial(ValueAndComparator.fromJson({
                                value      : value,
                                comparator : sign,
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.CustomNameId),
            availableNumberArray : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber        : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText    : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.CustomNameId),
                minValue     : Units_Constants.CustomName.MinId,
                maxValue     : Units_Constants.CustomName.MaxId,
                currentValue : oldCon == null ? null : oldCon.getValue(),
                callback     : value => {
                    if (value == null) {
                        filter.setConCustomNameId(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConCustomNameId(ValueAndComparator.fromJson({
                                value      : value,
                                comparator : sign,
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray   : filter.getConForbiddenLocationId()?.getValueArray() ?? [],
            availableIntegerArray : Locations_Constants.AllLocationIdArray,
            getTitleText          : () => Lang_Utils.getText(Lang_Constants.TextType.NoEntryLocations),
            callbackOnConfirm     : valueArray => {
                if (!valueArray.length) {
                    filter.setConForbiddenLocationId(null);
                } else {
                    const con = filter.createIfNotExistsConForbiddenLocationId();
                    con.setValueArray(valueArray);
                    con.setSetRelation(con.getSetRelation());
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConForbiddenLocationIdPredicate(): void {
        const filter = this._getUnitFilter();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.NoEntryLocations),
            availableNumberArray : ValueSetAndRelations_Constants.AllSetRelationIdArray,
            currentNumber        : filter.getConForbiddenLocationId()?.getSetRelation(),
            getNumberMainText    : num => Lang_Utils.getSetRelationName(num),
            callbackOnConfirm    : setRelation => {
                filter.createIfNotExistsConForbiddenLocationId().setSetRelation(setRelation);
                this._updateView();
            },
        });
    }

    private _onTouchedBtnConAiModeArray(): void {
        const filter = this._getUnitFilter();
        const oldCon = filter.getConAiMode();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray   : oldCon == null ? [] : (oldCon.getValueArray()),
            availableNumberArray : Units_Constants.AllAiModeIdArray,
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.AiMode),
            getNumberMainText    : num => Lang_Utils.getUnitAiModeName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : valueArray => {
                if (!valueArray.length) {
                    filter.setConAiMode(null);
                } else {
                    const con = filter.createIfNotExistsConAiMode();
                    con.setValueArray(valueArray);
                    con.setIsOneOf(con.getIsOneOf());
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseGridIndexPanel, {
            currentGridIndexArray : Helpers_Collection.getNonNullElements(filter.getConGridIndex()?.getGridIndexArray()?.map(v => AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v)) ?? []),
            mapSize               : mapSize,
            callbackOnConfirm     : valueArray => {
                if (!valueArray.length) {
                    filter.setConGridIndex(null);
                } else {
                    const con = filter.createIfNotExistsConGridIndex();
                    con.setGridIndexArray(valueArray.map(v => v.toProto()));
                    con.setIsOneOf(con.getIsOneOf());
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray   : filter.getConLocationId()?.getValueArray() ?? [],
            availableIntegerArray : Locations_Constants.AllLocationIdArray,
            getTitleText          : () => Lang_Utils.getText(Lang_Constants.TextType.Location),
            callbackOnConfirm     : valueArray => {
                if (!valueArray.length) {
                    filter.setConLocationId(null);
                } else {
                    const con = filter.createIfNotExistsConLocationId();
                    con.setValueArray(valueArray);
                    con.setSetRelation(con.getSetRelation());
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConLocationIdPredicate(): void {
        const filter = this._getUnitFilter();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.Location),
            availableNumberArray : ValueSetAndRelations_Constants.AllSetRelationIdArray,
            currentNumber        : filter.getConLocationId()?.getSetRelation(),
            getNumberMainText    : num => Lang_Utils.getSetRelationName(num),
            callbackOnConfirm    : setRelation => {
                filter.createIfNotExistsConLocationId().setSetRelation(setRelation);
                this._updateView();
            },
        });
    }

    private _onTouchedBtnConBuffTypeIdArray(): void {
        const filter = this._getUnitFilter();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray   : filter.getConBuffTypeId()?.getValueArray() ?? [],
            availableNumberArray : UnitBuffs_Constants.AllBuffTypeIdArray,
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId),
            getNumberMainText    : v => Lang_Utils.getUnitBuffName(v) ?? Lang_Constants.UndefinedError,
            showNumber           : true,
            callbackOnConfirm    : valueArray => {
                if (!valueArray.length) {
                    filter.setConBuffTypeId(null);
                } else {
                    const con = filter.createIfNotExistsConBuffTypeId();
                    con.setValueArray(valueArray);
                    con.setSetRelation(con.getSetRelation());
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConBuffTypeIdPredicate(): void {
        const filter = this._getUnitFilter();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId),
            availableNumberArray : ValueSetAndRelations_Constants.AllSetRelationIdArray,
            currentNumber        : filter.getConBuffTypeId()?.getSetRelation(),
            getNumberMainText    : num => Lang_Utils.getSetRelationName(num),
            callbackOnConfirm    : setRelation => {
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
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitFilter);
        this._btnClear.setLangText(Lang_Constants.TextType.B0391);

        this._btnConPlayerIndexArray.setLangText(Lang_Constants.TextType.PlayerIndex);
        this._btnConTeamIndexArray.setLangText(Lang_Constants.TextType.B0019);
        this._btnConUnitTypeArray.setLangText(Lang_Constants.TextType.B0525);
        this._btnConActionStateArray.setLangText(Lang_Constants.TextType.ActionState);
        this._btnConIsCoOnboard.setLangText(Lang_Constants.TextType.CoOnboard);
        this._btnConHp.setLangText(Lang_Constants.TextType.B0934);
        this._btnConFuel.setLangText(Lang_Constants.TextType.Fuel);
        this._btnConPriAmmo.setLangText(Lang_Constants.TextType.PrimaryWeaponAmmo);
        this._btnConPromotion.setLangText(Lang_Constants.TextType.Promotion);
        this._btnConIsOwnerPlayerInTurn.setLangText(Lang_Constants.TextType.B0086);
        this._btnConIsDiving.setLangText(Lang_Constants.TextType.B0371);
        this._btnConTagIdArray.setLangText(Lang_Constants.TextType.Tags);
        this._btnConLoadedUnitsCount.setLangText(Lang_Constants.TextType.B0698);
        this._btnConIsLoaded.setLangText(Lang_Constants.TextType.B1056);
        this._btnConFlareAmmo.setLangText(Lang_Constants.TextType.FlareAmmo);
        this._btnConBuildMaterial.setLangText(Lang_Constants.TextType.BuildMaterial);
        this._btnConProduceMaterial.setLangText(Lang_Constants.TextType.ProductionMaterial);
        this._btnConCustomNameId.setLangText(Lang_Constants.TextType.CustomNameId);
        this._btnConForbiddenLocationIdArray.setLangText(Lang_Constants.TextType.NoEntryLocations);
        this._btnConAiModeArray.setLangText(Lang_Constants.TextType.AiMode);
        this._btnConGridIndexArray.setLangText(Lang_Constants.TextType.B0531);
        this._btnConLocationIdArray.setLangText(Lang_Constants.TextType.Location);
        this._btnConBuffTypeIdArray.setLangText(Lang_Constants.TextType.AbnormalStateTypeId);

        this._btnConPlayerIndexPredicate.setLangText(Lang_Constants.TextType.B1403);
        this._btnConTeamIndexPredicate.setLangText(Lang_Constants.TextType.B1403);
        this._btnConUnitTypePredicate.setLangText(Lang_Constants.TextType.B1403);
        this._btnConActionStatePredicate.setLangText(Lang_Constants.TextType.B1403);
        this._btnConTagIdPredicate.setLangText(Lang_Constants.TextType.B1417);
        this._btnConForbiddenLocationIdPredicate.setLangText(Lang_Constants.TextType.B1417);
        this._btnConAiModePredicate.setLangText(Lang_Constants.TextType.B1403);
        this._btnConGridIndexPredicate.setLangText(Lang_Constants.TextType.B1403);
        this._btnConLocationIdPredicate.setLangText(Lang_Constants.TextType.B1417);
        this._btnConBuffTypeIdPredicate.setLangText(Lang_Constants.TextType.B1417);

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
        const errorTip          = Units_Utils_Filter.getErrorTip(unitFilter, openData.playersCountUnneutral, openData.mapSize, gameConfig);
        const labelError        = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(Units_Utils_Filter.getDesc(unitFilter, gameConfig));
        this._groupDesc.arrangeItems();
        this._scrDesc.updateOnItemsChanged();
    }
    private _updateLabelsForConPlayerIndex(): void {
        const con           = this._getUnitFilter().getConPlayerIndex();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConPlayerIndexArray.setText(valueArray?.map(v => `P${v}`).join(`, `) ?? ``);
        this._labelConPlayerIndexPredicate.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConTeamIndex(): void {
        const con           = this._getUnitFilter().getConTeamIndex();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConTeamIndexArray.setText(valueArray?.map(v => Lang_Utils.getPlayerTeamName(v)).join(`, `) ?? ``);
        this._labelConTeamIndexPredicate.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConUnitType(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const con           = this._getUnitFilter().getConUnitType();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConUnitTypeArray.setText(valueArray?.map(v => Lang_Utils.getUnitName(v, gameConfig)).join(`, `) ?? ``);
        this._labelConUnitTypePredicate.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConActionState(): void {
        const con           = this._getUnitFilter().getConActionState();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConActionStateArray.setText(valueArray?.map(v => Lang_Utils.getUnitActionStateText(v)).join(`, `) ?? ``);
        this._labelConActionStatePredicate.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConIsCoOnboard(): void {
        const con = this._getUnitFilter().getConIsCoOnboard();
        this._labelConIsCoOnboard.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con));
    }
    private _updateLabelsForConHp(): void {
        const con = this._getUnitFilter().getConHp();
        this._labelConHp.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }
    private _updateLabelsForConFuel(): void {
        const con = this._getUnitFilter().getConFuel();
        this._labelConFuel.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }
    private _updateLabelsForConPriAmmo(): void {
        const con = this._getUnitFilter().getConPriAmmo();
        this._labelConPriAmmo.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }
    private _updateLabelsForConPromotion(): void {
        const con = this._getUnitFilter().getConPromotion();
        this._labelConPromotion.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }
    private _updateLabelsForConIsOwnerPlayerInTurn(): void {
        const con = this._getUnitFilter().getConIsOwnerPlayerInTurn();
        this._labelConIsOwnerPlayerInTurn.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con));
    }
    private _updateLabelsForConIsDiving(): void {
        const con = this._getUnitFilter().getConIsDiving();
        this._labelConIsDiving.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con));
    }
    private _updateLabelsForConTagId(): void {
        const con = this._getUnitFilter().getConTagId();
        this._labelConTagIdArray.setText(con?.getValueArray().join(`, `) ?? ``);
        this._labelConTagIdPredicate.setText(con == null ? `` : Lang_Utils.getSetRelationName(con.getSetRelation()));
    }
    private _updateLabelsForConLoadedUnitsCount(): void {
        const con = this._getUnitFilter().getConLoadedUnitsCount();
        this._labelConLoadedUnitsCount.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }
    private _updateLabelsForConIsLoaded(): void {
        const con = this._getUnitFilter().getConIsLoaded();
        this._labelConIsLoaded.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con));
    }
    private _updateLabelsForConFlareAmmo(): void {
        const con = this._getUnitFilter().getConFlareAmmo();
        this._labelConFlareAmmo.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }
    private _updateLabelsForConBuildMaterial(): void {
        const con = this._getUnitFilter().getConBuildMaterial();
        this._labelConBuildMaterial.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }
    private _updateLabelsForConProduceMaterial(): void {
        const con = this._getUnitFilter().getConProduceMaterial();
        this._labelConProduceMaterial.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }
    private _updateLabelsForConCustomNameId(): void {
        const con = this._getUnitFilter().getConCustomNameId();
        this._labelConCustomNameId.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }
    private _updateLabelsForConForbiddenLocationIdArray(): void {
        const con = this._getUnitFilter().getConForbiddenLocationId();
        this._labelConForbiddenLocationIdArray.setText(con?.getValueArray().join(`, `) ?? ``);
        this._labelConForbiddenLocationIdPredicate.setText(con == null ? `` : Lang_Utils.getSetRelationName(con.getSetRelation()));
    }
    private _updateLabelsForConAiMode(): void {
        const con           = this._getUnitFilter().getConAiMode();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConAiModeArray.setText(valueArray?.map(v => Lang_Utils.getUnitAiModeName(v)).join(`, `) ?? ``);
        this._labelConAiModePredicate.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConGridIndex() {
        const con = this._getUnitFilter().getConGridIndex();
        this._labelConGridIndexArray.setText(con?.getGridIndexArray().map(v => `(${v.getX()},${v.getY()})`).join(`, `) ?? ``);
        this._labelConGridIndexPredicate.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConLocationId() {
        const con = this._getUnitFilter().getConLocationId();
        this._labelConLocationIdArray.setText(con?.getValueArray().join(`, `) ?? ``);
        this._labelConLocationIdPredicate.setText(con == null ? `` : Lang_Utils.getSetRelationName(con.getSetRelation()));
    }
    private _updateLabelsForConBuffTypeId() {
        const con = this._getUnitFilter().getConBuffTypeId();
        this._labelConBuffTypeIdArray.setText(con?.getValueArray().map(v => Lang_Utils.getUnitBuffName(v))?.join(`, `) ?? ``);
        this._labelConBuffTypeIdPredicate.setText(con == null ? `` : Lang_Utils.getSetRelationName(con.getSetRelation()));
    }

    private _getUnitFilter(): UnitFilter {
        return this._unitFilter;
    }
}
