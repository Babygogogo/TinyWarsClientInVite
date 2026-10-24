import type * as CoopCustomRoomModelCcrRoomCreator from "../model/CcrRoomCreator.ts";
import * as CosConstants from "../../cos/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayerRulesUtils from "../../playerRules/Utils.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiOpenableComponent from "../../ui/components/UiOpenableComponent.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import * as UiTypesUiHorizontalAlign from "../../ui/types/UiHorizontalAlign.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiVerticalAlign from "../../ui/types/UiVerticalAlign.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

export type OpenData = {
    roomCreator : CoopCustomRoomModelCcrRoomCreator.CcrRoomCreator;
} | null;
export class Page extends UiComponentsUiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _groupInfo!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listPlayer!   : UiInterfacesIUiScrollList.IUiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        UiUtilsUiSkinHelpers.loadSkinByPath(this, "coopCustomRoom/CcrCreatePlayerInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage  : 100 },
            height          : { percentage  : 100 },
        });

        this._listPlayer.setItemRendererClass(PlayerRenderer);
    }
    public override async _onOpened(): Promise<void> {
        await super._onOpened();

        this._updateComponentsForPlayerInfo();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listPlayer.removeAllItems();

        await super._onClosed();
    }

    public updateView(): void {
        this._updateComponentsForPlayerInfo();
    }

    private async _updateComponentsForPlayerInfo(): Promise<void> {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return;
        }

        await this._listPlayer.bindData(this._createDataForListPlayer(HelpersMisc.getExisted((await roomCreator.getMapRawData()).getPlayersCountUnneutral())));
    }

    private _createDataForListPlayer(playersCountUnneutral: number): DataForPlayerRenderer[] {
        const CcrCreateModel = this.getOpenData()?.roomCreator;
        if (CcrCreateModel == null) {
            return [];
        }

        const dataList: DataForPlayerRenderer[] = [];
        for (let playerIndex = 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
            dataList.push({
                roomCreator  : CcrCreateModel,
                playerIndex     : playerIndex,
                page            : this,
            });
        }

        return dataList;
    }
}

interface DataForPlayerRenderer extends UiTypesUiListItemData.UiListItemData {
    roomCreator     : CoopCustomRoomModelCcrRoomCreator.CcrRoomCreator;
    playerIndex     : number;
    page            : Page;
}
class PlayerRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSkin!              : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCoInfo!            : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCoHead!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelCo!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPlayerType!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelPlayerIndex!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTeamIndex!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnChangeCo!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChangeController!  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChangeSkinId!      : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,                callback: this._onTouchedGroupCo },
            { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo },
            { ui: this._btnChangeController,    callback: this._onTouchedBtnChangeController },
            { ui: this._btnChangeSkinId,        callback: this._onTouchedBtnChangeSkinId },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    private async _onTouchedGroupCo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator   = openData.roomCreator;
        const playerIndex   = openData.playerIndex;
        const coId          = (roomCreator.getSelfPlayerIndex() === playerIndex)
            ? (roomCreator.getSelfCoId())
            : (WarRulesUtilsCommonData.getPlayerRule(
                HelpersMisc.getExisted(roomCreator.getSettingsForCommon().getInstanceWarRule()?.getWarRuleCommonData()),
                playerIndex
            ).getCcwAiCoId());

        if ((coId != null) && (coId !== CosConstants.CoId.Empty)) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonCoInfoPanel, {
                gameConfig   : roomCreator.getGcData(),
                coId,
            });
        }
    }

    private async _onTouchedBtnChangeController(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator           = openData.roomCreator;
        const instanceWarRule       = roomCreator.getInstanceWarRule();
        const playerRuleArray       = HelpersMisc.getExisted(instanceWarRule.getWarRuleCommonData()?.getPlayerRuleList());
        const humanPlayerIndexSet   = new Set<number>();
        const aiPlayerIndexSet      = new Set<number>();
        for (const playerRule of playerRuleArray) {
            const playerIndex = HelpersMisc.getExisted(playerRule.getPlayerIndex());
            if (playerRule.getCcwAiCoId() == null) {
                humanPlayerIndexSet.add(playerIndex);
            } else {
                aiPlayerIndexSet.add(playerIndex);
            }
        }

        const playerIndex   = openData.playerIndex;
        const playerRule    = HelpersMisc.getExisted(playerRuleArray.find(v => v.getPlayerIndex() === playerIndex));
        if (playerIndex === roomCreator.getSelfPlayerIndex()) {
            if (humanPlayerIndexSet.size < 2) {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0222));
            } else {
                const callback = () => {
                    for (const p of humanPlayerIndexSet) {
                        if (p !== playerIndex) {
                            roomCreator.setSelfPlayerIndex(p);
                            break;
                        }
                    }
                    playerRule.setCcwAiCoId(CosConstants.CoId.Empty);
                    roomCreator.setAiSkinId(playerIndex, playerIndex);
                    openData.page.updateView();
                };

                if (instanceWarRule.getTemplateWarRuleId() == null) {
                    callback();
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                        getContent : () => LangUtils.getText(LangConstants.TextType.A0129),
                        callback: () => {
                            instanceWarRule.setTemplateWarRuleId(null);
                            callback();
                        },
                    });
                }
            }

        } else {
            if (playerRule.getCcwAiCoId() == null) {
                roomCreator.setSelfPlayerIndex(playerIndex);
                openData.page.updateView();
            } else {
                const callback = () => {
                    playerRule.setCcwAiCoId(null);
                    roomCreator.deleteAiSkinId(playerIndex);
                    openData.page.updateView();
                };

                if (instanceWarRule.getTemplateWarRuleId() == null) {
                    callback();
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                        getContent : () => LangUtils.getText(LangConstants.TextType.A0129),
                        callback: () => {
                            instanceWarRule.setTemplateWarRuleId(null);
                            callback();
                        },
                    });
                }
            }
        }

        openData.page.updateView();

    }

    private async _onTouchedBtnChangeSkinId(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openData.roomCreator.tickUnitAndTileSkinId(openData.playerIndex);
        this._updateComponentsForSettings();
    }

    private async _onTouchedBtnChangeCo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex       = openData.playerIndex;
        const roomCreator       = openData.roomCreator;
        const instanceWarRule   = roomCreator.getInstanceWarRule();
        const warRuleCommonData = HelpersMisc.getExisted(instanceWarRule.getWarRuleCommonData());
        const gcData            = roomCreator.getGcData();
        const playerRule        = WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex);
        const hasFogByDefault   = warRuleCommonData.getHasFogByDefault();
        const warType           = hasFogByDefault ? WarTypesConstants.WarTypeId.CcwFog : WarTypesConstants.WarTypeId.CcwStd;
        if (playerIndex === roomCreator.getSelfPlayerIndex()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
                gameConfig          : gcData,
                currentCoId         : roomCreator.getSelfCoId(),
                availableCoIdArray  : [...PlayerRulesUtils.getFinalCcwHumanCoIdSet({
                    playerRule      : playerRule,
                    gameConfig      : gcData,
                    hasFogByDefault : hasFogByDefault,
                    includeRandom   : true,
                })],
                isBan               : false,
                callbackOnConfirm   : newCoId => {
                    if (newCoId !== roomCreator.getSelfCoId()) {
                        roomCreator.setSelfCoId(newCoId);
                        this._updateComponentsForSettings();
                    }
                },
            });
        } else {
            const ccwAiCoId = playerRule.getCcwAiCoId();
            if (ccwAiCoId != null) {
                const callback = () => {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
                        gameConfig          : gcData,
                        currentCoId         : ccwAiCoId,
                        availableCoIdArray  : gcData.getEnabledCoArray(warType).filter(v => v.getCoCategoryId() !== CosConstants.CategoryId.Random).map(v => v.getCoId()),
                        isBan               : false,
                        callbackOnConfirm   : newCoId => {
                            if (newCoId !== ccwAiCoId) {
                                playerRule.setCcwAiCoId(newCoId);
                                this._updateComponentsForSettings();
                                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.CcrCreateAiCoIdChanged);
                            }
                        },
                    });
                };

                if (instanceWarRule.getTemplateWarRuleId() == null) {
                    callback();
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                        getContent : () => LangUtils.getText(LangConstants.TextType.A0129),
                        callback: () => {
                            instanceWarRule.setTemplateWarRuleId(null);
                            callback();
                        },
                    });
                }
            }
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForSettings();
    }

    private _updateComponentsForLanguage(): void {
        this._btnChangeCo.setLangText(LangConstants.TextType.B0230);
        this._btnChangeController.setLangText(LangConstants.TextType.B0608);
        this._btnChangeSkinId.setLangText(LangConstants.TextType.B0609);
    }

    private async _updateComponentsForSettings(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator   = openData.roomCreator;
        const playerIndex   = openData.playerIndex;
        this._labelPlayerIndex.setText(LangUtils.getPlayerForceName(playerIndex));

        const settingsForCommon = roomCreator.getSettingsForCommon();
        const warRuleCommonData = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
        const playerRule        = WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex);
        this._labelTeamIndex.setText(LangUtils.getPlayerTeamName(HelpersMisc.getExisted(playerRule.getTeamIndex())) || LangConstants.UndefinedError);

        const isSelfPlayer      = roomCreator.getSelfPlayerIndex() === playerIndex;
        const isHumanPlayer     = playerRule.getCcwAiCoId() == null;
        this._imgSkin.loadSource(HelpersImageSource.getCoHeadFrame(
            isSelfPlayer
                ? roomCreator.getSelfUnitAndTileSkinId()
                : (isHumanPlayer ? null : roomCreator.getAiSkinId(playerIndex))
        ));

        this._labelPlayerType.setText(isSelfPlayer
            ? LangUtils.getText(LangConstants.TextType.B0647)
            : (isHumanPlayer
                ? LangUtils.getText(LangConstants.TextType.B0648)
                : LangUtils.getText(LangConstants.TextType.B0607))
        );

        const coId          = isSelfPlayer ? roomCreator.getSelfCoId() : (playerRule.getCcwAiCoId() ?? null);
        const gameConfig    = await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion()));
        const coCfg         = coId == null ? null : gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(coId == null ? `` : HelpersImageSource.getCoHead(gameConfig, coId) ?? LangConstants.UndefinedError);
        this._imgCoInfo.setIsVisible((coId !== CosConstants.CoId.Empty) && (!!coCfg));
        this._btnChangeCo.setIsVisible((isSelfPlayer) || (!isHumanPlayer));
        this._btnChangeSkinId.setIsVisible((isSelfPlayer) || (!isHumanPlayer));
    }
}
