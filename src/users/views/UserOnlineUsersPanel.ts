import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineUserIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgUserGetOnlineUserIdArray/S.ts";
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
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutTitle!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUsersCount!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelNameTitle1!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNameTitle2!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listUser!             : UiInterfacesIUiScrollList.IUiScrollList<DataForUserRenderer>;
    private readonly _labelLoading!         : UiInterfacesIUiLabel.IUiLabel;

    private _msg        : ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineUserIdArrayS.S | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserGetOnlineUserIdArray, callback: this._onNotifySUserGetOnlineUsers },
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
        UsersProxy.reqUserGetOnlineUserIdArray();
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

    private _onNotifySUserGetOnlineUsers(e: VendorEgretEgret.Event): void {
        if (!(e.data instanceof ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineUserIdArrayS.S)) {
            throw HelpersMisc.newError("Invalid online user list notification.");
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
        const gameConfig    = await GameConfigGcModel.getLatestGameConfig();
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0236));
        this._labelLoading.setText(LangUtils.getText(LangConstants.TextType.A0040));
        this._labelNameTitle1.setText(LangUtils.getText(LangConstants.TextType.B0175));
        this._labelNameTitle2.setText(LangUtils.getText(LangConstants.TextType.B0175));
        this._layoutTitle.arrangeItems();
    }
}

interface DataForUserRenderer extends UiTypesUiListItemData.UiListItemData {
    index       : number;
    userId      : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    gameConfig  : GameConfigGcData.GcData;
    isBottom    : boolean;
}
class UserRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForUserRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForUserRenderer>
{
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _imgAvatar!    : UiInterfacesIUiImage.IUiImage;
    private readonly _imgBottom!    : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgMedal!     : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const userId = this.getOpenData()?.userId;
        if (userId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId });
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

        const userBriefInfo = await UsersModel.getUserBriefInfo(userId);
        if ((userBriefInfo == null) || (userId !== this.getOpenData()?.userId)) {
            return;
        }

        const showMedalIdArray  = userBriefInfo.getShowMedalIdArray();
        const medalId           = showMedalIdArray ? showMedalIdArray[0] : null;
        imgMedal.loadSource(medalId == null ? `` : HelpersImageSource.getMedal(medalId));
        imgAvatar.loadSource(HelpersImageSource.getUserAvatar(userBriefInfo.getAvatarId() ?? 1));
        labelName.setText(userBriefInfo.getNickname() ?? LangConstants.UndefinedError);

        this._layoutName.arrangeItems();
    }
}
