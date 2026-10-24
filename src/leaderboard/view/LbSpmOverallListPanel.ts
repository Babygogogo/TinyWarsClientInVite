import * as FloatText2 from "../../FloatText.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LeaderboardModelLeaderboardModel from "../model/LeaderboardModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _labelSpmNoData!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSpmRank!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSpmNickname!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSpmScore!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listSpm!              : UiInterfacesIUiScrollList.IUiScrollList<DataForSpmUserRenderer>;

    private readonly _layoutVersion!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelVersionTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelVersion!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnPreviousVersion!   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextVersion!       : UiInterfacesIUiButton.IUiButton;

    private _configVersion = ``;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgCommonGetRankList,   callback: this._onMsgCommonGetRankList },
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
        this._configVersion = await GameConfigGcModel.getLatestConfigVersion();

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
        const configVersion = await GameConfigGcModel.getPreviousConfigVersion(this._configVersion);
        if (configVersion == null) {
            FloatText2.showLang(LangConstants.TextType.B0278);
        } else {
            this._configVersion = configVersion;
            this._updateView();
        }
    }

    private async _onTouchedBtnNextVersion(): Promise<void> {
        const configVersion = await GameConfigGcModel.getNextConfigVersion(this._configVersion);
        if (configVersion == null) {
            FloatText2.showLang(LangConstants.TextType.B0278);
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
        this._labelTitle.setLangText(LangConstants.TextType.B1103);
        this._labelSpmNoData.setLangText(LangConstants.TextType.B0278);
        this._labelSpmRank.setLangText(LangConstants.TextType.B0904);
        this._labelSpmNickname.setLangText(LangConstants.TextType.B0175);
        this._labelSpmScore.setLangText(LangConstants.TextType.B0579);
        this._labelVersionTitle.setLangText(LangConstants.TextType.B1104);
        this._btnPreviousVersion.setLangText(LangConstants.TextType.B1029);
        this._btnNextVersion.setLangText(LangConstants.TextType.B1030);
    }

    private async _updateComponentsForSpm(): Promise<void> {
        const configVersion = this._configVersion;
        const gameConfig    = await GameConfigGcModel.getGameConfig(configVersion);
        const dataArray     : DataForSpmUserRenderer[] = [];
        if (gameConfig != null) {
            for (const data of (await LeaderboardModelLeaderboardModel.getSpmOverallTopDataArray(configVersion))?.getDataArray() ?? []) {
                const length    = dataArray.length;
                const score     = HelpersMisc.getExisted(data.getScore());
                dataArray.push({
                    gameConfig  : gameConfig,
                    index       : length + 1,
                    userId      : HelpersMisc.getExisted(data.getUserId()),
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

interface DataForSpmUserRenderer extends UiTypesUiListItemData.UiListItemData {
    gameConfig  : GameConfigGcData.GcData;
    index       : number;
    rank        : number;
    userId      : number;
    score       : number;
    isLast      : boolean;
}
class SpmUserRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForSpmUserRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForSpmUserRenderer>
{
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgAvatar!        : UiInterfacesIUiImage.IUiImage;
    private readonly _imgBottom!        : UiInterfacesIUiImage.IUiImage;
    private readonly _imgMedal!         : UiInterfacesIUiImage.IUiImage;
    private readonly _labelIndex!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelNickname!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelScore!       : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: this.getOpenData()?.userId });
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
        labelScore.setText(`${HelpersText.format(`%.2f`, openData.score)}`);
        this._labelIndex.setText(`${rank}`);
        this._imgBottom.setIsVisible(!openData.isLast);

        const userId            = openData.userId;
        const userInfo          = await UsersModel.getUserPublicInfo(userId);
        if ((userInfo == null) || (userId !== this.getOpenData()?.userId)) {
            return;
        }

        const medalId = (userInfo.getShowMedalIdArray() ?? [])[0];
        imgAvatar.loadSource(HelpersImageSource.getUserAvatar(userInfo.getAvatarId() ?? 1));
        imgMedal.loadSource(medalId == null ? `` : HelpersImageSource.getMedal(medalId));
        labelNickname.setText(userInfo?.getNickname() ?? LangConstants.UndefinedError);

        this._layoutName.arrangeItems();
    }
}
