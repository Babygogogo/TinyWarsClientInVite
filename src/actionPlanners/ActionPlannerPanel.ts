import * as ActionPlannersConstants from "./Constants.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import * as SoundsConstants from "../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiContainer from "../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../ui/interfaces/IUiLabel.ts";

export interface OpenData {
    war: BaseWarInterfaceIBwWar.IBwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupIgnoreObstructiveUnits!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitleIgnoreObstructiveUnits! : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupAlly!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelIgnoreAlliedUnits!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgAlly!                          : UiInterfacesIUiImage.IUiImage;

    private readonly _groupEnemy!                       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelIgnoreEnemyUnits!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgEnemy!                         : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.ActionPlannerStateChanged,       callback: this._onNotifyActionPlannerStateChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupAlly,                              callback: this._onTouchedGroupAlly },
            { ui: this._groupEnemy,                             callback: this._onTouchedGroupEnemy },
        ]);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateGroupIgnoreObstructiveUnits();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyActionPlannerStateChanged(): void {
        this._updateGroupIgnoreObstructiveUnits();
    }

    private _onTouchedGroupAlly(): void {
        const actionPlanner = this.getOpenData()?.war.getActionPlanner();
        if (actionPlanner == null) {
            return;
        }


        const img   = this._imgAlly;
        const state = actionPlanner.getStateId();
        const isOn  = !img.getIsVisible();
        if (state === ActionPlannersConstants.StateId.PreviewingUnitAttackableArea) {
            actionPlanner.setIsIgnoreAllyForPreviewingAttackableArea(isOn);
        }
        img.setIsVisible(isOn);

        SoundsSoundPlayer.playShortSfx(isOn
            ? SoundsConstants.ShortSfxCode.CursorConfirm01
            : SoundsConstants.ShortSfxCode.ButtonCancel01
        );
    }

    private _onTouchedGroupEnemy(): void {
        const actionPlanner = this.getOpenData()?.war.getActionPlanner();
        if (actionPlanner == null) {
            return;
        }

        const img   = this._imgEnemy;
        const state = actionPlanner.getStateId();
        const isOn  = !img.getIsVisible();
        if (state === ActionPlannersConstants.StateId.PreviewingUnitAttackableArea) {
            actionPlanner.setIsIgnoreEnemyForPreviewingAttackableArea(isOn);
        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitMovableArea) {
            actionPlanner.setIsIgnoreEnemyForPreviewingMovableArea(isOn);
        }
        img.setIsVisible(isOn);

        SoundsSoundPlayer.playShortSfx(isOn
            ? SoundsConstants.ShortSfxCode.CursorConfirm01
            : SoundsConstants.ShortSfxCode.ButtonCancel01
        );
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitleIgnoreObstructiveUnits.setLangText(LangConstants.TextType.B1297);
        this._labelIgnoreAlliedUnits.setLangText(LangConstants.TextType.B1298);
        this._labelIgnoreEnemyUnits.setLangText(LangConstants.TextType.B1299);
    }

    private _updateGroupIgnoreObstructiveUnits(): void {
        const actionPlanner = this.getOpenData()?.war.getActionPlanner();
        if (actionPlanner == null) {
            return;
        }

        const state     = actionPlanner.getStateId();
        const group     = this._groupIgnoreObstructiveUnits;
        const groupAlly = this._groupAlly;
        const imgAlly   = this._imgAlly;
        const imgEnemy  = this._imgEnemy;
        if (state === ActionPlannersConstants.StateId.PreviewingUnitAttackableArea) {
            group.setIsVisible(true);
            groupAlly.setIsVisible(true);
            imgAlly.setIsVisible(actionPlanner.getIsIgnoreAllyForPreviewingAttackableArea());
            imgEnemy.setIsVisible(actionPlanner.getIsIgnoreEnemyForPreviewingAttackableArea());

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitMovableArea) {
            group.setIsVisible(true);
            groupAlly.setIsVisible(false);
            imgEnemy.setIsVisible(actionPlanner.getIsIgnoreEnemyForPreviewingMovableArea());

        } else {
            group.setIsVisible(false);
        }
    }
}
