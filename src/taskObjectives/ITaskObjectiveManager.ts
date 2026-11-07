import {
    type BaseWar_Model_War,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { TaskObjectiveFullData } from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type { TaskObjectiveState } from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";
import type { SerialTaskObjectiveManager } from "../proto/schema/CommonProto/WarSerialization/SerialTaskObjectiveManager.ts";

export interface ITaskObjectiveManager {
    init(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialTaskObjectiveManager>, taskObjectiveFullData: AuxiliaryTypes_AuxiliaryTypes.Undefinable<TaskObjectiveFullData>): void;
    fastInit(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialTaskObjectiveManager>): void;

    serialize(): SerialTaskObjectiveManager;
    serializeForCreateMfr(): SerialTaskObjectiveManager;
    serializeForCreateSfw(): SerialTaskObjectiveManager;

    startRunning(war: BaseWar_Model_War.War): void;

    getWar(): BaseWar_Model_War.War;

    getStateArray(): TaskObjectiveState[];
    updateState(state: TaskObjectiveState): boolean;

    autoUpdateAllCurrentProgresses(): void;

    getScore(): number;
}
