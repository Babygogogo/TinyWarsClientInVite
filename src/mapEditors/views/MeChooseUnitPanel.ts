import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as MapEditorModelMeModel from "../../mapEditor/model/MeModel.ts";
import type * as MapEditorModelMeTypes from "../../mapEditor/model/MeTypes.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";

const MAX_RECENT_COUNT = 10;

export interface OpenData {
    war     : MapEditorInterfaceIMeWar.IMeWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSwitch!        : UiInterfacesIUiButton.IUiButton;

    private readonly _labelRecentTitle! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listRecent!       : UiInterfacesIUiScrollList.IUiScrollList<DataForUnitRenderer>;
    private readonly _listPlayerIndex!  : UiInterfacesIUiScrollList.IUiScrollList<DataForPlayerIndexRenderer>;
    private readonly _listUnit!         : UiInterfacesIUiScrollList.IUiScrollList<DataForUnitRenderer>;

    private readonly _dataListForRecent : DataForUnitRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.closePanel },
            { ui: this._btnSwitch,  callback: this._onTouchedBtnSwitch },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listPlayerIndex.setItemRendererClass(PlayerIndexRenderer);
        this._listRecent.setItemRendererClass(UnitRenderer);
        this._listUnit.setItemRendererClass(UnitRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listPlayerIndex.removeAllItems(),
            this._listRecent.removeAllItems(),
            this._listUnit.removeAllItems(),
        ]);
        await super._onClosed();
    }

    public async setAndReviseSelectedPlayerIndex(newPlayerIndex: number, needScroll: boolean): Promise<void> {
        const listPlayerIndex   = this._listPlayerIndex;
        const index             = HelpersMisc.getExisted(listPlayerIndex.getRevisedFirstIndex(v => v?.playerIndex === newPlayerIndex));
        listPlayerIndex.setSelectedItemIndex(index);
        if (needScroll) {
            listPlayerIndex.scrollToItem(index);
        }

        await this._updateListUnit();
    }

    public async updateOnChooseUnit(data: MapEditorModelMeTypes.DataForDrawUnit): Promise<void> {
        const dataList      = this._dataListForRecent;
        const filteredList  = dataList.filter(v => {
            const oldData = v.dataForDrawUnit;
            return (oldData.playerIndex != data.playerIndex)
                || (oldData.unitType != data.unitType);
        });
        dataList.length     = 0;
        dataList[0]         = {
            dataForDrawUnit : data,
            panel           : this,
            gameConfig      : await GameConfigGcModel.getLatestGameConfig(),
        };
        for (const v of filteredList) {
            if (dataList.length < MAX_RECENT_COUNT) {
                dataList.push(v);
            } else {
                break;
            }
        }
        await this._updateListRecent();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnSwitch(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeChooseTileBasePanel, {
            war : war,
        });
        this.closePanel();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0281));
        this._labelRecentTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0372)}:`);
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        const data = this._dataListForRecent[0];
        await this._resetListPlayerIndex(data ? data.dataForDrawUnit.playerIndex : PlayersConstants.PlayerIndex.First);
        await this._updateListUnit();
        await this._updateListRecent();
    }

    private async _resetListPlayerIndex(selectedPlayerIndex: number | null): Promise<void> {
        const dataArray: DataForPlayerIndexRenderer[] = [];
        for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= PlayersConstants.PlayerIndex.Max; ++playerIndex) {
            dataArray.push({
                playerIndex,
                panel       : this,
            });
        }

        const list = this._listPlayerIndex;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.playerIndex === selectedPlayerIndex) ?? (dataArray.length ? 0 : -1));
    }

    private async _updateListUnit(): Promise<void> {
        const playerIndex = this._listPlayerIndex.getFirstSelectedData()?.playerIndex;
        const listUnit    = this._listUnit;
        if (playerIndex == null) {
            await listUnit.removeAllItems();
            return;
        }

        const gameConfig    = await GameConfigGcModel.getLatestGameConfig();
        const dataArray     : DataForUnitRenderer[] = [];
        for (const unitType of gameConfig.getAllUnitTypeArray()) {
            dataArray.push({
                panel           : this,
                dataForDrawUnit : {
                    playerIndex,
                    unitType,
                },
                gameConfig,
            });
        }

        await listUnit.bindData(dataArray);
    }

    private async _updateListRecent(): Promise<void> {
        await this._listRecent.bindData(this._dataListForRecent);
        this._listRecent.scrollTop();
    }
}

interface DataForPlayerIndexRenderer extends UiTypesUiListItemData.UiListItemData {
    playerIndex : number;
    panel       : Panel;
}
class PlayerIndexRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForPlayerIndexRenderer> {
    private readonly _labelPlayerIndex! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSelected!      : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const playerIndex = this.getOpenData()?.playerIndex;
        if (playerIndex == null) {
            return;
        }

        this._labelPlayerIndex.setText(`P${playerIndex}`);
        this._imgBg.loadSource(HelpersImageSource.getSkinButtonBackground(playerIndex));
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.playerIndex, false);
    }
}

interface DataForUnitRenderer extends UiTypesUiListItemData.UiListItemData {
    dataForDrawUnit : MapEditorModelMeTypes.DataForDrawUnit;
    panel           : Panel;
    gameConfig      : GameConfigGcData.GcData;
}
class UnitRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _conUnitView!  : UiInterfacesIUiContainer.IUiContainer;

    private _unitView   = new (GameHelpersGhFactory.getUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
        this._conUnitView.addUiChild(this._unitView);
    }
    protected override async _onClosed(): Promise<void> {
        this._unitView.stopRunningView();

        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForDrawUnit   = openData.dataForDrawUnit;
        const unitType          = dataForDrawUnit.unitType;
        const gameConfig        = openData.gameConfig;
        const war               = HelpersMisc.getExisted(MapEditorModelMeModel.getWar());
        this._labelName.setText(LangUtils.getUnitName(unitType, gameConfig) ?? LangConstants.UndefinedError);

        const unitView  = this._unitView;
        const unit      = new (GameHelpersGhFactory.getUnitClass())();
        unit.init(UnitsUtilsSerialization.createDefault({
            gridIndex   : { x: 0, y: 0 },
            unitId      : 0,
            unitTypeId  : unitType,
            playerIndex : dataForDrawUnit.playerIndex,
            gcData      : gameConfig,
        }), gameConfig);
        unit.startRunning(war);
        unitView.init(unit);
        unitView.startRunningView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const panel             = openData.panel;
        const dataForDrawUnit   = openData.dataForDrawUnit;
        panel.updateOnChooseUnit(dataForDrawUnit);
        panel.closePanel();
        HelpersMisc.getExisted(MapEditorModelMeModel.getWar()).getDrawer().setModeDrawUnit(dataForDrawUnit);
    }
}
