import { GridIndex } from "./GridIndex.ts";
import { getExisted } from "../helpers/Misc.ts";
import { MovePath as ProtoMovePath } from "../proto/schema/CommonProto/Structure/MovePath.ts";

export class MovePath {
    public nodes            : GridIndex[];
    public fuelConsumption  : number;
    public isBlocked        : boolean;

    public constructor(nodes: GridIndex[], fuelConsumption: number, isBlocked: boolean) {
        this.nodes              = nodes;
        this.fuelConsumption    = fuelConsumption;
        this.isBlocked          = isBlocked;
    }

    public static create(movePath: ProtoMovePath): MovePath {
        const nodes: GridIndex[] = [];
        for (const node of movePath.getNodes()) {
            nodes.push(getExisted(GridIndex.convertGridIndex(node)));
        }

        return new MovePath(nodes, movePath.getFuelConsumption(), !!movePath.getIsBlocked());
    }

    public toProto(): ProtoMovePath {
        return ProtoMovePath.fromJson({
            nodes           : this.nodes.map(v => v.toProto().toJson()),
            isBlocked       : this.isBlocked,
            fuelConsumption : this.fuelConsumption,
        });
    }
}
