import * as AuxiliaryTypesGridIndex from "./GridIndex.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoStructureMovePath from "../proto/schema/CommonProto/Structure/MovePath.ts";

export class MovePath {
    public nodes            : AuxiliaryTypesGridIndex.GridIndex[];
    public fuelConsumption  : number;
    public isBlocked        : boolean;

    public constructor(nodes: AuxiliaryTypesGridIndex.GridIndex[], fuelConsumption: number, isBlocked: boolean) {
        this.nodes              = nodes;
        this.fuelConsumption    = fuelConsumption;
        this.isBlocked          = isBlocked;
    }

    public static create(movePath: ProtoSchemaCommonProtoStructureMovePath.MovePath): MovePath {
        const nodes: AuxiliaryTypesGridIndex.GridIndex[] = [];
        for (const node of movePath.getNodes()) {
            nodes.push(HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(node)));
        }

        return new MovePath(nodes, movePath.getFuelConsumption() ?? 0, !!movePath.getIsBlocked());
    }

    public toProto(): ProtoSchemaCommonProtoStructureMovePath.MovePath {
        return ProtoSchemaCommonProtoStructureMovePath.MovePath.fromJson({
            nodes           : this.nodes.map(v => v.toProto().toJson()),
            isBlocked       : this.isBlocked,
            fuelConsumption : this.fuelConsumption,
        });
    }
}
