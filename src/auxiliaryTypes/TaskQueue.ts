import { Helpers_Misc } from "../internal.ts";

export class TaskQueue<T> {
    private readonly _taskArray : (() => Promise<void>)[] = [];

    /** Runs tasks sequentially; failures reject without blocking subsequent tasks. */
    public addTask(task: () => T | Promise<T>): Promise<T> {
        return this._doAddTask(task);
    }

    private _doAddTask(rawTask: () => T | Promise<T>): Promise<T> {
        const arr = this._taskArray;
        return new Promise<T>((resolve, reject) => {
            const task = async (): Promise<void> => {
                try {
                    if (arr[0] !== task) {
                        throw Helpers_Misc.newError(`Unknown error 1!`);
                    }

                    resolve(await rawTask());
                } catch (error) {
                    reject(error);
                } finally {
                    arr.shift();
                    if (arr.length) {
                        arr[0]();
                    }
                }
            };

            arr.push(task);
            if (arr.length === 1) {
                task();
            }
        });
    }

    // private async _runTaskArray(): Promise<void> {
    //     if (this._isRunningTaskArray) {
    //         return;
    //     }
    //     this._isRunningTaskArray = true;

    //     const arr   = this._taskArray;
    //     const task  = arr.shift();
    //     (task) && (await task());

    //     this._isRunningTaskArray = false;
    //     if (arr.length) {
    //         this._runTaskArray();
    //     }
    // }
}
