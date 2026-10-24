import * as ExpressionParsersEnums from "../../expressionParsers/Enums.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersConstants from "../../numbers/Constants.ts";
import type * as ProtoSchemaCommonProtoTaskObjectivesTaskObjective from "../../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import type * as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TaskObjectivesConstants from "../../taskObjectives/Constants.ts";
import * as TaskObjectivesUtils from "../../taskObjectives/Utils.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";

type TaskObjectiveFullData  = ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData.TaskObjectiveFullData;
type TaskObjective          = ProtoSchemaCommonProtoTaskObjectivesTaskObjective.TaskObjective;

export interface OpenData {
    fullData                : TaskObjectiveFullData;
    taskObjective           : TaskObjective;
    warEventFullData        : ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
    isReviewingMap          : boolean;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelError!                           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnIdentifier!                        : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnHelpDesc!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _groupModifyDesc!                      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelDesc!                            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _scrollData!                           : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupData!                            : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupIsMain!                          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnHelpIsMain!                        : UiInterfacesIUiButton.IUiButton;
    private readonly _groupModifyIsMain!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelIsMain!                          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupMaxProgress!                     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnHelpMaxProgress!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _groupModifyMaxProgress!               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelMaxProgress!                     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupScoreForCompletion!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnHelpScoreForCompletion!            : UiInterfacesIUiButton.IUiButton;
    private readonly _groupModifyScoreForCompletion!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelScoreForCompletion!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupScoreForProgress!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnHelpScoreForProgress!              : UiInterfacesIUiButton.IUiButton;
    private readonly _groupModifyScoreForProgress!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelScoreForProgress!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupUpdaterForCurrentProgress!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnHelpUpdaterForCurrentProgress!     : UiInterfacesIUiButton.IUiButton;
    private readonly _groupModifyUpdaterForCurrentProgress! : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelUpdaterForCurrentProgress!       : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MeTaskObjectiveFullDataChanged,  callback: this._onNotifyTaskObjectiveFullDataChanged },
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputLanguageTextPanel, {
            getTitle            : () => LangUtils.getText(LangConstants.TextType.B1215),
            currentTextArray    : taskObjective.getDesc(),
            maxLength           : GameConfigGcWar.TaskObjectives.MaxDescLength,
            callback            : newValue => {
                taskObjective.setDesc(newValue);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeTaskObjectiveFullDataChanged, this.getOpenData()?.fullData);
            },
        });
    }
    private _onTouchedBtnHelpDesc(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0714),
        });
    }
    private _onTouchedBtnIdentifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonApiPanel, {
            contextType : ExpressionParsersEnums.ContextType.TaskObjective,
        });
    }

    private _onTouchedGroupModifyIsMain(): void {
        const taskObjective = this.getOpenData()?.taskObjective;
        if (taskObjective == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (taskObjective.getIsMain()) {
            taskObjective.setIsMain(null);
        } else {
            taskObjective.setIsMain(true);
        }
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeTaskObjectiveFullDataChanged, this.getOpenData()?.fullData);
    }
    private _onTouchedBtnHelpIsMain(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0715),
        });
    }

    private _onTouchedGroupModifyMaxProgress(): void {
        const taskObjective = this.getOpenData()?.taskObjective;
        if (taskObjective == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const currentValue = taskObjective.getMaxProgress();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B1216),
            minValue        : 1,
            maxValue        : NumbersConstants.MaxInt32,
            currentValue    : currentValue ?? 0,
            callback        : newValue => {
                if (newValue != currentValue) {
                    taskObjective.setMaxProgress(newValue);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeTaskObjectiveFullDataChanged, this.getOpenData()?.fullData);
                }
            },
        });
    }
    private _onTouchedBtnHelpMaxProgress(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0716),
        });
    }

    private _onTouchedGroupModifyScoreForCompletion(): void {
        const taskObjective = this.getOpenData()?.taskObjective;
        if (taskObjective == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const currentValue  = taskObjective.getScoreForCompletion() ?? 0;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.B1218),
            minValue        : NumbersConstants.MinInt32,
            maxValue        : NumbersConstants.MaxInt32,
            currentValue    : currentValue,
            callback        : newValue => {
                if (newValue != currentValue) {
                    if (newValue === 0) {
                        taskObjective.setScoreForCompletion(null);
                    } else {
                        taskObjective.setScoreForCompletion(newValue);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeTaskObjectiveFullDataChanged, this.getOpenData()?.fullData);
                }
            },
        });
    }
    private _onTouchedBtnHelpScoreForCompletion(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0717),
        });
    }

    private _onTouchedGroupModifyScoreForProgress(): void {
        const taskObjective = this.getOpenData()?.taskObjective;
        if (taskObjective == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const currentValue = taskObjective.getScoreForProgress() ?? 0;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.B1219),
            minValue        : NumbersConstants.MinInt32,
            maxValue        : NumbersConstants.MaxInt32,
            currentValue    : currentValue,
            callback        : newValue => {
                if (newValue != currentValue) {
                    if (newValue === 0) {
                        taskObjective.setScoreForProgress(null);
                    } else {
                        taskObjective.setScoreForProgress(newValue);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeTaskObjectiveFullDataChanged, this.getOpenData()?.fullData);
                }
            },
        });
    }
    private _onTouchedBtnHelpScoreForProgress(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0718),
        });
    }

    private _onTouchedBtnUpdaterForCurrentProgress(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0730),
        });
    }
    private _onTouchedGroupModifyUpdaterForCurrentProgress(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const taskObjective = openData.taskObjective;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : taskObjective.getUpdaterForCurrentProgress(),
            expressionInfo  : TaskObjectivesConstants.ExpressionInfoDict.UpdaterForCurrentProgress,
            fullData        : openData.warEventFullData,
            isReviewingMap  : openData.isReviewingMap,
            callback        : text => {
                taskObjective.setUpdaterForCurrentProgress(text);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeTaskObjectiveFullDataChanged);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelError();

        this._updateInputs();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1214)} #${this.getOpenData()?.taskObjective.getObjectiveId() ?? 0}`);
        this._btnClose.setLangText(LangConstants.TextType.B0146);
        this._btnIdentifier.setLangText(LangConstants.TextType.B0131);

        this._btnHelpDesc.setLangText(LangConstants.TextType.B1215);
        this._btnHelpIsMain.setLangText(LangConstants.TextType.B1217);
        this._btnHelpMaxProgress.setLangText(LangConstants.TextType.B1216);
        this._btnHelpScoreForCompletion.setLangText(LangConstants.TextType.B1218);
        this._btnHelpScoreForProgress.setLangText(LangConstants.TextType.B1219);
        this._btnHelpUpdaterForCurrentProgress.setLangText(LangConstants.TextType.B1226);

        this._updateLabelError();
    }

    private _updateLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const errorTip      = TaskObjectivesUtils.getErrorText(openData.taskObjective, new Set(openData.warEventFullData.getCustomCounterNameArray()?.map(v => v.getName() ?? ``)));
        const labelError    = this._labelError;
        labelError.setText(errorTip ?? LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.Green);
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
            label.setText(LangUtils.getTextForYesOrNo(taskObjective?.getIsMain()));
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
