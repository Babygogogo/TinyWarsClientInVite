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
import type * as ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr from "../../proto/schema/CommonProto/WarEvent/WeaFillUnitOnMapExpr.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as WarEventsActionsConstantsFillUnitOnMapExpr from "../../warEvents/actions/constants/FillUnitOnMapExpr.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData           = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction             = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                                       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                                          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnIdentifier!                                    : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                                        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _scrExpression!                                    : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupExpression!                                  : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupCon!                                         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupAct!                                         : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupConTileFilter!                               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyConTileFilter!                         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelConTileFilter!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConTileFilter!                                 : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActUnitType!                                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActUnitType!                           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActUnitType!                                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActUnitType!                                   : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActPlayerIndex!                              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActPlayerIndex!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActPlayerIndex!                              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActPlayerIndex!                                : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActActionState!                              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActActionState!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActActionState!                              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActActionState!                                : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActCurrentHp!                                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentHp!                          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActCurrentHp!                                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActCurrentHp!                                  : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActPrimaryWeaponCurrentAmmo!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActPrimaryWeaponCurrentAmmo!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActPrimaryWeaponCurrentAmmo!                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActPrimaryWeaponCurrentAmmo!                   : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActFlareCurrentAmmo!                         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActFlareCurrentAmmo!                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActFlareCurrentAmmo!                         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActFlareCurrentAmmo!                           : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActCurrentFuel!                              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentFuel!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActCurrentFuel!                              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActCurrentFuel!                                : UiInterfacesIUiButton.IUiButton;

    // private readonly _groupActIsCapturingTile!                          : Ui.Interfaces.IUiContainer;
    // private readonly _groupModifyActIsCapturingTile!                    : Ui.Interfaces.IUiContainer;
    // private readonly _labelActIsCapturingTile!                          : Ui.Interfaces.IUiLabel;
    // private readonly _btnActIsCapturingTile!                            : Ui.Interfaces.IUiButton;

    private readonly _groupActIsDiving!                                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActIsDiving!                           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActIsDiving!                                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActIsDiving!                                   : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActCurrentBuildMaterial!                     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentBuildMaterial!               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActCurrentBuildMaterial!                     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActCurrentBuildMaterial!                       : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActCurrentProduceMaterial!                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentProduceMaterial!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActCurrentProduceMaterial!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActCurrentProduceMaterial!                     : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActCurrentPromotion!                         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentPromotion!                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActCurrentPromotion!                         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActCurrentPromotion!                           : UiInterfacesIUiButton.IUiButton;

    // private readonly _groupActIsBuildingTile!                           : Ui.Interfaces.IUiContainer;
    // private readonly _groupModifyActIsBuildingTile!                     : Ui.Interfaces.IUiContainer;
    // private readonly _labelActIsBuildingTile!                           : Ui.Interfaces.IUiLabel;
    // private readonly _btnActIsBuildingTile!                             : Ui.Interfaces.IUiButton;

    private readonly _groupActIsCoOnboard!                              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActIsCoOnboard!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActIsCoOnboard!                              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActIsCoOnboard!                                : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActAiMode!                                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActAiMode!                             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActAiMode!                                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActAiMode!                                     : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActGroupedTagId!                             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActGroupedTagId!                       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActGroupedTagId!                             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActGroupedTagId!                               : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActForbiddenGroupedLocationIdArray!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActForbiddenGroupedLocationIdArray!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActForbiddenGroupedLocationIdArray!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActForbiddenGroupedLocationIdArray!            : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActAiWeightedDestination!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActAiWeightedDestination!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActAiWeightedDestination!                    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActAiWeightedDestination!                      : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,                 callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                       callback: this.closePanel },
            { ui: this._btnType,                                        callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                                  callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyConTileFilter,                       callback: this._onTouchedGroupModifyConTileFilter },
            { ui: this._btnConTileFilter,                               callback: this._onTouchedBtnConTileFilter },

            { ui: this._groupModifyActUnitType,                         callback: this._onTouchedGroupModifyActUnitType },
            { ui: this._btnActUnitType,                                 callback: this._onTouchedBtnActUnitType },

            { ui: this._groupModifyActPlayerIndex,                      callback: this._onTouchedGroupModifyActPlayerIndex },
            { ui: this._btnActPlayerIndex,                              callback: this._onTouchedBtnActPlayerIndex },

            { ui: this._groupModifyActActionState,                      callback: this._onTouchedGroupModifyActActionState },
            { ui: this._btnActActionState,                              callback: this._onTouchedBtnActActionState },

            { ui: this._groupModifyActCurrentHp,                        callback: this._onTouchedGroupModifyActCurrentHp },
            { ui: this._btnActCurrentHp,                                callback: this._onTouchedBtnActCurrentHp },

            { ui: this._groupModifyActPrimaryWeaponCurrentAmmo,         callback: this._onTouchedGroupModifyActPrimaryWeaponCurrentAmmo },
            { ui: this._btnActPrimaryWeaponCurrentAmmo,                 callback: this._onTouchedBtnActPrimaryWeaponCurrentAmmo },

            { ui: this._groupModifyActFlareCurrentAmmo,                 callback: this._onTouchedGroupModifyActFlareCurrentAmmo },
            { ui: this._btnActFlareCurrentAmmo,                         callback: this._onTouchedBtnActFlareCurrentAmmo },

            { ui: this._groupModifyActCurrentFuel,                      callback: this._onTouchedGroupModifyActCurrentFuel },
            { ui: this._btnActCurrentFuel,                              callback: this._onTouchedBtnActCurrentFuel },

            // { ui: this._groupModifyActIsCapturingTile,                  callback: this._onTouchedGroupModifyActIsCapturingTile },
            // { ui: this._btnActIsCapturingTile,                          callback: this._onTouchedBtnActIsCapturingTile },

            { ui: this._groupModifyActIsDiving,                         callback: this._onTouchedGroupModifyActIsDiving },
            { ui: this._btnActIsDiving,                                 callback: this._onTouchedBtnActIsDiving },

            { ui: this._groupModifyActCurrentBuildMaterial,             callback: this._onTouchedGroupModifyActCurrentBuildMaterial },
            { ui: this._btnActCurrentBuildMaterial,                     callback: this._onTouchedBtnActCurrentBuildMaterial },

            { ui: this._groupModifyActCurrentProduceMaterial,           callback: this._onTouchedGroupModifyActCurrentProduceMaterial },
            { ui: this._btnActCurrentProduceMaterial,                   callback: this._onTouchedBtnActCurrentProduceMaterial },

            { ui: this._groupModifyActCurrentPromotion,                 callback: this._onTouchedGroupModifyActCurrentPromotion },
            { ui: this._btnActCurrentPromotion,                         callback: this._onTouchedBtnActCurrentPromotion },

            // { ui: this._groupModifyActIsBuildingTile,                   callback: this._onTouchedGroupModifyActIsBuildingTile },
            // { ui: this._btnActIsBuildingTile,                           callback: this._onTouchedBtnActIsBuildingTile },

            { ui: this._groupModifyActIsCoOnboard,                      callback: this._onTouchedGroupModifyActIsCoOnboard },
            { ui: this._btnActIsCoOnboard,                              callback: this._onTouchedBtnActIsCoOnboard },

            { ui: this._groupModifyActAiMode,                           callback: this._onTouchedGroupModifyActAiMode },
            { ui: this._btnActAiMode,                                   callback: this._onTouchedBtnActAiMode },

            { ui: this._groupModifyActGroupedTagId,                     callback: this._onTouchedGroupModifyActGroupedTagId },
            { ui: this._btnActGroupedTagId,                             callback: this._onTouchedBtnActGroupedTagId },

            { ui: this._groupModifyActForbiddenGroupedLocationIdArray,  callback: this._onTouchedGroupModifyActForbiddenGroupedLocationIdArray },
            { ui: this._btnActForbiddenGroupedLocationIdArray,          callback: this._onTouchedBtnActForbiddenGroupedLocationIdArray },

            { ui: this._groupModifyActAiWeightedDestination,            callback: this._onTouchedGroupModifyActAiWeightedDestination },
            { ui: this._btnActAiWeightedDestination,                    callback: this._onTouchedBtnActAiWeightedDestination },
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
            contextType : ExpressionParsersEnums.ContextType.Player,
        });
    }

    private _onTouchedBtnConTileFilter(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ConTileFilter.getHelpText(),
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
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ConTileFilter,
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

    private _onTouchedBtnActUnitType(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActUnitType.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActUnitType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActUnitType(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActUnitType,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActUnitType() != text) {
                    action.setActUnitType(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActPlayerIndex(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActPlayerIndex.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActPlayerIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActPlayerIndex(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActPlayerIndex,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActPlayerIndex() != text) {
                    action.setActPlayerIndex(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActActionState(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActActionState.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActActionState(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActActionState(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActActionState,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActActionState() != text) {
                    action.setActActionState(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentHp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentHp.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCurrentHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentHp(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentHp,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentHp() != text) {
                    action.setActCurrentHp(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActPrimaryWeaponCurrentAmmo(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActPrimaryWeaponCurrentAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActPrimaryWeaponCurrentAmmo() != text) {
                    action.setActPrimaryWeaponCurrentAmmo(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActFlareCurrentAmmo(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActFlareCurrentAmmo.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActFlareCurrentAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActFlareCurrentAmmo(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActFlareCurrentAmmo,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActFlareCurrentAmmo() != text) {
                    action.setActFlareCurrentAmmo(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentFuel(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentFuel.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCurrentFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentFuel(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentFuel,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentFuel() != text) {
                    action.setActCurrentFuel(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsCapturingTile(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsCapturingTile.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActIsCapturingTile(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsCapturingTile(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsCapturingTile,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsCapturingTile() != text) {
                    action.setActIsCapturingTile(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsDiving(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsDiving.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActIsDiving(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsDiving(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsDiving,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsDiving() != text) {
                    action.setActIsDiving(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentBuildMaterial(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentBuildMaterial.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCurrentBuildMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentBuildMaterial(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentBuildMaterial,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentBuildMaterial() != text) {
                    action.setActCurrentBuildMaterial(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentProduceMaterial(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentProduceMaterial.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCurrentProduceMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentProduceMaterial(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentProduceMaterial,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentProduceMaterial() != text) {
                    action.setActCurrentProduceMaterial(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentPromotion(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentPromotion.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCurrentPromotion(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentPromotion(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentPromotion,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentPromotion() != text) {
                    action.setActCurrentPromotion(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsBuildingTile(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsBuildingTile.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActIsBuildingTile(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsBuildingTile(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsBuildingTile,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsBuildingTile() != text) {
                    action.setActIsBuildingTile(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsCoOnboard(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsCoOnboard.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActIsCoOnboard(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsCoOnboard(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsCoOnboard,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsCoOnboard() != text) {
                    action.setActIsCoOnboard(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActAiMode(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActAiMode.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActAiMode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActAiMode(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActAiMode,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActAiMode() != text) {
                    action.setActAiMode(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActGroupedTagId(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActGroupedTagId.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActGroupedTagId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActGroupedTagId(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActGroupedTagId,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActGroupedTagId() != text) {
                    action.setActGroupedTagId(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActForbiddenGroupedLocationIdArray(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActForbiddenGroupedLocationIdArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActForbiddenGroupedLocationIdArray(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActForbiddenGroupedLocationIdArray() != text) {
                    action.setActForbiddenGroupedLocationIdArray(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActAiWeightedDestination(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActAiWeightedDestination.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActAiWeightedDestination(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActAiWeightedDestination(),
            expressionInfo  : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActAiWeightedDestination,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActAiWeightedDestination() != text) {
                    action.setActAiWeightedDestination(text);
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
        this._btnType.setLangText(LangConstants.TextType.B0516);
        this._btnIdentifier.setLangText(LangConstants.TextType.B0131);

        this._btnConTileFilter.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ConTileFilter.getTitleText());
        this._btnActUnitType.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActUnitType.getTitleText());
        this._btnActPlayerIndex.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActPlayerIndex.getTitleText());
        this._btnActActionState.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActActionState.getTitleText());
        this._btnActCurrentHp.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentHp.getTitleText());
        this._btnActPrimaryWeaponCurrentAmmo.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo.getTitleText());
        this._btnActFlareCurrentAmmo.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActFlareCurrentAmmo.getTitleText());
        this._btnActCurrentFuel.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentFuel.getTitleText());
        // this._btnActIsCapturingTile.setText(PhWeaFillUnitOnMapExpr.ExpressionInfoDict.ActIsCapturingTile.getTitleText());
        this._btnActIsDiving.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsDiving.getTitleText());
        this._btnActCurrentBuildMaterial.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentBuildMaterial.getTitleText());
        this._btnActCurrentProduceMaterial.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentProduceMaterial.getTitleText());
        this._btnActCurrentPromotion.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentPromotion.getTitleText());
        // this._btnActIsBuildingTile.setText(PhWeaFillUnitOnMapExpr.ExpressionInfoDict.ActIsBuildingTile.getTitleText());
        this._btnActIsCoOnboard.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsCoOnboard.getTitleText());
        this._btnActAiMode.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActAiMode.getTitleText());
        this._btnActGroupedTagId.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActGroupedTagId.getTitleText());
        this._btnActForbiddenGroupedLocationIdArray.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray.getTitleText());
        this._btnActAiWeightedDestination.setText(WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActAiWeightedDestination.getTitleText());

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
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.Green);
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
            const label = this._labelActUnitType;
            label.setText(action.getActUnitType() ?? ``);
            this._groupActUnitType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActPlayerIndex;
            label.setText(action.getActPlayerIndex() ?? ``);
            this._groupActPlayerIndex.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActActionState;
            label.setText(action.getActActionState() ?? ``);
            this._groupActActionState.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentHp;
            label.setText(action.getActCurrentHp() ?? ``);
            this._groupActCurrentHp.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActPrimaryWeaponCurrentAmmo;
            label.setText(action.getActPrimaryWeaponCurrentAmmo() ?? ``);
            this._groupActPrimaryWeaponCurrentAmmo.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActFlareCurrentAmmo;
            label.setText(action.getActFlareCurrentAmmo() ?? ``);
            this._groupActFlareCurrentAmmo.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentFuel;
            label.setText(action.getActCurrentFuel() ?? ``);
            this._groupActCurrentFuel.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        // {
        //     const label                                             = this._labelActIsCapturingTile;
        //     label.setText(action.getActIsCapturingTile() ?? ``);
        //     this._groupActIsCapturingTile.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        // }
        {
            const label = this._labelActIsDiving;
            label.setText(action.getActIsDiving() ?? ``);
            this._groupActIsDiving.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentBuildMaterial;
            label.setText(action.getActCurrentBuildMaterial() ?? ``);
            this._groupActCurrentBuildMaterial.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentProduceMaterial;
            label.setText(action.getActCurrentProduceMaterial() ?? ``);
            this._groupActCurrentProduceMaterial.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentPromotion;
            label.setText(action.getActCurrentPromotion() ?? ``);
            this._groupActCurrentPromotion.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        // {
        //     const label                                             = this._labelActIsBuildingTile;
        //     label.setText(action.getActIsBuildingTile() ?? ``);
        //     this._groupActIsBuildingTile.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        // }
        {
            const label = this._labelActIsCoOnboard;
            label.setText(action.getActIsCoOnboard() ?? ``);
            this._groupActIsCoOnboard.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActAiMode;
            label.setText(action.getActAiMode() ?? ``);
            this._groupActAiMode.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActGroupedTagId;
            label.setText(action.getActGroupedTagId() ?? ``);
            this._groupActGroupedTagId.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActForbiddenGroupedLocationIdArray;
            label.setText(action.getActForbiddenGroupedLocationIdArray() ?? ``);
            this._groupActForbiddenGroupedLocationIdArray.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActAiWeightedDestination;
            label.setText(action.getActAiWeightedDestination() ?? ``);
            this._groupActAiWeightedDestination.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr> {
        return this.getOpenData()?.action.getWeaFillUnitOnMapExpr();
    }
}
