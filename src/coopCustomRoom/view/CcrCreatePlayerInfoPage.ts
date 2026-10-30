import {
    Cos_Constants,
    Notifications_Dispatcher,
    Helpers_ImageSource,
    GamePanels_Dict,
    Helpers_Misc,
    PlayerRules_Utils,
    GameConfigs_Provider,
    Lang_Utils,
    WarRules_Utils_CommonData,
    Ui_Utils_UiSkinHelpers,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Types_UiHorizontalAlign,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiOpenableComponent,
    Ui_Types_UiVerticalAlign,
    WarTypes_Constants,
    type CoopCustomRoom_Model_CcrRoomCreator,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export type OpenData = {
    roomCreator : CoopCustomRoom_Model_CcrRoomCreator.CcrRoomCreator;
} | null;
export class Page extends Ui_Components_UiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _groupInfo!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listPlayer!   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(this, "coopCustomRoom/CcrCreatePlayerInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage : 100 },
            height          : { percentage : 100 },
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

        await this._listPlayer.bindData(this._createDataForListPlayer((await roomCreator.getMapRawData()).getPlayersCountUnneutral()));
    }

    private _createDataForListPlayer(playersCountUnneutral: number): DataForPlayerRenderer[] {
        const CcrCreateModel = this.getOpenData()?.roomCreator;
        if (CcrCreateModel == null) {
            return [];
        }

        const dataList: DataForPlayerRenderer[] = [];
        for (let playerIndex = 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
            dataList.push({
                roomCreator : CcrCreateModel,
                playerIndex : playerIndex,
                page        : this,
            });
        }

        return dataList;
    }
}

interface DataForPlayerRenderer extends Ui_Types_UiListItemData.UiListItemData {
    roomCreator     : CoopCustomRoom_Model_CcrRoomCreator.CcrRoomCreator;
    playerIndex     : number;
    page            : Page;
}
class PlayerRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSkin!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCoInfo!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCoHead!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelCo!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPlayerType!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelPlayerIndex!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTeamIndex!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnChangeCo!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChangeController!  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChangeSkinId!      : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._groupCo,                callback : this._onTouchedGroupCo },
            { ui : this._btnChangeCo,            callback : this._onTouchedBtnChangeCo },
            { ui : this._btnChangeController,    callback : this._onTouchedBtnChangeController },
            { ui : this._btnChangeSkinId,        callback : this._onTouchedBtnChangeSkinId },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
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
            : (WarRules_Utils_CommonData.getPlayerRule(
                Helpers_Misc.getExisted(roomCreator.getSettingsForCommon().getInstanceWarRule()?.getWarRuleCommonData()),
                playerIndex,
            ).getCcwAiCoId());

        if ((coId != null) && (coId !== Cos_Constants.CoId.Empty)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonCoInfoPanel, {
                gameConfig : roomCreator.getGcData(),
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
        const playerRuleArray       = Helpers_Misc.getExisted(instanceWarRule.getWarRuleCommonData()?.getPlayerRuleList());
        const humanPlayerIndexSet   = new Set<number>();
        const aiPlayerIndexSet      = new Set<number>();
        for (const playerRule of playerRuleArray) {
            const playerIndex = playerRule.getPlayerIndex();
            if (playerRule.getCcwAiCoId() == null) {
                humanPlayerIndexSet.add(playerIndex);
            } else {
                aiPlayerIndexSet.add(playerIndex);
            }
        }

        const playerIndex   = openData.playerIndex;
        const playerRule    = Helpers_Misc.getExisted(playerRuleArray.find(v => v.getPlayerIndex() === playerIndex));
        if (playerIndex === roomCreator.getSelfPlayerIndex()) {
            if (humanPlayerIndexSet.size < 2) {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0222));
            } else {
                const callback = () => {
                    for (const p of humanPlayerIndexSet) {
                        if (p !== playerIndex) {
                            roomCreator.setSelfPlayerIndex(p);
                            break;
                        }
                    }
                    playerRule.setCcwAiCoId(Cos_Constants.CoId.Empty);
                    roomCreator.setAiSkinId(playerIndex, playerIndex);
                    openData.page.updateView();
                };

                if (instanceWarRule.getTemplateWarRuleId() == null) {
                    callback();
                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                        getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0129),
                        callback   : () => {
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
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                        getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0129),
                        callback   : () => {
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
        const warRuleCommonData = Helpers_Misc.getExisted(instanceWarRule.getWarRuleCommonData());
        const gcData            = roomCreator.getGcData();
        const playerRule        = WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex);
        const hasFogByDefault   = warRuleCommonData.getHasFogByDefault();
        const warType           = hasFogByDefault ? WarTypes_Constants.WarTypeId.CcwFog : WarTypes_Constants.WarTypeId.CcwStd;
        if (playerIndex === roomCreator.getSelfPlayerIndex()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
                gameConfig         : gcData,
                currentCoId        : roomCreator.getSelfCoId(),
                availableCoIdArray : [...PlayerRules_Utils.getFinalCcwHumanCoIdSet({
                    playerRule      : playerRule,
                    gameConfig      : gcData,
                    hasFogByDefault : hasFogByDefault,
                    includeRandom   : true,
                })],
                isBan             : false,
                callbackOnConfirm : newCoId => {
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
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
                        gameConfig         : gcData,
                        currentCoId        : ccwAiCoId,
                        availableCoIdArray : gcData.getEnabledCoArray(warType).filter(v => v.getCoCategoryId() !== Cos_Constants.CategoryId.Random).map(v => v.getCoId()),
                        isBan              : false,
                        callbackOnConfirm  : newCoId => {
                            if (newCoId !== ccwAiCoId) {
                                playerRule.setCcwAiCoId(newCoId);
                                this._updateComponentsForSettings();
                                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.CcrCreateAiCoIdChanged);
                            }
                        },
                    });
                };

                if (instanceWarRule.getTemplateWarRuleId() == null) {
                    callback();
                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                        getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0129),
                        callback   : () => {
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
        this._btnChangeCo.setLangText(Lang_Constants.TextType.B0230);
        this._btnChangeController.setLangText(Lang_Constants.TextType.B0608);
        this._btnChangeSkinId.setLangText(Lang_Constants.TextType.B0609);
    }

    private async _updateComponentsForSettings(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator   = openData.roomCreator;
        const playerIndex   = openData.playerIndex;
        this._labelPlayerIndex.setText(Lang_Utils.getPlayerForceName(playerIndex));

        const settingsForCommon = roomCreator.getSettingsForCommon();
        const warRuleCommonData = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
        const playerRule        = WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex);
        this._labelTeamIndex.setText(Lang_Utils.getPlayerTeamName(playerRule.getTeamIndex()) || Lang_Constants.UndefinedError);

        const isSelfPlayer      = roomCreator.getSelfPlayerIndex() === playerIndex;
        const isHumanPlayer     = playerRule.getCcwAiCoId() == null;
        this._imgSkin.loadSource(Helpers_ImageSource.getCoHeadFrame(
            isSelfPlayer
                ? roomCreator.getSelfUnitAndTileSkinId()
                : (isHumanPlayer ? null : roomCreator.getAiSkinId(playerIndex)),
        ));

        this._labelPlayerType.setLangText(isSelfPlayer ? Lang_Constants.TextType.B0647 : isHumanPlayer ? Lang_Constants.TextType.B0648 : Lang_Constants.TextType.B0607);

        const coId          = isSelfPlayer ? roomCreator.getSelfCoId() : (playerRule.getCcwAiCoId() ?? null);
        const gameConfig    = await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion()));
        const coCfg         = coId == null ? null : gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(coId == null ? `` : Helpers_ImageSource.getCoHead(gameConfig, coId) ?? Lang_Constants.UndefinedError);
        this._imgCoInfo.setIsVisible((coId !== Cos_Constants.CoId.Empty) && (!!coCfg));
        this._btnChangeCo.setIsVisible((isSelfPlayer) || (!isHumanPlayer));
        this._btnChangeSkinId.setIsVisible((isSelfPlayer) || (!isHumanPlayer));
    }
}
