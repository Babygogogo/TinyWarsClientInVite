import { getAvailableUserAvatarIdArray } from "../../avatars/Utils.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getLatestGameConfig } from "../../gameConfigs/Provider.ts";
import { getUserAvatar } from "../../helpers/ImageSource.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getSelfAvatarId } from "../Model.ts";
import { reqSetAvatarId } from "../Proxy.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;

    private readonly _sclAvatar!        : IUiScrollList<DataForAvatarRenderer>;
    private readonly _imgAvatar!        : IUiImage;
    private readonly _btnConfirm!       : IUiButton;

    private _gameConfig : GameConfig | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            { ui: this._btnClose,       callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._sclAvatar.setItemRendererClass(AvatarRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._gameConfig = await getLatestGameConfig();
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._sclAvatar.removeAllItems();

        await super._onClosed();
    }

    public updateOnSetSelectedAvatar(): void {
        this._updateImgAvatar();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onTouchedBtnConfirm(): void {
        const avatarId = this._sclAvatar.getFirstSelectedData()?.avatarId;
        if ((avatarId != null) && (avatarId !== getSelfAvatarId())) {
            reqSetAvatarId(avatarId);
        }
        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateImgAvatar();
        this._updateSclAvatar();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(getText(TextType.B0707));
        this._btnConfirm.setText(getText(TextType.B0026));
    }

    private _updateImgAvatar(): void {
        this._imgAvatar.loadSource(getUserAvatar(this._sclAvatar.getFirstSelectedData()?.avatarId ?? getSelfAvatarId() ?? 1));
    }
    private async _updateSclAvatar(): Promise<void> {
        const dataArray: DataForAvatarRenderer[] = [];
        for (const avatarId of getAvailableUserAvatarIdArray()) {
            dataArray.push({
                avatarId,
                panel   : this,
            });
        }

        const selfAvatarId  = getSelfAvatarId() ?? 1;
        const list          = this._sclAvatar;
        await list.bindData(dataArray);

        const index = Math.max(0, dataArray.findIndex(v => v.avatarId === selfAvatarId));
        list.setSelectedItemIndex(index);
        list.scrollToItem(index);
    }
}

interface DataForAvatarRenderer extends UiListItemData {
    avatarId    : number;
    panel       : Panel;
}
class AvatarRenderer
    extends     UiListItemRenderer<DataForAvatarRenderer>
    implements  IUiListItemRenderer<DataForAvatarRenderer>
{
    private readonly _imgAvatar!    : IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgAvatar.loadSource(getUserAvatar(openData.avatarId));
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSetSelectedAvatar();
    }
}
