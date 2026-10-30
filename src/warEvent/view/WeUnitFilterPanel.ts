import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import {
    createRange,
    getNonNullElements,
} from "../../helpers/Collection.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
    getPlayerTeamName,
    getUnitActionStateText,
    getComparatorName,
    getSetRelationName,
    getUnitAiModeName,
    getUnitBuffName,
    getTextForYesOrNo,
    getUnitName,
} from "../../lang/Utils.ts";
import { AllLocationIdArray } from "../../locations/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { UnitFilter } from "../../proto/schema/CommonProto/Structure/UnitFilter.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { TeamIndex } from "../../teams/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { AllBuffTypeIdArray } from "../../unitBuffs/Constants.ts";
import {
    AllActionStateIdArray,
    AllTagIdArray,
    CustomName,
    AllAiModeIdArray,
} from "../../units/Constants.ts";
import {
    checkIsEmpty,
    getErrorTip,
    getDesc,
} from "../../units/utils/Filter.ts";
import { AllComparatorIdArray } from "../../valueAndComparators/Constants.ts";
import { getBriefDesc } from "../../valueAndComparators/Utils.ts";
import {
    SetRelationId,
    AllSetRelationIdArray,
} from "../../valueSetAndRelations/Constants.ts";

export interface OpenData {
    gameConfig              : GameConfig;
    playersCountUnneutral   : number;
    mapSize                 : MapSize;
    currentFilter           : Undefinable<UnitFilter>;
    callback                : ((unitFilter: UnitFilter | null) => void) | null;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                  : IUiImage;
    private readonly _group!                                    : IUiContainer;
    private readonly _labelTitle!                               : IUiLabel;
    private readonly _btnClear!                                 : IUiButton;
    private readonly _btnClose!                                 : IUiButton;

    private readonly _scrDesc!                                  : IUiScroller<IUiLayout>;
    private readonly _groupDesc!                                : IUiLayout;
    private readonly _labelDesc!                                : IUiLabel;
    private readonly _labelError!                               : IUiLabel;

    private readonly _btnConPlayerIndexArray!                   : IUiButton;
    private readonly _labelConPlayerIndexArray!                 : IUiLabel;
    private readonly _btnConPlayerIndexPredicate!               : IUiButton;
    private readonly _labelConPlayerIndexPredicate!             : IUiLabel;

    private readonly _btnConTeamIndexArray!                     : IUiButton;
    private readonly _labelConTeamIndexArray!                   : IUiLabel;
    private readonly _btnConTeamIndexPredicate!                 : IUiButton;
    private readonly _labelConTeamIndexPredicate!               : IUiLabel;

    private readonly _btnConUnitTypeArray!                      : IUiButton;
    private readonly _labelConUnitTypeArray!                    : IUiLabel;
    private readonly _btnConUnitTypePredicate!                  : IUiButton;
    private readonly _labelConUnitTypePredicate!                : IUiLabel;

    private readonly _btnConActionStateArray!                   : IUiButton;
    private readonly _labelConActionStateArray!                 : IUiLabel;
    private readonly _btnConActionStatePredicate!               : IUiButton;
    private readonly _labelConActionStatePredicate!             : IUiLabel;

    private readonly _btnConIsCoOnboard!                        : IUiButton;
    private readonly _labelConIsCoOnboard!                      : IUiLabel;

    private readonly _btnConHp!                                 : IUiButton;
    private readonly _labelConHp!                               : IUiLabel;

    private readonly _btnConFuel!                               : IUiButton;
    private readonly _labelConFuel!                             : IUiLabel;

    private readonly _btnConPriAmmo!                            : IUiButton;
    private readonly _labelConPriAmmo!                          : IUiLabel;

    private readonly _btnConPromotion!                          : IUiButton;
    private readonly _labelConPromotion!                        : IUiLabel;

    private readonly _btnConIsOwnerPlayerInTurn!                : IUiButton;
    private readonly _labelConIsOwnerPlayerInTurn!              : IUiLabel;

    private readonly _btnConIsDiving!                           : IUiButton;
    private readonly _labelConIsDiving!                         : IUiLabel;

    private readonly _btnConTagIdArray!                         : IUiButton;
    private readonly _labelConTagIdArray!                       : IUiLabel;
    private readonly _btnConTagIdPredicate!                     : IUiButton;
    private readonly _labelConTagIdPredicate!                   : IUiLabel;

    private readonly _btnConLoadedUnitsCount!                   : IUiButton;
    private readonly _labelConLoadedUnitsCount!                 : IUiLabel;

    private readonly _btnConIsLoaded!                           : IUiButton;
    private readonly _labelConIsLoaded!                         : IUiLabel;

    private readonly _btnConFlareAmmo!                          : IUiButton;
    private readonly _labelConFlareAmmo!                        : IUiLabel;

    private readonly _btnConBuildMaterial!                      : IUiButton;
    private readonly _labelConBuildMaterial!                    : IUiLabel;

    private readonly _btnConProduceMaterial!                    : IUiButton;
    private readonly _labelConProduceMaterial!                  : IUiLabel;

    private readonly _btnConCustomNameId!                       : IUiButton;
    private readonly _labelConCustomNameId!                     : IUiLabel;

    private readonly _btnConForbiddenLocationIdArray!           : IUiButton;
    private readonly _labelConForbiddenLocationIdArray!         : IUiLabel;
    private readonly _btnConForbiddenLocationIdPredicate!       : IUiButton;
    private readonly _labelConForbiddenLocationIdPredicate!     : IUiLabel;

    private readonly _btnConAiModeArray!                        : IUiButton;
    private readonly _labelConAiModeArray!                      : IUiLabel;
    private readonly _btnConAiModePredicate!                    : IUiButton;
    private readonly _labelConAiModePredicate!                  : IUiLabel;

    private readonly _btnConGridIndexArray!                     : IUiButton;
    private readonly _labelConGridIndexArray!                   : IUiLabel;
    private readonly _btnConGridIndexPredicate!                 : IUiButton;
    private readonly _labelConGridIndexPredicate!               : IUiLabel;

    private readonly _btnConLocationIdArray!                    : IUiButton;
    private readonly _labelConLocationIdArray!                  : IUiLabel;
    private readonly _btnConLocationIdPredicate!                : IUiButton;
    private readonly _labelConLocationIdPredicate!              : IUiLabel;

    private readonly _btnConBuffTypeIdArray!                    : IUiButton;
    private readonly _labelConBuffTypeIdArray!                  : IUiLabel;
    private readonly _btnConBuffTypeIdPredicate!                : IUiButton;
    private readonly _labelConBuffTypeIdPredicate!              : IUiLabel;

    private _unitFilter = new UnitFilter();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
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
            playShortSfx(ShortSfxCode.ButtonCancel01);
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
            openPanel(getDict().CommonConfirmPanel, {
                getContent             : () => getText(TextType.A0418),
                getTextForConfirm      : () => getText(TextType.Yes),
                getTextForCancel       : () => getText(TextType.No),
                callback            : () => {
                    const unitFilter = this._getUnitFilter();
                    callback(checkIsEmpty(unitFilter) ? null : unitFilter);
                    this.closePanel();
                },
                callbackOnCancel    : () => this.closePanel(),
                showButtonClose     : true,
            });
        }
    }
    private _onTouchedBtnClear(): void {
        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getText(TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                this._unitFilter = new UnitFilter();
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
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : oldCon?.getValueArray() ?? [],
            availableNumberArray    : createRange(PlayerIndex.Neutral, playersCountUnneutral + 1, 1),
            getTitleText            : () => getFormattedText(TextType.F0092, getText(TextType.B0031)),
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
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : oldCon?.getValueArray() ?? [],
            availableNumberArray    : createRange(TeamIndex.Neutral, playersCountUnneutral + 1, 1),
            getTitleText            : () => getFormattedText(TextType.F0092, getText(TextType.B0019)),
            getNumberMainText       : num => getPlayerTeamName(num) ?? UndefinedError,
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
        openPanel(getDict().CommonChooseMultiUnitTypePanel, {
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
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : oldCon?.getValueArray() ?? [],
            availableNumberArray    : AllActionStateIdArray,
            getTitleText            : () => getFormattedText(TextType.F0092, getText(TextType.B0525)),
            getNumberMainText       : num => getUnitActionStateText(num) ?? UndefinedError,
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

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.B0807),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.B0807),
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
                            filter.setConHp(ValueAndComparator.fromJson({
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

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.Fuel),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.Fuel),
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
                            filter.setConFuel(ValueAndComparator.fromJson({
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

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.PrimaryWeaponAmmo),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.PrimaryWeaponAmmo),
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
                            filter.setConPriAmmo(ValueAndComparator.fromJson({
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

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.Promotion),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.Promotion),
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
                            filter.setConPromotion(ValueAndComparator.fromJson({
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
        openPanel(getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : filter.getConTagId()?.getValueArray() ?? [],
            availableIntegerArray   : AllTagIdArray,
            getTitleText            : () => getFormattedText(TextType.F0092, getText(TextType.Tags)),
            callbackOnConfirm       : valueArray => {
                if (!valueArray.length) {
                    filter.setConTagId(null);
                } else {
                    const con = filter.createIfNotExistsConTagId();
                    con.setValueArray(valueArray);
                    if (con.getSetRelation() == null) {
                        con.setSetRelation(SetRelationId.EqualTo);
                    }
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConTagIdPredicate(): void {
        const filter = this._getUnitFilter();
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.Tags),
            availableNumberArray    : AllSetRelationIdArray,
            currentNumber           : filter.getConTagId()?.getSetRelation(),
            getNumberMainText       : num => getSetRelationName(num),
            callbackOnConfirm       : setRelation => {
                filter.createIfNotExistsConTagId().setSetRelation(setRelation);
                this._updateView();
            },
        });
    }

    private _onTouchedBtnConLoadedUnitsCount(): void {
        const filter = this._getUnitFilter();
        const oldCon = filter.getConLoadedUnitsCount();

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.B0698),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.B0698),
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
                            filter.setConLoadedUnitsCount(ValueAndComparator.fromJson({
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

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.FlareAmmo),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.FlareAmmo),
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
                            filter.setConFlareAmmo(ValueAndComparator.fromJson({
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

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.BuildMaterial),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.BuildMaterial),
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
                            filter.setConBuildMaterial(ValueAndComparator.fromJson({
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

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.ProductionMaterial),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.ProductionMaterial),
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
                            filter.setConProduceMaterial(ValueAndComparator.fromJson({
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

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.CustomNameId),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.CustomNameId),
                minValue        : CustomName.MinId,
                maxValue        : CustomName.MaxId,
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConCustomNameId(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConCustomNameId(ValueAndComparator.fromJson({
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
        openPanel(getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : filter.getConForbiddenLocationId()?.getValueArray() ?? [],
            availableIntegerArray   : AllLocationIdArray,
            getTitleText            : () => getText(TextType.NoEntryLocations),
            callbackOnConfirm       : valueArray => {
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
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.NoEntryLocations),
            availableNumberArray    : AllSetRelationIdArray,
            currentNumber           : filter.getConForbiddenLocationId()?.getSetRelation(),
            getNumberMainText       : num => getSetRelationName(num),
            callbackOnConfirm       : setRelation => {
                filter.createIfNotExistsConForbiddenLocationId().setSetRelation(setRelation);
                this._updateView();
            },
        });
    }

    private _onTouchedBtnConAiModeArray(): void {
        const filter = this._getUnitFilter();
        const oldCon = filter.getConAiMode();
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : oldCon == null ? [] : (oldCon.getValueArray()),
            availableNumberArray    : AllAiModeIdArray,
            getTitleText            : () => getText(TextType.AiMode),
            getNumberMainText       : num => getUnitAiModeName(num) ?? UndefinedError,
            callbackOnConfirm       : valueArray => {
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
        openPanel(getDict().CommonChooseGridIndexPanel, {
            currentGridIndexArray   : getNonNullElements(filter.getConGridIndex()?.getGridIndexArray()?.map(v => GridIndex.convertGridIndex(v)) ?? []),
            mapSize                 : mapSize,
            callbackOnConfirm       : valueArray => {
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
        openPanel(getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : filter.getConLocationId()?.getValueArray() ?? [],
            availableIntegerArray   : AllLocationIdArray,
            getTitleText            : () => getText(TextType.Location),
            callbackOnConfirm       : valueArray => {
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
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.Location),
            availableNumberArray    : AllSetRelationIdArray,
            currentNumber           : filter.getConLocationId()?.getSetRelation(),
            getNumberMainText       : num => getSetRelationName(num),
            callbackOnConfirm       : setRelation => {
                filter.createIfNotExistsConLocationId().setSetRelation(setRelation);
                this._updateView();
            },
        });
    }

    private _onTouchedBtnConBuffTypeIdArray(): void {
        const filter = this._getUnitFilter();
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : filter.getConBuffTypeId()?.getValueArray() ?? [],
            availableNumberArray    : AllBuffTypeIdArray,
            getTitleText            : () => getText(TextType.AbnormalStateTypeId),
            getNumberMainText       : v => getUnitBuffName(v) ?? UndefinedError,
            showNumber              : true,
            callbackOnConfirm       : valueArray => {
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
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.AbnormalStateTypeId),
            availableNumberArray    : AllSetRelationIdArray,
            currentNumber           : filter.getConBuffTypeId()?.getSetRelation(),
            getNumberMainText       : num => getSetRelationName(num),
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
        this._labelTitle.setLangText(TextType.UnitFilter);
        this._btnClear.setLangText(TextType.B0391);

        this._btnConPlayerIndexArray.setLangText(TextType.PlayerIndex);
        this._btnConTeamIndexArray.setLangText(TextType.B0019);
        this._btnConUnitTypeArray.setLangText(TextType.B0525);
        this._btnConActionStateArray.setLangText(TextType.ActionState);
        this._btnConIsCoOnboard.setLangText(TextType.CoOnboard);
        this._btnConHp.setLangText(TextType.B0934);
        this._btnConFuel.setLangText(TextType.Fuel);
        this._btnConPriAmmo.setLangText(TextType.PrimaryWeaponAmmo);
        this._btnConPromotion.setLangText(TextType.Promotion);
        this._btnConIsOwnerPlayerInTurn.setLangText(TextType.B0086);
        this._btnConIsDiving.setLangText(TextType.B0371);
        this._btnConTagIdArray.setLangText(TextType.Tags);
        this._btnConLoadedUnitsCount.setLangText(TextType.B0698);
        this._btnConIsLoaded.setLangText(TextType.B1056);
        this._btnConFlareAmmo.setLangText(TextType.FlareAmmo);
        this._btnConBuildMaterial.setLangText(TextType.BuildMaterial);
        this._btnConProduceMaterial.setLangText(TextType.ProductionMaterial);
        this._btnConCustomNameId.setLangText(TextType.CustomNameId);
        this._btnConForbiddenLocationIdArray.setLangText(TextType.NoEntryLocations);
        this._btnConAiModeArray.setLangText(TextType.AiMode);
        this._btnConGridIndexArray.setLangText(TextType.B0531);
        this._btnConLocationIdArray.setLangText(TextType.Location);
        this._btnConBuffTypeIdArray.setLangText(TextType.AbnormalStateTypeId);

        this._btnConPlayerIndexPredicate.setLangText(TextType.B1403);
        this._btnConTeamIndexPredicate.setLangText(TextType.B1403);
        this._btnConUnitTypePredicate.setLangText(TextType.B1403);
        this._btnConActionStatePredicate.setLangText(TextType.B1403);
        this._btnConTagIdPredicate.setLangText(TextType.B1417);
        this._btnConForbiddenLocationIdPredicate.setLangText(TextType.B1417);
        this._btnConAiModePredicate.setLangText(TextType.B1403);
        this._btnConGridIndexPredicate.setLangText(TextType.B1403);
        this._btnConLocationIdPredicate.setLangText(TextType.B1417);
        this._btnConBuffTypeIdPredicate.setLangText(TextType.B1417);

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
        const errorTip          = getErrorTip(unitFilter, openData.playersCountUnneutral, openData.mapSize, gameConfig);
        const labelError        = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getDesc(unitFilter, gameConfig));
        this._groupDesc.arrangeItems();
        this._scrDesc.updateOnItemsChanged();
    }
    private _updateLabelsForConPlayerIndex(): void {
        const con           = this._getUnitFilter().getConPlayerIndex();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConPlayerIndexArray.setText(valueArray?.map(v => `P${v}`).join(`, `) ?? ``);
        this._labelConPlayerIndexPredicate.setText(con == null ? `` : getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConTeamIndex(): void {
        const con           = this._getUnitFilter().getConTeamIndex();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConTeamIndexArray.setText(valueArray?.map(v => getPlayerTeamName(v)).join(`, `) ?? ``);
        this._labelConTeamIndexPredicate.setText(con == null ? `` : getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConUnitType(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const con           = this._getUnitFilter().getConUnitType();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConUnitTypeArray.setText(valueArray?.map(v => getUnitName(v, gameConfig)).join(`, `) ?? ``);
        this._labelConUnitTypePredicate.setText(con == null ? `` : getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConActionState(): void {
        const con           = this._getUnitFilter().getConActionState();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConActionStateArray.setText(valueArray?.map(v => getUnitActionStateText(v)).join(`, `) ?? ``);
        this._labelConActionStatePredicate.setText(con == null ? `` : getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConIsCoOnboard(): void {
        const con = this._getUnitFilter().getConIsCoOnboard();
        this._labelConIsCoOnboard.setText(con == null ? `` : getTextForYesOrNo(con));
    }
    private _updateLabelsForConHp(): void {
        const con = this._getUnitFilter().getConHp();
        this._labelConHp.setText(con == null ? `` : getBriefDesc(con));
    }
    private _updateLabelsForConFuel(): void {
        const con = this._getUnitFilter().getConFuel();
        this._labelConFuel.setText(con == null ? `` : getBriefDesc(con));
    }
    private _updateLabelsForConPriAmmo(): void {
        const con = this._getUnitFilter().getConPriAmmo();
        this._labelConPriAmmo.setText(con == null ? `` : getBriefDesc(con));
    }
    private _updateLabelsForConPromotion(): void {
        const con = this._getUnitFilter().getConPromotion();
        this._labelConPromotion.setText(con == null ? `` : getBriefDesc(con));
    }
    private _updateLabelsForConIsOwnerPlayerInTurn(): void {
        const con = this._getUnitFilter().getConIsOwnerPlayerInTurn();
        this._labelConIsOwnerPlayerInTurn.setText(con == null ? `` : getTextForYesOrNo(con));
    }
    private _updateLabelsForConIsDiving(): void {
        const con = this._getUnitFilter().getConIsDiving();
        this._labelConIsDiving.setText(con == null ? `` : getTextForYesOrNo(con));
    }
    private _updateLabelsForConTagId(): void {
        const con = this._getUnitFilter().getConTagId();
        this._labelConTagIdArray.setText(con?.getValueArray().join(`, `) ?? ``);
        this._labelConTagIdPredicate.setText(con == null ? `` : getSetRelationName(con.getSetRelation()));
    }
    private _updateLabelsForConLoadedUnitsCount(): void {
        const con = this._getUnitFilter().getConLoadedUnitsCount();
        this._labelConLoadedUnitsCount.setText(con == null ? `` : getBriefDesc(con));
    }
    private _updateLabelsForConIsLoaded(): void {
        const con = this._getUnitFilter().getConIsLoaded();
        this._labelConIsLoaded.setText(con == null ? `` : getTextForYesOrNo(con));
    }
    private _updateLabelsForConFlareAmmo(): void {
        const con = this._getUnitFilter().getConFlareAmmo();
        this._labelConFlareAmmo.setText(con == null ? `` : getBriefDesc(con));
    }
    private _updateLabelsForConBuildMaterial(): void {
        const con = this._getUnitFilter().getConBuildMaterial();
        this._labelConBuildMaterial.setText(con == null ? `` : getBriefDesc(con));
    }
    private _updateLabelsForConProduceMaterial(): void {
        const con = this._getUnitFilter().getConProduceMaterial();
        this._labelConProduceMaterial.setText(con == null ? `` : getBriefDesc(con));
    }
    private _updateLabelsForConCustomNameId(): void {
        const con = this._getUnitFilter().getConCustomNameId();
        this._labelConCustomNameId.setText(con == null ? `` : getBriefDesc(con));
    }
    private _updateLabelsForConForbiddenLocationIdArray(): void {
        const con = this._getUnitFilter().getConForbiddenLocationId();
        this._labelConForbiddenLocationIdArray.setText(con?.getValueArray().join(`, `) ?? ``);
        this._labelConForbiddenLocationIdPredicate.setText(con == null ? `` : getSetRelationName(con.getSetRelation()));
    }
    private _updateLabelsForConAiMode(): void {
        const con           = this._getUnitFilter().getConAiMode();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConAiModeArray.setText(valueArray?.map(v => getUnitAiModeName(v)).join(`, `) ?? ``);
        this._labelConAiModePredicate.setText(con == null ? `` : getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConGridIndex() {
        const con = this._getUnitFilter().getConGridIndex();
        this._labelConGridIndexArray.setText(con?.getGridIndexArray().map(v => `(${v.getX()},${v.getY()})`).join(`, `) ?? ``);
        this._labelConGridIndexPredicate.setText(con == null ? `` : getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConLocationId() {
        const con = this._getUnitFilter().getConLocationId();
        this._labelConLocationIdArray.setText(con?.getValueArray().join(`, `) ?? ``);
        this._labelConLocationIdPredicate.setText(con == null ? `` : getSetRelationName(con.getSetRelation()));
    }
    private _updateLabelsForConBuffTypeId() {
        const con = this._getUnitFilter().getConBuffTypeId();
        this._labelConBuffTypeIdArray.setText(con?.getValueArray().map(v => getUnitBuffName(v))?.join(`, `) ?? ``);
        this._labelConBuffTypeIdPredicate.setText(con == null ? `` : getSetRelationName(con.getSetRelation()));
    }

    private _getUnitFilter(): UnitFilter {
        return this._unitFilter;
    }
}
