import {
    AutoTourneys_Constants,
    Helpers_Collection,
    BootTimers_Constants,
    AutoTourneys_Mains_Provider,
    Lang_Utils,
    GamePanels_Dict,
    Timer_TimerModel,
    Users_Model,
    Helpers_Misc,
    GamePanels_Manager,
    AutoTourneys_Mains_Gateway,
    FloatText,
    Lang_Constants,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../../internal.ts";

export interface OpenData {
    tourneyId   : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnRegistrationDuration!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelRegistrationDuration!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnAdjustmentDuration!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelAdjustmentDuration!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnRename!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelRename!                  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnBootTimer!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelBootTimer!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnDeletePlayer!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnModifyMap!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnModifyBracket!             : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                 callback : this._onNotifyLanguageChanged },
            { type : "MsgAtSetRegistrationDuration",    callback : this._onNotifyMsgAtSetRegistrationDuration },
            { type : "MsgAtSetAdjustmentDuration",      callback : this._onNotifyMsgAtSetAdjustmentDuration },
            { type : "MsgAtGetTourneyInfo",             callback : this._onNotifyMsgAtGetTourneyInfo },
            { type : "MsgAtDeleteUser",                 callback : this._onNotifyMsgAtDeleteUser },
            { type : "MsgAtSetName",                    callback : this._onNotifyMsgAtSetName },
            { type : "MsgAtSetBootTimer",               callback : this._onNotifyMsgAtSetBootTimer },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },
            { ui : this._btnHelp,                    callback : this._onTouchedBtnHelp },
            { ui : this._btnRegistrationDuration,    callback : this._onTouchedBtnRegistrationDuration },
            { ui : this._btnAdjustmentDuration,      callback : this._onTouchedBtnAdjustmentDuration },
            { ui : this._btnRename,                  callback : this._onTouchedBtnRename },
            { ui : this._btnBootTimer,               callback : this._onTouchedBtnBootTimer },
            { ui : this._btnDeletePlayer,            callback : this._onTouchedBtnDeletePlayer },
            { ui : this._btnModifyMap,               callback : this._onTouchedBtnModifyMap },
            { ui : this._btnModifyBracket,           callback : this._onTouchedBtnModifyBracket },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.R0019),
        });
    }

    private async _onTouchedBtnRegistrationDuration(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo = await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return;
        }

        const minValue      = AutoTourneys_Constants.RegistrationConstants.MinDuration;
        const maxValue      = AutoTourneys_Constants.RegistrationConstants.MaxDuration;
        const currentValue  = tourneyInfo.getRegistrationDuration();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputDurationPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B1043),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : currentValue,
            tips         : `${Lang_Utils.getText(Lang_Constants.TextType.B0319)}: [${Lang_Utils.getTimeDurationText2(minValue)}, ${Lang_Utils.getTimeDurationText2(maxValue)}]`,
            callback     : interval => {
                if (interval !== currentValue) {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                        getContent : () => AutoTourneys_Mains_Provider.getTourneyInfoPhase(tourneyInfo) === AutoTourneys_Constants.PhaseId.Registration
                            ? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0164, Lang_Utils.getTimeDurationText2((tourneyInfo.getRegistrationTimestamp()) + interval - Timer_TimerModel.getServerTimestamp()))
                            : Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
                        callback : () => AutoTourneys_Mains_Gateway.reqAtSetRegistrationDuration(tourneyId, interval),
                    });
                }
            },
        });
    }

    private async _onTouchedBtnAdjustmentDuration(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo = await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return;
        }

        const minValue      = AutoTourneys_Constants.AdjustmentConstants.MinDuration;
        const maxValue      = AutoTourneys_Constants.AdjustmentConstants.MaxDuration;
        const currentValue  = tourneyInfo.getAdjustmentDuration();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputDurationPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B1044),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : currentValue,
            tips         : `${Lang_Utils.getText(Lang_Constants.TextType.B0319)}: [${Lang_Utils.getTimeDurationText2(minValue)}, ${Lang_Utils.getTimeDurationText2(maxValue)}]`,
            callback     : interval => {
                if (interval !== currentValue) {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                        getContent : () => AutoTourneys_Mains_Provider.getTourneyInfoPhase(tourneyInfo) === AutoTourneys_Constants.PhaseId.Adjustment
                            ? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0165, Lang_Utils.getTimeDurationText2((tourneyInfo.getAdjustmentTimestamp() ?? 0) + interval - Timer_TimerModel.getServerTimestamp()))
                            : Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
                        callback : () => AutoTourneys_Mains_Gateway.reqAtSetAdjustmentDuration(tourneyId, interval),
                    });
                }
            },
        });
    }

    private async _onTouchedBtnRename(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo = await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return;
        }

        const phase = AutoTourneys_Mains_Provider.getTourneyInfoPhase(tourneyInfo);
        if ((phase !== AutoTourneys_Constants.PhaseId.Adjustment)    &&
            (phase !== AutoTourneys_Constants.PhaseId.Registration)  &&
            (phase !== AutoTourneys_Constants.PhaseId.Battle)
        ) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray : tourneyInfo.getNameArray(),
            maxTextLength    : AutoTourneys_Constants.Common.MaxNameLength,
            callback         : nameArray => AutoTourneys_Mains_Gateway.reqAtSetName(tourneyId, nameArray),
        });
    }

    private async _onTouchedBtnBootTimer(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo = await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return;
        }

        const phase = AutoTourneys_Mains_Provider.getTourneyInfoPhase(tourneyInfo);
        if ((phase !== AutoTourneys_Constants.PhaseId.Adjustment)    &&
            (phase !== AutoTourneys_Constants.PhaseId.Registration)
        ) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const currBootTimerParams = tourneyInfo.getBootTimerParams();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B0188),
            availableNumberArray : [BootTimers_Constants.TimerTypeId.Regular, BootTimers_Constants.TimerTypeId.Incremental],
            currentNumber        : currBootTimerParams[0],
            getNumberMainText    : timerType => Lang_Utils.getBootTimerTypeName(timerType) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : newTimerType => {
                if (newTimerType === BootTimers_Constants.TimerTypeId.Regular) {
                    const minValue      = 1;
                    const maxValue      = 3600 * 24 * 7;
                    const currentValue  = currBootTimerParams[1];
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputDurationPanel, {
                        title        : Lang_Utils.getText(Lang_Constants.TextType.B0124),
                        minValue     : minValue,
                        maxValue     : maxValue,
                        currentValue : currentValue,
                        tips         : `${Lang_Utils.getText(Lang_Constants.TextType.B0319)}: [${Lang_Utils.getTimeDurationText2(minValue)}, ${Lang_Utils.getTimeDurationText2(maxValue)}]`,
                        callback     : newValue => {
                            const newBootTimerParams = [newTimerType, newValue];
                            if (Helpers_Collection.checkIsSameList(currBootTimerParams, newBootTimerParams)) {
                                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
                            } else {
                                AutoTourneys_Mains_Gateway.reqAtSetBootTimer(tourneyId, newBootTimerParams);
                            }
                        },
                    });

                } else if (newTimerType === BootTimers_Constants.TimerTypeId.Incremental) {
                    const minInitialTime    = 1;
                    const maxInitialTime    = 3600 * 24 * 7;
                    const currInitialTime   = currBootTimerParams[1];
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputDurationPanel, {
                        title        : Lang_Utils.getText(Lang_Constants.TextType.B0389),
                        minValue     : minInitialTime,
                        maxValue     : maxInitialTime,
                        currentValue : currInitialTime,
                        tips         : `${Lang_Utils.getText(Lang_Constants.TextType.B0319)}: [${Lang_Utils.getTimeDurationText2(minInitialTime)}, ${Lang_Utils.getTimeDurationText2(maxInitialTime)}]`,
                        callback     : newInitialTime => {
                            const minIncrementalTimePerUnit    = 0;
                            const maxIncrementalTimePerUnit    = 3600 * 24 * 7;
                            const currIncrementalTimePerUnit   = currBootTimerParams[2] ?? 0;
                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputDurationPanel, {
                                title        : Lang_Utils.getText(Lang_Constants.TextType.B0390),
                                minValue     : minIncrementalTimePerUnit,
                                maxValue     : maxIncrementalTimePerUnit,
                                currentValue : currIncrementalTimePerUnit,
                                tips         : `${Lang_Utils.getText(Lang_Constants.TextType.B0319)}: [${Lang_Utils.getTimeDurationText2(minIncrementalTimePerUnit)}, ${Lang_Utils.getTimeDurationText2(maxIncrementalTimePerUnit)}]`,
                                callback     : newIncrementalTimePerUnit => {
                                    const minIncrementalTimePerTurn    = 0;
                                    const maxIncrementalTimePerTurn    = 3600 * 24 * 7;
                                    const currIncrementalTimePerTurn   = currBootTimerParams[3] ?? 0;
                                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputDurationPanel, {
                                        title        : Lang_Utils.getText(Lang_Constants.TextType.B1475),
                                        minValue     : minIncrementalTimePerTurn,
                                        maxValue     : maxIncrementalTimePerTurn,
                                        currentValue : currIncrementalTimePerTurn,
                                        tips         : `${Lang_Utils.getText(Lang_Constants.TextType.B0319)}: [${Lang_Utils.getTimeDurationText2(minIncrementalTimePerTurn)}, ${Lang_Utils.getTimeDurationText2(maxIncrementalTimePerTurn)}]`,
                                        callback     : newIncrementalTimePerTurn => {
                                            const newBootTimerParams = [newTimerType, newInitialTime, newIncrementalTimePerUnit, newIncrementalTimePerTurn];
                                            if (Helpers_Collection.checkIsSameList(currBootTimerParams, newBootTimerParams)) {
                                                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
                                            } else {
                                                AutoTourneys_Mains_Gateway.reqAtSetBootTimer(tourneyId, newBootTimerParams);
                                            }
                                        },
                                    });
                                },
                            });
                        },
                    });

                } else {
                    throw Helpers_Misc.newError(`Invalid timer type: ${newTimerType}`);
                }
            },
        });
    }

    private async _onTouchedBtnDeletePlayer(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo   = await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId);
        const phase         = tourneyInfo == null ? null : AutoTourneys_Mains_Provider.getTourneyInfoPhase(tourneyInfo);
        if ((phase !== AutoTourneys_Constants.PhaseId.Registration)) {
            FloatText.showLang(Lang_Constants.TextType.A0410);
            return;
        }

        const currentUserIdArray = await AutoTourneys_Mains_Provider.getAtUserArray(tourneyId);
        if (!currentUserIdArray?.length) {
            FloatText.showLang(Lang_Constants.TextType.A0409);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            maxChooseCount       : 1000,
            minChooseCount       : 1,
            availableNumberArray : currentUserIdArray,
            currentNumberArray   : [],
            showNumber           : true,
            columnsCount         : 3,
            getNumberMainText    : async userId => (await Users_Model.getUserNickname(userId)) ?? Lang_Constants.UndefinedError,
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B1048),
            callbackOnHelp       : userId => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId }),
            callbackOnConfirm    : userIdArray => AutoTourneys_Mains_Gateway.reqAtDeleteUser(tourneyId, userIdArray),
        });
    }

    private async _onTouchedBtnModifyMap(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo   = await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId);
        const phase         = tourneyInfo == null ? null : AutoTourneys_Mains_Provider.getTourneyInfoPhase(tourneyInfo);
        if ((phase !== AutoTourneys_Constants.PhaseId.Registration) &&
            (phase !== AutoTourneys_Constants.PhaseId.Adjustment)
        ) {
            FloatText.showLang(Lang_Constants.TextType.A0411);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().AtSetMapPoolPanel, {
                tourneyId : tourneyId,
            });
        }
    }

    private async _onTouchedBtnModifyBracket(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo = await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId);
        if ((tourneyInfo == null) || (AutoTourneys_Mains_Provider.getTourneyInfoPhase(tourneyInfo) !== AutoTourneys_Constants.PhaseId.Adjustment)) {
            FloatText.showLang(Lang_Constants.TextType.A0407);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().AtSetInitialBracketsPanel, {
                tourneyId : tourneyId,
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtSetAdjustmentDuration(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtSetRegistrationDuration(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtGetTourneyInfo(): void {
        this._updateView();
    }

    private _onNotifyMsgAtDeleteUser(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtSetName(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        this._updateLabelRename();
    }

    private _onNotifyMsgAtSetBootTimer(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        this._updateLabelBootTimer();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelRegistrationDuration();
        this._updateLabelAdjustmentDuration();
        this._updateLabelBootTimer();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1022)} #${this.getOpenData()?.tourneyId}`);
        this._btnRegistrationDuration.setLangText(Lang_Constants.TextType.B1043);
        this._btnAdjustmentDuration.setLangText(Lang_Constants.TextType.B1044);
        this._btnRename.setLangText(Lang_Constants.TextType.B0708);
        this._btnBootTimer.setLangText(Lang_Constants.TextType.B0188);
        this._btnDeletePlayer.setLangText(Lang_Constants.TextType.B1048);
        this._btnModifyMap.setLangText(Lang_Constants.TextType.B1045);
        this._btnModifyBracket.setLangText(Lang_Constants.TextType.B1046);
        this._updateLabelRename();
    }

    private async _updateLabelRegistrationDuration(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const info  = await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId);
        const label = this._labelRegistrationDuration;
        if (info == null) {
            label.setText(Lang_Constants.UndefinedError);
        } else {
            label.setText(Lang_Utils.getTimeDurationText2(info.getRegistrationDuration()));
        }
    }

    private async _updateLabelAdjustmentDuration(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const info  = await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId);
        const label = this._labelAdjustmentDuration;
        if (info == null) {
            label.setText(Lang_Constants.UndefinedError);
        } else {
            label.setText(Lang_Utils.getTimeDurationText2(info.getAdjustmentDuration()));
        }
    }

    private async _updateLabelRename(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        this._labelRename.setText(Lang_Utils.getLanguageText({ textArray : (await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId))?.getNameArray() }) ?? `--`);
    }

    private async _updateLabelBootTimer(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const bootTimerParams   = (await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId))?.getBootTimerParams() ?? BootTimers_Constants.DefaultParams;
        const bootTimerType     = bootTimerParams[0];
        const label             = this._labelBootTimer;
        if (bootTimerType === BootTimers_Constants.TimerTypeId.Regular) {
            label.setText(Lang_Utils.getTimeDurationText2(bootTimerParams[1]));
        } else if (bootTimerType === BootTimers_Constants.TimerTypeId.Incremental) {
            label.setText(`${Lang_Utils.getTimeDurationText2(bootTimerParams[1])}  ${Lang_Utils.getTimeDurationText2(bootTimerParams[2] ?? 0)}  ${Lang_Utils.getTimeDurationText2(bootTimerParams[3] ?? 0)}`);
        }
    }
}
