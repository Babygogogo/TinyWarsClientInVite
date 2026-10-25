import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { ContextType } from "../../expressionParsers/Enums.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getTextForYesOrNo } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type {
    WarEventAction as ProtoSchemaCommonProtoWarEventWarEventAction,
} from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type {
    WarEventFullData as ProtoSchemaCommonProtoWarEventWarEventFullData,
} from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaPersistentModifyUnitAttribute } from "../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyUnitAttribute.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { ExpressionInfoDict } from "../../warEvents/actions/constants/PersistentModifyUnitAttribute.ts";
import { getErrorTipForAction, getBriefDescForAction } from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData                       = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEventAction                         = ProtoSchemaCommonProtoWarEventWarEventAction;

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                  : IUiImage;
    private readonly _group!                                    : IUiContainer;
    private readonly _labelTitle!                               : IUiLabel;
    private readonly _btnType!                                  : IUiButton;
    private readonly _btnClose!                                 : IUiButton;
    private readonly _btnIdentifier!                            : IUiButton;

    private readonly _groupDesc!                                : IUiLayout;
    private readonly _labelDesc!                                : IUiLabel;
    private readonly _labelError!                               : IUiLabel;

    private readonly _scrExpression!                            : IUiScroller<IUiLayout>;
    private readonly _groupExpression!                          : IUiLayout;
    private readonly _groupCon!                                 : IUiLayout;
    private readonly _groupAct!                                 : IUiLayout;

    private readonly _layoutConIsEffectiveInMpw!                : IUiLayout;
    private readonly _btnConIsEffectiveInMpw!                   : IUiButton;
    private readonly _labelConIsEffectiveInMpw!                 : IUiLabel;

    private readonly _groupConUnitFilter!                       : IUiContainer;
    private readonly _groupModifyConUnitFilter!                 : IUiContainer;
    private readonly _btnConUnitFilter!                         : IUiButton;
    private readonly _labelConUnitFilter!                       : IUiLabel;

    private readonly _groupActAttackPowerModifier!              : IUiContainer;
    private readonly _groupModifyActAttackPowerModifier!        : IUiContainer;
    private readonly _btnActAttackPowerModifier!                : IUiButton;
    private readonly _labelActAttackPowerModifier!              : IUiLabel;

    private readonly _groupActDefenseModifier!                  : IUiContainer;
    private readonly _groupModifyActDefenseModifier!            : IUiContainer;
    private readonly _btnActDefenseModifier!                    : IUiButton;
    private readonly _labelActDefenseModifier!                  : IUiLabel;

    private readonly _groupActMaxAttackRangeModifier!           : IUiContainer;
    private readonly _groupModifyActMaxAttackRangeModifier!     : IUiContainer;
    private readonly _btnActMaxAttackRangeModifier!             : IUiButton;
    private readonly _labelActMaxAttackRangeModifier!           : IUiLabel;

    private readonly _groupActCanAttackAfterMoving!             : IUiContainer;
    private readonly _groupModifyActCanAttackAfterMoving!       : IUiContainer;
    private readonly _btnActCanAttackAfterMoving!               : IUiButton;
    private readonly _labelActCanAttackAfterMoving!             : IUiLabel;

    private readonly _groupActMoveRangeModifier!                : IUiContainer;
    private readonly _groupModifyActMoveRangeModifier!          : IUiContainer;
    private readonly _btnActMoveRangeModifier!                  : IUiButton;
    private readonly _labelActMoveRangeModifier!                : IUiLabel;

    private readonly _groupActLuckLowerLimitModifier!           : IUiContainer;
    private readonly _groupModifyActLuckLowerLimitModifier!     : IUiContainer;
    private readonly _btnActLuckLowerLimitModifier!             : IUiButton;
    private readonly _labelActLuckLowerLimitModifier!           : IUiLabel;

    private readonly _groupActLuckUpperLimitModifier!           : IUiContainer;
    private readonly _groupModifyActLuckUpperLimitModifier!     : IUiContainer;
    private readonly _btnActLuckUpperLimitModifier!             : IUiButton;
    private readonly _labelActLuckUpperLimitModifier!           : IUiLabel;

    private readonly _groupActVisionRangeModifier!              : IUiContainer;
    private readonly _groupModifyActVisionRangeModifier!        : IUiContainer;
    private readonly _btnActVisionRangeModifier!                : IUiButton;
    private readonly _labelActVisionRangeModifier!              : IUiLabel;

    private readonly _groupActIsPenetratingVision!              : IUiContainer;
    private readonly _groupModifyActIsPenetratingVision!        : IUiContainer;
    private readonly _btnActIsPenetratingVision!                : IUiButton;
    private readonly _labelActIsPenetratingVision!              : IUiLabel;

    private readonly _groupActFlareRangeModifier!               : IUiContainer;
    private readonly _groupModifyActFlareRangeModifier!         : IUiContainer;
    private readonly _btnActFlareRangeModifier!                 : IUiButton;
    private readonly _labelActFlareRangeModifier!               : IUiLabel;

    private readonly _groupActFlareRadiusModifier!              : IUiContainer;
    private readonly _groupModifyActFlareRadiusModifier!        : IUiContainer;
    private readonly _btnActFlareRadiusModifier!                : IUiButton;
    private readonly _labelActFlareRadiusModifier!              : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                   callback: this.closePanel },
            { ui: this._btnType,                                    callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                              callback: this._onTouchedBtnIdentifier },
            { ui: this._btnConIsEffectiveInMpw,                     callback: this._onTouchedBtnConIsEffectiveInMpw },

            { ui: this._groupModifyConUnitFilter,                   callback: this._onTouchedGroupModifyConUnitFilter },
            { ui: this._btnConUnitFilter,                           callback: this._onTouchedBtnConUnitFilter },

            { ui: this._groupModifyActAttackPowerModifier,          callback: this._onTouchedGroupModifyActAttackPowerModifier },
            { ui: this._btnActAttackPowerModifier,                  callback: this._onTouchedBtnActAttackPowerModifier },

            { ui: this._groupModifyActDefenseModifier,              callback: this._onTouchedGroupModifyActDefenseModifier },
            { ui: this._btnActDefenseModifier,                      callback: this._onTouchedBtnActDefenseModifier },

            { ui: this._groupModifyActMaxAttackRangeModifier,       callback: this._onTouchedGroupModifyActMaxAttackRangeModifier },
            { ui: this._btnActMaxAttackRangeModifier,               callback: this._onTouchedBtnActMaxAttackRangeModifier },

            { ui: this._groupModifyActCanAttackAfterMoving,         callback: this._onTouchedGroupModifyActCanAttackAfterMoving },
            { ui: this._btnActCanAttackAfterMoving,                 callback: this._onTouchedBtnActCanAttackAfterMoving },

            { ui: this._groupModifyActMoveRangeModifier,            callback: this._onTouchedGroupModifyActMoveRangeModifier },
            { ui: this._btnActMoveRangeModifier,                    callback: this._onTouchedBtnActMoveRangeModifier },

            { ui: this._groupModifyActLuckLowerLimitModifier,       callback: this._onTouchedGroupModifyActLuckLowerLimitModifier },
            { ui: this._btnActLuckLowerLimitModifier,               callback: this._onTouchedBtnActLuckLowerLimitModifier },

            { ui: this._groupModifyActLuckUpperLimitModifier,       callback: this._onTouchedGroupModifyActLuckUpperLimitModifier },
            { ui: this._btnActLuckUpperLimitModifier,               callback: this._onTouchedBtnActLuckUpperLimitModifier },

            { ui: this._groupModifyActVisionRangeModifier,          callback: this._onTouchedGroupModifyActVisionRangeModifier },
            { ui: this._btnActVisionRangeModifier,                  callback: this._onTouchedBtnActVisionRangeModifier },

            { ui: this._groupModifyActIsPenetratingVision,          callback: this._onTouchedGroupModifyActIsPenetratingVision },
            { ui: this._btnActIsPenetratingVision,                  callback: this._onTouchedBtnActIsPenetratingVision },

            { ui: this._groupModifyActFlareRangeModifier,           callback: this._onTouchedGroupModifyActFlareRangeModifier },
            { ui: this._btnActFlareRangeModifier,                   callback: this._onTouchedBtnActFlareRangeModifier },

            { ui: this._groupModifyActFlareRadiusModifier,          callback: this._onTouchedGroupModifyActFlareRadiusModifier },
            { ui: this._btnActFlareRadiusModifier,                  callback: this._onTouchedBtnActFlareRadiusModifier },
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
    private _onNotifyWarEventFullDataChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().WeActionTypeListPanel, {
            fullData    : openData.fullData,
            action      : openData.action,
            war         : openData.war,
        });
    }
    private _onTouchedBtnIdentifier(): void {
        openPanel(getDict().CommonApiPanel, {
            contextType : ContextType.Unit,
        });
    }
    private _onTouchedBtnConIsEffectiveInMpw(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        if (action.getIsEffectiveInMpw()) {
            action.setIsEffectiveInMpw(null);
            dispatch(TypeId.WarEventFullDataChanged);
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent     : () => getText(TextType.A0538),
                callback    : () => {
                    action.setIsEffectiveInMpw(true);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            });
        }
    }

    private _onTouchedBtnConUnitFilter(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0539),
        });
    }
    private _onTouchedGroupModifyConUnitFilter(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getConUnitFilter(),
            expressionInfo  : ExpressionInfoDict.ConUnitFilter,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getConUnitFilter() != text) {
                    action.setConUnitFilter(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActAttackPowerModifier(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActAttackPowerModifier.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActAttackPowerModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActAttackPowerModifier(),
            expressionInfo  : ExpressionInfoDict.ActAttackPowerModifier,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActAttackPowerModifier() != text) {
                    action.setActAttackPowerModifier(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActDefenseModifier(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActDefenseModifier.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActDefenseModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActDefenseModifier(),
            expressionInfo  : ExpressionInfoDict.ActDefenseModifier,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActDefenseModifier() != text) {
                    action.setActDefenseModifier(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActMaxAttackRangeModifier(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0543),
        });
    }
    private _onTouchedGroupModifyActMaxAttackRangeModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActMaxAttackRangeModifier(),
            expressionInfo  : ExpressionInfoDict.ActMaxAttackRangeModifier,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActMaxAttackRangeModifier() != text) {
                    action.setActMaxAttackRangeModifier(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanAttackAfterMoving(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0548),
        });
    }
    private _onTouchedGroupModifyActCanAttackAfterMoving(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanAttackAfterMoving(),
            expressionInfo  : ExpressionInfoDict.ActCanAttackAfterMoving,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanAttackAfterMoving() != text) {
                    action.setActCanAttackAfterMoving(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActMoveRangeModifier(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActMoveRangeModifier.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActMoveRangeModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActMoveRangeModifier(),
            expressionInfo  : ExpressionInfoDict.ActMoveRangeModifier,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActMoveRangeModifier() != text) {
                    action.setActMoveRangeModifier(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActLuckLowerLimitModifier(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActLuckLowerLimitModifier.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActLuckLowerLimitModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActLuckLowerLimitModifier(),
            expressionInfo  : ExpressionInfoDict.ActLuckLowerLimitModifier,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActLuckLowerLimitModifier() != text) {
                    action.setActLuckLowerLimitModifier(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActLuckUpperLimitModifier(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActLuckUpperLimitModifier.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActLuckUpperLimitModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActLuckUpperLimitModifier(),
            expressionInfo  : ExpressionInfoDict.ActLuckUpperLimitModifier,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActLuckUpperLimitModifier() != text) {
                    action.setActLuckUpperLimitModifier(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActVisionRangeModifier(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0643),
        });
    }
    private _onTouchedGroupModifyActVisionRangeModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActVisionRangeModifier(),
            expressionInfo  : ExpressionInfoDict.ActVisionRangeModifier,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActVisionRangeModifier() != text) {
                    action.setActVisionRangeModifier(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsPenetratingVision(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0644),
        });
    }
    private _onTouchedGroupModifyActIsPenetratingVision(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsPenetratingVision(),
            expressionInfo  : ExpressionInfoDict.ActIsPenetratingVision,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsPenetratingVision() != text) {
                    action.setActIsPenetratingVision(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActFlareRangeModifier(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActFlareRangeModifier.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActFlareRangeModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActFlareRangeModifier(),
            expressionInfo  : ExpressionInfoDict.ActFlareRangeModifier,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActFlareRangeModifier() != text) {
                    action.setActFlareRangeModifier(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActFlareRadiusModifier(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActFlareRadiusModifier.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActFlareRadiusModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActFlareRadiusModifier(),
            expressionInfo  : ExpressionInfoDict.ActFlareRadiusModifier,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActFlareRadiusModifier() != text) {
                    action.setActFlareRadiusModifier(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateInputs();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnClose.setLangText(TextType.B0146);
        this._btnType.setLangText(TextType.B0516);
        this._btnIdentifier.setLangText(TextType.B0131);
        this._btnConIsEffectiveInMpw.setLangText(TextType.B1170);
        this._btnConUnitFilter.setText(ExpressionInfoDict.ConUnitFilter.getTitleText());
        this._btnActAttackPowerModifier.setText(ExpressionInfoDict.ActAttackPowerModifier.getTitleText());
        this._btnActDefenseModifier.setText(ExpressionInfoDict.ActDefenseModifier.getTitleText());
        this._btnActMaxAttackRangeModifier.setText(ExpressionInfoDict.ActMaxAttackRangeModifier.getTitleText());
        this._btnActCanAttackAfterMoving.setText(ExpressionInfoDict.ActCanAttackAfterMoving.getTitleText());
        this._btnActMoveRangeModifier.setText(ExpressionInfoDict.ActMoveRangeModifier.getTitleText());
        this._btnActLuckLowerLimitModifier.setText(ExpressionInfoDict.ActLuckLowerLimitModifier.getTitleText());
        this._btnActLuckUpperLimitModifier.setText(ExpressionInfoDict.ActLuckUpperLimitModifier.getTitleText());
        this._btnActVisionRangeModifier.setText(ExpressionInfoDict.ActVisionRangeModifier.getTitleText());
        this._btnActIsPenetratingVision.setText(ExpressionInfoDict.ActIsPenetratingVision.getTitleText());
        this._btnActFlareRangeModifier.setText(ExpressionInfoDict.ActFlareRangeModifier.getTitleText());
        this._btnActFlareRadiusModifier.setText(ExpressionInfoDict.ActFlareRadiusModifier.getTitleText());

        this._updateLabelDescAndLabelError();
        this._updateLabelConIsEffectiveInMpw();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action            = openData.action;
        const war               = openData.war;
        const errorTip          = getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getBriefDescForAction(action, war.getGcData()) || UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateLabelConIsEffectiveInMpw(): void {
        this._labelConIsEffectiveInMpw.setText(getTextForYesOrNo(this.getAction()?.getIsEffectiveInMpw()));
        this._layoutConIsEffectiveInMpw.arrangeItems();
    }

    private _updateInputs(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        {
            const label = this._labelConUnitFilter;
            label.setText(action.getConUnitFilter() ?? ``);
            this._groupConUnitFilter.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActAttackPowerModifier;
            label.setText(action.getActAttackPowerModifier() ?? ``);
            this._groupActAttackPowerModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActDefenseModifier;
            label.setText(action.getActDefenseModifier() ?? ``);
            this._groupActDefenseModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActMaxAttackRangeModifier;
            label.setText(action.getActMaxAttackRangeModifier() ?? ``);
            this._groupActMaxAttackRangeModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCanAttackAfterMoving;
            label.setText(action.getActCanAttackAfterMoving() ?? ``);
            this._groupActCanAttackAfterMoving.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActMoveRangeModifier;
            label.setText(action.getActMoveRangeModifier() ?? ``);
            this._groupActMoveRangeModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActLuckLowerLimitModifier;
            label.setText(action.getActLuckLowerLimitModifier() ?? ``);
            this._groupActLuckLowerLimitModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActLuckUpperLimitModifier;
            label.setText(action.getActLuckUpperLimitModifier() ?? ``);
            this._groupActLuckUpperLimitModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActVisionRangeModifier;
            label.setText(action.getActVisionRangeModifier() ?? ``);
            this._groupActVisionRangeModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActIsPenetratingVision;
            label.setText(action.getActIsPenetratingVision() ?? ``);
            this._groupActIsPenetratingVision.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActFlareRangeModifier;
            label.setText(action.getActFlareRangeModifier() ?? ``);
            this._groupActFlareRangeModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActFlareRadiusModifier;
            label.setText(action.getActFlareRadiusModifier() ?? ``);
            this._groupActFlareRadiusModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): Undefinable<WeaPersistentModifyUnitAttribute> {
        return this.getOpenData()?.action.getWeaPersistentModifyUnitAttribute();
    }
}
