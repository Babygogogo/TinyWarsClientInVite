import {
    RegistrationConstants,
    PhaseId,
    AdjustmentConstants,
    Common,
} from "../../Constants.ts";
import {
    reqAtSetRegistrationDuration,
    reqAtSetAdjustmentDuration,
    reqAtSetName,
    reqAtSetBootTimer,
    reqAtDeleteUser,
} from "../Gateway.ts";
import {
    getAtTourneyInfo,
    getTourneyInfoPhase,
    getAtUserArray,
} from "../Provider.ts";
import {
    TimerTypeId,
    DefaultParams,
} from "../../../bootTimers/Constants.ts";
import { showLang } from "../../../FloatText.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import { openPanel } from "../../../gamePanels/Manager.ts";
import { checkIsSameList } from "../../../helpers/Collection.ts";
import { newError } from "../../../helpers/Misc.ts";
import {
    TextType,
    UndefinedError,
} from "../../../lang/Constants.ts";
import {
    getText,
    getTimeDurationText2,
    getFormattedText,
    getBootTimerTypeName,
    getLanguageText,
} from "../../../lang/Utils.ts";
import { TypeId } from "../../../notifications/TypeId.ts";
import { getServerTimestamp } from "../../../timer/TimerModel.ts";
import { UiPanel } from "../../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../../ui/interfaces/IUiLabel.ts";
import { getUserNickname } from "../../../users/Model.ts";

export interface OpenData {
    tourneyId   : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnHelp!                      : IUiButton;
    private readonly _btnClose!                     : IUiButton;

    private readonly _btnRegistrationDuration!      : IUiButton;
    private readonly _labelRegistrationDuration!    : IUiLabel;

    private readonly _btnAdjustmentDuration!        : IUiButton;
    private readonly _labelAdjustmentDuration!      : IUiLabel;

    private readonly _btnRename!                    : IUiButton;
    private readonly _labelRename!                  : IUiLabel;

    private readonly _btnBootTimer!                 : IUiButton;
    private readonly _labelBootTimer!               : IUiLabel;

    private readonly _btnDeletePlayer!              : IUiButton;
    private readonly _btnModifyMap!                 : IUiButton;
    private readonly _btnModifyBracket!             : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgAtSetRegistrationDuration,    callback: this._onNotifyMsgAtSetRegistrationDuration },
            { type: TypeId.MsgAtSetAdjustmentDuration,      callback: this._onNotifyMsgAtSetAdjustmentDuration },
            { type: TypeId.MsgAtGetTourneyInfo,             callback: this._onNotifyMsgAtGetTourneyInfo },
            { type: TypeId.MsgAtDeleteUser,                 callback: this._onNotifyMsgAtDeleteUser },
            { type: TypeId.MsgAtSetName,                    callback: this._onNotifyMsgAtSetName },
            { type: TypeId.MsgAtSetBootTimer,               callback: this._onNotifyMsgAtSetBootTimer },
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
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.R0019),
        });
    }

    private async _onTouchedBtnRegistrationDuration(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo = await getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return;
        }

        const minValue      = RegistrationConstants.MinDuration;
        const maxValue      = RegistrationConstants.MaxDuration;
        const currentValue  = tourneyInfo.getRegistrationDuration();
        openPanel(getDict().CommonInputDurationPanel, {
            title           : getText(TextType.B1043),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : currentValue,
            tips            : `${getText(TextType.B0319)}: [${getTimeDurationText2(minValue)}, ${getTimeDurationText2(maxValue)}]`,
            callback        : interval => {
                if (interval !== currentValue) {
                    openPanel(getDict().CommonConfirmPanel, {
                        getContent     : () => getTourneyInfoPhase(tourneyInfo) === PhaseId.Registration
                            ? getFormattedText(TextType.F0164, getTimeDurationText2((tourneyInfo.getRegistrationTimestamp()) + interval - getServerTimestamp()))
                            : getText(TextType.AreYouSureYouWantToContinue),
                        callback    : () => reqAtSetRegistrationDuration(tourneyId, interval),
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

        const tourneyInfo = await getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return;
        }

        const minValue      = AdjustmentConstants.MinDuration;
        const maxValue      = AdjustmentConstants.MaxDuration;
        const currentValue  = tourneyInfo.getAdjustmentDuration();
        openPanel(getDict().CommonInputDurationPanel, {
            title           : getText(TextType.B1044),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : currentValue,
            tips            : `${getText(TextType.B0319)}: [${getTimeDurationText2(minValue)}, ${getTimeDurationText2(maxValue)}]`,
            callback        : interval => {
                if (interval !== currentValue) {
                    openPanel(getDict().CommonConfirmPanel, {
                        getContent     : () => getTourneyInfoPhase(tourneyInfo) === PhaseId.Adjustment
                            ? getFormattedText(TextType.F0165, getTimeDurationText2((tourneyInfo.getAdjustmentTimestamp() ?? 0) + interval - getServerTimestamp()))
                            : getText(TextType.AreYouSureYouWantToContinue),
                        callback    : () => reqAtSetAdjustmentDuration(tourneyId, interval),
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

        const tourneyInfo = await getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return;
        }

        const phase = getTourneyInfoPhase(tourneyInfo);
        if ((phase !== PhaseId.Adjustment)    &&
            (phase !== PhaseId.Registration)  &&
            (phase !== PhaseId.Battle)
        ) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        openPanel(getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : tourneyInfo.getNameArray(),
            maxTextLength       : Common.MaxNameLength,
            callback            : nameArray => reqAtSetName(tourneyId, nameArray),
        });
    }

    private async _onTouchedBtnBootTimer(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo = await getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return;
        }

        const phase = getTourneyInfoPhase(tourneyInfo);
        if ((phase !== PhaseId.Adjustment)    &&
            (phase !== PhaseId.Registration)
        ) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const currBootTimerParams = tourneyInfo.getBootTimerParams();
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.B0188),
            availableNumberArray    : [TimerTypeId.Regular, TimerTypeId.Incremental],
            currentNumber           : currBootTimerParams[0],
            getNumberMainText       : timerType => getBootTimerTypeName(timerType) ?? UndefinedError,
            callbackOnConfirm       : newTimerType => {
                if (newTimerType === TimerTypeId.Regular) {
                    const minValue      = 1;
                    const maxValue      = 3600 * 24 * 7;
                    const currentValue  = currBootTimerParams[1];
                    openPanel(getDict().CommonInputDurationPanel, {
                        title           : getText(TextType.B0124),
                        minValue        : minValue,
                        maxValue        : maxValue,
                        currentValue    : currentValue,
                        tips            : `${getText(TextType.B0319)}: [${getTimeDurationText2(minValue)}, ${getTimeDurationText2(maxValue)}]`,
                        callback        : newValue => {
                            const newBootTimerParams = [newTimerType, newValue];
                            if (checkIsSameList(currBootTimerParams, newBootTimerParams)) {
                                showLang(TextType.OperationSucceeded);
                            } else {
                                reqAtSetBootTimer(tourneyId, newBootTimerParams);
                            }
                        },
                    });

                } else if (newTimerType === TimerTypeId.Incremental) {
                    const minInitialTime    = 1;
                    const maxInitialTime    = 3600 * 24 * 7;
                    const currInitialTime   = currBootTimerParams[1];
                    openPanel(getDict().CommonInputDurationPanel, {
                        title           : getText(TextType.B0389),
                        minValue        : minInitialTime,
                        maxValue        : maxInitialTime,
                        currentValue    : currInitialTime,
                        tips            : `${getText(TextType.B0319)}: [${getTimeDurationText2(minInitialTime)}, ${getTimeDurationText2(maxInitialTime)}]`,
                        callback        : newInitialTime => {
                            const minIncrementalTimePerUnit    = 0;
                            const maxIncrementalTimePerUnit    = 3600 * 24 * 7;
                            const currIncrementalTimePerUnit   = currBootTimerParams[2] ?? 0;
                            openPanel(getDict().CommonInputDurationPanel, {
                                title           : getText(TextType.B0390),
                                minValue        : minIncrementalTimePerUnit,
                                maxValue        : maxIncrementalTimePerUnit,
                                currentValue    : currIncrementalTimePerUnit,
                                tips            : `${getText(TextType.B0319)}: [${getTimeDurationText2(minIncrementalTimePerUnit)}, ${getTimeDurationText2(maxIncrementalTimePerUnit)}]`,
                                callback        : newIncrementalTimePerUnit => {
                                    const minIncrementalTimePerTurn    = 0;
                                    const maxIncrementalTimePerTurn    = 3600 * 24 * 7;
                                    const currIncrementalTimePerTurn   = currBootTimerParams[3] ?? 0;
                                    openPanel(getDict().CommonInputDurationPanel, {
                                        title           : getText(TextType.B1475),
                                        minValue        : minIncrementalTimePerTurn,
                                        maxValue        : maxIncrementalTimePerTurn,
                                        currentValue    : currIncrementalTimePerTurn,
                                        tips            : `${getText(TextType.B0319)}: [${getTimeDurationText2(minIncrementalTimePerTurn)}, ${getTimeDurationText2(maxIncrementalTimePerTurn)}]`,
                                        callback        : newIncrementalTimePerTurn => {
                                            const newBootTimerParams = [newTimerType, newInitialTime, newIncrementalTimePerUnit, newIncrementalTimePerTurn];
                                            if (checkIsSameList(currBootTimerParams, newBootTimerParams)) {
                                                showLang(TextType.OperationSucceeded);
                                            } else {
                                                reqAtSetBootTimer(tourneyId, newBootTimerParams);
                                            }
                                        },
                                    });
                                },
                            });
                        },
                    });

                } else {
                    throw newError(`Invalid timer type: ${newTimerType}`);
                }
            },
        });
    }

    private async _onTouchedBtnDeletePlayer(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo   = await getAtTourneyInfo(tourneyId);
        const phase         = tourneyInfo == null ? null : getTourneyInfoPhase(tourneyInfo);
        if ((phase !== PhaseId.Registration)) {
            showLang(TextType.A0410);
            return;
        }

        const currentUserIdArray = await getAtUserArray(tourneyId);
        if (!currentUserIdArray?.length) {
            showLang(TextType.A0409);
            return;
        }

        openPanel(getDict().CommonChooseMultiNumberPanel, {
            maxChooseCount          : 1000,
            minChooseCount          : 1,
            availableNumberArray    : currentUserIdArray,
            currentNumberArray      : [],
            showNumber              : true,
            columnsCount            : 3,
            getNumberMainText       : async userId => (await getUserNickname(userId)) ?? UndefinedError,
            getTitleText            : () => getText(TextType.B1048),
            callbackOnHelp          : userId => openPanel(getDict().UserPanel, { userId }),
            callbackOnConfirm       : userIdArray => reqAtDeleteUser(tourneyId, userIdArray),
        });
    }

    private async _onTouchedBtnModifyMap(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo   = await getAtTourneyInfo(tourneyId);
        const phase         = tourneyInfo == null ? null : getTourneyInfoPhase(tourneyInfo);
        if ((phase !== PhaseId.Registration) &&
            (phase !== PhaseId.Adjustment)
        ) {
            showLang(TextType.A0411);
        } else {
            openPanel(getDict().AtSetMapPoolPanel, {
                tourneyId   : tourneyId,
            });
        }
    }

    private async _onTouchedBtnModifyBracket(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyInfo = await getAtTourneyInfo(tourneyId);
        if ((tourneyInfo == null) || (getTourneyInfoPhase(tourneyInfo) !== PhaseId.Adjustment)) {
            showLang(TextType.A0407);
        } else {
            openPanel(getDict().AtSetInitialBracketsPanel, {
                tourneyId   : tourneyId,
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtSetAdjustmentDuration(): void {
        showLang(TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtSetRegistrationDuration(): void {
        showLang(TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtGetTourneyInfo(): void {
        this._updateView();
    }

    private _onNotifyMsgAtDeleteUser(): void {
        showLang(TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtSetName(): void {
        showLang(TextType.OperationSucceeded);
        this._updateLabelRename();
    }

    private _onNotifyMsgAtSetBootTimer(): void {
        showLang(TextType.OperationSucceeded);
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
        this._labelTitle.setText(`${getText(TextType.B1022)} #${this.getOpenData()?.tourneyId}`);
        this._btnRegistrationDuration.setLangText(TextType.B1043);
        this._btnAdjustmentDuration.setLangText(TextType.B1044);
        this._btnRename.setLangText(TextType.B0708);
        this._btnBootTimer.setLangText(TextType.B0188);
        this._btnDeletePlayer.setLangText(TextType.B1048);
        this._btnModifyMap.setLangText(TextType.B1045);
        this._btnModifyBracket.setLangText(TextType.B1046);
        this._updateLabelRename();
    }

    private async _updateLabelRegistrationDuration(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const info  = await getAtTourneyInfo(tourneyId);
        const label = this._labelRegistrationDuration;
        if (info == null) {
            label.setText(UndefinedError);
        } else {
            label.setText(getTimeDurationText2(info.getRegistrationDuration()));
        }
    }

    private async _updateLabelAdjustmentDuration(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const info  = await getAtTourneyInfo(tourneyId);
        const label = this._labelAdjustmentDuration;
        if (info == null) {
            label.setText(UndefinedError);
        } else {
            label.setText(getTimeDurationText2(info.getAdjustmentDuration()));
        }
    }

    private async _updateLabelRename(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        this._labelRename.setText(getLanguageText({ textArray: (await getAtTourneyInfo(tourneyId))?.getNameArray() }) ?? `--`);
    }

    private async _updateLabelBootTimer(): Promise<void> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return;
        }

        const bootTimerParams   = (await getAtTourneyInfo(tourneyId))?.getBootTimerParams() ?? DefaultParams;
        const bootTimerType     = bootTimerParams[0];
        const label             = this._labelBootTimer;
        if (bootTimerType === TimerTypeId.Regular) {
            label.setText(getTimeDurationText2(bootTimerParams[1]));
        } else if (bootTimerType === TimerTypeId.Incremental) {
            label.setText(`${getTimeDurationText2(bootTimerParams[1])}  ${getTimeDurationText2(bootTimerParams[2] ?? 0)}  ${getTimeDurationText2(bootTimerParams[3] ?? 0)}`);
        }
    }
}
