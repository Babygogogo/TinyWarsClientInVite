import {
    type Notifications_Mapping,
    GamePanels_Dict,
    GameConfigs_Provider,
    Helpers_ImageSource,
    Users_Model,
    Helpers_Misc,
    GamePanels_Manager,
    Users_Proxy,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { S as UserGetOnlineUserIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserGetOnlineUserIdArray/S.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutTitle!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUsersCount!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelNameTitle1!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNameTitle2!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listUser!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUserRenderer>;
    private readonly _labelLoading!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private _msg        : UserGetOnlineUserIdArrayResponse | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",             callback : this._onNotifyLanguageChanged },
            { type : "MsgUserGetOnlineUserIdArray", callback : this._onNotifySUserGetOnlineUsers },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,   callback : this.closePanel },
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
        Users_Proxy.reqUserGetOnlineUserIdArray();
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

    private _onNotifySUserGetOnlineUsers(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgUserGetOnlineUserIdArray"]>): void {
        const data = e.data;
        if (typeof data !== "object" || data == null || !("msg" in data) || !(data.msg instanceof UserGetOnlineUserIdArrayResponse)) {
            throw Helpers_Misc.newError("Invalid online user list notification.");
        }
        this._msg = data.msg;
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
        const gameConfig    = await GameConfigs_Provider.getLatestGameConfig();
        const dataArray     : DataForUserRenderer[] = [];
        for (const userId of this._msg?.getUserIdArray() ?? []) {
            dataArray.push({
                index      : 0,
                userId     : userId,
                gameConfig : gameConfig,
                isBottom   : false,
            });
        }

        if (dataArray.length % 2 !== 0) {
            dataArray.push({
                index      : 0,
                userId     : null,
                gameConfig : gameConfig,
                isBottom   : false,
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0236);
        this._labelLoading.setLangText(Lang_Constants.TextType.A0040);
        this._labelNameTitle1.setLangText(Lang_Constants.TextType.B0175);
        this._labelNameTitle2.setLangText(Lang_Constants.TextType.B0175);
        this._layoutTitle.arrangeItems();
    }
}

interface DataForUserRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index       : number;
    userId      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    gameConfig  : GameConfigs_GameConfig.GameConfig;
    isBottom    : boolean;
}
class UserRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUserRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForUserRenderer> {
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgAvatar!    : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgBottom!    : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgMedal!     : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const userId = this.getOpenData()?.userId;
        if (userId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId });
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

        const userBriefInfo = await Users_Model.getUserBriefInfo(userId);
        if ((userBriefInfo == null) || (userId !== this.getOpenData()?.userId)) {
            return;
        }

        const showMedalIdArray  = userBriefInfo.getShowMedalIdArray();
        const medalId           = showMedalIdArray ? showMedalIdArray[0] : null;
        imgMedal.loadSource(medalId == null ? `` : Helpers_ImageSource.getMedal(medalId));
        imgAvatar.loadSource(Helpers_ImageSource.getUserAvatar(userBriefInfo.getAvatarId() ?? 1));
        labelName.setText(userBriefInfo.getNickname() ?? Lang_Constants.UndefinedError);

        this._layoutName.arrangeItems();
    }
}
