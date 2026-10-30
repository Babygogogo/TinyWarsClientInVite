import {
    TileBuffs_Constants,
    ValueAndComparators_Constants,
    Locations_Constants,
    ValueSetAndRelations_Constants,
    Tiles_Utils_Filter,
    Graphics_Constants,
    Helpers_Collection,
    Tiles_Constants_Common,
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
import { TileFilter } from "../../proto/schema/CommonProto/Structure/TileFilter.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";

export interface OpenData {
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    playersCountUnneutral   : number;
    mapSize                 : AuxiliaryTypes_MapSize.MapSize;
    currentFilter           : AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileFilter>;
    callback                : ((tileFilter: TileFilter | null) => void) | null;
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

    private readonly _btnConTileTypeArray!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTileTypeArray!                    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConTileTypePredicate!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTileTypePredicate!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConHp!                                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConHp!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConIsOwnerPlayerInTurn!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConIsOwnerPlayerInTurn!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConIsHighlighted!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConIsHighlighted!                    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConUnitsCount!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConUnitsCount!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConCustomNameId!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConCustomNameId!                     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConBuildPoint!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConBuildPoint!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConCapturePoint!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConCapturePoint!                     : Ui_Interfaces_IUiLabel.IUiLabel;

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

    private _tileFilter = new TileFilter();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
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
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent             : () => Lang_Utils.getText(Lang_Constants.TextType.A0418),
                getTextForConfirm      : () => Lang_Utils.getText(Lang_Constants.TextType.Yes),
                getTextForCancel       : () => Lang_Utils.getText(Lang_Constants.TextType.No),
                callback            : () => {
                    const tileFilter = this._getTileFilter();
                    callback(Tiles_Utils_Filter.checkIsEmpty(tileFilter) ? null : tileFilter);
                    this.closePanel();
                },
                callbackOnCancel    : () => this.closePanel(),
                showButtonClose     : true,
            });
        }
    }
    private _onTouchedBtnClear(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray          : oldCon?.getValueArray() ?? [],
            availableNumberArray        : Helpers_Collection.createRange(Players_Constants.PlayerIndex.Neutral, playersCountUnneutral + 1, 1),
            getTitleText                : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B0031)),
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : oldCon?.getValueArray() ?? [],
            availableNumberArray    : Helpers_Collection.createRange(Teams_Constants.TeamIndex.Neutral, playersCountUnneutral + 1, 1),
            getTitleText            : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B0019)),
            getNumberMainText       : num => Lang_Utils.getPlayerTeamName(num) ?? Lang_Constants.UndefinedError,
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiTileTypePanel, {
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B0807),
            availableNumberArray    : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm       : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.B0807),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B0773),
            availableNumberArray    : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm       : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.B0773),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.CustomNameId),
            availableNumberArray    : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm       : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.CustomNameId),
                minValue        : Tiles_Constants_Common.CustomName.MinId,
                maxValue        : Tiles_Constants_Common.CustomName.MaxId,
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.BuildPoint),
            availableNumberArray    : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm       : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.BuildPoint),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.CapturePoint),
            availableNumberArray    : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm       : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.CapturePoint),
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseGridIndexPanel, {
            currentGridIndexArray   : Helpers_Collection.getNonNullElements(filter.getConGridIndex()?.getGridIndexArray().map(v => AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v)) ?? []),
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : filter.getConLocationId()?.getValueArray() ?? [],
            availableIntegerArray   : Locations_Constants.AllLocationIdArray,
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.Location),
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.Location),
            availableNumberArray    : ValueSetAndRelations_Constants.AllSetRelationIdArray,
            currentNumber           : filter.getConLocationId()?.getSetRelation(),
            getNumberMainText       : num => Lang_Utils.getSetRelationName(num),
            callbackOnConfirm       : setRelation => {
                filter.createIfNotExistsConLocationId().setSetRelation(setRelation);
                this._updateView();
            },
        });
    }

    private _onTouchedBtnConBuffTypeIdArray(): void {
        const filter = this._getTileFilter();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : filter.getConBuffTypeId()?.getValueArray() ?? [],
            availableNumberArray    : TileBuffs_Constants.AllBuffTypeIdArray,
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId),
            getNumberMainText       : v => Lang_Utils.getTileBuffName(v) ?? Lang_Constants.UndefinedError,
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId),
            availableNumberArray    : ValueSetAndRelations_Constants.AllSetRelationIdArray,
            currentNumber           : filter.getConBuffTypeId()?.getSetRelation(),
            getNumberMainText       : num => Lang_Utils.getSetRelationName(num),
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
        this._labelTitle.setLangText(Lang_Constants.TextType.TileFilter);
        this._btnClear.setLangText(Lang_Constants.TextType.B0391);

        this._btnConPlayerIndexArray.setLangText(Lang_Constants.TextType.PlayerIndex);
        this._btnConTeamIndexArray.setLangText(Lang_Constants.TextType.B0019);
        this._btnConTileTypeArray.setLangText(Lang_Constants.TextType.B0718);
        this._btnConHp.setLangText(Lang_Constants.TextType.Hp);
        this._btnConIsOwnerPlayerInTurn.setLangText(Lang_Constants.TextType.B0086);
        this._btnConIsHighlighted.setLangText(Lang_Constants.TextType.IsHighlighted);
        this._btnConUnitsCount.setLangText(Lang_Constants.TextType.B0773);
        this._btnConCustomNameId.setLangText(Lang_Constants.TextType.CustomNameId);
        this._btnConBuildPoint.setLangText(Lang_Constants.TextType.BuildPoint);
        this._btnConCapturePoint.setLangText(Lang_Constants.TextType.CapturePoint);
        this._btnConGridIndexArray.setLangText(Lang_Constants.TextType.B0531);
        this._btnConLocationIdArray.setLangText(Lang_Constants.TextType.Location);
        this._btnConBuffTypeIdArray.setLangText(Lang_Constants.TextType.AbnormalStateTypeId);

        this._btnConPlayerIndexPredicate.setLangText(Lang_Constants.TextType.B1403);
        this._btnConTeamIndexPredicate.setLangText(Lang_Constants.TextType.B1403);
        this._btnConTileTypePredicate.setLangText(Lang_Constants.TextType.B1403);
        this._btnConGridIndexPredicate.setLangText(Lang_Constants.TextType.B1403);
        this._btnConLocationIdPredicate.setLangText(Lang_Constants.TextType.B1417);
        this._btnConBuffTypeIdPredicate.setLangText(Lang_Constants.TextType.B1417);

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
        const errorTip          = Tiles_Utils_Filter.getErrorTip(tileFilter, openData.playersCountUnneutral, openData.mapSize, gameConfig);
        const labelError        = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(Tiles_Utils_Filter.getDesc(tileFilter, gameConfig));
        this._groupDesc.arrangeItems();
        this._scrDesc.updateOnItemsChanged();
    }
    private _updateLabelsForConPlayerIndex(): void {
        const con           = this._getTileFilter().getConPlayerIndex();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConPlayerIndexArray.setText(valueArray?.map(v => `P${v}`).join(`, `) ?? ``);
        this._labelConPlayerIndexPredicate.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConTeamIndex(): void {
        const con           = this._getTileFilter().getConTeamIndex();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConTeamIndexArray.setText(valueArray?.map(v => Lang_Utils.getPlayerTeamName(v)).join(`, `) ?? ``);
        this._labelConTeamIndexPredicate.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConTileType(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const con           = this._getTileFilter().getConTileType();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConTileTypeArray.setText(valueArray?.map(v => Lang_Utils.getTileName(v, gameConfig)).join(`, `) ?? ``);
        this._labelConTileTypePredicate.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConHp(): void {
        const con = this._getTileFilter().getConHp();
        this._labelConHp.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }
    private _updateLabelsForConIsOwnerPlayerInTurn(): void {
        const con = this._getTileFilter().getConIsOwnerPlayerInTurn();
        this._labelConIsOwnerPlayerInTurn.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con));
    }
    private _updateLabelsForConIsHighlighted(): void {
        const con = this._getTileFilter().getConIsHighlighted();
        this._labelConIsHighlighted.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con));
    }
    private _updateLabelsForConUnitsCount(): void {
        const con = this._getTileFilter().getConUnitsCount();
        this._labelConUnitsCount.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }
    private _updateLabelsForConCustomNameId(): void {
        const con = this._getTileFilter().getConCustomNameId();
        this._labelConCustomNameId.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }
    private _updateLabelsForConBuildPoint(): void {
        const con = this._getTileFilter().getConBuildPoint();
        this._labelConBuildPoint.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }
    private _updateLabelsForConCapturePoint(): void {
        const con = this._getTileFilter().getConCapturePoint();
        this._labelConCapturePoint.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }
    private _updateLabelsForConGridIndex() {
        const con = this._getTileFilter().getConGridIndex();
        this._labelConGridIndexArray.setText(con?.getGridIndexArray()?.map(v => `(${v.getX()},${v.getY()})`).join(`, `) ?? ``);
        this._labelConGridIndexPredicate.setText(con == null ? `` : Lang_Utils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConLocationId() {
        const con = this._getTileFilter().getConLocationId();
        this._labelConLocationIdArray.setText(con?.getValueArray()?.join(`, `) ?? ``);
        this._labelConLocationIdPredicate.setText(con == null ? `` : Lang_Utils.getSetRelationName(con.getSetRelation()));
    }
    private _updateLabelsForConBuffTypeId() {
        const con = this._getTileFilter().getConBuffTypeId();
        this._labelConBuffTypeIdArray.setText(con?.getValueArray()?.map(v => Lang_Utils.getTileBuffName(v))?.join(`, `) ?? ``);
        this._labelConBuffTypeIdPredicate.setText(con == null ? `` : Lang_Utils.getSetRelationName(con.getSetRelation()));
    }

    private _getTileFilter(): TileFilter {
        return this._tileFilter;
    }
}
