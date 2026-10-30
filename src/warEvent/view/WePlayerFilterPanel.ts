import {
    Players_Constants,
    ValueAndComparators_Constants,
    CoSkills_Constants,
    Players_Utils_Filter,
    Graphics_Constants,
    Helpers_Collection,
    ValueAndComparators_Utils,
    Lang_Utils,
    GamePanels_Dict,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Teams_Constants,
    Lang_Constants,
    ValueArrayAndPredicates_Utils,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { PlayerFilter } from "../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";

export interface OpenData {
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    playersCountUnneutral   : number;
    currentFilter           : AuxiliaryTypes_AuxiliaryTypes.Undefinable<PlayerFilter>;
    callback                : ((playerFilter: PlayerFilter | null) => void) | null;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClear!                                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDesc!                                : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConIsInTurn!                           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConIsInTurn!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConIsSkipTurn!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConIsSkipTurn!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConPlayerIndexArray!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConPlayerIndexArray!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConPlayerIndexPredicate!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConPlayerIndexPredicate!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConTeamIndexArray!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTeamIndexArray!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConTeamIndexPredicate!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTeamIndexPredicate!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConAliveStateArray!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConAliveStateArray!                  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConAliveStatePredicate!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConAliveStatePredicate!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConCoUsingSkillTypeArray!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConCoUsingSkillTypeArray!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConCoUsingSkillTypePredicate!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConCoUsingSkillTypePredicate!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConCoCategoryIdArray!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConCoCategoryIdArray!                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConCoCategoryIdPredicate!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConCoCategoryIdPredicate!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConFund!                               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConFund!                             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConCoEnergy!                           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConCoEnergy!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private _filter = new PlayerFilter();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                 callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.WarEventFullDataChanged,         callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                               callback : this._onTouchedBtnClose },
            { ui : this._btnClear,                               callback : this._onTouchedBtnClear },

            { ui : this._btnConIsInTurn,                            callback : this._onTouchedBtnIsInTurn },

            { ui : this._btnConIsSkipTurn,                          callback : this._onTouchedBtnIsSkipTurn },

            { ui : this._btnConPlayerIndexPredicate,                callback : this._onTouchedBtnPlayerIndexPredicate },
            { ui : this._btnConPlayerIndexArray,                    callback : this._onTouchedBtnPlayerIndexArray },

            { ui : this._btnConTeamIndexPredicate,                  callback : this._onTouchedBtnTeamIndexPredicate },
            { ui : this._btnConTeamIndexArray,                      callback : this._onTouchedBtnTeamIndexArray },

            { ui : this._btnConCoEnergy,                            callback : this._onTouchedBtnCoEnergy },

            { ui : this._btnConFund,                                callback : this._onTouchedBtnFund },

            { ui : this._btnConAliveStatePredicate,                 callback : this._onTouchedBtnAliveStatePredicate },
            { ui : this._btnConAliveStateArray,                     callback : this._onTouchedBtnAliveStateArray },

            { ui : this._btnConCoUsingSkillTypePredicate,           callback : this._onTouchedBtnCoUsingSkillTypePredicate },
            { ui : this._btnConCoUsingSkillTypeArray,               callback : this._onTouchedBtnCoUsingSkillTypeArray },

            { ui : this._btnConCoCategoryIdPredicate,               callback : this._onTouchedBtnCoCategoryIdPredicate },
            { ui : this._btnConCoCategoryIdArray,                   callback : this._onTouchedBtnCoCategoryIdArray },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._filter = this.getOpenData()?.currentFilter?.clone() ?? new PlayerFilter();

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
                    const playerFilter = this._getPlayerFilter();
                    callback(Players_Utils_Filter.checkIsEmpty(playerFilter) ? null : playerFilter);
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
                this._filter = new PlayerFilter();
                this._updateView();
            },
        });
    }

    private _onTouchedBtnIsInTurn(): void {
        const filter    = this._getPlayerFilter();
        const con       = filter.getConIsInTurn();
        if (con == null) {
            filter.setConIsInTurn(true);
        } else if (con) {
            filter.setConIsInTurn(false);
        } else {
            filter.setConIsInTurn(null);
        }
        this._updateView();
    }
    private _onTouchedBtnIsSkipTurn(): void {
        const filter = this._getPlayerFilter();
        const con    = filter.getConIsSkipTurn();
        if (con == null) {
            filter.setConIsSkipTurn(true);
        } else if (con) {
            filter.setConIsSkipTurn(false);
        } else {
            filter.setConIsSkipTurn(null);
        }
        this._updateView();
    }

    private _onTouchedBtnPlayerIndexPredicate(): void {
        const con = this._getPlayerFilter().createIfNotExistsConPlayerIndex();
        ValueArrayAndPredicates_Utils.tickIsOneOf(con);
        this._updateView();
    }
    private _onTouchedBtnPlayerIndexArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const filter = this._getPlayerFilter();
        const oldCon = filter.getConPlayerIndex();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex),
            availableNumberArray : Helpers_Collection.createRange(Players_Constants.PlayerIndex.Neutral, openData.playersCountUnneutral + 1, 1),
            currentNumberArray   : oldCon?.getValueArray() ?? [],
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

    private _onTouchedBtnTeamIndexPredicate(): void {
        const con = this._getPlayerFilter().createIfNotExistsConTeamIndex();
        ValueArrayAndPredicates_Utils.tickIsOneOf(con);
        this._updateView();
    }
    private _onTouchedBtnTeamIndexArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const filter = this._getPlayerFilter();
        const oldCon = filter.getConTeamIndex();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B0019),
            availableNumberArray : Helpers_Collection.createRange(Teams_Constants.TeamIndex.Neutral, openData.playersCountUnneutral + 1, 1),
            currentNumberArray   : oldCon?.getValueArray() ?? [],
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

    private _onTouchedBtnCoEnergy(): void {
        const filter = this._getPlayerFilter();
        const oldCon = filter.getConCoEnergy();

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.CoEnergy),
            availableNumberArray : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber        : oldCon?.getComparator(),
            getNumberMainText    : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.CoEnergy),
                minValue     : 0,
                maxValue     : 1000000,
                currentValue : oldCon?.getValue(),
                callback     : value => {
                    if (value == null) {
                        filter.setConCoEnergy(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConCoEnergy(ValueAndComparator.fromJson({
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

    private _onTouchedBtnFund(): void {
        const filter = this._getPlayerFilter();
        const oldCon = filter.getConFund();

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.Fund),
            availableNumberArray : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber        : oldCon?.getComparator(),
            getNumberMainText    : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : sign => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Fund),
                minValue     : 0,
                maxValue     : Players_Constants.Fund.MaxFund,
                currentValue : oldCon?.getValue(),
                callback     : value => {
                    if (value == null) {
                        filter.setConFund(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConFund(ValueAndComparator.fromJson({
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

    private _onTouchedBtnAliveStatePredicate(): void {
        const con = this._getPlayerFilter().createIfNotExistsConAliveState();
        ValueArrayAndPredicates_Utils.tickIsOneOf(con);
        this._updateView();
    }
    private _onTouchedBtnAliveStateArray(): void {
        const filter = this._getPlayerFilter();
        const oldCon = filter.getConAliveState();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.PlayerAliveState),
            availableNumberArray : Players_Constants.AllAliveStateIdArray,
            currentNumberArray   : oldCon?.getValueArray(),
            getNumberMainText    : num => Lang_Utils.getPlayerAliveStateName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : valueArray => {
                if (!valueArray.length) {
                    filter.setConAliveState(null);
                } else {
                    const con = filter.createIfNotExistsConAliveState();
                    con.setValueArray(valueArray);
                    con.setIsOneOf(!!con.getIsOneOf());
                }
                this._updateView();
            },
        });
    }

    private _onTouchedBtnCoUsingSkillTypePredicate(): void {
        const con = this._getPlayerFilter().createIfNotExistsConCoUsingSkillType();
        ValueArrayAndPredicates_Utils.tickIsOneOf(con);
        this._updateView();
    }
    private _onTouchedBtnCoUsingSkillTypeArray(): void {
        const filter = this._getPlayerFilter();
        const oldCon = filter.getConCoUsingSkillType();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.ActivatingCoSkillType),
            availableNumberArray : CoSkills_Constants.AllSkillTypeIdArray,
            currentNumberArray   : oldCon?.getValueArray(),
            getNumberMainText    : num => Lang_Utils.getCoSkillTypeName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : valueArray => {
                if (!valueArray.length) {
                    filter.setConCoUsingSkillType(null);
                } else {
                    const con = filter.createIfNotExistsConCoUsingSkillType();
                    con.setValueArray(valueArray);
                    con.setIsOneOf(!!con.getIsOneOf());
                }
                this._updateView();
            },
        });
    }

    private _onTouchedBtnCoCategoryIdPredicate(): void {
        const con = this._getPlayerFilter().createIfNotExistsConCoCategoryId();
        ValueArrayAndPredicates_Utils.tickIsOneOf(con);
        this._updateView();
    }
    private _onTouchedBtnCoCategoryIdArray(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const filter = this._getPlayerFilter();
        const oldCon = filter.getConCoCategoryId();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiCoCategoryIdPanel, {
            getTitleText                   : () => Lang_Utils.getText(Lang_Constants.TextType.B0394),
            gameConfig                     : gameConfig,
            forceUnchosenCoCategoryIdArray : [],
            availableCoCategoryIdArray     : gameConfig.getAllEnabledCoCategoryIdArray(),
            currentCoCategoryIdArray       : oldCon?.getValueArray() ?? [],
            maxChooseCount                 : null,
            isBan                          : false,
            callbackOnConfirm              : valueArray => {
                if (!valueArray.length) {
                    filter.setConCoCategoryId(null);
                } else {
                    const con = filter.createIfNotExistsConCoCategoryId();
                    con.setValueArray(valueArray);
                    con.setIsOneOf(!!con.getIsOneOf());
                }
                this._updateView();
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateLabelsForPlayerIndex();
        this._updateLabelsForTeamIndex();
        this._updateLabelsForAliveState();
        this._updateLabelsForCoUsingSkillType();
        this._updateLabelsForCoCategoryId();
        this._updateLabelIsInTurn();
        this._updateLabelIsSkipTurn();
        this._updateLabelsForConFund();
        this._updateLabelsForConCoEnergy();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.PlayerFilter);
        this._btnClear.setLangText(Lang_Constants.TextType.B0391);

        this._btnConIsInTurn.setLangText(Lang_Constants.TextType.B1401);
        this._btnConIsSkipTurn.setLangText(Lang_Constants.TextType.B1402);
        this._btnConPlayerIndexPredicate.setLangText(Lang_Constants.TextType.B1403);
        this._btnConPlayerIndexArray.setLangText(Lang_Constants.TextType.PlayerIndex);
        this._btnConTeamIndexPredicate.setLangText(Lang_Constants.TextType.B1403);
        this._btnConTeamIndexArray.setLangText(Lang_Constants.TextType.B0019);
        this._btnConCoEnergy.setLangText(Lang_Constants.TextType.CoEnergy);
        this._btnConFund.setLangText(Lang_Constants.TextType.Fund);
        this._btnConAliveStatePredicate.setLangText(Lang_Constants.TextType.B1403);
        this._btnConAliveStateArray.setLangText(Lang_Constants.TextType.PlayerAliveState);
        this._btnConCoUsingSkillTypePredicate.setLangText(Lang_Constants.TextType.B1403);
        this._btnConCoUsingSkillTypeArray.setLangText(Lang_Constants.TextType.ActivatingCoSkillType);
        this._btnConCoCategoryIdPredicate.setLangText(Lang_Constants.TextType.B1403);
        this._btnConCoCategoryIdArray.setLangText(Lang_Constants.TextType.B0394);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerFilter      = this._getPlayerFilter();
        const gameConfig        = openData.gameConfig;
        const errorTip          = Players_Utils_Filter.getErrorTip(playerFilter, openData.playersCountUnneutral, gameConfig);
        const labelError        = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(Players_Utils_Filter.getDesc(playerFilter, gameConfig));
        this._groupDesc.arrangeItems();
    }
    private _updateLabelsForPlayerIndex(): void {
        const con               = this._getPlayerFilter().getConPlayerIndex();
        const labelArray        = this._labelConPlayerIndexArray;
        const labelPredicate    = this._labelConPlayerIndexPredicate;
        if (con == null) {
            labelArray.setText(``);
            labelPredicate.setText(``);
        } else {
            labelArray.setText(con.getValueArray()?.map(v => `P${v}`).join(`, `));
            labelPredicate.setLangText(con.getIsOneOf() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        }
    }
    private _updateLabelsForTeamIndex(): void {
        const con               = this._getPlayerFilter().getConTeamIndex();
        const labelArray        = this._labelConTeamIndexArray;
        const labelPredicate    = this._labelConTeamIndexPredicate;
        if (con == null) {
            labelArray.setText(``);
            labelPredicate.setText(``);
        } else {
            labelArray.setText(con.getValueArray()?.map(v => Lang_Utils.getPlayerTeamName(v)).join(`, `));
            labelPredicate.setLangText(con.getIsOneOf() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        }
    }
    private _updateLabelsForAliveState(): void {
        const con               = this._getPlayerFilter().getConAliveState();
        const labelArray        = this._labelConAliveStateArray;
        const labelPredicate    = this._labelConAliveStatePredicate;
        if (con == null) {
            labelArray.setText(``);
            labelPredicate.setText(``);
        } else {
            labelArray.setText(con.getValueArray().map(v => Lang_Utils.getPlayerAliveStateName(v)).join(`, `));
            labelPredicate.setLangText(con.getIsOneOf() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        }
    }
    private _updateLabelsForCoUsingSkillType(): void {
        const con               = this._getPlayerFilter().getConCoUsingSkillType();
        const labelArray        = this._labelConCoUsingSkillTypeArray;
        const labelPredicate    = this._labelConCoUsingSkillTypePredicate;
        if (con == null) {
            labelArray.setText(``);
            labelPredicate.setText(``);
        } else {
            labelArray.setText(con.getValueArray()?.map(v => Lang_Utils.getCoSkillTypeName(v)).join(`, `));
            labelPredicate.setLangText(con.getIsOneOf() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        }
    }
    private _updateLabelsForCoCategoryId(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const con               = this._getPlayerFilter().getConCoCategoryId();
        const labelArray        = this._labelConCoCategoryIdArray;
        const labelPredicate    = this._labelConCoCategoryIdPredicate;
        if (con == null) {
            labelArray.setText(``);
            labelPredicate.setText(``);
        } else {
            labelArray.setText(con.getValueArray().map(v => gameConfig.getCoCategoryCfg(v)?.getName()).join(`, `));
            labelPredicate.setLangText(con.getIsOneOf() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        }
    }
    private _updateLabelIsInTurn(): void {
        const value = this._getPlayerFilter().getConIsInTurn();
        this._labelConIsInTurn.setText(value == null ? `` : Lang_Utils.getTextForYesOrNo(value));
    }
    private _updateLabelIsSkipTurn(): void {
        const value = this._getPlayerFilter().getConIsSkipTurn();
        this._labelConIsSkipTurn.setText(value == null ? `` : Lang_Utils.getTextForYesOrNo(value));
    }

    private _updateLabelsForConFund(): void {
        const con = this._getPlayerFilter().getConFund();
        this._labelConFund.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }
    private _updateLabelsForConCoEnergy(): void {
        const con = this._getPlayerFilter().getConCoEnergy();
        this._labelConCoEnergy.setText(con == null ? `` : ValueAndComparators_Utils.getBriefDesc(con));
    }

    private _getPlayerFilter(): PlayerFilter {
        return this._filter;
    }
}
