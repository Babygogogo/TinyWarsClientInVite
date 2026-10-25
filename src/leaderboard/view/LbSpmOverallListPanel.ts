import { showLang } from "../../FloatText.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import { getLatestConfigVersion, getPreviousConfigVersion, getNextConfigVersion, getGameConfig } from "../../gameConfig/GcModel.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getUserAvatar, getMedal } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { format } from "../../helpers/Text.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getSpmOverallTopDataArray } from "../model/LeaderboardModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getUserPublicInfo } from "../../users/Model.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;

    private readonly _labelSpmNoData!       : IUiLabel;
    private readonly _labelSpmRank!         : IUiLabel;
    private readonly _labelSpmNickname!     : IUiLabel;
    private readonly _labelSpmScore!        : IUiLabel;
    private readonly _listSpm!              : IUiScrollList<DataForSpmUserRenderer>;

    private readonly _layoutVersion!        : IUiLayout;
    private readonly _labelVersionTitle!    : IUiLabel;
    private readonly _labelVersion!         : IUiLabel;
    private readonly _btnPreviousVersion!   : IUiButton;
    private readonly _btnNextVersion!       : IUiButton;

    private _configVersion = ``;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgCommonGetRankList,   callback: this._onMsgCommonGetRankList },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnPreviousVersion,     callback: this._onTouchedBtnPreviousVersion },
            { ui: this._btnNextVersion,         callback: this._onTouchedBtnNextVersion },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listSpm.setItemRendererClass(SpmUserRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._configVersion = await getLatestConfigVersion();

        this._updateComponentsForLanguage();
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listSpm.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _onTouchedBtnPreviousVersion(): Promise<void> {
        const configVersion = await getPreviousConfigVersion(this._configVersion);
        if (configVersion == null) {
            showLang(TextType.B0278);
        } else {
            this._configVersion = configVersion;
            this._updateView();
        }
    }

    private async _onTouchedBtnNextVersion(): Promise<void> {
        const configVersion = await getNextConfigVersion(this._configVersion);
        if (configVersion == null) {
            showLang(TextType.B0278);
        } else {
            this._configVersion = configVersion;
            this._updateView();
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onMsgCommonGetRankList(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForSpm();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1103);
        this._labelSpmNoData.setLangText(TextType.B0278);
        this._labelSpmRank.setLangText(TextType.B0904);
        this._labelSpmNickname.setLangText(TextType.B0175);
        this._labelSpmScore.setLangText(TextType.B0579);
        this._labelVersionTitle.setLangText(TextType.B1104);
        this._btnPreviousVersion.setLangText(TextType.B1029);
        this._btnNextVersion.setLangText(TextType.B1030);
    }

    private async _updateComponentsForSpm(): Promise<void> {
        const configVersion = this._configVersion;
        const gameConfig    = await getGameConfig(configVersion);
        const dataArray     : DataForSpmUserRenderer[] = [];
        if (gameConfig != null) {
            for (const data of (await getSpmOverallTopDataArray(configVersion))?.getDataArray() ?? []) {
                const length    = dataArray.length;
                const score     = getExisted(data.getScore());
                dataArray.push({
                    gameConfig  : gameConfig,
                    index       : length + 1,
                    userId      : getExisted(data.getUserId()),
                    score       : score,
                    isLast      : false,
                    rank        : length === 0
                        ? 1
                        : (score === dataArray[length - 1].score ? dataArray[length - 1].rank : length + 1),
                });
            }
        }
        if (dataArray.length) {
            dataArray[dataArray.length - 1].isLast = true;
        }

        this._labelVersion.setText(configVersion);
        this._labelSpmNoData.setIsVisible(!dataArray.length);

        this._layoutVersion.arrangeItems();

        await this._listSpm.bindData(dataArray);
    }
}

interface DataForSpmUserRenderer extends UiListItemData {
    gameConfig  : GcData;
    index       : number;
    rank        : number;
    userId      : number;
    score       : number;
    isLast      : boolean;
}
class SpmUserRenderer
    extends     UiListItemRenderer<DataForSpmUserRenderer>
    implements  IUiListItemRenderer<DataForSpmUserRenderer>
{
    private readonly _group!            : IUiContainer;
    private readonly _imgAvatar!        : IUiImage;
    private readonly _imgBottom!        : IUiImage;
    private readonly _imgMedal!         : IUiImage;
    private readonly _labelIndex!       : IUiLabel;

    private readonly _layoutName!       : IUiLayout;
    private readonly _labelNickname!    : IUiLabel;
    private readonly _labelScore!       : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        openPanel(getDict().UserPanel, { userId: this.getOpenData()?.userId });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const rank              = openData.rank;
        const labelNickname     = this._labelNickname;
        const labelScore        = this._labelScore;
        const imgAvatar         = this._imgAvatar;
        const imgMedal          = this._imgMedal;
        labelNickname.setText(``);
        imgAvatar.loadSource(``);
        imgMedal.loadSource(``);
        labelScore.setText(`${format(`%.2f`, openData.score)}`);
        this._labelIndex.setText(`${rank}`);
        this._imgBottom.setIsVisible(!openData.isLast);

        const userId            = openData.userId;
        const userInfo          = await getUserPublicInfo(userId);
        if ((userInfo == null) || (userId !== this.getOpenData()?.userId)) {
            return;
        }

        const medalId = (userInfo.getShowMedalIdArray() ?? [])[0];
        imgAvatar.loadSource(getUserAvatar(userInfo.getAvatarId() ?? 1));
        imgMedal.loadSource(medalId == null ? `` : getMedal(medalId));
        labelNickname.setText(userInfo?.getNickname() ?? UndefinedError);

        this._layoutName.arrangeItems();
    }
}
