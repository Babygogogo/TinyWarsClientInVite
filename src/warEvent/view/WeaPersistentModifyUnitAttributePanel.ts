import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as ExpressionParsersEnums from "../../expressionParsers/Enums.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaPersistentModifyUnitAttribute from "../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyUnitAttribute.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as WarEventsActionsConstantsPersistentModifyUnitAttribute from "../../warEvents/actions/constants/PersistentModifyUnitAttribute.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData                       = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction                         = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnIdentifier!                            : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                                : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _scrExpression!                            : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupExpression!                          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupCon!                                 : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupAct!                                 : UiInterfacesIUiLayout.IUiLayout;

    private readonly _layoutConIsEffectiveInMpw!                : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnConIsEffectiveInMpw!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConIsEffectiveInMpw!                 : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupConUnitFilter!                       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyConUnitFilter!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnConUnitFilter!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConUnitFilter!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActAttackPowerModifier!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActAttackPowerModifier!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActAttackPowerModifier!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActAttackPowerModifier!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActDefenseModifier!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActDefenseModifier!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActDefenseModifier!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActDefenseModifier!                  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActMaxAttackRangeModifier!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActMaxAttackRangeModifier!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActMaxAttackRangeModifier!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActMaxAttackRangeModifier!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActCanAttackAfterMoving!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCanAttackAfterMoving!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActCanAttackAfterMoving!               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCanAttackAfterMoving!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActMoveRangeModifier!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActMoveRangeModifier!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActMoveRangeModifier!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActMoveRangeModifier!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActLuckLowerLimitModifier!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActLuckLowerLimitModifier!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActLuckLowerLimitModifier!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActLuckLowerLimitModifier!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActLuckUpperLimitModifier!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActLuckUpperLimitModifier!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActLuckUpperLimitModifier!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActLuckUpperLimitModifier!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActVisionRangeModifier!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActVisionRangeModifier!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActVisionRangeModifier!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActVisionRangeModifier!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActIsPenetratingVision!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActIsPenetratingVision!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActIsPenetratingVision!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActIsPenetratingVision!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActFlareRangeModifier!               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActFlareRangeModifier!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActFlareRangeModifier!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActFlareRangeModifier!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActFlareRadiusModifier!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActFlareRadiusModifier!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActFlareRadiusModifier!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActFlareRadiusModifier!              : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeActionTypeListPanel, {
            fullData    : openData.fullData,
            action      : openData.action,
            war         : openData.war,
        });
    }
    private _onTouchedBtnIdentifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonApiPanel, {
            contextType : ExpressionParsersEnums.ContextType.Unit,
        });
    }
    private _onTouchedBtnConIsEffectiveInMpw(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        if (action.getIsEffectiveInMpw()) {
            action.setIsEffectiveInMpw(null);
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent     : () => LangUtils.getText(LangConstants.TextType.A0538),
                callback    : () => {
                    action.setIsEffectiveInMpw(true);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            });
        }
    }

    private _onTouchedBtnConUnitFilter(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0539),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getConUnitFilter(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ConUnitFilter,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getConUnitFilter() != text) {
                    action.setConUnitFilter(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActAttackPowerModifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActAttackPowerModifier.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActAttackPowerModifier(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActAttackPowerModifier,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActAttackPowerModifier() != text) {
                    action.setActAttackPowerModifier(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActDefenseModifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActDefenseModifier.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActDefenseModifier(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActDefenseModifier,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActDefenseModifier() != text) {
                    action.setActDefenseModifier(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActMaxAttackRangeModifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0543),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActMaxAttackRangeModifier(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActMaxAttackRangeModifier,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActMaxAttackRangeModifier() != text) {
                    action.setActMaxAttackRangeModifier(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanAttackAfterMoving(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0548),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanAttackAfterMoving(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActCanAttackAfterMoving,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanAttackAfterMoving() != text) {
                    action.setActCanAttackAfterMoving(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActMoveRangeModifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActMoveRangeModifier.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActMoveRangeModifier(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActMoveRangeModifier,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActMoveRangeModifier() != text) {
                    action.setActMoveRangeModifier(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActLuckLowerLimitModifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckLowerLimitModifier.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActLuckLowerLimitModifier(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckLowerLimitModifier,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActLuckLowerLimitModifier() != text) {
                    action.setActLuckLowerLimitModifier(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActLuckUpperLimitModifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckUpperLimitModifier.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActLuckUpperLimitModifier(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckUpperLimitModifier,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActLuckUpperLimitModifier() != text) {
                    action.setActLuckUpperLimitModifier(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActVisionRangeModifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0643),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActVisionRangeModifier(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActVisionRangeModifier,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActVisionRangeModifier() != text) {
                    action.setActVisionRangeModifier(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsPenetratingVision(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0644),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsPenetratingVision(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActIsPenetratingVision,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsPenetratingVision() != text) {
                    action.setActIsPenetratingVision(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActFlareRangeModifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRangeModifier.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActFlareRangeModifier(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRangeModifier,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActFlareRangeModifier() != text) {
                    action.setActFlareRangeModifier(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActFlareRadiusModifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRadiusModifier.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActFlareRadiusModifier(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRadiusModifier,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActFlareRadiusModifier() != text) {
                    action.setActFlareRadiusModifier(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateInputs();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnClose.setLangText(LangConstants.TextType.B0146);
        this._btnType.setLangText(LangConstants.TextType.B0516);
        this._btnIdentifier.setLangText(LangConstants.TextType.B0131);
        this._btnConIsEffectiveInMpw.setLangText(LangConstants.TextType.B1170);
        this._btnConUnitFilter.setText(WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ConUnitFilter.getTitleText());
        this._btnActAttackPowerModifier.setText(WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActAttackPowerModifier.getTitleText());
        this._btnActDefenseModifier.setText(WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActDefenseModifier.getTitleText());
        this._btnActMaxAttackRangeModifier.setText(WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActMaxAttackRangeModifier.getTitleText());
        this._btnActCanAttackAfterMoving.setText(WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActCanAttackAfterMoving.getTitleText());
        this._btnActMoveRangeModifier.setText(WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActMoveRangeModifier.getTitleText());
        this._btnActLuckLowerLimitModifier.setText(WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckLowerLimitModifier.getTitleText());
        this._btnActLuckUpperLimitModifier.setText(WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckUpperLimitModifier.getTitleText());
        this._btnActVisionRangeModifier.setText(WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActVisionRangeModifier.getTitleText());
        this._btnActIsPenetratingVision.setText(WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActIsPenetratingVision.getTitleText());
        this._btnActFlareRangeModifier.setText(WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRangeModifier.getTitleText());
        this._btnActFlareRadiusModifier.setText(WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRadiusModifier.getTitleText());

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
        const errorTip          = WarEventsActionsUtilsCommon.getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(WarEventsActionsUtilsCommon.getBriefDescForAction(action, war.getGcData()) || LangConstants.UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateLabelConIsEffectiveInMpw(): void {
        this._labelConIsEffectiveInMpw.setText(LangUtils.getTextForYesOrNo(this.getAction()?.getIsEffectiveInMpw()));
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

    private getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaPersistentModifyUnitAttribute.WeaPersistentModifyUnitAttribute> {
        return this.getOpenData()?.action.getWeaPersistentModifyUnitAttribute();
    }
}
