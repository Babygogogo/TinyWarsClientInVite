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
import type * as ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateExpr from "../../proto/schema/CommonProto/WarEvent/WeaSetCustomCrystalStateExpr.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as WarEventsActionsConstantsSetCustomCrystalStateExpr from "../../warEvents/actions/constants/SetCustomCrystalStateExpr.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData                   = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction                     = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                                      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnIdentifier!                                : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                                    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _scrExpression!                                : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupExpression!                              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupCon!                                     : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupAct!                                     : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupConTileFilter!                           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyConTileFilter!                     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnConTileFilter!                             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTileFilter!                           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActRadius!                               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActRadius!                         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActRadius!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActRadius!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActPriority!                             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActPriority!                       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActPriority!                               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActPriority!                             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActCanAffectSelf!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCanAffectSelf!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActCanAffectSelf!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCanAffectSelf!                        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActCanAffectAlly!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCanAffectAlly!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActCanAffectAlly!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCanAffectAlly!                        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActCanAffectEnemy!                       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCanAffectEnemy!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActCanAffectEnemy!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCanAffectEnemy!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActOffsetFund!                           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActOffsetFund!                     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActOffsetFund!                             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActOffsetFund!                           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActOffsetEnergyPercentage!               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActOffsetEnergyPercentage!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActOffsetEnergyPercentage!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActOffsetEnergyPercentage!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActOffsetHp!                             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActOffsetHp!                       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActOffsetHp!                               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActOffsetHp!                             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActOffsetFuelPercentage!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActOffsetFuelPercentage!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActOffsetFuelPercentage!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActOffsetFuelPercentage!                 : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActOffsetPrimaryAmmoPercentage!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActOffsetPrimaryAmmoPercentage!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActOffsetPrimaryAmmoPercentage!            : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActOffsetPrimaryAmmoPercentage!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActCanBeFatal!                           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCanBeFatal!                     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActCanBeFatal!                             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCanBeFatal!                           : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,             callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                   callback: this.closePanel },
            { ui: this._btnType,                                    callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                              callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyConTileFilter,                   callback: this._onTouchedGroupModifyConTileFilter },
            { ui: this._btnConTileFilter,                           callback: this._onTouchedBtnConTileFilter },

            { ui: this._groupModifyActRadius,                       callback: this._onTouchedGroupModifyActRadius },
            { ui: this._btnActRadius,                               callback: this._onTouchedBtnActRadius },

            { ui: this._groupModifyActPriority,                     callback: this._onTouchedGroupModifyActPriority },
            { ui: this._btnActPriority,                             callback: this._onTouchedBtnActPriority },

            { ui: this._groupModifyActCanAffectSelf,                callback: this._onTouchedGroupModifyActCanAffectSelf },
            { ui: this._btnActCanAffectSelf,                        callback: this._onTouchedBtnActCanAffectSelf },

            { ui: this._groupModifyActCanAffectAlly,                callback: this._onTouchedGroupModifyActCanAffectAlly },
            { ui: this._btnActCanAffectAlly,                        callback: this._onTouchedBtnActCanAffectAlly },

            { ui: this._groupModifyActCanAffectEnemy,               callback: this._onTouchedGroupModifyActCanAffectEnemy },
            { ui: this._btnActCanAffectEnemy,                       callback: this._onTouchedBtnActCanAffectEnemy },

            { ui: this._groupModifyActOffsetFund,                   callback: this._onTouchedGroupModifyActOffsetFund },
            { ui: this._btnActOffsetFund,                           callback: this._onTouchedBtnActOffsetFund },

            { ui: this._groupModifyActOffsetEnergyPercentage,       callback: this._onTouchedGroupModifyActOffsetEnergyPercentage },
            { ui: this._btnActOffsetEnergyPercentage,               callback: this._onTouchedBtnActOffsetEnergyPercentage },

            { ui: this._groupModifyActOffsetHp,                     callback: this._onTouchedGroupModifyActOffsetHp },
            { ui: this._btnActOffsetHp,                             callback: this._onTouchedBtnActOffsetHp },

            { ui: this._groupModifyActOffsetFuelPercentage,         callback: this._onTouchedGroupModifyActOffsetFuelPercentage },
            { ui: this._btnActOffsetFuelPercentage,                 callback: this._onTouchedBtnActOffsetFuelPercentage },

            { ui: this._groupModifyActOffsetPrimaryAmmoPercentage,  callback: this._onTouchedGroupModifyActOffsetPrimaryAmmoPercentage },
            { ui: this._btnActOffsetPrimaryAmmoPercentage,          callback: this._onTouchedBtnActOffsetPrimaryAmmoPercentage },

            { ui: this._groupModifyActCanBeFatal,                   callback: this._onTouchedGroupModifyActCanBeFatal },
            { ui: this._btnActCanBeFatal,                           callback: this._onTouchedBtnActCanBeFatal },
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
            contextType : ExpressionParsersEnums.ContextType.Tile,
        });
    }

    private _onTouchedBtnConTileFilter(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0662),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getConTileFilter(),
            expressionInfo  : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ConTileFilter,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getConTileFilter() != text) {
                    action.setConTileFilter(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActRadius(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0670),
        });
    }
    private _onTouchedGroupModifyActRadius(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActRadius(),
            expressionInfo  : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActRadius,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActRadius() != text) {
                    action.setActRadius(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActPriority(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0671),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActPriority(),
            expressionInfo  : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActPriority,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActPriority() != text) {
                    action.setActPriority(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanAffectSelf(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0672),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanAffectSelf(),
            expressionInfo  : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectSelf,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanAffectSelf() != text) {
                    action.setActCanAffectSelf(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanAffectAlly(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0673),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanAffectAlly(),
            expressionInfo  : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectAlly,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanAffectAlly() != text) {
                    action.setActCanAffectAlly(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanAffectEnemy(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0674),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanAffectEnemy(),
            expressionInfo  : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectEnemy,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanAffectEnemy() != text) {
                    action.setActCanAffectEnemy(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActOffsetFund(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0675),
        });
    }
    private _onTouchedGroupModifyActOffsetFund(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActOffsetFund(),
            expressionInfo  : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFund,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActOffsetFund() != text) {
                    action.setActOffsetFund(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActOffsetEnergyPercentage(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0676),
        });
    }
    private _onTouchedGroupModifyActOffsetEnergyPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActOffsetEnergyPercentage(),
            expressionInfo  : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetEnergyPercentage,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActOffsetEnergyPercentage() != text) {
                    action.setActOffsetEnergyPercentage(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActOffsetHp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0677),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActOffsetHp(),
            expressionInfo  : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetHp,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActOffsetHp() != text) {
                    action.setActOffsetHp(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActOffsetFuelPercentage(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0677),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActOffsetFuelPercentage(),
            expressionInfo  : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActOffsetFuelPercentage() != text) {
                    action.setActOffsetFuelPercentage(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActOffsetPrimaryAmmoPercentage(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0677),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActOffsetPrimaryAmmoPercentage(),
            expressionInfo  : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActOffsetPrimaryAmmoPercentage() != text) {
                    action.setActOffsetPrimaryAmmoPercentage(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanBeFatal(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanBeFatal.getHelpText,
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanBeFatal(),
            expressionInfo  : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanBeFatal,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanBeFatal() != text) {
                    action.setActCanBeFatal(text);
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
        this._btnClose.setText(LangUtils.getText(LangConstants.TextType.B0146));
        this._btnType.setText(LangUtils.getText(LangConstants.TextType.B0516));
        this._btnIdentifier.setText(LangUtils.getText(LangConstants.TextType.B0131));

        this._btnConTileFilter.setText(WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ConTileFilter.getTitleText());
        this._btnActRadius.setText(WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActRadius.getTitleText());
        this._btnActPriority.setText(WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActPriority.getTitleText());
        this._btnActCanAffectSelf.setText(WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectSelf.getTitleText());
        this._btnActCanAffectAlly.setText(WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectAlly.getTitleText());
        this._btnActCanAffectEnemy.setText(WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectEnemy.getTitleText());
        this._btnActOffsetFund.setText(WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFund.getTitleText());
        this._btnActOffsetEnergyPercentage.setText(WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetEnergyPercentage.getTitleText());
        this._btnActOffsetHp.setText(WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetHp.getTitleText());
        this._btnActOffsetFuelPercentage.setText(WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage.getTitleText());
        this._btnActOffsetPrimaryAmmoPercentage.setText(WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage.getTitleText());
        this._btnActCanBeFatal.setText(WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanBeFatal.getTitleText());

        this._updateLabelDescAndLabelError();
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
            const label = this._labelActRadius;
            label.setText(action.getActRadius() ?? ``);
            this._groupActRadius.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
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
            const label = this._labelActOffsetFund;
            label.setText(action.getActOffsetFund() ?? ``);
            this._groupActOffsetFund.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActOffsetEnergyPercentage;
            label.setText(action.getActOffsetEnergyPercentage() ?? ``);
            this._groupActOffsetEnergyPercentage.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActOffsetHp;
            label.setText(action.getActOffsetHp() ?? ``);
            this._groupActOffsetHp.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
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
        {
            const label = this._labelActCanBeFatal;
            label.setText(action.getActCanBeFatal() ?? ``);
            this._groupActCanBeFatal.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateExpr.WeaSetCustomCrystalStateExpr> {
        return this.getOpenData()?.action.getWeaSetCustomCrystalStateExpr();
    }
}
