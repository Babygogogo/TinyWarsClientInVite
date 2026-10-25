import { StateId } from "./Constants.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import { TextType } from "../lang/Constants.ts";
import { TypeId } from "../notifications/TypeId.ts";
import { ShortSfxCode } from "../sounds/Constants.ts";
import { playShortSfx } from "../sounds/SoundPlayer.ts";
import { UiPanel } from "../ui/components/UiPanel.ts";
import type { IUiContainer } from "../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../ui/interfaces/IUiLabel.ts";

export interface OpenData {
    war: IBwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _groupIgnoreObstructiveUnits!      : IUiContainer;
    private readonly _labelTitleIgnoreObstructiveUnits! : IUiLabel;

    private readonly _groupAlly!                        : IUiContainer;
    private readonly _labelIgnoreAlliedUnits!           : IUiLabel;
    private readonly _imgAlly!                          : IUiImage;

    private readonly _groupEnemy!                       : IUiContainer;
    private readonly _labelIgnoreEnemyUnits!            : IUiLabel;
    private readonly _imgEnemy!                         : IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.ActionPlannerStateChanged,       callback: this._onNotifyActionPlannerStateChanged },
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
        if (state === StateId.PreviewingUnitAttackableArea) {
            actionPlanner.setIsIgnoreAllyForPreviewingAttackableArea(isOn);
        }
        img.setIsVisible(isOn);

        playShortSfx(isOn
            ? ShortSfxCode.CursorConfirm01
            : ShortSfxCode.ButtonCancel01
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
        if (state === StateId.PreviewingUnitAttackableArea) {
            actionPlanner.setIsIgnoreEnemyForPreviewingAttackableArea(isOn);
        } else if (state === StateId.PreviewingUnitMovableArea) {
            actionPlanner.setIsIgnoreEnemyForPreviewingMovableArea(isOn);
        }
        img.setIsVisible(isOn);

        playShortSfx(isOn
            ? ShortSfxCode.CursorConfirm01
            : ShortSfxCode.ButtonCancel01
        );
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitleIgnoreObstructiveUnits.setLangText(TextType.B1297);
        this._labelIgnoreAlliedUnits.setLangText(TextType.B1298);
        this._labelIgnoreEnemyUnits.setLangText(TextType.B1299);
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
        if (state === StateId.PreviewingUnitAttackableArea) {
            group.setIsVisible(true);
            groupAlly.setIsVisible(true);
            imgAlly.setIsVisible(actionPlanner.getIsIgnoreAllyForPreviewingAttackableArea());
            imgEnemy.setIsVisible(actionPlanner.getIsIgnoreEnemyForPreviewingAttackableArea());

        } else if (state === StateId.PreviewingUnitMovableArea) {
            group.setIsVisible(true);
            groupAlly.setIsVisible(false);
            imgEnemy.setIsVisible(actionPlanner.getIsIgnoreEnemyForPreviewingMovableArea());

        } else {
            group.setIsVisible(false);
        }
    }
}
