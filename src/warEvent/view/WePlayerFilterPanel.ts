import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as PlayersUtilsFilter from "../../players/utils/Filter.ts";
import * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
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
import * as ValueAndComparatorsConstants from "../../valueAndComparators/Constants.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as ValueArrayAndPredicatesUtils from "../../valueArrayAndPredicates/Utils.ts";

export interface OpenData {
    gameConfig              : GameConfigGcData.GcData;
    playersCountUnneutral   : number;
    currentFilter           : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter>;
    callback                : ((playerFilter: ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter | null) => void) | null;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClear!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                 : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                                : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConIsInTurn!                           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConIsInTurn!                         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConIsSkipTurn!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConIsSkipTurn!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConPlayerIndexArray!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConPlayerIndexArray!                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConPlayerIndexPredicate!               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConPlayerIndexPredicate!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConTeamIndexArray!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTeamIndexArray!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConTeamIndexPredicate!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTeamIndexPredicate!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConAliveStateArray!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConAliveStateArray!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConAliveStatePredicate!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConAliveStatePredicate!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConCoUsingSkillTypeArray!              : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConCoUsingSkillTypeArray!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConCoUsingSkillTypePredicate!          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConCoUsingSkillTypePredicate!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConCoCategoryIdArray!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConCoCategoryIdArray!                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConCoCategoryIdPredicate!              : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConCoCategoryIdPredicate!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConFund!                               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConFund!                             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConCoEnergy!                           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConCoEnergy!                         : UiInterfacesIUiLabel.IUiLabel;

    private _filter = new ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
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
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._filter = this.getOpenData()?.currentFilter?.clone() ?? new ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter();

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
                getContent          : () => LangUtils.getText(LangConstants.TextType.A0418),
                getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.Yes),
                getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.No),
                callback            : () => {
                    const playerFilter = this._getPlayerFilter();
                    callback(PlayersUtilsFilter.checkIsEmpty(playerFilter) ? null : playerFilter);
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
                this._filter = new ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter();
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
        ValueArrayAndPredicatesUtils.tickIsOneOf(con);
        this._updateView();
    }
    private _onTouchedBtnPlayerIndexArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const filter = this._getPlayerFilter();
        const oldCon = filter.getConPlayerIndex();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.PlayerIndex),
            availableNumberArray    : HelpersCollection.createRange(PlayersConstants.PlayerIndex.Neutral, openData.playersCountUnneutral + 1, 1),
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
        ValueArrayAndPredicatesUtils.tickIsOneOf(con);
        this._updateView();
    }
    private _onTouchedBtnTeamIndexArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const filter = this._getPlayerFilter();
        const oldCon = filter.getConTeamIndex();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0019),
            availableNumberArray    : HelpersCollection.createRange(TeamsConstants.TeamIndex.Neutral, openData.playersCountUnneutral + 1, 1),
            currentNumberArray      : oldCon?.getValueArray() ?? [],
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

    private _onTouchedBtnCoEnergy(): void {
        const filter = this._getPlayerFilter();
        const oldCon = filter.getConCoEnergy();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.CoEnergy),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon?.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.CoEnergy),
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
                            filter.setConCoEnergy(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.Fund),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon?.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.Fund),
                minValue        : 0,
                maxValue        : PlayersConstants.Fund.MaxFund,
                currentValue    : oldCon?.getValue(),
                callback        : value => {
                    if (value == null) {
                        filter.setConFund(null);
                    } else {
                        if (oldCon != null) {
                            oldCon.setValue(value);
                            oldCon.setComparator(sign);
                        } else {
                            filter.setConFund(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
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
        ValueArrayAndPredicatesUtils.tickIsOneOf(con);
        this._updateView();
    }
    private _onTouchedBtnAliveStateArray(): void {
        const filter = this._getPlayerFilter();
        const oldCon = filter.getConAliveState();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.PlayerAliveState),
            availableNumberArray    : PlayersConstants.AllAliveStateIdArray,
            currentNumberArray      : oldCon?.getValueArray(),
            getNumberMainText       : num => LangUtils.getPlayerAliveStateName(num) ?? LangConstants.UndefinedError,
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
        ValueArrayAndPredicatesUtils.tickIsOneOf(con);
        this._updateView();
    }
    private _onTouchedBtnCoUsingSkillTypeArray(): void {
        const filter = this._getPlayerFilter();
        const oldCon = filter.getConCoUsingSkillType();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.ActivatingCoSkillType),
            availableNumberArray    : CoSkillsConstants.AllSkillTypeIdArray,
            currentNumberArray      : oldCon?.getValueArray(),
            getNumberMainText       : num => LangUtils.getCoSkillTypeName(num) ?? LangConstants.UndefinedError,
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
        ValueArrayAndPredicatesUtils.tickIsOneOf(con);
        this._updateView();
    }
    private _onTouchedBtnCoCategoryIdArray(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const filter = this._getPlayerFilter();
        const oldCon = filter.getConCoCategoryId();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiCoCategoryIdPanel, {
            getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0394),
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
        this._labelTitle.setLangText(LangConstants.TextType.PlayerFilter);
        this._btnClear.setLangText(LangConstants.TextType.B0391);

        this._btnConIsInTurn.setLangText(LangConstants.TextType.B1401);
        this._btnConIsSkipTurn.setLangText(LangConstants.TextType.B1402);
        this._btnConPlayerIndexPredicate.setLangText(LangConstants.TextType.B1403);
        this._btnConPlayerIndexArray.setLangText(LangConstants.TextType.PlayerIndex);
        this._btnConTeamIndexPredicate.setLangText(LangConstants.TextType.B1403);
        this._btnConTeamIndexArray.setLangText(LangConstants.TextType.B0019);
        this._btnConCoEnergy.setLangText(LangConstants.TextType.CoEnergy);
        this._btnConFund.setLangText(LangConstants.TextType.Fund);
        this._btnConAliveStatePredicate.setLangText(LangConstants.TextType.B1403);
        this._btnConAliveStateArray.setLangText(LangConstants.TextType.PlayerAliveState);
        this._btnConCoUsingSkillTypePredicate.setLangText(LangConstants.TextType.B1403);
        this._btnConCoUsingSkillTypeArray.setLangText(LangConstants.TextType.ActivatingCoSkillType);
        this._btnConCoCategoryIdPredicate.setLangText(LangConstants.TextType.B1403);
        this._btnConCoCategoryIdArray.setLangText(LangConstants.TextType.B0394);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerFilter      = this._getPlayerFilter();
        const gameConfig        = openData.gameConfig;
        const errorTip          = PlayersUtilsFilter.getErrorTip(playerFilter, openData.playersCountUnneutral, gameConfig);
        const labelError        = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(PlayersUtilsFilter.getDesc(playerFilter, gameConfig));
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
            labelPredicate.setText(LangUtils.getTextForYesOrNo(con.getIsOneOf()));
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
            labelArray.setText(con.getValueArray()?.map(v => LangUtils.getPlayerTeamName(v)).join(`, `) ?? ``);
            labelPredicate.setText(LangUtils.getTextForYesOrNo(con.getIsOneOf()));
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
            labelArray.setText(con.getValueArray().map(v => LangUtils.getPlayerAliveStateName(v)).join(`, `) ?? ``);
            labelPredicate.setText(LangUtils.getTextForYesOrNo(con.getIsOneOf()));
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
            labelArray.setText(con.getValueArray()?.map(v => LangUtils.getCoSkillTypeName(v)).join(`, `) ?? ``);
            labelPredicate.setText(LangUtils.getTextForYesOrNo(con.getIsOneOf()));
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
            labelPredicate.setText(LangUtils.getTextForYesOrNo(con.getIsOneOf()));
        }
    }
    private _updateLabelIsInTurn(): void {
        const value = this._getPlayerFilter().getConIsInTurn();
        this._labelConIsInTurn.setText(value == null ? `` : LangUtils.getTextForYesOrNo(value));
    }
    private _updateLabelIsSkipTurn(): void {
        const value = this._getPlayerFilter().getConIsSkipTurn();
        this._labelConIsSkipTurn.setText(value == null ? `` : LangUtils.getTextForYesOrNo(value));
    }

    private _updateLabelsForConFund(): void {
        const con = this._getPlayerFilter().getConFund();
        this._labelConFund.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }
    private _updateLabelsForConCoEnergy(): void {
        const con = this._getPlayerFilter().getConCoEnergy();
        this._labelConCoEnergy.setText(con == null ? `` : ValueAndComparatorsUtils.getBriefDesc(con));
    }

    private _getPlayerFilter(): ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter {
        return this._filter;
    }
}
