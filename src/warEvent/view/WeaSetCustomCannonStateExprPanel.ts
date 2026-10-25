import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { ContextType } from "../../expressionParsers/Enums.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type {
    WarEventAction as ProtoSchemaCommonProtoWarEventWarEventAction,
} from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type {
    WarEventFullData as ProtoSchemaCommonProtoWarEventWarEventFullData,
} from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetCustomCannonStateExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetCustomCannonStateExpr.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { ExpressionInfoDict } from "../../warEvents/actions/constants/SetCustomCannonStateExpr.ts";
import { getErrorTipForAction, getBriefDescForAction } from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData                   = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEventAction                     = ProtoSchemaCommonProtoWarEventWarEventAction;

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                      : IUiImage;
    private readonly _group!                                        : IUiContainer;
    private readonly _labelTitle!                                   : IUiLabel;
    private readonly _btnType!                                      : IUiButton;
    private readonly _btnClose!                                     : IUiButton;
    private readonly _btnIdentifier!                                : IUiButton;

    private readonly _groupDesc!                                    : IUiLayout;
    private readonly _labelDesc!                                    : IUiLabel;
    private readonly _labelError!                                   : IUiLabel;

    private readonly _scrExpression!                                : IUiScroller<IUiLayout>;
    private readonly _groupExpression!                              : IUiLayout;
    private readonly _groupCon!                                     : IUiLayout;
    private readonly _groupAct!                                     : IUiLayout;

    private readonly _groupConTileFilter!                           : IUiContainer;
    private readonly _groupModifyConTileFilter!                     : IUiContainer;
    private readonly _btnConTileFilter!                             : IUiButton;
    private readonly _labelConTileFilter!                           : IUiLabel;

    private readonly _groupActRangeForUp!                           : IUiContainer;
    private readonly _groupModifyActRangeForUp!                     : IUiContainer;
    private readonly _btnActRangeForUp!                             : IUiButton;
    private readonly _labelActRangeForUp!                           : IUiLabel;

    private readonly _groupActRangeForDown!                         : IUiContainer;
    private readonly _groupModifyActRangeForDown!                   : IUiContainer;
    private readonly _btnActRangeForDown!                           : IUiButton;
    private readonly _labelActRangeForDown!                         : IUiLabel;

    private readonly _groupActRangeForLeft!                         : IUiContainer;
    private readonly _groupModifyActRangeForLeft!                   : IUiContainer;
    private readonly _btnActRangeForLeft!                           : IUiButton;
    private readonly _labelActRangeForLeft!                         : IUiLabel;

    private readonly _groupActRangeForRight!                        : IUiContainer;
    private readonly _groupModifyActRangeForRight!                  : IUiContainer;
    private readonly _btnActRangeForRight!                          : IUiButton;
    private readonly _labelActRangeForRight!                        : IUiLabel;

    private readonly _groupActPriority!                             : IUiContainer;
    private readonly _groupModifyActPriority!                       : IUiContainer;
    private readonly _btnActPriority!                               : IUiButton;
    private readonly _labelActPriority!                             : IUiLabel;

    private readonly _groupActCanAffectSelf!                        : IUiContainer;
    private readonly _groupModifyActCanAffectSelf!                  : IUiContainer;
    private readonly _btnActCanAffectSelf!                          : IUiButton;
    private readonly _labelActCanAffectSelf!                        : IUiLabel;

    private readonly _groupActCanAffectAlly!                        : IUiContainer;
    private readonly _groupModifyActCanAffectAlly!                  : IUiContainer;
    private readonly _btnActCanAffectAlly!                          : IUiButton;
    private readonly _labelActCanAffectAlly!                        : IUiLabel;

    private readonly _groupActCanAffectEnemy!                       : IUiContainer;
    private readonly _groupModifyActCanAffectEnemy!                 : IUiContainer;
    private readonly _btnActCanAffectEnemy!                         : IUiButton;
    private readonly _labelActCanAffectEnemy!                       : IUiLabel;

    private readonly _groupActMaxTargetCount!                       : IUiContainer;
    private readonly _groupModifyActMaxTargetCount!                 : IUiContainer;
    private readonly _btnActMaxTargetCount!                         : IUiButton;
    private readonly _labelActMaxTargetCount!                       : IUiLabel;

    private readonly _groupActOffsetHp!                             : IUiContainer;
    private readonly _groupModifyActOffsetHp!                       : IUiContainer;
    private readonly _btnActOffsetHp!                               : IUiButton;
    private readonly _labelActOffsetHp!                             : IUiLabel;

    private readonly _groupActCanBeFatal!                           : IUiContainer;
    private readonly _groupModifyActCanBeFatal!                     : IUiContainer;
    private readonly _btnActCanBeFatal!                             : IUiButton;
    private readonly _labelActCanBeFatal!                           : IUiLabel;

    private readonly _groupActOffsetFuelPercentage!                 : IUiContainer;
    private readonly _groupModifyActOffsetFuelPercentage!           : IUiContainer;
    private readonly _btnActOffsetFuelPercentage!                   : IUiButton;
    private readonly _labelActOffsetFuelPercentage!                 : IUiLabel;

    private readonly _groupActOffsetPrimaryAmmoPercentage!          : IUiContainer;
    private readonly _groupModifyActOffsetPrimaryAmmoPercentage!    : IUiContainer;
    private readonly _btnActOffsetPrimaryAmmoPercentage!            : IUiButton;
    private readonly _labelActOffsetPrimaryAmmoPercentage!          : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,             callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                   callback: this.closePanel },
            { ui: this._btnType,                                    callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                              callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyConTileFilter,                   callback: this._onTouchedGroupModifyConTileFilter },
            { ui: this._btnConTileFilter,                           callback: this._onTouchedBtnConTileFilter },

            { ui: this._groupModifyActRangeForUp,                   callback: this._onTouchedGroupModifyActRangeForUp },
            { ui: this._btnActRangeForUp,                           callback: this._onTouchedBtnActRangeForUp },

            { ui: this._groupModifyActRangeForDown,                 callback: this._onTouchedGroupModifyActRangeForDown },
            { ui: this._btnActRangeForDown,                         callback: this._onTouchedBtnActRangeForDown },

            { ui: this._groupModifyActRangeForLeft,                 callback: this._onTouchedGroupModifyActRangeForLeft },
            { ui: this._btnActRangeForLeft,                         callback: this._onTouchedBtnActRangeForLeft },

            { ui: this._groupModifyActRangeForRight,                callback: this._onTouchedGroupModifyActRangeForRight },
            { ui: this._btnActRangeForRight,                        callback: this._onTouchedBtnActRangeForRight },

            { ui: this._groupModifyActPriority,                     callback: this._onTouchedGroupModifyActPriority },
            { ui: this._btnActPriority,                             callback: this._onTouchedBtnActPriority },

            { ui: this._groupModifyActCanAffectSelf,                callback: this._onTouchedGroupModifyActCanAffectSelf },
            { ui: this._btnActCanAffectSelf,                        callback: this._onTouchedBtnActCanAffectSelf },

            { ui: this._groupModifyActCanAffectAlly,                callback: this._onTouchedGroupModifyActCanAffectAlly },
            { ui: this._btnActCanAffectAlly,                        callback: this._onTouchedBtnActCanAffectAlly },

            { ui: this._groupModifyActCanAffectEnemy,               callback: this._onTouchedGroupModifyActCanAffectEnemy },
            { ui: this._btnActCanAffectEnemy,                       callback: this._onTouchedBtnActCanAffectEnemy },

            { ui: this._groupModifyActMaxTargetCount,               callback: this._onTouchedGroupModifyActMaxTargetCount },
            { ui: this._btnActMaxTargetCount,                       callback: this._onTouchedBtnActMaxTargetCount },

            { ui: this._groupModifyActOffsetHp,                     callback: this._onTouchedGroupModifyActOffsetHp },
            { ui: this._btnActOffsetHp,                             callback: this._onTouchedBtnActOffsetHp },

            { ui: this._groupModifyActCanBeFatal,                   callback: this._onTouchedGroupModifyActCanBeFatal },
            { ui: this._btnActCanBeFatal,                           callback: this._onTouchedBtnActCanBeFatal },

            { ui: this._groupModifyActOffsetFuelPercentage,         callback: this._onTouchedGroupModifyActOffsetFuelPercentage },
            { ui: this._btnActOffsetFuelPercentage,                 callback: this._onTouchedBtnActOffsetFuelPercentage },

            { ui: this._groupModifyActOffsetPrimaryAmmoPercentage,  callback: this._onTouchedGroupModifyActOffsetPrimaryAmmoPercentage },
            { ui: this._btnActOffsetPrimaryAmmoPercentage,          callback: this._onTouchedBtnActOffsetPrimaryAmmoPercentage },
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
            contextType : ContextType.Tile,
        });
    }

    private _onTouchedBtnConTileFilter(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0662),
        });
    }
    private _onTouchedGroupModifyConTileFilter(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getConTileFilter(),
            expressionInfo  : ExpressionInfoDict.ConTileFilter,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getConTileFilter() != text) {
                    action.setConTileFilter(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActRangeForUp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0680),
        });
    }
    private _onTouchedGroupModifyActRangeForUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActRangeForUp(),
            expressionInfo  : ExpressionInfoDict.ActRangeForUp,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActRangeForUp() != text) {
                    action.setActRangeForUp(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActRangeForDown(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0681),
        });
    }
    private _onTouchedGroupModifyActRangeForDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActRangeForDown(),
            expressionInfo  : ExpressionInfoDict.ActRangeForDown,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActRangeForDown() != text) {
                    action.setActRangeForDown(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActRangeForLeft(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0682),
        });
    }
    private _onTouchedGroupModifyActRangeForLeft(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActRangeForLeft(),
            expressionInfo  : ExpressionInfoDict.ActRangeForLeft,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActRangeForLeft() != text) {
                    action.setActRangeForLeft(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActRangeForRight(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0683),
        });
    }
    private _onTouchedGroupModifyActRangeForRight(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActRangeForRight(),
            expressionInfo  : ExpressionInfoDict.ActRangeForRight,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActRangeForRight() != text) {
                    action.setActRangeForRight(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActPriority(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0671),
        });
    }
    private _onTouchedGroupModifyActPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActPriority(),
            expressionInfo  : ExpressionInfoDict.ActPriority,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActPriority() != text) {
                    action.setActPriority(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanAffectSelf(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0672),
        });
    }
    private _onTouchedGroupModifyActCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanAffectSelf(),
            expressionInfo  : ExpressionInfoDict.ActCanAffectSelf,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanAffectSelf() != text) {
                    action.setActCanAffectSelf(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanAffectAlly(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0673),
        });
    }
    private _onTouchedGroupModifyActCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanAffectAlly(),
            expressionInfo  : ExpressionInfoDict.ActCanAffectAlly,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanAffectAlly() != text) {
                    action.setActCanAffectAlly(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanAffectEnemy(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0674),
        });
    }
    private _onTouchedGroupModifyActCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanAffectEnemy(),
            expressionInfo  : ExpressionInfoDict.ActCanAffectEnemy,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanAffectEnemy() != text) {
                    action.setActCanAffectEnemy(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActMaxTargetCount(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0684),
        });
    }
    private _onTouchedGroupModifyActMaxTargetCount(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActMaxTargetCount(),
            expressionInfo  : ExpressionInfoDict.ActMaxTargetCount,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActMaxTargetCount() != text) {
                    action.setActMaxTargetCount(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActOffsetHp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0677),
        });
    }
    private _onTouchedGroupModifyActOffsetHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActOffsetHp(),
            expressionInfo  : ExpressionInfoDict.ActOffsetHp,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActOffsetHp() != text) {
                    action.setActOffsetHp(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanBeFatal(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : ExpressionInfoDict.ActCanBeFatal.getHelpText,
        });
    }
    private _onTouchedGroupModifyActCanBeFatal(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanBeFatal(),
            expressionInfo  : ExpressionInfoDict.ActCanBeFatal,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanBeFatal() != text) {
                    action.setActCanBeFatal(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActOffsetFuelPercentage(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0677),
        });
    }
    private _onTouchedGroupModifyActOffsetFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActOffsetFuelPercentage(),
            expressionInfo  : ExpressionInfoDict.ActOffsetFuelPercentage,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActOffsetFuelPercentage() != text) {
                    action.setActOffsetFuelPercentage(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActOffsetPrimaryAmmoPercentage(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0677),
        });
    }
    private _onTouchedGroupModifyActOffsetPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActOffsetPrimaryAmmoPercentage(),
            expressionInfo  : ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActOffsetPrimaryAmmoPercentage() != text) {
                    action.setActOffsetPrimaryAmmoPercentage(text);
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
        this._btnClose.setText(getText(TextType.B0146));
        this._btnType.setText(getText(TextType.B0516));
        this._btnIdentifier.setText(getText(TextType.B0131));

        this._btnConTileFilter.setText(ExpressionInfoDict.ConTileFilter.getTitleText());
        this._btnActRangeForUp.setText(ExpressionInfoDict.ActRangeForUp.getTitleText());
        this._btnActRangeForDown.setText(ExpressionInfoDict.ActRangeForDown.getTitleText());
        this._btnActRangeForLeft.setText(ExpressionInfoDict.ActRangeForLeft.getTitleText());
        this._btnActRangeForRight.setText(ExpressionInfoDict.ActRangeForRight.getTitleText());
        this._btnActPriority.setText(ExpressionInfoDict.ActPriority.getTitleText());
        this._btnActCanAffectSelf.setText(ExpressionInfoDict.ActCanAffectSelf.getTitleText());
        this._btnActCanAffectAlly.setText(ExpressionInfoDict.ActCanAffectAlly.getTitleText());
        this._btnActCanAffectEnemy.setText(ExpressionInfoDict.ActCanAffectEnemy.getTitleText());
        this._btnActMaxTargetCount.setText(ExpressionInfoDict.ActMaxTargetCount.getTitleText());
        this._btnActOffsetHp.setText(ExpressionInfoDict.ActOffsetHp.getTitleText());
        this._btnActCanBeFatal.setText(ExpressionInfoDict.ActCanBeFatal.getTitleText());
        this._btnActOffsetFuelPercentage.setText(ExpressionInfoDict.ActOffsetFuelPercentage.getTitleText());
        this._btnActOffsetPrimaryAmmoPercentage.setText(ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage.getTitleText());

        this._updateLabelDescAndLabelError();
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

    private _updateInputs(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        {
            const label = this._labelConTileFilter;
            label.setText(action.getConTileFilter() ?? ``);
            this._groupConTileFilter.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActRangeForUp;
            label.setText(action.getActRangeForUp() ?? ``);
            this._groupActRangeForUp.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActRangeForDown;
            label.setText(action.getActRangeForDown() ?? ``);
            this._groupActRangeForDown.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActRangeForLeft;
            label.setText(action.getActRangeForLeft() ?? ``);
            this._groupActRangeForLeft.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActRangeForRight;
            label.setText(action.getActRangeForRight() ?? ``);
            this._groupActRangeForRight.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActPriority;
            label.setText(action.getActPriority() ?? ``);
            this._groupActPriority.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCanAffectSelf;
            label.setText(action.getActCanAffectSelf() ?? ``);
            this._groupActCanAffectSelf.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCanAffectAlly;
            label.setText(action.getActCanAffectAlly() ?? ``);
            this._groupActCanAffectAlly.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCanAffectEnemy;
            label.setText(action.getActCanAffectEnemy() ?? ``);
            this._groupActCanAffectEnemy.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActMaxTargetCount;
            label.setText(action.getActMaxTargetCount() ?? ``);
            this._groupActMaxTargetCount.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActOffsetHp;
            label.setText(action.getActOffsetHp() ?? ``);
            this._groupActOffsetHp.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCanBeFatal;
            label.setText(action.getActCanBeFatal() ?? ``);
            this._groupActCanBeFatal.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActOffsetFuelPercentage;
            label.setText(action.getActOffsetFuelPercentage() ?? ``);
            this._groupActOffsetFuelPercentage.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActOffsetPrimaryAmmoPercentage;
            label.setText(action.getActOffsetPrimaryAmmoPercentage() ?? ``);
            this._groupActOffsetPrimaryAmmoPercentage.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): Undefinable<WeaSetCustomCannonStateExpr> {
        return this.getOpenData()?.action.getWeaSetCustomCannonStateExpr();
    }
}
