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
import * as ProtoSchemaCommonProtoStructureTileFilter from "../../proto/schema/CommonProto/Structure/TileFilter.ts";
import * as ProtoSchemaCommonProtoStructureValueAndComparator from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TeamsConstants from "../../teams/Constants.ts";
import * as TileBuffsConstants from "../../tileBuffs/Constants.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import * as TilesUtilsFilter from "../../tiles/utils/Filter.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as ValueAndComparatorsConstants from "../../valueAndComparators/Constants.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as ValueSetAndRelationsConstants from "../../valueSetAndRelations/Constants.ts";

export interface OpenData {
    gameConfig              : GameConfigGcData.GcData;
    playersCountUnneutral   : number;
    mapSize                 : AuxiliaryTypesMapSize.MapSize;
    currentFilter           : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureTileFilter.TileFilter>;
    callback                : ((tileFilter: ProtoSchemaCommonProtoStructureTileFilter.TileFilter | null) => void) | null;
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

    private readonly _btnConTileTypeArray!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTileTypeArray!                    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConTileTypePredicate!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTileTypePredicate!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConHp!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConHp!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConIsOwnerPlayerInTurn!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConIsOwnerPlayerInTurn!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConIsHighlighted!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConIsHighlighted!                    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConUnitsCount!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConUnitsCount!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConCustomNameId!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConCustomNameId!                     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConBuildPoint!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConBuildPoint!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConCapturePoint!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConCapturePoint!                     : UiInterfacesIUiLabel.IUiLabel;

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

    private _tileFilter = new ProtoSchemaCommonProtoStructureTileFilter.TileFilter();

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
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._tileFilter = this.getOpenData()?.currentFilter?.clone() ?? new ProtoSchemaCommonProtoStructureTileFilter.TileFilter();

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
                    const tileFilter = this._getTileFilter();
                    callback(TilesUtilsFilter.checkIsEmpty(tileFilter) ? null : tileFilter);
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
                this._tileFilter = new ProtoSchemaCommonProtoStructureTileFilter.TileFilter();
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray          : oldCon?.getValueArray() ?? [],
            availableNumberArray        : HelpersCollection.createRange(PlayersConstants.PlayerIndex.Neutral, playersCountUnneutral + 1, 1),
            getTitleText                : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B0031)),
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiTileTypePanel, {
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0773),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.B0773),
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
                            filter.setConUnitsCount(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.CustomNameId),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.CustomNameId),
                minValue        : TilesConstantsCommon.CustomName.MinId,
                maxValue        : TilesConstantsCommon.CustomName.MaxId,
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

    private _onTouchedBtnConBuildPoint(): void {
        const filter = this._getTileFilter();
        const oldCon = filter.getConBuildPoint();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.BuildPoint),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.BuildPoint),
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
                            filter.setConBuildPoint(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.CapturePoint),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon == null ? null : oldCon.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.CapturePoint),
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
                            filter.setConCapturePoint(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseGridIndexPanel, {
            currentGridIndexArray   : HelpersCollection.getNonNullElements(filter.getConGridIndex()?.getGridIndexArray().map(v => AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v)) ?? []),
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
        const con = this._getTileFilter().createIfNotExistsConGridIndex();
        con.setIsOneOf(!con.getIsOneOf());
        this._updateView();
    }

    private _onTouchedBtnConLocationIdArray(): void {
        const filter = this._getTileFilter();
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
        const filter = this._getTileFilter();
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
        const filter = this._getTileFilter();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : filter.getConBuffTypeId()?.getValueArray() ?? [],
            availableNumberArray    : TileBuffsConstants.AllBuffTypeIdArray,
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId),
            getNumberMainText       : v => LangUtils.getTileBuffName(v) ?? LangConstants.UndefinedError,
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
        const filter = this._getTileFilter();
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
        this._labelTitle.setLangText(LangConstants.TextType.TileFilter);
        this._btnClear.setLangText(LangConstants.TextType.B0391);

        this._btnConPlayerIndexArray.setLangText(LangConstants.TextType.PlayerIndex);
        this._btnConTeamIndexArray.setLangText(LangConstants.TextType.B0019);
        this._btnConTileTypeArray.setLangText(LangConstants.TextType.B0718);
        this._btnConHp.setLangText(LangConstants.TextType.Hp);
        this._btnConIsOwnerPlayerInTurn.setLangText(LangConstants.TextType.B0086);
        this._btnConIsHighlighted.setLangText(LangConstants.TextType.IsHighlighted);
        this._btnConUnitsCount.setLangText(LangConstants.TextType.B0773);
        this._btnConCustomNameId.setLangText(LangConstants.TextType.CustomNameId);
        this._btnConBuildPoint.setLangText(LangConstants.TextType.BuildPoint);
        this._btnConCapturePoint.setLangText(LangConstants.TextType.CapturePoint);
        this._btnConGridIndexArray.setLangText(LangConstants.TextType.B0531);
        this._btnConLocationIdArray.setLangText(LangConstants.TextType.Location);
        this._btnConBuffTypeIdArray.setLangText(LangConstants.TextType.AbnormalStateTypeId);

        this._btnConPlayerIndexPredicate.setLangText(LangConstants.TextType.B1403);
        this._btnConTeamIndexPredicate.setLangText(LangConstants.TextType.B1403);
        this._btnConTileTypePredicate.setLangText(LangConstants.TextType.B1403);
        this._btnConGridIndexPredicate.setLangText(LangConstants.TextType.B1403);
        this._btnConLocationIdPredicate.setLangText(LangConstants.TextType.B1417);
        this._btnConBuffTypeIdPredicate.setLangText(LangConstants.TextType.B1417);

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
        const errorTip          = TilesUtilsFilter.getErrorTip(tileFilter, openData.playersCountUnneutral, openData.mapSize, gameConfig);
        const labelError        = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(TilesUtilsFilter.getDesc(tileFilter, gameConfig));
        this._groupDesc.arrangeItems();
        this._scrDesc.updateOnItemsChanged();
    }
    private _updateLabelsForConPlayerIndex(): void {
        const con           = this._getTileFilter().getConPlayerIndex();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConPlayerIndexArray.setText(valueArray?.map(v => `P${v}`).join(`, `) ?? ``);
        this._labelConPlayerIndexPredicate.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConTeamIndex(): void {
        const con           = this._getTileFilter().getConTeamIndex();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConTeamIndexArray.setText(valueArray?.map(v => LangUtils.getPlayerTeamName(v)).join(`, `) ?? ``);
        this._labelConTeamIndexPredicate.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConTileType(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const con           = this._getTileFilter().getConTileType();
        const valueArray    = con == null ? null : con.getValueArray();
        this._labelConTileTypeArray.setText(valueArray?.map(v => LangUtils.getTileName(v, gameConfig)).join(`, `) ?? ``);
        this._labelConTileTypePredicate.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConHp(): void {
        const con = this._getTileFilter().getConHp();
        this._labelConHp.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }
    private _updateLabelsForConIsOwnerPlayerInTurn(): void {
        const con = this._getTileFilter().getConIsOwnerPlayerInTurn();
        this._labelConIsOwnerPlayerInTurn.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con));
    }
    private _updateLabelsForConIsHighlighted(): void {
        const con = this._getTileFilter().getConIsHighlighted();
        this._labelConIsHighlighted.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con));
    }
    private _updateLabelsForConUnitsCount(): void {
        const con = this._getTileFilter().getConUnitsCount();
        this._labelConUnitsCount.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }
    private _updateLabelsForConCustomNameId(): void {
        const con = this._getTileFilter().getConCustomNameId();
        this._labelConCustomNameId.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }
    private _updateLabelsForConBuildPoint(): void {
        const con = this._getTileFilter().getConBuildPoint();
        this._labelConBuildPoint.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }
    private _updateLabelsForConCapturePoint(): void {
        const con = this._getTileFilter().getConCapturePoint();
        this._labelConCapturePoint.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }
    private _updateLabelsForConGridIndex() {
        const con = this._getTileFilter().getConGridIndex();
        this._labelConGridIndexArray.setText(con?.getGridIndexArray()?.map(v => `(${v.getX()},${v.getY()})`).join(`, `) ?? ``);
        this._labelConGridIndexPredicate.setText(con == null ? `` : LangUtils.getTextForYesOrNo(con.getIsOneOf()));
    }
    private _updateLabelsForConLocationId() {
        const con = this._getTileFilter().getConLocationId();
        this._labelConLocationIdArray.setText(con?.getValueArray()?.join(`, `) ?? ``);
        this._labelConLocationIdPredicate.setText(con == null ? `` : LangUtils.getSetRelationName(con.getSetRelation()));
    }
    private _updateLabelsForConBuffTypeId() {
        const con = this._getTileFilter().getConBuffTypeId();
        this._labelConBuffTypeIdArray.setText(con?.getValueArray()?.map(v => LangUtils.getTileBuffName(v))?.join(`, `) ?? ``);
        this._labelConBuffTypeIdPredicate.setText(con == null ? `` : LangUtils.getSetRelationName(con.getSetRelation()));
    }

    private _getTileFilter(): ProtoSchemaCommonProtoStructureTileFilter.TileFilter {
        return this._tileFilter;
    }
}
