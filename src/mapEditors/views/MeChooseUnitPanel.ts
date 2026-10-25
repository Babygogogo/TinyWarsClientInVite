import type { GcData } from "../../gameConfig/GcData.ts";
import { getLatestGameConfig } from "../../gameConfig/GcModel.ts";
import { getUnitViewClass, getUnitClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getSkinButtonBackground } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getUnitName } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { getWar } from "../../mapEditor/model/MeModel.ts";
import type { DataForDrawUnit } from "../../mapEditor/model/MeTypes.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { createDefault } from "../../units/utils/Serialization.ts";

const MAX_RECENT_COUNT = 10;

export interface OpenData {
    war     : IMeWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;
    private readonly _btnSwitch!        : IUiButton;

    private readonly _labelRecentTitle! : IUiLabel;
    private readonly _listRecent!       : IUiScrollList<DataForUnitRenderer>;
    private readonly _listPlayerIndex!  : IUiScrollList<DataForPlayerIndexRenderer>;
    private readonly _listUnit!         : IUiScrollList<DataForUnitRenderer>;

    private readonly _dataListForRecent : DataForUnitRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        const index             = getExisted(listPlayerIndex.getRevisedFirstIndex(v => v?.playerIndex === newPlayerIndex));
        listPlayerIndex.setSelectedItemIndex(index);
        if (needScroll) {
            listPlayerIndex.scrollToItem(index);
        }

        await this._updateListUnit();
    }

    public async updateOnChooseUnit(data: DataForDrawUnit): Promise<void> {
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
            gameConfig      : await getLatestGameConfig(),
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

        openPanel(getDict().MeChooseTileBasePanel, {
            war : war,
        });
        this.closePanel();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(getText(TextType.B0281));
        this._labelRecentTitle.setText(`${getText(TextType.B0372)}:`);
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        const data = this._dataListForRecent[0];
        await this._resetListPlayerIndex(data ? data.dataForDrawUnit.playerIndex : PlayerIndex.First);
        await this._updateListUnit();
        await this._updateListRecent();
    }

    private async _resetListPlayerIndex(selectedPlayerIndex: number | null): Promise<void> {
        const dataArray: DataForPlayerIndexRenderer[] = [];
        for (let playerIndex = PlayerIndex.First; playerIndex <= PlayerIndex.Max; ++playerIndex) {
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

        const gameConfig    = await getLatestGameConfig();
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

interface DataForPlayerIndexRenderer extends UiListItemData {
    playerIndex : number;
    panel       : Panel;
}
class PlayerIndexRenderer extends UiListItemRenderer<DataForPlayerIndexRenderer> {
    private readonly _labelPlayerIndex! : IUiLabel;
    private readonly _imgBg!            : IUiImage;
    private readonly _imgSelected!      : IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const playerIndex = this.getOpenData()?.playerIndex;
        if (playerIndex == null) {
            return;
        }

        this._labelPlayerIndex.setText(`P${playerIndex}`);
        this._imgBg.loadSource(getSkinButtonBackground(playerIndex));
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.playerIndex, false);
    }
}

interface DataForUnitRenderer extends UiListItemData {
    dataForDrawUnit : DataForDrawUnit;
    panel           : Panel;
    gameConfig      : GcData;
}
class UnitRenderer extends UiListItemRenderer<DataForUnitRenderer> {
    private readonly _group!        : IUiContainer;
    private readonly _labelName!    : IUiLabel;
    private readonly _conUnitView!  : IUiContainer;

    private _unitView   = new (getUnitViewClass())();

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
        const war               = getExisted(getWar());
        this._labelName.setText(getUnitName(unitType, gameConfig) ?? UndefinedError);

        const unitView  = this._unitView;
        const unit      = new (getUnitClass())();
        unit.init(createDefault({
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
        getExisted(getWar()).getDrawer().setModeDrawUnit(dataForDrawUnit);
    }
}
