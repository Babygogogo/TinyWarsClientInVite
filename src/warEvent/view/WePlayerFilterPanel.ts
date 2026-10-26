import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { AllSkillTypeIdArray } from "../../coSkills/Constants.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { createRange } from "../../helpers/Collection.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import {
    getText,
    getPlayerTeamName,
    getComparatorName,
    getPlayerAliveStateName,
    getCoSkillTypeName,
    getTextForYesOrNo,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex, Fund, AllAliveStateIdArray } from "../../players/Constants.ts";
import { checkIsEmpty, getErrorTip, getDesc } from "../../players/utils/Filter.ts";
import { PlayerFilter } from "../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
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
import { AllComparatorIdArray } from "../../valueAndComparators/Constants.ts";
import { getBriefDesc } from "../../valueAndComparators/Utils.ts";
import { tickIsOneOf } from "../../valueArrayAndPredicates/Utils.ts";

export interface OpenData {
    gameConfig              : GcData;
    playersCountUnneutral   : number;
    currentFilter           : Undefinable<PlayerFilter>;
    callback                : ((playerFilter: PlayerFilter | null) => void) | null;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                  : IUiImage;
    private readonly _group!                                    : IUiContainer;
    private readonly _labelTitle!                               : IUiLabel;
    private readonly _btnClear!                                 : IUiButton;
    private readonly _btnClose!                                 : IUiButton;

    private readonly _groupDesc!                                : IUiLayout;
    private readonly _labelDesc!                                : IUiLabel;
    private readonly _labelError!                               : IUiLabel;

    private readonly _btnConIsInTurn!                           : IUiButton;
    private readonly _labelConIsInTurn!                         : IUiLabel;

    private readonly _btnConIsSkipTurn!                         : IUiButton;
    private readonly _labelConIsSkipTurn!                       : IUiLabel;

    private readonly _btnConPlayerIndexArray!                   : IUiButton;
    private readonly _labelConPlayerIndexArray!                 : IUiLabel;
    private readonly _btnConPlayerIndexPredicate!               : IUiButton;
    private readonly _labelConPlayerIndexPredicate!             : IUiLabel;

    private readonly _btnConTeamIndexArray!                     : IUiButton;
    private readonly _labelConTeamIndexArray!                   : IUiLabel;
    private readonly _btnConTeamIndexPredicate!                 : IUiButton;
    private readonly _labelConTeamIndexPredicate!               : IUiLabel;

    private readonly _btnConAliveStateArray!                    : IUiButton;
    private readonly _labelConAliveStateArray!                  : IUiLabel;
    private readonly _btnConAliveStatePredicate!                : IUiButton;
    private readonly _labelConAliveStatePredicate!              : IUiLabel;

    private readonly _btnConCoUsingSkillTypeArray!              : IUiButton;
    private readonly _labelConCoUsingSkillTypeArray!            : IUiLabel;
    private readonly _btnConCoUsingSkillTypePredicate!          : IUiButton;
    private readonly _labelConCoUsingSkillTypePredicate!        : IUiLabel;

    private readonly _btnConCoCategoryIdArray!                  : IUiButton;
    private readonly _labelConCoCategoryIdArray!                : IUiLabel;
    private readonly _btnConCoCategoryIdPredicate!              : IUiButton;
    private readonly _labelConCoCategoryIdPredicate!            : IUiLabel;

    private readonly _btnConFund!                               : IUiButton;
    private readonly _labelConFund!                             : IUiLabel;

    private readonly _btnConCoEnergy!                           : IUiButton;
    private readonly _labelConCoEnergy!                         : IUiLabel;

    private _filter = new PlayerFilter();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                               callback: this._onTouchedBtnClose },
            { ui: this._btnClear,                               callback: this._onTouchedBtnClear },

            { ui: this._btnConIsInTurn,                            callback: this._onTouchedBtnIsInTurn },

            { ui: this._btnConIsSkipTurn,                          callback: this._onTouchedBtnIsSkipTurn },

            { ui: this._btnConPlayerIndexPredicate,                callback: this._onTouchedBtnPlayerIndexPredicate },
            { ui: this._btnConPlayerIndexArray,                    callback: this._onTouchedBtnPlayerIndexArray },

            { ui: this._btnConTeamIndexPredicate,                  callback: this._onTouchedBtnTeamIndexPredicate },
            { ui: this._btnConTeamIndexArray,                      callback: this._onTouchedBtnTeamIndexArray },

            { ui: this._btnConCoEnergy,                            callback: this._onTouchedBtnCoEnergy },

            { ui: this._btnConFund,                                callback: this._onTouchedBtnFund },

            { ui: this._btnConAliveStatePredicate,                 callback: this._onTouchedBtnAliveStatePredicate },
            { ui: this._btnConAliveStateArray,                     callback: this._onTouchedBtnAliveStateArray },

            { ui: this._btnConCoUsingSkillTypePredicate,           callback: this._onTouchedBtnCoUsingSkillTypePredicate },
            { ui: this._btnConCoUsingSkillTypeArray,               callback: this._onTouchedBtnCoUsingSkillTypeArray },

            { ui: this._btnConCoCategoryIdPredicate,               callback: this._onTouchedBtnCoCategoryIdPredicate },
            { ui: this._btnConCoCategoryIdArray,                   callback: this._onTouchedBtnCoCategoryIdArray },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
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
            openPanel(getDict().CommonConfirmPanel, {
                getContent          : () => getText(TextType.A0418),
                getTextForConfirm   : () => getText(TextType.Yes),
                getTextForCancel    : () => getText(TextType.No),
                callback            : () => {
                    const playerFilter = this._getPlayerFilter();
                    callback(checkIsEmpty(playerFilter) ? null : playerFilter);
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
                this._filter = new PlayerFilter();
                this._updateView();
            }
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
        tickIsOneOf(con);
        this._updateView();
    }
    private _onTouchedBtnPlayerIndexArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const filter = this._getPlayerFilter();
        const oldCon = filter.getConPlayerIndex();
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            getTitleText            : () => getText(TextType.PlayerIndex),
            availableNumberArray    : createRange(PlayerIndex.Neutral, openData.playersCountUnneutral + 1, 1),
            currentNumberArray      : oldCon?.getValueArray() ?? [],
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

    private _onTouchedBtnTeamIndexPredicate(): void {
        const con = this._getPlayerFilter().createIfNotExistsConTeamIndex();
        tickIsOneOf(con);
        this._updateView();
    }
    private _onTouchedBtnTeamIndexArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const filter = this._getPlayerFilter();
        const oldCon = filter.getConTeamIndex();
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            getTitleText            : () => getText(TextType.B0019),
            availableNumberArray    : createRange(TeamIndex.Neutral, openData.playersCountUnneutral + 1, 1),
            currentNumberArray      : oldCon?.getValueArray() ?? [],
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

    private _onTouchedBtnCoEnergy(): void {
        const filter = this._getPlayerFilter();
        const oldCon = filter.getConCoEnergy();

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.CoEnergy),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon?.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.CoEnergy),
                minValue        : 0,
                maxValue        : 1000000,
                currentValue    : oldCon?.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConCoEnergy(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConCoEnergy(ValueAndComparator.fromJson({
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

    private _onTouchedBtnFund(): void {
        const filter = this._getPlayerFilter();
        const oldCon = filter.getConFund();

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.Fund),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon?.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.Fund),
                minValue        : 0,
                maxValue        : Fund.MaxFund,
                currentValue    : oldCon?.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConFund(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConFund(ValueAndComparator.fromJson({
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

    private _onTouchedBtnAliveStatePredicate(): void {
        const con = this._getPlayerFilter().createIfNotExistsConAliveState();
        tickIsOneOf(con);
        this._updateView();
    }
    private _onTouchedBtnAliveStateArray(): void {
        const filter = this._getPlayerFilter();
        const oldCon = filter.getConAliveState();
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            getTitleText            : () => getText(TextType.PlayerAliveState),
            availableNumberArray    : AllAliveStateIdArray,
            currentNumberArray      : oldCon?.getValueArray(),
            getNumberMainText       : num => getPlayerAliveStateName(num) ?? UndefinedError,
            callbackOnConfirm       : valueArray => {
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
        tickIsOneOf(con);
        this._updateView();
    }
    private _onTouchedBtnCoUsingSkillTypeArray(): void {
        const filter = this._getPlayerFilter();
        const oldCon = filter.getConCoUsingSkillType();
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            getTitleText            : () => getText(TextType.ActivatingCoSkillType),
            availableNumberArray    : AllSkillTypeIdArray,
            currentNumberArray      : oldCon?.getValueArray(),
            getNumberMainText       : num => getCoSkillTypeName(num) ?? UndefinedError,
            callbackOnConfirm       : valueArray => {
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
        tickIsOneOf(con);
        this._updateView();
    }
    private _onTouchedBtnCoCategoryIdArray(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const filter = this._getPlayerFilter();
        const oldCon = filter.getConCoCategoryId();
        openPanel(getDict().CommonChooseMultiCoCategoryIdPanel, {
            getTitleText                    : () => getText(TextType.B0394),
            gameConfig                      : gameConfig,
            forceUnchosenCoCategoryIdArray  : [],
            availableCoCategoryIdArray      : gameConfig.getAllEnabledCoCategoryIdArray(),
            currentCoCategoryIdArray        : oldCon?.getValueArray() ?? [],
            maxChooseCount                  : null,
            isBan                           : false,
            callbackOnConfirm               : valueArray => {
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
        this._labelTitle.setLangText(TextType.PlayerFilter);
        this._btnClear.setLangText(TextType.B0391);

        this._btnConIsInTurn.setLangText(TextType.B1401);
        this._btnConIsSkipTurn.setLangText(TextType.B1402);
        this._btnConPlayerIndexPredicate.setLangText(TextType.B1403);
        this._btnConPlayerIndexArray.setLangText(TextType.PlayerIndex);
        this._btnConTeamIndexPredicate.setLangText(TextType.B1403);
        this._btnConTeamIndexArray.setLangText(TextType.B0019);
        this._btnConCoEnergy.setLangText(TextType.CoEnergy);
        this._btnConFund.setLangText(TextType.Fund);
        this._btnConAliveStatePredicate.setLangText(TextType.B1403);
        this._btnConAliveStateArray.setLangText(TextType.PlayerAliveState);
        this._btnConCoUsingSkillTypePredicate.setLangText(TextType.B1403);
        this._btnConCoUsingSkillTypeArray.setLangText(TextType.ActivatingCoSkillType);
        this._btnConCoCategoryIdPredicate.setLangText(TextType.B1403);
        this._btnConCoCategoryIdArray.setLangText(TextType.B0394);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerFilter      = this._getPlayerFilter();
        const gameConfig        = openData.gameConfig;
        const errorTip          = getErrorTip(playerFilter, openData.playersCountUnneutral, gameConfig);
        const labelError        = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getDesc(playerFilter, gameConfig));
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
            labelArray.setText(con.getValueArray()?.map(v => `P${v}`).join(`, `) ?? ``);
            labelPredicate.setText(getTextForYesOrNo(con.getIsOneOf()));
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
            labelArray.setText(con.getValueArray()?.map(v => getPlayerTeamName(v)).join(`, `) ?? ``);
            labelPredicate.setText(getTextForYesOrNo(con.getIsOneOf()));
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
            labelArray.setText(con.getValueArray().map(v => getPlayerAliveStateName(v)).join(`, `) ?? ``);
            labelPredicate.setText(getTextForYesOrNo(con.getIsOneOf()));
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
            labelArray.setText(con.getValueArray()?.map(v => getCoSkillTypeName(v)).join(`, `) ?? ``);
            labelPredicate.setText(getTextForYesOrNo(con.getIsOneOf()));
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
            labelArray.setText(con.getValueArray().map(v => gameConfig.getCoCategoryCfg(v)?.getName()).join(`, `) ?? ``);
            labelPredicate.setText(getTextForYesOrNo(con.getIsOneOf()));
        }
    }
    private _updateLabelIsInTurn(): void {
        const value = this._getPlayerFilter().getConIsInTurn();
        this._labelConIsInTurn.setText(value == null ? `` : getTextForYesOrNo(value));
    }
    private _updateLabelIsSkipTurn(): void {
        const value = this._getPlayerFilter().getConIsSkipTurn();
        this._labelConIsSkipTurn.setText(value == null ? `` : getTextForYesOrNo(value));
    }

    private _updateLabelsForConFund(): void {
        const con = this._getPlayerFilter().getConFund();
        this._labelConFund.setText(con == null ? `` : getBriefDesc(con));
    }
    private _updateLabelsForConCoEnergy(): void {
        const con = this._getPlayerFilter().getConCoEnergy();
        this._labelConCoEnergy.setText(con == null ? `` : getBriefDesc(con));
    }

    private _getPlayerFilter(): PlayerFilter {
        return this._filter;
    }
}
