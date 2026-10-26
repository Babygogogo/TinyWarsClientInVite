import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import { getLatestGameConfig } from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getMedal, getUserAvatar } from "../../helpers/ImageSource.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { S } from "../../proto/schema/CommonProto/NetMessage/MsgUserGetOnlineUserIdArray/S.ts";
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
import { getUserBriefInfo } from "../Model.ts";
import { reqUserGetOnlineUserIdArray } from "../Proxy.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _btnClose!             : IUiButton;

    private readonly _layoutTitle!          : IUiLayout;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _labelUsersCount!      : IUiLabel;

    private readonly _labelNameTitle1!      : IUiLabel;
    private readonly _labelNameTitle2!      : IUiLabel;
    private readonly _listUser!             : IUiScrollList<DataForUserRenderer>;
    private readonly _labelLoading!         : IUiLabel;

    private _msg        : S | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserGetOnlineUserIdArray, callback: this._onNotifySUserGetOnlineUsers },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listUser.setItemRendererClass(UserRenderer);

        this._updateView();
        this._updateComponentsForLanguage();
    }
    protected async _onOpened(): Promise<void> {
        reqUserGetOnlineUserIdArray();
        await super._onOpened();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listUser.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifySUserGetOnlineUsers(e: Event): void {
        if (!(e.data instanceof S)) {
            throw newError("Invalid online user list notification.");
        }
        this._msg = e.data;
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        const msg = this._msg;
        if (!msg) {
            this._labelLoading.setIsVisible(true);
            this._labelUsersCount.setText(``);
            this._listUser.removeAllItems();
        } else {
            this._labelLoading.setIsVisible(false);
            this._labelUsersCount.setText(`(${msg.getTotalCount() ?? 0})`);
            await this._listUser.bindData(await this._createDataForList());
        }
    }

    private async _createDataForList(): Promise<DataForUserRenderer[]> {
        const gameConfig    = await getLatestGameConfig();
        const dataArray     : DataForUserRenderer[] = [];
        for (const userId of this._msg?.getUserIdArray() ?? []) {
            dataArray.push({
                index       : 0,
                userId      : userId,
                gameConfig  : gameConfig,
                isBottom    : false,
            });
        }

        if (dataArray.length % 2 !== 0) {
            dataArray.push({
                index       : 0,
                userId      : null,
                gameConfig  : gameConfig,
                isBottom    : false,
            });
        }

        const dataLength = dataArray.length;
        for (let index = 0; index < dataLength; ++index) {
            dataArray[index].index = index;
        }
        if (dataLength) {
            dataArray[dataLength - 1].isBottom = true;
            dataArray[dataLength - 2].isBottom = true;
        }

        return dataArray;
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(getText(TextType.B0236));
        this._labelLoading.setText(getText(TextType.A0040));
        this._labelNameTitle1.setText(getText(TextType.B0175));
        this._labelNameTitle2.setText(getText(TextType.B0175));
        this._layoutTitle.arrangeItems();
    }
}

interface DataForUserRenderer extends UiListItemData {
    index       : number;
    userId      : Undefinable<number>;
    gameConfig  : GcData;
    isBottom    : boolean;
}
class UserRenderer
    extends     UiListItemRenderer<DataForUserRenderer>
    implements  IUiListItemRenderer<DataForUserRenderer>
{
    private readonly _imgBg!        : IUiImage;
    private readonly _imgAvatar!    : IUiImage;
    private readonly _imgBottom!    : IUiImage;

    private readonly _layoutName!   : IUiLayout;
    private readonly _labelName!    : IUiLabel;
    private readonly _imgMedal!     : IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const userId = this.getOpenData()?.userId;
        if (userId != null) {
            openPanel(getDict().UserPanel, { userId });
        }
    }

    private async _updateView(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgBottom.setIsVisible(openData.isBottom);
        this._imgBg.setAlpha(openData.index % 4 < 2 ? 0.2 : 0.5);

        const userId        = openData.userId;
        const imgMedal      = this._imgMedal;
        const imgAvatar     = this._imgAvatar;
        const labelName     = this._labelName;
        imgMedal.loadSource(``);
        imgAvatar.loadSource(``);
        labelName.setText(``);
        if (userId == null) {
            return;
        }

        const userBriefInfo = await getUserBriefInfo(userId);
        if ((userBriefInfo == null) || (userId !== this.getOpenData()?.userId)) {
            return;
        }

        const showMedalIdArray  = userBriefInfo.getShowMedalIdArray();
        const medalId           = showMedalIdArray ? showMedalIdArray[0] : null;
        imgMedal.loadSource(medalId == null ? `` : getMedal(medalId));
        imgAvatar.loadSource(getUserAvatar(userBriefInfo.getAvatarId() ?? 1));
        labelName.setText(userBriefInfo.getNickname() ?? UndefinedError);

        this._layoutName.arrangeItems();
    }
}
