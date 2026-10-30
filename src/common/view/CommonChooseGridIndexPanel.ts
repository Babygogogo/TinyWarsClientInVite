import {
    GamePanels_Dict,
    Lang_Utils,
    Helpers_Collection,
    AuxiliaryTypes_GridIndex,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type AuxiliaryTypes_MapSize,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    currentGridIndexArray   : AuxiliaryTypes_GridIndex.GridIndex[];
    mapSize                 : AuxiliaryTypes_MapSize.MapSize;
    callbackOnConfirm       : (teamIndexArray: AuxiliaryTypes_GridIndex.GridIndex[]) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _layoutTitle!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapSize!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteAll!     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listLocation!     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForLocationRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnAdd,             callback : this._onTouchedBtnAdd },
            { ui : this._btnDeleteAll,       callback : this._onTouchedBtnDeleteAll },
            { ui : this._btnClose,           callback : this._onTouchedBtnClose },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listLocation.setItemRendererClass(GridIndexRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateListLocation();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listLocation.removeAllItems();

        await super._onClosed();
    }

    public async updateOnDeleteGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Promise<void> {
        const list      = this._listLocation;
        const dataArray = Helpers_Collection.getNonNullElements(list.getBoundDataArray() ?? []);
        await list.bindData(dataArray.filter(v => !gridIndex.checkIsEqual(v.gridIndex)));
    }

    private _onTouchedBtnAdd(): void {
        const mapSize = this.getOpenData()?.mapSize;
        if (mapSize == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1071),
            minValue     : 0,
            maxValue     : mapSize.getWidth() - 1,
            currentValue : 0,
            callback     : x => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                    getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1072),
                    minValue     : 0,
                    maxValue     : mapSize.getHeight() - 1,
                    currentValue : 0,
                    callback     : async y => {
                        const list              = this._listLocation;
                        const gridIndexArray    = Helpers_Collection.getNonNullElements(list.getBoundDataArray()?.map(v => v?.gridIndex) ?? []);
                        const gridIndex         = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
                        if (gridIndexArray.some(v => v.checkIsEqual(gridIndex))) {
                            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0268));
                            return;
                        }

                        gridIndexArray.push(gridIndex);
                        await list.bindData(gridIndexArray.sort(gridIndexSorter).map(v => {
                            return { gridIndex : v, panel : this }; 
                        }));
                    },
                });
            },
        });
    }
    private _onTouchedBtnDeleteAll(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0851),
            callback   : () => this._listLocation.removeAllItems(),
        });
    }
    private _onTouchedBtnClose(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0418),
            getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.Yes),
            getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.No),
            callback          : () => {
                this.getOpenData()?.callbackOnConfirm(Helpers_Collection.getNonNullElements(this._listLocation.getBoundDataArray()?.map(v => v?.gridIndex) ?? []).sort(gridIndexSorter));
                this.closePanel();
            },
            callbackOnCancel : () => this.closePanel(),
            showButtonClose  : true,
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B0531)));
        this._btnAdd.setLangText(Lang_Constants.TextType.B0320);
        this._btnDeleteAll.setLangText(Lang_Constants.TextType.B0762);
        this._layoutTitle.arrangeItems();

        this._updateLabelMapSize();
    }

    private async _updateListLocation(): Promise<void> {
        const dataArray : DataForLocationRenderer[] = [];
        for (const gridIndex of this.getOpenData()?.currentGridIndexArray.concat().sort(gridIndexSorter) ?? []) {
            dataArray.push({
                gridIndex : gridIndex,
                panel     : this,
            });
        }

        await this._listLocation.bindData(dataArray);
    }

    private _updateLabelMapSize(): void {
        const mapSize = this.getOpenData()?.mapSize;
        this._labelMapSize.setText(`(${Lang_Utils.getText(Lang_Constants.TextType.B0300)}: ${mapSize?.getWidth()} x ${mapSize?.getHeight()})`);
        this._layoutTitle.arrangeItems();
    }
}

interface DataForLocationRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gridIndex   : AuxiliaryTypes_GridIndex.GridIndex;
    panel       : Panel;
}
class GridIndexRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForLocationRenderer> {
    private readonly _btnDelete!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnDelete, callback : this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                openData.panel.updateOnDeleteGridIndex(openData.gridIndex);
            },
        });
    }
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        const gridIndex = this.getOpenData()?.gridIndex;
        this._labelName.setText(`${gridIndex?.getX()}, ${gridIndex?.getY()}`);
    }

    private _updateComponentsForLanguage(): void {
        this._btnDelete.setLangText(Lang_Constants.TextType.B0220);
    }
}

function gridIndexSorter(g1: AuxiliaryTypes_GridIndex.GridIndex, g2: AuxiliaryTypes_GridIndex.GridIndex): number {
    const x1 = g1.getX();
    const x2 = g2.getX();
    if (x1 !== x2) {
        return x1 - x2;
    } else {
        return g1.getY() - g2.getY();
    }
}
