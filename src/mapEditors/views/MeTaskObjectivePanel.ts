import {
    Graphics_Constants,
    TaskObjectives_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    GamePanels_Dict,
    TaskObjectives_Utils,
    Lang_Utils,
    Numbers_Constants,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScroller,
} from "../../internal.ts";
import type { TaskObjective } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import type { TaskObjectiveFullData } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";

export interface OpenData {
    fullData                : TaskObjectiveFullData;
    taskObjective           : TaskObjective;
    warEventFullData        : WarEventFullData;
    isReviewingMap          : boolean;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelError!                           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnIdentifier!                        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDesc!                            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnHelpDesc!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _groupModifyDesc!                      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelDesc!                            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _scrollData!                           : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _groupData!                            : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _groupIsMain!                          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnHelpIsMain!                        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _groupModifyIsMain!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelIsMain!                          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupMaxProgress!                     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnHelpMaxProgress!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _groupModifyMaxProgress!               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelMaxProgress!                     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupScoreForCompletion!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnHelpScoreForCompletion!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _groupModifyScoreForCompletion!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelScoreForCompletion!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupScoreForProgress!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnHelpScoreForProgress!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _groupModifyScoreForProgress!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelScoreForProgress!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupUpdaterForCurrentProgress!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnHelpUpdaterForCurrentProgress!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _groupModifyUpdaterForCurrentProgress! : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelUpdaterForCurrentProgress!       : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MeTaskObjectiveFullDataChanged,  callback: this._onNotifyTaskObjectiveFullDataChanged },
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

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputLanguageTextPanel, {
            getTitle            : () => Lang_Utils.getText(Lang_Constants.TextType.B1215),
            currentTextArray    : taskObjective.getDesc(),
            maxLength           : TaskObjectives_Constants.Common.MaxDescLength,
            callback            : newValue => {
                taskObjective.setDesc(newValue);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeTaskObjectiveFullDataChanged, this.getOpenData()?.fullData);
            },
        });
    }
    private _onTouchedBtnHelpDesc(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0714),
        });
    }
    private _onTouchedBtnIdentifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonApiPanel, {
            contextType : ExpressionParsers_Enums.ContextType.TaskObjective,
        });
    }

    private _onTouchedGroupModifyIsMain(): void {
        const taskObjective = this.getOpenData()?.taskObjective;
        if (taskObjective == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (taskObjective.getIsMain()) {
            taskObjective.setIsMain(null);
        } else {
            taskObjective.setIsMain(true);
        }
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeTaskObjectiveFullDataChanged, this.getOpenData()?.fullData);
    }
    private _onTouchedBtnHelpIsMain(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0715),
        });
    }

    private _onTouchedGroupModifyMaxProgress(): void {
        const taskObjective = this.getOpenData()?.taskObjective;
        if (taskObjective == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const currentValue = taskObjective.getMaxProgress();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.B1216),
            minValue        : 1,
            maxValue        : Numbers_Constants.MaxInt32,
            currentValue    : currentValue ?? 0,
            callback        : newValue => {
                if (newValue != currentValue) {
                    taskObjective.setMaxProgress(newValue);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeTaskObjectiveFullDataChanged, this.getOpenData()?.fullData);
                }
            },
        });
    }
    private _onTouchedBtnHelpMaxProgress(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0716),
        });
    }

    private _onTouchedGroupModifyScoreForCompletion(): void {
        const taskObjective = this.getOpenData()?.taskObjective;
        if (taskObjective == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const currentValue  = taskObjective.getScoreForCompletion();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.B1218),
            minValue        : Numbers_Constants.MinInt32,
            maxValue        : Numbers_Constants.MaxInt32,
            currentValue    : currentValue,
            callback        : newValue => {
                if (newValue != currentValue) {
                    if (newValue === 0) {
                        taskObjective.setScoreForCompletion(null);
                    } else {
                        taskObjective.setScoreForCompletion(newValue);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeTaskObjectiveFullDataChanged, this.getOpenData()?.fullData);
                }
            },
        });
    }
    private _onTouchedBtnHelpScoreForCompletion(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0717),
        });
    }

    private _onTouchedGroupModifyScoreForProgress(): void {
        const taskObjective = this.getOpenData()?.taskObjective;
        if (taskObjective == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const currentValue = taskObjective.getScoreForProgress();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.B1219),
            minValue        : Numbers_Constants.MinInt32,
            maxValue        : Numbers_Constants.MaxInt32,
            currentValue    : currentValue,
            callback        : newValue => {
                if (newValue != currentValue) {
                    if (newValue === 0) {
                        taskObjective.setScoreForProgress(null);
                    } else {
                        taskObjective.setScoreForProgress(newValue);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeTaskObjectiveFullDataChanged, this.getOpenData()?.fullData);
                }
            },
        });
    }
    private _onTouchedBtnHelpScoreForProgress(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0718),
        });
    }

    private _onTouchedBtnUpdaterForCurrentProgress(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0730),
        });
    }
    private _onTouchedGroupModifyUpdaterForCurrentProgress(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const taskObjective = openData.taskObjective;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : taskObjective.getUpdaterForCurrentProgress(),
            expressionInfo  : TaskObjectives_Constants.ExpressionInfoDict.UpdaterForCurrentProgress,
            fullData        : openData.warEventFullData,
            isReviewingMap  : openData.isReviewingMap,
            callback        : text => {
                taskObjective.setUpdaterForCurrentProgress(text);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeTaskObjectiveFullDataChanged);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelError();

        this._updateInputs();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1214)} #${this.getOpenData()?.taskObjective.getObjectiveId() ?? 0}`);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
        this._btnIdentifier.setLangText(Lang_Constants.TextType.B0131);

        this._btnHelpDesc.setLangText(Lang_Constants.TextType.B1215);
        this._btnHelpIsMain.setLangText(Lang_Constants.TextType.B1217);
        this._btnHelpMaxProgress.setLangText(Lang_Constants.TextType.B1216);
        this._btnHelpScoreForCompletion.setLangText(Lang_Constants.TextType.B1218);
        this._btnHelpScoreForProgress.setLangText(Lang_Constants.TextType.B1219);
        this._btnHelpUpdaterForCurrentProgress.setLangText(Lang_Constants.TextType.B1226);

        this._updateLabelError();
    }

    private _updateLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const errorTip      = TaskObjectives_Utils.getErrorText(openData.taskObjective, new Set(openData.warEventFullData.getCustomCounterNameArray()?.map(v => v.getName() ?? ``)));
        const labelError    = this._labelError;
        labelError.setText(errorTip ?? Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Yellow : Graphics_Constants.ColorValue.Green);
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
            label.setLangText(taskObjective?.getIsMain() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
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
