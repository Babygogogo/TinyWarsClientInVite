import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { BwWar } from "../baseWar/model/BwWar.ts";
import type {
    TaskObjectiveFullData as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData,
} from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type {
    TaskObjectiveState as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState,
} from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";
import type {
    SerialTaskObjectiveManager as ProtoSchemaCommonProtoWarSerializationSerialTaskObjectiveManager,
} from "../proto/schema/CommonProto/WarSerialization/SerialTaskObjectiveManager.ts";

type TaskObjectiveState         = ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState;
type TaskObjectiveFullData      = ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData;
type SerialTaskObjectiveManager = ProtoSchemaCommonProtoWarSerializationSerialTaskObjectiveManager;
type Undefinable<T>             = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;
type IBwWar                     = BwWar;

export interface ITaskObjectiveManager {
    init(data: Undefinable<SerialTaskObjectiveManager>, taskObjectiveFullData: Undefinable<TaskObjectiveFullData>): void;
    fastInit(data: Undefinable<SerialTaskObjectiveManager>): void;

    serialize(): SerialTaskObjectiveManager;
    serializeForCreateMfr(): SerialTaskObjectiveManager;
    serializeForCreateSfw(): SerialTaskObjectiveManager;

    startRunning(war: IBwWar): void;

    getWar(): IBwWar;

    getStateArray(): TaskObjectiveState[];
    updateState(state: TaskObjectiveState): boolean;

    autoUpdateAllCurrentProgresses(): void;

    getScore(): number;
}
