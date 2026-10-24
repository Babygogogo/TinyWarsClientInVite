import * as AutoTourneysConstants from "../../Constants.ts";
import * as AutoTourneysMainsGateway from "../Gateway.ts";
import * as AutoTourneysMainsProvider from "../Provider.ts";
import * as BootTimersConstants from "../../../bootTimers/Constants.ts";
import * as FloatText2 from "../../../FloatText.ts";
import * as GamePanelsDict from "../../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../../helpers/Collection.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NotificationsTypeId from "../../../notifications/TypeId.ts";
import * as TimerTimerModel from "../../../timer/TimerModel.ts";
import * as UiComponentsUiPanel from "../../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../../ui/interfaces/IUiLabel.ts";
import * as UsersModel from "../../../users/Model.ts";

export interface OpenData {
    tourneyId   : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;

    private readonly _btnRegistrationDuration!      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelRegistrationDuration!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnAdjustmentDuration!        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelAdjustmentDuration!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnRename!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelRename!                  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnBootTimer!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelBootTimer!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnDeletePlayer!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnModifyMap!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnModifyBracket!             : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgAtSetRegistrationDuration,    callback: this._onNotifyMsgAtSetRegistrationDuration },
            { type: NotificationsTypeId.TypeId.MsgAtSetAdjustmentDuration,      callback: this._onNotifyMsgAtSetAdjustmentDuration },
            { type: NotificationsTypeId.TypeId.MsgAtGetTourneyInfo,             callback: this._onNotifyMsgAtGetTourneyInfo },
            { type: NotificationsTypeId.TypeId.MsgAtDeleteUser,                 callback: this._onNotifyMsgAtDeleteUser },
            { type: NotificationsTypeId.TypeId.MsgAtSetName,                    callback: this._onNotifyMsgAtSetName },
            { type: NotificationsTypeId.TypeId.MsgAtSetBootTimer,               callback: this._onNotifyMsgAtSetBootTimer },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },
            { ui: this._btnHelp,                    callback: this._onTouchedBtnHelp },
            { ui: this._btnRegistrationDuration,    callback: this._onTouchedBtnRegistrationDuration },
            { ui: this._btnAdjustmentDuration,      callback: this._onTouchedBtnAdjustmentDuration },
            { ui: this._btnRename,                  callback: this._onTouchedBtnRename },
            { ui: this._btnBootTimer,               callback: this._onTouchedBtnBootTimer },
            { ui: this._btnDeletePlayer,            callback: this._onTouchedBtnDeletePlayer },
            { ui: this._btnModifyMap,               callback: this._onTouchedBtnModifyMap },
            { ui: this._btnModifyBracket,           callback: this._onTouchedBtnModifyBracket },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.R0019),
        });
    }

    private async _onTouchedBtnRegistrationDuration(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo = await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return;
        }

        const minValue      = AutoTourneysConstants.RegistrationConstants.MinDuration;
        const maxValue      = AutoTourneysConstants.RegistrationConstants.MaxDuration;
        const currentValue  = tourneyInfo.getRegistrationDuration() ?? 0;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputDurationPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B1043),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : currentValue,
            tips            : `${LangUtils.getText(LangConstants.TextType.B0319)}: [${LangUtils.getTimeDurationText2(minValue)}, ${LangUtils.getTimeDurationText2(maxValue)}]`,
            callback        : interval => {
                if (interval !== currentValue) {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                        getContent     : () => AutoTourneysMainsProvider.getTourneyInfoPhase(tourneyInfo) === AutoTourneysConstants.PhaseId.Registration
                            ? LangUtils.getFormattedText(LangConstants.TextType.F0164, LangUtils.getTimeDurationText2((tourneyInfo.getRegistrationTimestamp() ?? 0) + interval - TimerTimerModel.getServerTimestamp()))
                            : LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
                        callback    : () => AutoTourneysMainsGateway.reqAtSetRegistrationDuration(tourneyId, interval),
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

        const tourneyInfo = await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return;
        }

        const minValue      = AutoTourneysConstants.AdjustmentConstants.MinDuration;
        const maxValue      = AutoTourneysConstants.AdjustmentConstants.MaxDuration;
        const currentValue  = tourneyInfo.getAdjustmentDuration() ?? 0;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputDurationPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B1044),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : currentValue,
            tips            : `${LangUtils.getText(LangConstants.TextType.B0319)}: [${LangUtils.getTimeDurationText2(minValue)}, ${LangUtils.getTimeDurationText2(maxValue)}]`,
            callback        : interval => {
                if (interval !== currentValue) {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                        getContent     : () => AutoTourneysMainsProvider.getTourneyInfoPhase(tourneyInfo) === AutoTourneysConstants.PhaseId.Adjustment
                            ? LangUtils.getFormattedText(LangConstants.TextType.F0165, LangUtils.getTimeDurationText2((tourneyInfo.getAdjustmentTimestamp() ?? 0) + interval - TimerTimerModel.getServerTimestamp()))
                            : LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
                        callback    : () => AutoTourneysMainsGateway.reqAtSetAdjustmentDuration(tourneyId, interval),
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

        const tourneyInfo = await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return;
        }

        const phase = AutoTourneysMainsProvider.getTourneyInfoPhase(tourneyInfo);
        if ((phase !== AutoTourneysConstants.PhaseId.Adjustment)    &&
            (phase !== AutoTourneysConstants.PhaseId.Registration)  &&
            (phase !== AutoTourneysConstants.PhaseId.Battle)
        ) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : tourneyInfo.getNameArray(),
            maxTextLength       : AutoTourneysConstants.Common.MaxNameLength,
            callback            : nameArray => AutoTourneysMainsGateway.reqAtSetName(tourneyId, nameArray),
        });
    }

    private async _onTouchedBtnBootTimer(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo = await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return;
        }

        const phase = AutoTourneysMainsProvider.getTourneyInfoPhase(tourneyInfo);
        if ((phase !== AutoTourneysConstants.PhaseId.Adjustment)    &&
            (phase !== AutoTourneysConstants.PhaseId.Registration)
        ) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const currBootTimerParams = tourneyInfo.getBootTimerParams();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0188),
            availableNumberArray    : [BootTimersConstants.TimerTypeId.Regular, BootTimersConstants.TimerTypeId.Incremental],
            currentNumber           : currBootTimerParams[0],
            getNumberMainText       : timerType => LangUtils.getBootTimerTypeName(timerType) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : newTimerType => {
                if (newTimerType === BootTimersConstants.TimerTypeId.Regular) {
                    const minValue      = 1;
                    const maxValue      = 3600 * 24 * 7;
                    const currentValue  = currBootTimerParams[1];
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputDurationPanel, {
                        title           : LangUtils.getText(LangConstants.TextType.B0124),
                        minValue        : minValue,
                        maxValue        : maxValue,
                        currentValue    : currentValue,
                        tips            : `${LangUtils.getText(LangConstants.TextType.B0319)}: [${LangUtils.getTimeDurationText2(minValue)}, ${LangUtils.getTimeDurationText2(maxValue)}]`,
                        callback        : newValue => {
                            const newBootTimerParams = [newTimerType, newValue];
                            if (HelpersCollection.checkIsSameList(currBootTimerParams, newBootTimerParams)) {
                                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
                            } else {
                                AutoTourneysMainsGateway.reqAtSetBootTimer(tourneyId, newBootTimerParams);
                            }
                        },
                    });

                } else if (newTimerType === BootTimersConstants.TimerTypeId.Incremental) {
                    const minInitialTime    = 1;
                    const maxInitialTime    = 3600 * 24 * 7;
                    const currInitialTime   = currBootTimerParams[1];
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputDurationPanel, {
                        title           : LangUtils.getText(LangConstants.TextType.B0389),
                        minValue        : minInitialTime,
                        maxValue        : maxInitialTime,
                        currentValue    : currInitialTime,
                        tips            : `${LangUtils.getText(LangConstants.TextType.B0319)}: [${LangUtils.getTimeDurationText2(minInitialTime)}, ${LangUtils.getTimeDurationText2(maxInitialTime)}]`,
                        callback        : newInitialTime => {
                            const minIncrementalTimePerUnit    = 0;
                            const maxIncrementalTimePerUnit    = 3600 * 24 * 7;
                            const currIncrementalTimePerUnit   = currBootTimerParams[2] ?? 0;
                            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputDurationPanel, {
                                title           : LangUtils.getText(LangConstants.TextType.B0390),
                                minValue        : minIncrementalTimePerUnit,
                                maxValue        : maxIncrementalTimePerUnit,
                                currentValue    : currIncrementalTimePerUnit,
                                tips            : `${LangUtils.getText(LangConstants.TextType.B0319)}: [${LangUtils.getTimeDurationText2(minIncrementalTimePerUnit)}, ${LangUtils.getTimeDurationText2(maxIncrementalTimePerUnit)}]`,
                                callback        : newIncrementalTimePerUnit => {
                                    const minIncrementalTimePerTurn    = 0;
                                    const maxIncrementalTimePerTurn    = 3600 * 24 * 7;
                                    const currIncrementalTimePerTurn   = currBootTimerParams[3] ?? 0;
                                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputDurationPanel, {
                                        title           : LangUtils.getText(LangConstants.TextType.B1475),
                                        minValue        : minIncrementalTimePerTurn,
                                        maxValue        : maxIncrementalTimePerTurn,
                                        currentValue    : currIncrementalTimePerTurn,
                                        tips            : `${LangUtils.getText(LangConstants.TextType.B0319)}: [${LangUtils.getTimeDurationText2(minIncrementalTimePerTurn)}, ${LangUtils.getTimeDurationText2(maxIncrementalTimePerTurn)}]`,
                                        callback        : newIncrementalTimePerTurn => {
                                            const newBootTimerParams = [newTimerType, newInitialTime, newIncrementalTimePerUnit, newIncrementalTimePerTurn];
                                            if (HelpersCollection.checkIsSameList(currBootTimerParams, newBootTimerParams)) {
                                                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
                                            } else {
                                                AutoTourneysMainsGateway.reqAtSetBootTimer(tourneyId, newBootTimerParams);
                                            }
                                        },
                                    });
                                },
                            });
                        },
                    });

                } else {
                    throw HelpersMisc.newError(`Invalid timer type: ${newTimerType}`);
                }
            },
        });
    }

    private async _onTouchedBtnDeletePlayer(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo   = await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId);
        const phase         = tourneyInfo == null ? null : AutoTourneysMainsProvider.getTourneyInfoPhase(tourneyInfo);
        if ((phase !== AutoTourneysConstants.PhaseId.Registration)) {
            FloatText2.showLang(LangConstants.TextType.A0410);
            return;
        }

        const currentUserIdArray = await AutoTourneysMainsProvider.getAtUserArray(tourneyId);
        if (!currentUserIdArray?.length) {
            FloatText2.showLang(LangConstants.TextType.A0409);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            maxChooseCount          : 1000,
            minChooseCount          : 1,
            availableNumberArray    : currentUserIdArray,
            currentNumberArray      : [],
            showNumber              : true,
            columnsCount            : 3,
            getNumberMainText       : async userId => (await UsersModel.getUserNickname(userId)) ?? LangConstants.UndefinedError,
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1048),
            callbackOnHelp          : userId => GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId }),
            callbackOnConfirm       : userIdArray => AutoTourneysMainsGateway.reqAtDeleteUser(tourneyId, userIdArray),
        });
    }

    private async _onTouchedBtnModifyMap(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo   = await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId);
        const phase         = tourneyInfo == null ? null : AutoTourneysMainsProvider.getTourneyInfoPhase(tourneyInfo);
        if ((phase !== AutoTourneysConstants.PhaseId.Registration) &&
            (phase !== AutoTourneysConstants.PhaseId.Adjustment)
        ) {
            FloatText2.showLang(LangConstants.TextType.A0411);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().AtSetMapPoolPanel, {
                tourneyId   : tourneyId,
            });
        }
    }

    private async _onTouchedBtnModifyBracket(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo = await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId);
        if ((tourneyInfo == null) || (AutoTourneysMainsProvider.getTourneyInfoPhase(tourneyInfo) !== AutoTourneysConstants.PhaseId.Adjustment)) {
            FloatText2.showLang(LangConstants.TextType.A0407);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().AtSetInitialBracketsPanel, {
                tourneyId   : tourneyId,
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtSetAdjustmentDuration(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtSetRegistrationDuration(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtGetTourneyInfo(): void {
        this._updateView();
    }

    private _onNotifyMsgAtDeleteUser(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtSetName(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
        this._updateLabelRename();
    }

    private _onNotifyMsgAtSetBootTimer(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
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
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1022)} #${this.getOpenData()?.tourneyId}`);
        this._btnRegistrationDuration.setLangText(LangConstants.TextType.B1043);
        this._btnAdjustmentDuration.setLangText(LangConstants.TextType.B1044);
        this._btnRename.setLangText(LangConstants.TextType.B0708);
        this._btnBootTimer.setLangText(LangConstants.TextType.B0188);
        this._btnDeletePlayer.setLangText(LangConstants.TextType.B1048);
        this._btnModifyMap.setLangText(LangConstants.TextType.B1045);
        this._btnModifyBracket.setLangText(LangConstants.TextType.B1046);
        this._updateLabelRename();
    }

    private async _updateLabelRegistrationDuration(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const info  = await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId);
        const label = this._labelRegistrationDuration;
        if (info == null) {
            label.setText(LangConstants.UndefinedError);
        } else {
            label.setText(LangUtils.getTimeDurationText2(info.getRegistrationDuration() ?? 0));
        }
    }

    private async _updateLabelAdjustmentDuration(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const info  = await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId);
        const label = this._labelAdjustmentDuration;
        if (info == null) {
            label.setText(LangConstants.UndefinedError);
        } else {
            label.setText(LangUtils.getTimeDurationText2(info.getAdjustmentDuration() ?? 0));
        }
    }

    private async _updateLabelRename(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        this._labelRename.setText(LangUtils.getLanguageText({ textArray: (await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId))?.getNameArray() }) ?? `--`);
    }

    private async _updateLabelBootTimer(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const bootTimerParams   = (await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId))?.getBootTimerParams() ?? BootTimersConstants.DefaultParams;
        const bootTimerType     = bootTimerParams[0];
        const label             = this._labelBootTimer;
        if (bootTimerType === BootTimersConstants.TimerTypeId.Regular) {
            label.setText(LangUtils.getTimeDurationText2(bootTimerParams[1]));
        } else if (bootTimerType === BootTimersConstants.TimerTypeId.Incremental) {
            label.setText(`${LangUtils.getTimeDurationText2(bootTimerParams[1])}  ${LangUtils.getTimeDurationText2(bootTimerParams[2] ?? 0)}  ${LangUtils.getTimeDurationText2(bootTimerParams[3] ?? 0)}`);
        }
    }
}
