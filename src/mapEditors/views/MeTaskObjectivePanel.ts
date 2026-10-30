import { ContextType } from "../../expressionParsers/Enums.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import {
    MaxInt32,
    MinInt32,
} from "../../numbers/Constants.ts";
import type { TaskObjective } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import type { TaskObjectiveFullData } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import {
    ExpressionInfoDict,
    Common,
} from "../../taskObjectives/Constants.ts";
import { getErrorText } from "../../taskObjectives/Utils.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";

export interface OpenData {
    fullData                : TaskObjectiveFullData;
    taskObjective           : TaskObjective;
    warEventFullData        : WarEventFullData;
    isReviewingMap          : boolean;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                              : IUiImage;
    private readonly _group!                                : IUiContainer;
    private readonly _labelTitle!                           : IUiLabel;
    private readonly _btnClose!                             : IUiButton;
    private readonly _labelError!                           : IUiLabel;
    private readonly _btnIdentifier!                        : IUiButton;

    private readonly _groupDesc!                            : IUiContainer;
    private readonly _btnHelpDesc!                          : IUiButton;
    private readonly _groupModifyDesc!                      : IUiContainer;
    private readonly _labelDesc!                            : IUiLabel;

    private readonly _scrollData!                           : IUiScroller<IUiLayout>;
    private readonly _groupData!                            : IUiLayout;

    private readonly _groupIsMain!                          : IUiContainer;
    private readonly _btnHelpIsMain!                        : IUiButton;
    private readonly _groupModifyIsMain!                    : IUiContainer;
    private readonly _labelIsMain!                          : IUiLabel;

    private readonly _groupMaxProgress!                     : IUiContainer;
    private readonly _btnHelpMaxProgress!                   : IUiButton;
    private readonly _groupModifyMaxProgress!               : IUiContainer;
    private readonly _labelMaxProgress!                     : IUiLabel;

    private readonly _groupScoreForCompletion!              : IUiContainer;
    private readonly _btnHelpScoreForCompletion!            : IUiButton;
    private readonly _groupModifyScoreForCompletion!        : IUiContainer;
    private readonly _labelScoreForCompletion!              : IUiLabel;

    private readonly _groupScoreForProgress!                : IUiContainer;
    private readonly _btnHelpScoreForProgress!              : IUiButton;
    private readonly _groupModifyScoreForProgress!          : IUiContainer;
    private readonly _labelScoreForProgress!                : IUiLabel;

    private readonly _groupUpdaterForCurrentProgress!       : IUiContainer;
    private readonly _btnHelpUpdaterForCurrentProgress!     : IUiButton;
    private readonly _groupModifyUpdaterForCurrentProgress! : IUiContainer;
    private readonly _labelUpdaterForCurrentProgress!       : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.MeTaskObjectiveFullDataChanged,  callback: this._onNotifyTaskObjectiveFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                               callback: this.closePanel },
            { ui: this._btnIdentifier,                          callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyDesc,                        callback: this._onTouchedGroupModifyDesc },
            { ui: this._btnHelpDesc,                            callback: this._onTouchedBtnHelpDesc  },

            { ui: this._groupModifyIsMain,                      callback: this._onTouchedGroupModifyIsMain },
            { ui: this._btnHelpIsMain,                          callback: this._onTouchedBtnHelpIsMain  },

            { ui: this._groupModifyMaxProgress,                 callback: this._onTouchedGroupModifyMaxProgress },
            { ui: this._btnHelpMaxProgress,                     callback: this._onTouchedBtnHelpMaxProgress  },

            { ui: this._groupModifyScoreForCompletion,          callback: this._onTouchedGroupModifyScoreForCompletion },
            { ui: this._btnHelpScoreForCompletion,              callback: this._onTouchedBtnHelpScoreForCompletion },

            { ui: this._groupModifyScoreForProgress,            callback: this._onTouchedGroupModifyScoreForProgress },
            { ui: this._btnHelpScoreForProgress,                callback: this._onTouchedBtnHelpScoreForProgress  },

            { ui: this._groupModifyUpdaterForCurrentProgress,   callback: this._onTouchedGroupModifyUpdaterForCurrentProgress },
            { ui: this._btnHelpUpdaterForCurrentProgress,       callback: this._onTouchedBtnUpdaterForCurrentProgress },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyTaskObjectiveFullDataChanged(): void {
        this._updateView();
    }

    private _onTouchedGroupModifyDesc(): void {
        const taskObjective = this.getOpenData()?.taskObjective;
        if (taskObjective == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonInputLanguageTextPanel, {
            getTitle            : () => getText(TextType.B1215),
            currentTextArray    : taskObjective.getDesc(),
            maxLength           : Common.MaxDescLength,
            callback            : newValue => {
                taskObjective.setDesc(newValue);
                dispatch(TypeId.MeTaskObjectiveFullDataChanged, this.getOpenData()?.fullData);
            },
        });
    }
    private _onTouchedBtnHelpDesc(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0714),
        });
    }
    private _onTouchedBtnIdentifier(): void {
        openPanel(getDict().CommonApiPanel, {
            contextType : ContextType.TaskObjective,
        });
    }

    private _onTouchedGroupModifyIsMain(): void {
        const taskObjective = this.getOpenData()?.taskObjective;
        if (taskObjective == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        if (taskObjective.getIsMain()) {
            taskObjective.setIsMain(null);
        } else {
            taskObjective.setIsMain(true);
        }
        dispatch(TypeId.MeTaskObjectiveFullDataChanged, this.getOpenData()?.fullData);
    }
    private _onTouchedBtnHelpIsMain(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0715),
        });
    }

    private _onTouchedGroupModifyMaxProgress(): void {
        const taskObjective = this.getOpenData()?.taskObjective;
        if (taskObjective == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const currentValue = taskObjective.getMaxProgress();
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B1216),
            minValue        : 1,
            maxValue        : MaxInt32,
            currentValue    : currentValue ?? 0,
            callback        : newValue => {
                if (newValue != currentValue) {
                    taskObjective.setMaxProgress(newValue);
                    dispatch(TypeId.MeTaskObjectiveFullDataChanged, this.getOpenData()?.fullData);
                }
            },
        });
    }
    private _onTouchedBtnHelpMaxProgress(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0716),
        });
    }

    private _onTouchedGroupModifyScoreForCompletion(): void {
        const taskObjective = this.getOpenData()?.taskObjective;
        if (taskObjective == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const currentValue  = taskObjective.getScoreForCompletion();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.B1218),
            minValue        : MinInt32,
            maxValue        : MaxInt32,
            currentValue    : currentValue,
            callback        : newValue => {
                if (newValue != currentValue) {
                    if (newValue === 0) {
                        taskObjective.setScoreForCompletion(null);
                    } else {
                        taskObjective.setScoreForCompletion(newValue);
                    }
                    dispatch(TypeId.MeTaskObjectiveFullDataChanged, this.getOpenData()?.fullData);
                }
            },
        });
    }
    private _onTouchedBtnHelpScoreForCompletion(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0717),
        });
    }

    private _onTouchedGroupModifyScoreForProgress(): void {
        const taskObjective = this.getOpenData()?.taskObjective;
        if (taskObjective == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const currentValue = taskObjective.getScoreForProgress();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.B1219),
            minValue        : MinInt32,
            maxValue        : MaxInt32,
            currentValue    : currentValue,
            callback        : newValue => {
                if (newValue != currentValue) {
                    if (newValue === 0) {
                        taskObjective.setScoreForProgress(null);
                    } else {
                        taskObjective.setScoreForProgress(newValue);
                    }
                    dispatch(TypeId.MeTaskObjectiveFullDataChanged, this.getOpenData()?.fullData);
                }
            },
        });
    }
    private _onTouchedBtnHelpScoreForProgress(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0718),
        });
    }

    private _onTouchedBtnUpdaterForCurrentProgress(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0730),
        });
    }
    private _onTouchedGroupModifyUpdaterForCurrentProgress(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const taskObjective = openData.taskObjective;
        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : taskObjective.getUpdaterForCurrentProgress(),
            expressionInfo  : ExpressionInfoDict.UpdaterForCurrentProgress,
            fullData        : openData.warEventFullData,
            isReviewingMap  : openData.isReviewingMap,
            callback        : text => {
                taskObjective.setUpdaterForCurrentProgress(text);
                dispatch(TypeId.MeTaskObjectiveFullDataChanged);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelError();

        this._updateInputs();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B1214)} #${this.getOpenData()?.taskObjective.getObjectiveId() ?? 0}`);
        this._btnClose.setLangText(TextType.B0146);
        this._btnIdentifier.setLangText(TextType.B0131);

        this._btnHelpDesc.setLangText(TextType.B1215);
        this._btnHelpIsMain.setLangText(TextType.B1217);
        this._btnHelpMaxProgress.setLangText(TextType.B1216);
        this._btnHelpScoreForCompletion.setLangText(TextType.B1218);
        this._btnHelpScoreForProgress.setLangText(TextType.B1219);
        this._btnHelpUpdaterForCurrentProgress.setLangText(TextType.B1226);

        this._updateLabelError();
    }

    private _updateLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const errorTip      = getErrorText(openData.taskObjective, new Set(openData.warEventFullData.getCustomCounterNameArray()?.map(v => v.getName() ?? ``)));
        const labelError    = this._labelError;
        labelError.setText(errorTip ?? getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Yellow : ColorValue.Green);
    }

    private _updateInputs(): void {
        const taskObjective = this.getOpenData()?.taskObjective;
        {
            const label = this._labelDesc;
            label.setText(taskObjective?.getDesc()?.map(v => v.getText() ?? `--`).join(`\n`) ?? `--`);
            this._groupDesc.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelIsMain;
            label.setLangText(taskObjective?.getIsMain() ? TextType.Yes : TextType.No);
            this._groupIsMain.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelMaxProgress;
            label.setText(`${taskObjective?.getMaxProgress() ?? `--`}`);
            this._groupMaxProgress.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelScoreForCompletion;
            label.setText(`${taskObjective?.getScoreForCompletion() ?? 0}`);
            this._groupScoreForCompletion.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelScoreForProgress;
            label.setText(`${taskObjective?.getScoreForProgress() ?? 0}`);
            this._groupScoreForProgress.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelUpdaterForCurrentProgress;
            label.setText(taskObjective?.getUpdaterForCurrentProgress() ?? ``);
            this._groupUpdaterForCurrentProgress.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        this._groupData.arrangeItems();
        this._scrollData.updateOnItemsChanged();
    }
}
