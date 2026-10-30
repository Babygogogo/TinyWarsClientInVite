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
    getComparatorName,
    getSetRelationName,
    getTileBuffName,
    getTextForYesOrNo,
    getTileName,
} from "../../lang/Utils.ts";
import { AllLocationIdArray } from "../../locations/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { TileFilter } from "../../proto/schema/CommonProto/Structure/TileFilter.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { TeamIndex } from "../../teams/Constants.ts";
import { AllBuffTypeIdArray } from "../../tileBuffs/Constants.ts";
import { CustomName } from "../../tiles/constants/Common.ts";
import {
    checkIsEmpty,
    getErrorTip,
    getDesc,
} from "../../tiles/utils/Filter.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { AllComparatorIdArray } from "../../valueAndComparators/Constants.ts";
import { getBriefDesc } from "../../valueAndComparators/Utils.ts";
import { AllSetRelationIdArray } from "../../valueSetAndRelations/Constants.ts";

export interface OpenData {
    gameConfig              : GameConfig;
    playersCountUnneutral   : number;
    mapSize                 : MapSize;
    currentFilter           : Undefinable<TileFilter>;
    callback                : ((tileFilter: TileFilter | null) => void) | null;
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

    private readonly _btnConTileTypeArray!                      : IUiButton;
    private readonly _labelConTileTypeArray!                    : IUiLabel;
    private readonly _btnConTileTypePredicate!                  : IUiButton;
    private readonly _labelConTileTypePredicate!                : IUiLabel;

    private readonly _btnConHp!                                 : IUiButton;
    private readonly _labelConHp!                               : IUiLabel;

    private readonly _btnConIsOwnerPlayerInTurn!                : IUiButton;
    private readonly _labelConIsOwnerPlayerInTurn!              : IUiLabel;

    private readonly _btnConIsHighlighted!                      : IUiButton;
    private readonly _labelConIsHighlighted!                    : IUiLabel;

    private readonly _btnConUnitsCount!                         : IUiButton;
    private readonly _labelConUnitsCount!                       : IUiLabel;

    private readonly _btnConCustomNameId!                       : IUiButton;
    private readonly _labelConCustomNameId!                     : IUiLabel;

    private readonly _btnConBuildPoint!                         : IUiButton;
    private readonly _labelConBuildPoint!                       : IUiLabel;

    private readonly _btnConCapturePoint!                       : IUiButton;
    private readonly _labelConCapturePoint!                     : IUiLabel;

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

    private _tileFilter = new TileFilter();

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

            { ui: this._btnConTileTypeArray,                    callback: this._onTouchedBtnConTileTypeArray },
            { ui: this._btnConTileTypePredicate,                callback: this._onTouchedBtnConTileTypePredicate },

            { ui: this._btnConHp,                               callback: this._onTouchedBtnConHp },

            { ui: this._btnConIsOwnerPlayerInTurn,              callback: this._onTouchedBtnConIsOwnerPlayerInTurn },

            { ui: this._btnConIsHighlighted,                    callback: this._onTouchedBtnConIsHighlighted },

            { ui: this._btnConUnitsCount,                       callback: this._onTouchedBtnConUnitsCount },

            { ui: this._btnConCustomNameId,                     callback: this._onTouchedBtnConCustomNameId },

            { ui: this._btnConBuildPoint,                       callback: this._onTouchedBtnConBuildPoint },

            { ui: this._btnConCapturePoint,                     callback: this._onTouchedBtnConCapturePoint },

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
        this._tileFilter = this.getOpenData()?.currentFilter?.clone() ?? new TileFilter();

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
                    const tileFilter = this._getTileFilter();
                    callback(checkIsEmpty(tileFilter) ? null : tileFilter);
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
                this._tileFilter = new TileFilter();
                this._updateView();
            }
        });
    }

    private _onTouchedBtnConPlayerIndexArray(): void {
        const playersCountUnneutral = this.getOpenData()?.playersCountUnneutral;
        if (playersCountUnneutral == null) {
            return;
        }

        const filter = this._getTileFilter();
        const oldCon = filter.getConPlayerIndex();
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray          : oldCon?.getValueArray() ?? [],
            availableNumberArray        : createRange(PlayerIndex.Neutral, playersCountUnneutral + 1, 1),
            getTitleText                : () => getFormattedText(TextType.F0092, getText(TextType.B0031)),
            getNumberMainText           : num => `P${num}`,
            callbackOnConfirm           : valueArray => {
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
        const con = this._getTileFilter().createIfNotExistsConPlayerIndex();
        con.setIsOneOf(!con.getIsOneOf());
        this._updateView();
    }

    private _onTouchedBtnConTeamIndexArray(): void {
        const playersCountUnneutral = this.getOpenData()?.playersCountUnneutral;
        if (playersCountUnneutral == null) {
            return;
        }

        const filter = this._getTileFilter();
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
        const con = this._getTileFilter().createIfNotExistsConTeamIndex();
        con.setIsOneOf(!con.getIsOneOf());
        this._updateView();
    }

    private _onTouchedBtnConTileTypeArray(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const filter = this._getTileFilter();
        const oldCon = filter.getConTileType();
        openPanel(getDict().CommonChooseMultiTileTypePanel, {
            gameConfig              : gameConfig,
            currentTileTypeArray    : oldCon?.getValueArray() ?? [],
            availableTileTypeArray  : gameConfig.getAllTileTypeArray(),
            callbackOnConfirm       : unitTypeArray => {
                if (!unitTypeArray.length) {
                    filter.setConTileType(null);
                } else {
                    const con = filter.createIfNotExistsConTileType();
                    con.setValueArray(unitTypeArray);
                    con.setIsOneOf(!!con.getIsOneOf());
                }
                this._updateView();
            },
        });
    }
    private _onTouchedBtnConTileTypePredicate(): void {
        const con = this._getTileFilter().createIfNotExistsConTileType();
        con.setIsOneOf(!con.getIsOneOf());
        this._updateView();
    }

    private _onTouchedBtnConHp(): void {
        const filter = this._getTileFilter();
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

    private _onTouchedBtnConIsOwnerPlayerInTurn(): void {
        const filter    = this._getTileFilter();
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

    private _onTouchedBtnConIsHighlighted(): void {
        const filter    = this._getTileFilter();
        const con       = filter.getConIsHighlighted();
        if (con == null) {
            filter.setConIsHighlighted(true);
        } else if (con) {
            filter.setConIsHighlighted(false);
        } else {
            filter.setConIsHighlighted(null);
        }
        this._updateView();
    }

    private _onTouchedBtnConUnitsCount(): void {
        const filter = this._getTileFilter();
        const oldCon = filter.getConUnitsCount();

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.B0773),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.B0773),
                minValue        : 0,
                maxValue        : 100,
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConUnitsCount(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConUnitsCount(ValueAndComparator.fromJson({
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
        const filter = this._getTileFilter();
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

    private _onTouchedBtnConBuildPoint(): void {
        const filter = this._getTileFilter();
        const oldCon = filter.getConBuildPoint();

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.BuildPoint),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.BuildPoint),
                minValue        : 0,
                maxValue        : 100,
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConBuildPoint(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConBuildPoint(ValueAndComparator.fromJson({
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

    private _onTouchedBtnConCapturePoint(): void {
        const filter = this._getTileFilter();
        const oldCon = filter.getConCapturePoint();

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.CapturePoint),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.CapturePoint),
                minValue        : 0,
                maxValue        : 100,
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConCapturePoint(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConCapturePoint(ValueAndComparator.fromJson({
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

    private _onTouchedBtnConGridIndexArray(): void {
        const mapSize = this.getOpenData()?.mapSize;
        if (mapSize == null) {
            return;
        }

        const filter = this._getTileFilter();
        openPanel(getDict().CommonChooseGridIndexPanel, {
            currentGridIndexArray   : getNonNullElements(filter.getConGridIndex()?.getGridIndexArray().map(v => GridIndex.convertGridIndex(v)) ?? []),
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
        const con = this._getTileFilter().createIfNotExistsConGridIndex();
        con.setIsOneOf(!con.getIsOneOf());
        this._updateView();
    }

    private _onTouchedBtnConLocationIdArray(): void {
        const filter = this._getTileFilter();
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
        const filter = this._getTileFilter();
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
        const filter = this._getTileFilter();
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : filter.getConBuffTypeId()?.getValueArray() ?? [],
            availableNumberArray    : AllBuffTypeIdArray,
            getTitleText            : () => getText(TextType.AbnormalStateTypeId),
            getNumberMainText       : v => getTileBuffName(v) ?? UndefinedError,
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
        const filter = this._getTileFilter();
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
        this._labelTitle.setLangText(TextType.TileFilter);
        this._btnClear.setLangText(TextType.B0391);

        this._btnConPlayerIndexArray.setLangText(TextType.PlayerIndex);
        this._btnConTeamIndexArray.setLangText(TextType.B0019);
        this._btnConTileTypeArray.setLangText(TextType.B0718);
        this._btnConHp.setLangText(TextType.Hp);
        this._btnConIsOwnerPlayerInTurn.setLangText(TextType.B0086);
        this._btnConIsHighlighted.setLangText(TextType.IsHighlighted);
        this._btnConUnitsCount.setLangText(TextType.B0773);
        this._btnConCustomNameId.setLangText(TextType.CustomNameId);
        this._btnConBuildPoint.setLangText(TextType.BuildPoint);
        this._btnConCapturePoint.setLangText(TextType.CapturePoint);
        this._btnConGridIndexArray.setLangText(TextType.B0531);
        this._btnConLocationIdArray.setLangText(TextType.Location);
        this._btnConBuffTypeIdArray.setLangText(TextType.AbnormalStateTypeId);

        this._btnConPlayerIndexPredicate.setLangText(TextType.B1403);
        this._btnConTeamIndexPredicate.setLangText(TextType.B1403);
        this._btnConTileTypePredicate.setLangText(TextType.B1403);
        this._btnConGridIndexPredicate.setLangText(TextType.B1403);
        this._btnConLocationIdPredicate.setLangText(TextType.B1417);
        this._btnConBuffTypeIdPredicate.setLangText(TextType.B1417);

        this._updateLabelDescAndLabelError();

        this._updateLabelsForConPlayerIndex();
        this._updateLabelsForConTeamIndex();
        this._updateLabelsForConTileType();
        this._updateLabelsForConHp();
        this._updateLabelsForConIsOwnerPlayerInTurn();
        this._updateLabelsForConIsHighlighted();
        this._updateLabelsForConUnitsCount();
        this._updateLabelsForConCustomNameId();
        this._updateLabelsForConBuildPoint();
        this._updateLabelsForConCapturePoint();
        this._updateLabelsForConGridIndex();
        this._updateLabelsForConLocationId();
        this._updateLabelsForConBuffTypeId();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileFilter        = this._getTileFilter();
        const gameConfig        = openData.gameConfig;
        const errorTip          = getErrorTip(tileFilter, openData.playersCountUnneutral, openData.mapSize, gameConfig);
        const labelError        = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getDesc(tileFilter, gameConfig));
        this._groupDesc.arrangeItems();
        this._scrDesc.updateOnItemsChanged();
    }
    private _updateLabelsForConPlayerIndex(): void {
        const con           = this._getTileFilter().getConPlayerIndex();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConPlayerIndexArray.setText(valueArray?.map(v => `P${v}`).join(`, `) ?? ``);
        this._labelConPlayerIndexPredicate.setText(con == null ? `` : getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConTeamIndex(): void {
        const con           = this._getTileFilter().getConTeamIndex();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConTeamIndexArray.setText(valueArray?.map(v => getPlayerTeamName(v)).join(`, `) ?? ``);
        this._labelConTeamIndexPredicate.setText(con == null ? `` : getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConTileType(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const con           = this._getTileFilter().getConTileType();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConTileTypeArray.setText(valueArray?.map(v => getTileName(v, gameConfig)).join(`, `) ?? ``);
        this._labelConTileTypePredicate.setText(con == null ? `` : getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConHp(): void {
        const con = this._getTileFilter().getConHp();
        this._labelConHp.setText(con == null ? `` : getBriefDesc(con));
    }
    private _updateLabelsForConIsOwnerPlayerInTurn(): void {
        const con = this._getTileFilter().getConIsOwnerPlayerInTurn();
        this._labelConIsOwnerPlayerInTurn.setText(con == null ? `` : getTextForYesOrNo(con));
    }
    private _updateLabelsForConIsHighlighted(): void {
        const con = this._getTileFilter().getConIsHighlighted();
        this._labelConIsHighlighted.setText(con == null ? `` : getTextForYesOrNo(con));
    }
    private _updateLabelsForConUnitsCount(): void {
        const con = this._getTileFilter().getConUnitsCount();
        this._labelConUnitsCount.setText(con == null ? `` : getBriefDesc(con));
    }
    private _updateLabelsForConCustomNameId(): void {
        const con = this._getTileFilter().getConCustomNameId();
        this._labelConCustomNameId.setText(con == null ? `` : getBriefDesc(con));
    }
    private _updateLabelsForConBuildPoint(): void {
        const con = this._getTileFilter().getConBuildPoint();
        this._labelConBuildPoint.setText(con == null ? `` : getBriefDesc(con));
    }
    private _updateLabelsForConCapturePoint(): void {
        const con = this._getTileFilter().getConCapturePoint();
        this._labelConCapturePoint.setText(con == null ? `` : getBriefDesc(con));
    }
    private _updateLabelsForConGridIndex() {
        const con = this._getTileFilter().getConGridIndex();
        this._labelConGridIndexArray.setText(con?.getGridIndexArray()?.map(v => `(${v.getX()},${v.getY()})`).join(`, `) ?? ``);
        this._labelConGridIndexPredicate.setText(con == null ? `` : getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConLocationId() {
        const con = this._getTileFilter().getConLocationId();
        this._labelConLocationIdArray.setText(con?.getValueArray()?.join(`, `) ?? ``);
        this._labelConLocationIdPredicate.setText(con == null ? `` : getSetRelationName(con.getSetRelation()));
    }
    private _updateLabelsForConBuffTypeId() {
        const con = this._getTileFilter().getConBuffTypeId();
        this._labelConBuffTypeIdArray.setText(con?.getValueArray()?.map(v => getTileBuffName(v))?.join(`, `) ?? ``);
        this._labelConBuffTypeIdPredicate.setText(con == null ? `` : getSetRelationName(con.getSetRelation()));
    }

    private _getTileFilter(): TileFilter {
        return this._tileFilter;
    }
}
