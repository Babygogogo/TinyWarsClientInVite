import type { CcrRoomCreator } from "../model/CcrRoomCreator.ts";
import { CoId, CategoryId } from "../../cos/Constants.ts";
import { show } from "../../FloatText.ts";
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getCoHeadFrame, getCoHead } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getPlayerForceName, getPlayerTeamName } from "../../lang/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getFinalCcwHumanCoIdSet } from "../../playerRules/Utils.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiOpenableComponent } from "../../ui/components/UiOpenableComponent.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import { UiHorizontalAlign } from "../../ui/types/UiHorizontalAlign.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UiVerticalAlign } from "../../ui/types/UiVerticalAlign.ts";
import { loadSkinByPath } from "../../ui/utils/UiSkinHelpers.ts";
import { getPlayerRule } from "../../warRules/utils/CommonData.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

export type OpenData = {
    roomCreator : CcrRoomCreator;
} | null;
export class Page extends UiOpenableComponent<OpenData> {
    private readonly _groupInfo!    : IUiContainer;
    private readonly _listPlayer!   : IUiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        loadSkinByPath(this, "coopCustomRoom/CcrCreatePlayerInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiHorizontalAlign.Center },
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

        await this._listPlayer.bindData(this._createDataForListPlayer(getExisted((await roomCreator.getMapRawData()).getPlayersCountUnneutral())));
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

interface DataForPlayerRenderer extends UiListItemData {
    roomCreator     : CcrRoomCreator;
    playerIndex     : number;
    page            : Page;
}
class PlayerRenderer extends UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!              : IUiContainer;
    private readonly _imgSkin!              : IUiImage;
    private readonly _imgCoInfo!            : IUiImage;
    private readonly _imgCoHead!            : IUiImage;
    private readonly _labelCo!              : IUiLabel;
    private readonly _labelPlayerType!      : IUiLabel;

    private readonly _labelPlayerIndex!     : IUiLabel;
    private readonly _labelTeamIndex!       : IUiLabel;

    private readonly _btnChangeCo!          : IUiButton;
    private readonly _btnChangeController!  : IUiButton;
    private readonly _btnChangeSkinId!      : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,                callback: this._onTouchedGroupCo },
            { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo },
            { ui: this._btnChangeController,    callback: this._onTouchedBtnChangeController },
            { ui: this._btnChangeSkinId,        callback: this._onTouchedBtnChangeSkinId },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            : (getPlayerRule(
                getExisted(roomCreator.getSettingsForCommon().getInstanceWarRule()?.getWarRuleCommonData()),
                playerIndex
            ).getCcwAiCoId());

        if ((coId != null) && (coId !== CoId.Empty)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);

            openPanel(getDict().CommonCoInfoPanel, {
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
        const playerRuleArray       = getExisted(instanceWarRule.getWarRuleCommonData()?.getPlayerRuleList());
        const humanPlayerIndexSet   = new Set<number>();
        const aiPlayerIndexSet      = new Set<number>();
        for (const playerRule of playerRuleArray) {
            const playerIndex = getExisted(playerRule.getPlayerIndex());
            if (playerRule.getCcwAiCoId() == null) {
                humanPlayerIndexSet.add(playerIndex);
            } else {
                aiPlayerIndexSet.add(playerIndex);
            }
        }

        const playerIndex   = openData.playerIndex;
        const playerRule    = getExisted(playerRuleArray.find(v => v.getPlayerIndex() === playerIndex));
        if (playerIndex === roomCreator.getSelfPlayerIndex()) {
            if (humanPlayerIndexSet.size < 2) {
                show(getText(TextType.A0222));
            } else {
                const callback = () => {
                    for (const p of humanPlayerIndexSet) {
                        if (p !== playerIndex) {
                            roomCreator.setSelfPlayerIndex(p);
                            break;
                        }
                    }
                    playerRule.setCcwAiCoId(CoId.Empty);
                    roomCreator.setAiSkinId(playerIndex, playerIndex);
                    openData.page.updateView();
                };

                if (instanceWarRule.getTemplateWarRuleId() == null) {
                    callback();
                } else {
                    openPanel(getDict().CommonConfirmPanel, {
                        getContent : () => getText(TextType.A0129),
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
                    openPanel(getDict().CommonConfirmPanel, {
                        getContent : () => getText(TextType.A0129),
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
        const warRuleCommonData = getExisted(instanceWarRule.getWarRuleCommonData());
        const gcData            = roomCreator.getGcData();
        const playerRule        = getPlayerRule(warRuleCommonData, playerIndex);
        const hasFogByDefault   = warRuleCommonData.getHasFogByDefault();
        const warType           = hasFogByDefault ? WarTypeId.CcwFog : WarTypeId.CcwStd;
        if (playerIndex === roomCreator.getSelfPlayerIndex()) {
            openPanel(getDict().CommonChooseSingleCoIdPanel, {
                gameConfig          : gcData,
                currentCoId         : roomCreator.getSelfCoId(),
                availableCoIdArray  : [...getFinalCcwHumanCoIdSet({
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
                    openPanel(getDict().CommonChooseSingleCoIdPanel, {
                        gameConfig          : gcData,
                        currentCoId         : ccwAiCoId,
                        availableCoIdArray  : gcData.getEnabledCoArray(warType).filter(v => v.getCoCategoryId() !== CategoryId.Random).map(v => v.getCoId()),
                        isBan               : false,
                        callbackOnConfirm   : newCoId => {
                            if (newCoId !== ccwAiCoId) {
                                playerRule.setCcwAiCoId(newCoId);
                                this._updateComponentsForSettings();
                                dispatch(TypeId.CcrCreateAiCoIdChanged);
                            }
                        },
                    });
                };

                if (instanceWarRule.getTemplateWarRuleId() == null) {
                    callback();
                } else {
                    openPanel(getDict().CommonConfirmPanel, {
                        getContent : () => getText(TextType.A0129),
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
        this._btnChangeCo.setLangText(TextType.B0230);
        this._btnChangeController.setLangText(TextType.B0608);
        this._btnChangeSkinId.setLangText(TextType.B0609);
    }

    private async _updateComponentsForSettings(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator   = openData.roomCreator;
        const playerIndex   = openData.playerIndex;
        this._labelPlayerIndex.setText(getPlayerForceName(playerIndex));

        const settingsForCommon = roomCreator.getSettingsForCommon();
        const warRuleCommonData = getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
        const playerRule        = getPlayerRule(warRuleCommonData, playerIndex);
        this._labelTeamIndex.setText(getPlayerTeamName(getExisted(playerRule.getTeamIndex())) || UndefinedError);

        const isSelfPlayer      = roomCreator.getSelfPlayerIndex() === playerIndex;
        const isHumanPlayer     = playerRule.getCcwAiCoId() == null;
        this._imgSkin.loadSource(getCoHeadFrame(
            isSelfPlayer
                ? roomCreator.getSelfUnitAndTileSkinId()
                : (isHumanPlayer ? null : roomCreator.getAiSkinId(playerIndex))
        ));

        this._labelPlayerType.setText(isSelfPlayer
            ? getText(TextType.B0647)
            : (isHumanPlayer
                ? getText(TextType.B0648)
                : getText(TextType.B0607))
        );

        const coId          = isSelfPlayer ? roomCreator.getSelfCoId() : (playerRule.getCcwAiCoId() ?? null);
        const gameConfig    = await getGameConfig(getExisted(settingsForCommon.getConfigVersion()));
        const coCfg         = coId == null ? null : gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(coId == null ? `` : getCoHead(gameConfig, coId) ?? UndefinedError);
        this._imgCoInfo.setIsVisible((coId !== CoId.Empty) && (!!coCfg));
        this._btnChangeCo.setIsVisible((isSelfPlayer) || (!isHumanPlayer));
        this._btnChangeSkinId.setIsVisible((isSelfPlayer) || (!isHumanPlayer));
    }
}
