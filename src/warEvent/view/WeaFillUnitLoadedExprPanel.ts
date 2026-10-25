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
import type { WeaFillUnitLoadedExpr } from "../../proto/schema/CommonProto/WarEvent/WeaFillUnitLoadedExpr.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { ExpressionInfoDict } from "../../warEvents/actions/constants/FillUnitLoadedExpr.ts";
import { getErrorTipForAction, getBriefDescForAction } from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData       = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEventAction         = ProtoSchemaCommonProtoWarEventWarEventAction;

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                          : IUiImage;
    private readonly _group!                                            : IUiContainer;
    private readonly _labelTitle!                                       : IUiLabel;
    private readonly _btnType!                                          : IUiButton;
    private readonly _btnClose!                                         : IUiButton;
    private readonly _btnIdentifier!                                    : IUiButton;

    private readonly _groupDesc!                                        : IUiLayout;
    private readonly _labelDesc!                                        : IUiLabel;
    private readonly _labelError!                                       : IUiLabel;

    private readonly _scrExpression!                                    : IUiScroller<IUiLayout>;
    private readonly _groupExpression!                                  : IUiLayout;
    private readonly _groupCon!                                         : IUiLayout;
    private readonly _groupAct!                                         : IUiLayout;

    private readonly _groupConUnitFilter!                               : IUiContainer;
    private readonly _groupModifyConUnitFilter!                         : IUiContainer;
    private readonly _labelConUnitFilter!                               : IUiLabel;
    private readonly _btnConUnitFilter!                                 : IUiButton;

    private readonly _groupActUnitType!                                 : IUiContainer;
    private readonly _groupModifyActUnitType!                           : IUiContainer;
    private readonly _labelActUnitType!                                 : IUiLabel;
    private readonly _btnActUnitType!                                   : IUiButton;

    private readonly _groupActActionState!                              : IUiContainer;
    private readonly _groupModifyActActionState!                        : IUiContainer;
    private readonly _labelActActionState!                              : IUiLabel;
    private readonly _btnActActionState!                                : IUiButton;

    private readonly _groupActCurrentHp!                                : IUiContainer;
    private readonly _groupModifyActCurrentHp!                          : IUiContainer;
    private readonly _labelActCurrentHp!                                : IUiLabel;
    private readonly _btnActCurrentHp!                                  : IUiButton;

    private readonly _groupActPrimaryWeaponCurrentAmmo!                 : IUiContainer;
    private readonly _groupModifyActPrimaryWeaponCurrentAmmo!           : IUiContainer;
    private readonly _labelActPrimaryWeaponCurrentAmmo!                 : IUiLabel;
    private readonly _btnActPrimaryWeaponCurrentAmmo!                   : IUiButton;

    private readonly _groupActFlareCurrentAmmo!                         : IUiContainer;
    private readonly _groupModifyActFlareCurrentAmmo!                   : IUiContainer;
    private readonly _labelActFlareCurrentAmmo!                         : IUiLabel;
    private readonly _btnActFlareCurrentAmmo!                           : IUiButton;

    private readonly _groupActCurrentFuel!                              : IUiContainer;
    private readonly _groupModifyActCurrentFuel!                        : IUiContainer;
    private readonly _labelActCurrentFuel!                              : IUiLabel;
    private readonly _btnActCurrentFuel!                                : IUiButton;

    private readonly _groupActIsDiving!                                 : IUiContainer;
    private readonly _groupModifyActIsDiving!                           : IUiContainer;
    private readonly _labelActIsDiving!                                 : IUiLabel;
    private readonly _btnActIsDiving!                                   : IUiButton;

    private readonly _groupActCurrentBuildMaterial!                     : IUiContainer;
    private readonly _groupModifyActCurrentBuildMaterial!               : IUiContainer;
    private readonly _labelActCurrentBuildMaterial!                     : IUiLabel;
    private readonly _btnActCurrentBuildMaterial!                       : IUiButton;

    private readonly _groupActCurrentProduceMaterial!                   : IUiContainer;
    private readonly _groupModifyActCurrentProduceMaterial!             : IUiContainer;
    private readonly _labelActCurrentProduceMaterial!                   : IUiLabel;
    private readonly _btnActCurrentProduceMaterial!                     : IUiButton;

    private readonly _groupActCurrentPromotion!                         : IUiContainer;
    private readonly _groupModifyActCurrentPromotion!                   : IUiContainer;
    private readonly _labelActCurrentPromotion!                         : IUiLabel;
    private readonly _btnActCurrentPromotion!                           : IUiButton;

    private readonly _groupActIsCoOnboard!                              : IUiContainer;
    private readonly _groupModifyActIsCoOnboard!                        : IUiContainer;
    private readonly _labelActIsCoOnboard!                              : IUiLabel;
    private readonly _btnActIsCoOnboard!                                : IUiButton;

    private readonly _groupActAiMode!                                   : IUiContainer;
    private readonly _groupModifyActAiMode!                             : IUiContainer;
    private readonly _labelActAiMode!                                   : IUiLabel;
    private readonly _btnActAiMode!                                     : IUiButton;

    private readonly _groupActGroupedTagId!                             : IUiContainer;
    private readonly _groupModifyActGroupedTagId!                       : IUiContainer;
    private readonly _labelActGroupedTagId!                             : IUiLabel;
    private readonly _btnActGroupedTagId!                               : IUiButton;

    private readonly _groupActForbiddenGroupedLocationIdArray!          : IUiContainer;
    private readonly _groupModifyActForbiddenGroupedLocationIdArray!    : IUiContainer;
    private readonly _labelActForbiddenGroupedLocationIdArray!          : IUiLabel;
    private readonly _btnActForbiddenGroupedLocationIdArray!            : IUiButton;

    private readonly _groupActAiWeightedDestination!                    : IUiContainer;
    private readonly _groupModifyActAiWeightedDestination!              : IUiContainer;
    private readonly _labelActAiWeightedDestination!                    : IUiLabel;
    private readonly _btnActAiWeightedDestination!                      : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,                 callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                       callback: this.closePanel },
            { ui: this._btnType,                                        callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                                  callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyConUnitFilter,                       callback: this._onTouchedGroupModifyConUnitFilter },
            { ui: this._btnConUnitFilter,                               callback: this._onTouchedBtnConUnitFilter },

            { ui: this._groupModifyActUnitType,                         callback: this._onTouchedGroupModifyActUnitType },
            { ui: this._btnActUnitType,                                 callback: this._onTouchedBtnActUnitType },

            { ui: this._groupModifyActActionState,                      callback: this._onTouchedGroupModifyActActionState },
            { ui: this._btnActActionState,                              callback: this._onTouchedBtnActActionState },

            { ui: this._groupModifyActPrimaryWeaponCurrentAmmo,         callback: this._onTouchedGroupModifyActPrimaryWeaponCurrentAmmo },
            { ui: this._btnActPrimaryWeaponCurrentAmmo,                 callback: this._onTouchedBtnActPrimaryWeaponCurrentAmmo },

            { ui: this._groupModifyActCurrentHp,                        callback: this._onTouchedGroupModifyActCurrentHp },
            { ui: this._btnActCurrentHp,                                callback: this._onTouchedBtnActCurrentHp },

            { ui: this._groupModifyActIsDiving,                         callback: this._onTouchedGroupModifyActIsDiving },
            { ui: this._btnActIsDiving,                                 callback: this._onTouchedBtnActIsDiving },

            { ui: this._groupModifyActFlareCurrentAmmo,                 callback: this._onTouchedGroupModifyActFlareCurrentAmmo },
            { ui: this._btnActFlareCurrentAmmo,                         callback: this._onTouchedBtnActFlareCurrentAmmo },

            { ui: this._groupModifyActCurrentFuel,                      callback: this._onTouchedGroupModifyActCurrentFuel },
            { ui: this._btnActCurrentFuel,                              callback: this._onTouchedBtnActCurrentFuel },

            { ui: this._groupModifyActCurrentBuildMaterial,             callback: this._onTouchedGroupModifyActCurrentBuildMaterial },
            { ui: this._btnActCurrentBuildMaterial,                     callback: this._onTouchedBtnActCurrentBuildMaterial },

            { ui: this._groupModifyActCurrentProduceMaterial,           callback: this._onTouchedGroupModifyActCurrentProduceMaterial },
            { ui: this._btnActCurrentProduceMaterial,                   callback: this._onTouchedBtnActCurrentProduceMaterial },

            { ui: this._groupModifyActCurrentPromotion,                 callback: this._onTouchedGroupModifyActCurrentPromotion },
            { ui: this._btnActCurrentPromotion,                         callback: this._onTouchedBtnActCurrentPromotion },

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

    private _onTouchedBtnConUnitFilter(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ConUnitFilter.getHelpText(),
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

    private _onTouchedBtnActUnitType(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActUnitType.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActUnitType(),
            expressionInfo  : ExpressionInfoDict.ActUnitType,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActUnitType() != text) {
                    action.setActUnitType(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActActionState(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActActionState.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActActionState(),
            expressionInfo  : ExpressionInfoDict.ActActionState,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActActionState() != text) {
                    action.setActActionState(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentHp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActCurrentHp.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentHp(),
            expressionInfo  : ExpressionInfoDict.ActCurrentHp,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentHp() != text) {
                    action.setActCurrentHp(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActPrimaryWeaponCurrentAmmo(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo  : ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActPrimaryWeaponCurrentAmmo() != text) {
                    action.setActPrimaryWeaponCurrentAmmo(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActFlareCurrentAmmo(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActFlareCurrentAmmo.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActFlareCurrentAmmo(),
            expressionInfo  : ExpressionInfoDict.ActFlareCurrentAmmo,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActFlareCurrentAmmo() != text) {
                    action.setActFlareCurrentAmmo(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentFuel(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActCurrentFuel.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentFuel(),
            expressionInfo  : ExpressionInfoDict.ActCurrentFuel,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentFuel() != text) {
                    action.setActCurrentFuel(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsDiving(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActIsDiving.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsDiving(),
            expressionInfo  : ExpressionInfoDict.ActIsDiving,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsDiving() != text) {
                    action.setActIsDiving(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentBuildMaterial(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActCurrentBuildMaterial.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentBuildMaterial(),
            expressionInfo  : ExpressionInfoDict.ActCurrentBuildMaterial,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentBuildMaterial() != text) {
                    action.setActCurrentBuildMaterial(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentProduceMaterial(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActCurrentProduceMaterial.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentProduceMaterial(),
            expressionInfo  : ExpressionInfoDict.ActCurrentProduceMaterial,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentProduceMaterial() != text) {
                    action.setActCurrentProduceMaterial(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentPromotion(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActCurrentPromotion.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentPromotion(),
            expressionInfo  : ExpressionInfoDict.ActCurrentPromotion,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentPromotion() != text) {
                    action.setActCurrentPromotion(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsCoOnboard(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActIsCoOnboard.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsCoOnboard(),
            expressionInfo  : ExpressionInfoDict.ActIsCoOnboard,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsCoOnboard() != text) {
                    action.setActIsCoOnboard(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActAiMode(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActAiMode.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActAiMode(),
            expressionInfo  : ExpressionInfoDict.ActAiMode,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActAiMode() != text) {
                    action.setActAiMode(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActGroupedTagId(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActGroupedTagId.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActGroupedTagId(),
            expressionInfo  : ExpressionInfoDict.ActGroupedTagId,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActGroupedTagId() != text) {
                    action.setActGroupedTagId(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActForbiddenGroupedLocationIdArray(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActForbiddenGroupedLocationIdArray.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActForbiddenGroupedLocationIdArray(),
            expressionInfo  : ExpressionInfoDict.ActForbiddenGroupedLocationIdArray,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActForbiddenGroupedLocationIdArray() != text) {
                    action.setActForbiddenGroupedLocationIdArray(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActAiWeightedDestination(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActAiWeightedDestination.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActAiWeightedDestination(),
            expressionInfo  : ExpressionInfoDict.ActAiWeightedDestination,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActAiWeightedDestination() != text) {
                    action.setActAiWeightedDestination(text);
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

        this._btnConUnitFilter.setText(ExpressionInfoDict.ConUnitFilter.getTitleText());
        this._btnActUnitType.setText(ExpressionInfoDict.ActUnitType.getTitleText());
        this._btnActActionState.setText(ExpressionInfoDict.ActActionState.getTitleText());
        this._btnActCurrentHp.setText(ExpressionInfoDict.ActCurrentHp.getTitleText());
        this._btnActPrimaryWeaponCurrentAmmo.setText(ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo.getTitleText());
        this._btnActFlareCurrentAmmo.setText(ExpressionInfoDict.ActFlareCurrentAmmo.getTitleText());
        this._btnActCurrentFuel.setText(ExpressionInfoDict.ActCurrentFuel.getTitleText());
        this._btnActIsDiving.setText(ExpressionInfoDict.ActIsDiving.getTitleText());
        this._btnActCurrentBuildMaterial.setText(ExpressionInfoDict.ActCurrentBuildMaterial.getTitleText());
        this._btnActCurrentProduceMaterial.setText(ExpressionInfoDict.ActCurrentProduceMaterial.getTitleText());
        this._btnActCurrentPromotion.setText(ExpressionInfoDict.ActCurrentPromotion.getTitleText());
        this._btnActIsCoOnboard.setText(ExpressionInfoDict.ActIsCoOnboard.getTitleText());
        this._btnActAiMode.setText(ExpressionInfoDict.ActAiMode.getTitleText());
        this._btnActGroupedTagId.setText(ExpressionInfoDict.ActGroupedTagId.getTitleText());
        this._btnActForbiddenGroupedLocationIdArray.setText(ExpressionInfoDict.ActForbiddenGroupedLocationIdArray.getTitleText());
        this._btnActAiWeightedDestination.setText(ExpressionInfoDict.ActAiWeightedDestination.getTitleText());

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
            const label = this._labelConUnitFilter;
            label.setText(action.getConUnitFilter() ?? ``);
            this._groupConUnitFilter.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActUnitType;
            label.setText(action.getActUnitType() ?? ``);
            this._groupActUnitType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
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

    private getAction(): Undefinable<WeaFillUnitLoadedExpr> {
        return this.getOpenData()?.action.getWeaFillUnitLoadedExpr();
    }
}
