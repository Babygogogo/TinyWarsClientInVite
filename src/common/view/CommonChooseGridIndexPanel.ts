import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    currentGridIndexArray   : AuxiliaryTypesGridIndex.GridIndex[];
    mapSize                 : AuxiliaryTypesMapSize.MapSize;
    callbackOnConfirm       : (teamIndexArray: AuxiliaryTypesGridIndex.GridIndex[]) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;

    private readonly _layoutTitle!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapSize!     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAdd!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteAll!     : UiInterfacesIUiButton.IUiButton;

    private readonly _listLocation!     : UiInterfacesIUiScrollList.IUiScrollList<DataForLocationRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnAdd,             callback: this._onTouchedBtnAdd },
            { ui: this._btnDeleteAll,       callback: this._onTouchedBtnDeleteAll },
            { ui: this._btnClose,           callback: this._onTouchedBtnClose },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
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

    public async updateOnDeleteGridIndex(gridIndex: AuxiliaryTypesGridIndex.GridIndex): Promise<void> {
        const list      = this._listLocation;
        const dataArray = HelpersCollection.getNonNullElements(list.getBoundDataArray() ?? []);
        await list.bindData(dataArray.filter(v => !gridIndex.checkIsEqual(v.gridIndex)));
    }

    private _onTouchedBtnAdd(): void {
        const mapSize = this.getOpenData()?.mapSize;
        if (mapSize == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B1071),
            minValue        : 0,
            maxValue        : mapSize.getWidth() - 1,
            currentValue    : 0,
            callback        : x => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                    getTitle           : () => LangUtils.getText(LangConstants.TextType.B1072),
                    minValue        : 0,
                    maxValue        : mapSize.getHeight() - 1,
                    currentValue    : 0,
                    callback        : async y => {
                        const list              = this._listLocation;
                        const gridIndexArray    = HelpersCollection.getNonNullElements(list.getBoundDataArray()?.map(v => v?.gridIndex) ?? []);
                        const gridIndex         = new AuxiliaryTypesGridIndex.GridIndex(x, y);
                        if (gridIndexArray.some(v => v.checkIsEqual(gridIndex))) {
                            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0268));
                            return;
                        }

                        gridIndexArray.push(gridIndex);
                        await list.bindData(gridIndexArray.sort(gridIndexSorter).map(v => { return { gridIndex: v, panel: this }; }));
                    },
                });
            },
        });
    }
    private _onTouchedBtnDeleteAll(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0851),
            callback: () => this._listLocation.removeAllItems(),
        });
    }
    private _onTouchedBtnClose(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent             : () => LangUtils.getText(LangConstants.TextType.A0418),
            getTextForConfirm      : () => LangUtils.getText(LangConstants.TextType.Yes),
            getTextForCancel       : () => LangUtils.getText(LangConstants.TextType.No),
            callback            : () => {
                this.getOpenData()?.callbackOnConfirm(HelpersCollection.getNonNullElements(this._listLocation.getBoundDataArray()?.map(v => v?.gridIndex) ?? []).sort(gridIndexSorter));
                this.closePanel();
            },
            callbackOnCancel    : () => this.closePanel(),
            showButtonClose     : true,
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B0531)));
        this._btnAdd.setText(LangUtils.getText(LangConstants.TextType.B0320));
        this._btnDeleteAll.setText(LangUtils.getText(LangConstants.TextType.B0762));
        this._layoutTitle.arrangeItems();

        this._updateLabelMapSize();
    }

    private async _updateListLocation(): Promise<void> {
        const dataArray : DataForLocationRenderer[] = [];
        for (const gridIndex of this.getOpenData()?.currentGridIndexArray.concat().sort(gridIndexSorter) ?? []) {
            dataArray.push({
                gridIndex   : gridIndex,
                panel       : this,
            });
        }

        await this._listLocation.bindData(dataArray);
    }

    private _updateLabelMapSize(): void {
        const mapSize = this.getOpenData()?.mapSize;
        this._labelMapSize.setText(`(${LangUtils.getText(LangConstants.TextType.B0300)}: ${mapSize?.getWidth()} x ${mapSize?.getHeight()})`);
        this._layoutTitle.arrangeItems();
    }
}

interface DataForLocationRenderer extends UiTypesUiListItemData.UiListItemData {
    gridIndex   : AuxiliaryTypesGridIndex.GridIndex;
    panel       : Panel;
}
class GridIndexRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForLocationRenderer> {
    private readonly _btnDelete!    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnDelete, callback: this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback: () => {
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
        this._btnDelete.setText(LangUtils.getText(LangConstants.TextType.B0220));
    }
}

function gridIndexSorter(g1: AuxiliaryTypesGridIndex.GridIndex, g2: AuxiliaryTypesGridIndex.GridIndex): number {
    const x1 = g1.getX();
    const x2 = g2.getX();
    if (x1 !== x2) {
        return x1 - x2;
    } else {
        return g1.getY() - g2.getY();
    }
}
