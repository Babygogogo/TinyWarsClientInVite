import {
    GamePanels_Dict,
    GameConfigs_Provider,
    Lang_Utils,
    Users_Model,
    GamePanels_Manager,
    AuxiliaryTypes_RoomFilter,
    Lang_Constants,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";

export type OpenData = {
    roomFilter          : AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_RoomFilter.RoomFilter>;
    isMapNameEnabled    : boolean;
    callbackOnConfirm   : (roomFilter: AuxiliaryTypes_RoomFilter.RoomFilter) => void;
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnReset!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSearch!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _groupFilter!                  : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _groupRoomId!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelRoomIdTitle!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRoomId!                  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyRoomId!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnDeleteRoomId!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupMapName!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelMapNameTitle!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapName!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyMapName!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMapName!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupUserInRoom!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelUserInRoomTitle!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUserInRoom!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyUserInRoom!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteUserInRoom!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupUserNotInRoom!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelUserNotInRoomTitle!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUserNotInRoom!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyUserNotInRoom!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteUserNotInRoom!       : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupCoCategory!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelCoCategoryTitle!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCoCategory!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyCoCategory!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteCoCategory!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupHasFog!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelHasFogTitle!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHasFog!                  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyHasFog!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteHasFog!              : Ui_Interfaces_IUiButton.IUiButton;

    private _filter                                 = new AuxiliaryTypes_RoomFilter.RoomFilter();

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },
            { ui : this._btnHelp,                    callback : this._onTouchedBtnHelp },
            { ui : this._btnReset,                   callback : this._onTouchedBtnReset },
            { ui : this._btnSearch,                  callback : this._onTouchedBtnSearch },

            { ui : this._btnModifyUserInRoom,        callback : this._onTouchedBtnModifyUserInRoom },
            { ui : this._btnDeleteUserInRoom,        callback : this._onTouchedBtnDeleteUserInRoom },

            { ui : this._btnModifyUserNotInRoom,     callback : this._onTouchedBtnModifyUserNotInRoom },
            { ui : this._btnDeleteUserNotInRoom,     callback : this._onTouchedBtnDeleteUserNotInRoom },

            { ui : this._btnModifyRoomId,            callback : this._onTouchedBtnModifyRoomId },
            { ui : this._btnDeleteRoomId,            callback : this._onTouchedBtnDeleteRoomId },

            { ui : this._btnModifyMapName,           callback : this._onTouchedBtnModifyMapName },
            { ui : this._btnDeleteMapName,           callback : this._onTouchedBtnDeleteMapName },

            { ui : this._btnModifyHasFog,            callback : this._onTouchedBtnModifyHasFog },
            { ui : this._btnDeleteHasFog,            callback : this._onTouchedBtnDeleteHasFog },

            { ui : this._btnModifyCoCategory,        callback : this._onTouchedBtnModifyCoCategory },
            { ui : this._btnDeleteCoCategory,        callback : this._onTouchedBtnDeleteCoCategory },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",    callback : this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateGroupFilter();

        this._filter = this.getOpenData()?.roomFilter?.clone() ?? new AuxiliaryTypes_RoomFilter.RoomFilter();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0063),
        });
    }

    private _onTouchedBtnReset(): void {
        this._filter = new AuxiliaryTypes_RoomFilter.RoomFilter();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnSearch(): void {
        this.getOpenData()?.callbackOnConfirm(this._filter);
        this.closePanel();
    }

    private _onTouchedBtnModifyUserInRoom(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonSearchSingleUserPanel, {
            getTitleText      : () => Lang_Utils.getText(Lang_Constants.TextType.B0023),
            callbackOnConfirm : userId => {
                this._filter.userIdInRoom = userId;
                this._updateLabelUserInRoom();
            },
        });
    }
    private _onTouchedBtnDeleteUserInRoom(): void {
        this._filter.userIdInRoom = null;
        this._updateLabelUserInRoom();
    }

    private _onTouchedBtnModifyUserNotInRoom(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonSearchSingleUserPanel, {
            getTitleText      : () => Lang_Utils.getText(Lang_Constants.TextType.B0027),
            callbackOnConfirm : userId => {
                this._filter.userIdNotInRoom = userId;
                this._updateLabelUserNotInRoom();
            },
        });
    }
    private _onTouchedBtnDeleteUserNotInRoom(): void {
        this._filter.userIdNotInRoom = null;
        this._updateLabelUserNotInRoom();
    }

    private _onTouchedBtnModifyRoomId(): void {
        const filter = this._filter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0814),
            minValue     : 0,
            maxValue     : 99999999,
            currentValue : filter.roomId ?? 0,
            callback     : roomId => {
                filter.roomId = roomId;
                this._updateLabelRoomId();
            },
        });
    }
    private _onTouchedBtnDeleteRoomId(): void {
        this._filter.roomId = null;
        this._updateLabelRoomId();
    }

    private _onTouchedBtnModifyMapName(): void {
        const filter = this._filter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B0225),
            currentValue : filter.mapName ?? ``,
            maxChars     : 20,
            canBeEmpty   : true,
            charRestrict : null,
            tips         : null,
            callback     : panel => {
                filter.mapName = panel.getInputText();
                this._updateLabelMapName();
            },
        });
    }
    private _onTouchedBtnDeleteMapName(): void {
        this._filter.mapName = ``;
        this._updateLabelMapName();
    }

    private _onTouchedBtnModifyHasFog(): void {
        const filter    = this._filter;
        filter.hasFog   = !filter.hasFog;
        this._updateLabelHasFog();
    }
    private _onTouchedBtnDeleteHasFog(): void {
        this._filter.hasFog = null;
        this._updateLabelHasFog();
    }

    private async _onTouchedBtnModifyCoCategory(): Promise<void> {
        const filter        = this._filter;
        const gameConfig    = await GameConfigs_Provider.getLatestGameConfig();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoCategoryIdPanel, {
            currentCoCategoryId        : filter.coCategoryId ?? null,
            gameConfig                 : gameConfig,
            availableCoCategoryIdArray : gameConfig.getAllEnabledCoCategoryIdArray(),
            isBan                      : false,
            callbackOnConfirm          : coCategoryId => {
                filter.coCategoryId = coCategoryId;
                this._updateLabelCoCategory();
            },
        });
    }
    private _onTouchedBtnDeleteCoCategory(): void {
        this._filter.coCategoryId = null;
        this._updateLabelCoCategory();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0228);
        this._labelRoomIdTitle.setLangText(Lang_Constants.TextType.B0814);
        this._labelMapNameTitle.setLangText(Lang_Constants.TextType.B0225);
        this._labelUserInRoomTitle.setLangText(Lang_Constants.TextType.B0023);
        this._labelUserNotInRoomTitle.setLangText(Lang_Constants.TextType.B0027);
        this._labelCoCategoryTitle.setLangText(Lang_Constants.TextType.B0028);
        this._labelHasFogTitle.setLangText(Lang_Constants.TextType.B0020);
        this._btnReset.setLangText(Lang_Constants.TextType.B0567);
        this._btnSearch.setLangText(Lang_Constants.TextType.B0228);

        this._updateLabelHasFog();
    }

    private _updateGroupFilter(): void {
        const isMapNameEnabled  = this.getOpenData()?.isMapNameEnabled;
        const groupFilter       = this._groupFilter;
        groupFilter.removeAllItems(false);

        groupFilter.addItem(this._groupRoomId, false);
        (isMapNameEnabled) && (groupFilter.addItem(this._groupMapName, false));
        groupFilter.addItem(this._groupUserInRoom, false);
        groupFilter.addItem(this._groupUserNotInRoom, false);
        groupFilter.addItem(this._groupCoCategory, false);
        groupFilter.addItem(this._groupHasFog, false);

        groupFilter.arrangeItems();
    }
    private _updateComponentsForFilter(): void {
        this._updateLabelRoomId();
        this._updateLabelMapName();
        this._updateLabelHasFog();
        this._updateLabelUserInRoom();
        this._updateLabelUserNotInRoom();
        this._updateLabelCoCategory();
    }

    private _updateLabelRoomId(): void {
        this._labelRoomId.setText(`${this._filter.roomId ?? ``}`);
    }

    private _updateLabelMapName(): void {
        this._labelMapName.setText(this._filter.mapName ?? ``);
    }

    private async _updateLabelUserInRoom(): Promise<void> {
        const userId                = this._filter.userIdInRoom;
        this._labelUserInRoom.setText(userId == null ? `` : (await Users_Model.getUserNickname(userId) ?? Lang_Constants.UndefinedError));
    }

    private async _updateLabelUserNotInRoom(): Promise<void> {
        const userId                    = this._filter.userIdNotInRoom;
        this._labelUserNotInRoom.setText(userId == null ? `` : (await Users_Model.getUserNickname(userId) ?? Lang_Constants.UndefinedError));
    }

    private async _updateLabelCoCategory(): Promise<void> {
        const coCategoryId  = this._filter.coCategoryId;
        const label         = this._labelCoCategory;
        if (coCategoryId == null) {
            label.setText(``);
        } else {
            const config    = await GameConfigs_Provider.getLatestGameConfig();
            label.setText(config.getCoCategoryCfg(coCategoryId)?.getName() ?? Lang_Constants.UndefinedError);
        }
    }

    private _updateLabelHasFog(): void {
        const hasFog    = this._filter.hasFog;
        const label     = this._labelHasFog;
        if (hasFog === true) {
            label.setLangText(Lang_Constants.TextType.Yes);
        } else if (hasFog === false) {
            label.setLangText(Lang_Constants.TextType.No);
        } else {
            label.setText(``);
        }
    }
}
