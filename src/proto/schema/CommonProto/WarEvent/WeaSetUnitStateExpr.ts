import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetUnitStateExprJson extends $ProtoSchemaJsonBase {
    conUnitFilter?: string | null | undefined;
    actActionState?: string | null | undefined;
    actPrimaryWeaponCurrentAmmo?: string | null | undefined;
    actCurrentHp?: string | null | undefined;
    actIsCapturingTile?: string | null | undefined;
    actIsDiving?: string | null | undefined;
    actFlareCurrentAmmo?: string | null | undefined;
    actCurrentFuel?: string | null | undefined;
    actCurrentBuildMaterial?: string | null | undefined;
    actCurrentProduceMaterial?: string | null | undefined;
    actCurrentPromotion?: string | null | undefined;
    actIsBuildingTile?: string | null | undefined;
    actIsCoOnboard?: string | null | undefined;
    actAiMode?: string | null | undefined;
    actGroupedTagId?: string | null | undefined;
    actForbiddenGroupedLocationIdArray?: string | null | undefined;
    actAiWeightedDestination?: string | null | undefined;
    actCustomNameId?: string | null | undefined;
}

export class WeaSetUnitStateExpr extends $ProtoSchemaBase {
    private _conUnitFilter?: string | null | undefined;
    private _actActionState?: string | null | undefined;
    private _actPrimaryWeaponCurrentAmmo?: string | null | undefined;
    private _actCurrentHp?: string | null | undefined;
    private _actIsCapturingTile?: string | null | undefined;
    private _actIsDiving?: string | null | undefined;
    private _actFlareCurrentAmmo?: string | null | undefined;
    private _actCurrentFuel?: string | null | undefined;
    private _actCurrentBuildMaterial?: string | null | undefined;
    private _actCurrentProduceMaterial?: string | null | undefined;
    private _actCurrentPromotion?: string | null | undefined;
    private _actIsBuildingTile?: string | null | undefined;
    private _actIsCoOnboard?: string | null | undefined;
    private _actAiMode?: string | null | undefined;
    private _actGroupedTagId?: string | null | undefined;
    private _actForbiddenGroupedLocationIdArray?: string | null | undefined;
    private _actAiWeightedDestination?: string | null | undefined;
    private _actCustomNameId?: string | null | undefined;

    public static fromJson(obj: WeaSetUnitStateExprJson): WeaSetUnitStateExpr {
        return new WeaSetUnitStateExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaSetUnitStateExprJson): this {
        this.setConUnitFilter(obj.conUnitFilter);
        this.setActActionState(obj.actActionState);
        this.setActPrimaryWeaponCurrentAmmo(obj.actPrimaryWeaponCurrentAmmo);
        this.setActCurrentHp(obj.actCurrentHp);
        this.setActIsCapturingTile(obj.actIsCapturingTile);
        this.setActIsDiving(obj.actIsDiving);
        this.setActFlareCurrentAmmo(obj.actFlareCurrentAmmo);
        this.setActCurrentFuel(obj.actCurrentFuel);
        this.setActCurrentBuildMaterial(obj.actCurrentBuildMaterial);
        this.setActCurrentProduceMaterial(obj.actCurrentProduceMaterial);
        this.setActCurrentPromotion(obj.actCurrentPromotion);
        this.setActIsBuildingTile(obj.actIsBuildingTile);
        this.setActIsCoOnboard(obj.actIsCoOnboard);
        this.setActAiMode(obj.actAiMode);
        this.setActGroupedTagId(obj.actGroupedTagId);
        this.setActForbiddenGroupedLocationIdArray(obj.actForbiddenGroupedLocationIdArray);
        this.setActAiWeightedDestination(obj.actAiWeightedDestination);
        this.setActCustomNameId(obj.actCustomNameId);
        return this;
    }
    public override toJson(obj?: WeaSetUnitStateExprJson): WeaSetUnitStateExprJson {
        obj ??= ({} as WeaSetUnitStateExprJson);

        {
            const value = this.getConUnitFilter();
            (value != null) && (obj.conUnitFilter = value);
        }

        {
            const value = this.getActActionState();
            (value != null) && (obj.actActionState = value);
        }

        {
            const value = this.getActPrimaryWeaponCurrentAmmo();
            (value != null) && (obj.actPrimaryWeaponCurrentAmmo = value);
        }

        {
            const value = this.getActCurrentHp();
            (value != null) && (obj.actCurrentHp = value);
        }

        {
            const value = this.getActIsCapturingTile();
            (value != null) && (obj.actIsCapturingTile = value);
        }

        {
            const value = this.getActIsDiving();
            (value != null) && (obj.actIsDiving = value);
        }

        {
            const value = this.getActFlareCurrentAmmo();
            (value != null) && (obj.actFlareCurrentAmmo = value);
        }

        {
            const value = this.getActCurrentFuel();
            (value != null) && (obj.actCurrentFuel = value);
        }

        {
            const value = this.getActCurrentBuildMaterial();
            (value != null) && (obj.actCurrentBuildMaterial = value);
        }

        {
            const value = this.getActCurrentProduceMaterial();
            (value != null) && (obj.actCurrentProduceMaterial = value);
        }

        {
            const value = this.getActCurrentPromotion();
            (value != null) && (obj.actCurrentPromotion = value);
        }

        {
            const value = this.getActIsBuildingTile();
            (value != null) && (obj.actIsBuildingTile = value);
        }

        {
            const value = this.getActIsCoOnboard();
            (value != null) && (obj.actIsCoOnboard = value);
        }

        {
            const value = this.getActAiMode();
            (value != null) && (obj.actAiMode = value);
        }

        {
            const value = this.getActGroupedTagId();
            (value != null) && (obj.actGroupedTagId = value);
        }

        {
            const value = this.getActForbiddenGroupedLocationIdArray();
            (value != null) && (obj.actForbiddenGroupedLocationIdArray = value);
        }

        {
            const value = this.getActAiWeightedDestination();
            (value != null) && (obj.actAiWeightedDestination = value);
        }

        {
            const value = this.getActCustomNameId();
            (value != null) && (obj.actCustomNameId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConUnitFilter();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getActActionState();
            if (value != null) {
                writer.uint32(98).string(value);
            }
        }

        {
            const value = this.getActPrimaryWeaponCurrentAmmo();
            if (value != null) {
                writer.uint32(106).string(value);
            }
        }

        {
            const value = this.getActCurrentHp();
            if (value != null) {
                writer.uint32(114).string(value);
            }
        }

        {
            const value = this.getActIsCapturingTile();
            if (value != null) {
                writer.uint32(122).string(value);
            }
        }

        {
            const value = this.getActIsDiving();
            if (value != null) {
                writer.uint32(130).string(value);
            }
        }

        {
            const value = this.getActFlareCurrentAmmo();
            if (value != null) {
                writer.uint32(138).string(value);
            }
        }

        {
            const value = this.getActCurrentFuel();
            if (value != null) {
                writer.uint32(146).string(value);
            }
        }

        {
            const value = this.getActCurrentBuildMaterial();
            if (value != null) {
                writer.uint32(154).string(value);
            }
        }

        {
            const value = this.getActCurrentProduceMaterial();
            if (value != null) {
                writer.uint32(162).string(value);
            }
        }

        {
            const value = this.getActCurrentPromotion();
            if (value != null) {
                writer.uint32(170).string(value);
            }
        }

        {
            const value = this.getActIsBuildingTile();
            if (value != null) {
                writer.uint32(178).string(value);
            }
        }

        {
            const value = this.getActIsCoOnboard();
            if (value != null) {
                writer.uint32(186).string(value);
            }
        }

        {
            const value = this.getActAiMode();
            if (value != null) {
                writer.uint32(194).string(value);
            }
        }

        {
            const value = this.getActGroupedTagId();
            if (value != null) {
                writer.uint32(202).string(value);
            }
        }

        {
            const value = this.getActForbiddenGroupedLocationIdArray();
            if (value != null) {
                writer.uint32(210).string(value);
            }
        }

        {
            const value = this.getActAiWeightedDestination();
            if (value != null) {
                writer.uint32(218).string(value);
            }
        }

        {
            const value = this.getActCustomNameId();
            if (value != null) {
                writer.uint32(226).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetUnitStateExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetUnitStateExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConUnitFilter(reader.string());
                    break;

                case 12:
                    msg.setActActionState(reader.string());
                    break;

                case 13:
                    msg.setActPrimaryWeaponCurrentAmmo(reader.string());
                    break;

                case 14:
                    msg.setActCurrentHp(reader.string());
                    break;

                case 15:
                    msg.setActIsCapturingTile(reader.string());
                    break;

                case 16:
                    msg.setActIsDiving(reader.string());
                    break;

                case 17:
                    msg.setActFlareCurrentAmmo(reader.string());
                    break;

                case 18:
                    msg.setActCurrentFuel(reader.string());
                    break;

                case 19:
                    msg.setActCurrentBuildMaterial(reader.string());
                    break;

                case 20:
                    msg.setActCurrentProduceMaterial(reader.string());
                    break;

                case 21:
                    msg.setActCurrentPromotion(reader.string());
                    break;

                case 22:
                    msg.setActIsBuildingTile(reader.string());
                    break;

                case 23:
                    msg.setActIsCoOnboard(reader.string());
                    break;

                case 24:
                    msg.setActAiMode(reader.string());
                    break;

                case 25:
                    msg.setActGroupedTagId(reader.string());
                    break;

                case 26:
                    msg.setActForbiddenGroupedLocationIdArray(reader.string());
                    break;

                case 27:
                    msg.setActAiWeightedDestination(reader.string());
                    break;

                case 28:
                    msg.setActCustomNameId(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetUnitStateExpr {
        return WeaSetUnitStateExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetUnitStateExpr" {
        return "WeaSetUnitStateExpr";
    }

    public checkHasConUnitFilter(): boolean {
        return this._conUnitFilter != null;
    }
    public getConUnitFilter(): string | null | undefined {
        return this._conUnitFilter;
    }
    public setConUnitFilter(value: string | null | undefined): void {
        this._conUnitFilter = value;
    }

    public checkHasActActionState(): boolean {
        return this._actActionState != null;
    }
    public getActActionState(): string | null | undefined {
        return this._actActionState;
    }
    public setActActionState(value: string | null | undefined): void {
        this._actActionState = value;
    }

    public checkHasActPrimaryWeaponCurrentAmmo(): boolean {
        return this._actPrimaryWeaponCurrentAmmo != null;
    }
    public getActPrimaryWeaponCurrentAmmo(): string | null | undefined {
        return this._actPrimaryWeaponCurrentAmmo;
    }
    public setActPrimaryWeaponCurrentAmmo(value: string | null | undefined): void {
        this._actPrimaryWeaponCurrentAmmo = value;
    }

    public checkHasActCurrentHp(): boolean {
        return this._actCurrentHp != null;
    }
    public getActCurrentHp(): string | null | undefined {
        return this._actCurrentHp;
    }
    public setActCurrentHp(value: string | null | undefined): void {
        this._actCurrentHp = value;
    }

    public checkHasActIsCapturingTile(): boolean {
        return this._actIsCapturingTile != null;
    }
    public getActIsCapturingTile(): string | null | undefined {
        return this._actIsCapturingTile;
    }
    public setActIsCapturingTile(value: string | null | undefined): void {
        this._actIsCapturingTile = value;
    }

    public checkHasActIsDiving(): boolean {
        return this._actIsDiving != null;
    }
    public getActIsDiving(): string | null | undefined {
        return this._actIsDiving;
    }
    public setActIsDiving(value: string | null | undefined): void {
        this._actIsDiving = value;
    }

    public checkHasActFlareCurrentAmmo(): boolean {
        return this._actFlareCurrentAmmo != null;
    }
    public getActFlareCurrentAmmo(): string | null | undefined {
        return this._actFlareCurrentAmmo;
    }
    public setActFlareCurrentAmmo(value: string | null | undefined): void {
        this._actFlareCurrentAmmo = value;
    }

    public checkHasActCurrentFuel(): boolean {
        return this._actCurrentFuel != null;
    }
    public getActCurrentFuel(): string | null | undefined {
        return this._actCurrentFuel;
    }
    public setActCurrentFuel(value: string | null | undefined): void {
        this._actCurrentFuel = value;
    }

    public checkHasActCurrentBuildMaterial(): boolean {
        return this._actCurrentBuildMaterial != null;
    }
    public getActCurrentBuildMaterial(): string | null | undefined {
        return this._actCurrentBuildMaterial;
    }
    public setActCurrentBuildMaterial(value: string | null | undefined): void {
        this._actCurrentBuildMaterial = value;
    }

    public checkHasActCurrentProduceMaterial(): boolean {
        return this._actCurrentProduceMaterial != null;
    }
    public getActCurrentProduceMaterial(): string | null | undefined {
        return this._actCurrentProduceMaterial;
    }
    public setActCurrentProduceMaterial(value: string | null | undefined): void {
        this._actCurrentProduceMaterial = value;
    }

    public checkHasActCurrentPromotion(): boolean {
        return this._actCurrentPromotion != null;
    }
    public getActCurrentPromotion(): string | null | undefined {
        return this._actCurrentPromotion;
    }
    public setActCurrentPromotion(value: string | null | undefined): void {
        this._actCurrentPromotion = value;
    }

    public checkHasActIsBuildingTile(): boolean {
        return this._actIsBuildingTile != null;
    }
    public getActIsBuildingTile(): string | null | undefined {
        return this._actIsBuildingTile;
    }
    public setActIsBuildingTile(value: string | null | undefined): void {
        this._actIsBuildingTile = value;
    }

    public checkHasActIsCoOnboard(): boolean {
        return this._actIsCoOnboard != null;
    }
    public getActIsCoOnboard(): string | null | undefined {
        return this._actIsCoOnboard;
    }
    public setActIsCoOnboard(value: string | null | undefined): void {
        this._actIsCoOnboard = value;
    }

    public checkHasActAiMode(): boolean {
        return this._actAiMode != null;
    }
    public getActAiMode(): string | null | undefined {
        return this._actAiMode;
    }
    public setActAiMode(value: string | null | undefined): void {
        this._actAiMode = value;
    }

    public checkHasActGroupedTagId(): boolean {
        return this._actGroupedTagId != null;
    }
    public getActGroupedTagId(): string | null | undefined {
        return this._actGroupedTagId;
    }
    public setActGroupedTagId(value: string | null | undefined): void {
        this._actGroupedTagId = value;
    }

    public checkHasActForbiddenGroupedLocationIdArray(): boolean {
        return this._actForbiddenGroupedLocationIdArray != null;
    }
    public getActForbiddenGroupedLocationIdArray(): string | null | undefined {
        return this._actForbiddenGroupedLocationIdArray;
    }
    public setActForbiddenGroupedLocationIdArray(value: string | null | undefined): void {
        this._actForbiddenGroupedLocationIdArray = value;
    }

    public checkHasActAiWeightedDestination(): boolean {
        return this._actAiWeightedDestination != null;
    }
    public getActAiWeightedDestination(): string | null | undefined {
        return this._actAiWeightedDestination;
    }
    public setActAiWeightedDestination(value: string | null | undefined): void {
        this._actAiWeightedDestination = value;
    }

    public checkHasActCustomNameId(): boolean {
        return this._actCustomNameId != null;
    }
    public getActCustomNameId(): string | null | undefined {
        return this._actCustomNameId;
    }
    public setActCustomNameId(value: string | null | undefined): void {
        this._actCustomNameId = value;
    }
}
