import { Tween } from "../graphics/Constants.ts";
import { addTickCallback } from "../timer/TimerModel.ts";
import { sineOut } from "./Ease.ts";
import { EventDispatcher, getTimer } from "../vendor/egret/Egret.ts";

const NONE      = 0;
// const LOOP      = 1;
// const REVERSE   = 2;

const IGNORE    = {};

const AllTweens  : Executor<TweenTarget>[] = [];
const AllPlugins : Record<string, any> = {};
interface TweenTarget {
    tween_count?    : number;
    [k: string]     : any;
}
interface TweenProps {
    useTicks?           : boolean;
    ignoreGlobalPause?  : boolean;
    loop?               : boolean;
    onChange?           : any;
    onChangeObj?        : any;
    override?           : any;
    paused?             : any;
    position?           : null;
}

export class Executor<T extends TweenTarget> extends EventDispatcher {
    private static _initialized         = false;
    private static _lastTime            = 0;

    private readonly _target            : T;
    private _useTicks                   = false;
    private ignoreGlobalPause           = false;
    private loop                        = false;
    private readonly _steps             : any[] = [];
    private paused                      = false;
    private duration                    = 0;
    private _prevPos                    = -1;
    private _prevPosition               = 0;
    private passive                     = false;
    private readonly _initQueueProps    : { [K in keyof T]?: T[K] } = {};
    private readonly _curQueueProps     : { [K in keyof T]?: T[K] } = {};

    private constructor(target: T, props: TweenProps | undefined) {
        super();

        this._target = target;
        if (props) {
            this._useTicks          = !!props.useTicks;
            this.ignoreGlobalPause  = !!props.ignoreGlobalPause;
            this.loop               = !!props.loop;
            props.onChange && this.addEventListener("change", props.onChange, props.onChangeObj);
            if (props.override) {
                Executor.removeTweens(target);
            }
        }
        if (props && props.paused) {
            this.paused = true;
        }
        else {
            Executor._register(this, true);
        }
        if (props && props.position != null) {
            this.setPosition(props.position, NONE);
        }
    }

    public static get<Target extends TweenTarget>(
        target      : Target,
        props?      : TweenProps,
        override?   : boolean | undefined
    ): Executor<Target> {
        if (override) {
            Executor.removeTweens(target);
        }
        return new Executor(target, props);
    }

    public static removeTweens<Target extends TweenTarget>(target: Target): void {
        if (!target.tween_count) {
            return;
        }
        const tweens = AllTweens;
        for (let i = tweens.length - 1; i >= 0; i--) {
            if (tweens[i]._target == target) {
                tweens[i].paused = true;
                tweens.splice(i, 1);
            }
        }
        target.tween_count = 0;
    }

    public static pauseTweens<Target extends TweenTarget>(target: Target): void {
        if (!target.tween_count) {
            return;
        }
        const tweens = AllTweens;
        for (let i = tweens.length - 1; i >= 0; i--) {
            if (tweens[i]._target == target) {
                tweens[i].paused = true;
            }
        }
    }

    public static resumeTweens<Target extends TweenTarget>(target: Target): void {
        if (!target.tween_count) {
            return;
        }
        const tweens = AllTweens;
        for (let i = tweens.length - 1; i >= 0; i--) {
            if (tweens[i]._target == target) {
                tweens[i].paused = false;
            }
        }
    }

    public static reset<Target extends TweenTarget>({ obj, beginProps, waitTime, endProps, tweenTime, callback }: {
        obj         : Target;
        beginProps  : { [K in keyof Target]?: Target[K] };
        waitTime?   : number;
        endProps    : { [K in keyof Target]?: Target[K] };
        tweenTime?  : number;
        callback?   : () => void
    }): void {
        Executor.removeTweens(obj);

        const tween = Executor.get(obj)
            .set(beginProps)
            .wait(waitTime || 0)
            .to(endProps, tweenTime || Tween.DefaultDuration, sineOut);
        if (callback) {
            tween.call(callback);
        }
    }

    private static tick(timeStamp: number, paused?: boolean | undefined): boolean {
        if (paused === void 0) { paused = false; }
        const delta = timeStamp - Executor._lastTime;
        Executor._lastTime = timeStamp;
        const tweens = AllTweens.concat();
        for (let i = tweens.length - 1; i >= 0; i--) {
            const tween_1 = tweens[i];
            if ((paused && !tween_1.ignoreGlobalPause) || tween_1.paused) {
                continue;
            }
            tween_1.$tick(tween_1._useTicks ? 1 : delta);
        }
        return false;
    }

    private static _register<Target extends TweenTarget>(tween: Executor<Target>, value: boolean): void {
        const target = tween._target;
        const tweens = AllTweens;
        if (value) {
            if (target) {
                target.tween_count = target.tween_count! > 0 ? target.tween_count! + 1 : 1;
            }
            tweens.push(tween);
            if (!Executor._initialized) {
                Executor._lastTime = getTimer();
                // egret.ticker.$startTick(Tween.tick, null);
                addTickCallback(Executor.tick);
                Executor._initialized = true;
            }
        }
        else {
            if (target) {
                target.tween_count!--;
            }
            let i = tweens.length;
            while (i--) {
                if (tweens[i] == tween) {
                    tweens.splice(i, 1);
                    return;
                }
            }
        }
    }

    public static removeAllTweens(): void {
        const tweens = AllTweens;
        for (let i = 0, l = tweens.length; i < l; i++) {
            const tween_2               = tweens[i];
            tween_2.paused              = true;
            tween_2._target.tween_count = 0;
        }
        tweens.length = 0;
    }

    private setPosition(value: number, actionsMode?: number | undefined): boolean {
        if (actionsMode === void 0) { actionsMode = 1; }
        if (value < 0) {
            value = 0;
        }
        //正常化位置
        let t = value;
        let end = false;
        if (t >= this.duration) {
            if (this.loop) {
                const newTime = t % this.duration;
                if (t > 0 && newTime === 0) {
                    t = this.duration;
                }
                else {
                    t = newTime;
                }
            }
            else {
                t = this.duration;
                end = true;
            }
        }
        if (t == this._prevPos) {
            return end;
        }
        if (end) {
            this.setPaused(true);
        }
        const prevPos = this._prevPos;
        this._prevPos = t;
        this._prevPosition = value;
        if (this._target) {
            if (this._steps.length > 0) {
                // 找到新的tween
                const l = this._steps.length;
                let stepIndex = -1;
                for (let i = 0; i < l; i++) {
                    if (this._steps[i].type == "step") {
                        stepIndex = i;
                        if (this._steps[i].t <= t && this._steps[i].t + this._steps[i].d >= t) {
                            break;
                        }
                    }
                }
                for (let i = 0; i < l; i++) {
                    if (this._steps[i].type == "action") {
                        //执行actions
                        if (actionsMode != 0) {
                            if (this._useTicks) {
                                this._runAction(this._steps[i], t, t);
                            }
                            else if (actionsMode == 1 && t < prevPos) {
                                if (prevPos != this.duration) {
                                    this._runAction(this._steps[i], prevPos, this.duration);
                                }
                                this._runAction(this._steps[i], 0, t, true);
                            }
                            else {
                                this._runAction(this._steps[i], prevPos, t);
                            }
                        }
                    }
                    else if (this._steps[i].type == "step") {
                        if (stepIndex == i) {
                            const step = this._steps[stepIndex];
                            this._updateTargetProps(step, Math.min((t - step.t) / step.d, 1));
                        }
                    }
                }
            }
        }
        this.dispatchEventWith("change");
        return end;
    }

    private _runAction(action: { t: any; f: { apply: (arg0: any, arg1: any) => void; }; o: any; p: any; }, startPos: number, endPos: number, includeStart?: boolean | undefined): void {
        if (includeStart === void 0) { includeStart = false; }
        let sPos = startPos;
        let ePos = endPos;
        if (startPos > endPos) {
            //把所有的倒置
            sPos = endPos;
            ePos = startPos;
        }
        const pos = action.t;
        if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
            action.f.apply(action.o, action.p);
        }
    }

    private _updateTargetProps(step: { v: any; e: (arg0: any, arg1: number, arg2: number, arg3: number) => any; p0: any; p1: any; }, ratio: number): void {
        let p0, p1, v, v0, v1, arr;
        if (!step && ratio == 1) {
            this.passive = false;
            p0 = p1 = this._curQueueProps;
        }
        else {
            this.passive = !!step.v;
            //不更新props.
            if (this.passive) {
                return;
            }
            //使用ease
            if (step.e) {
                ratio = step.e(ratio, 0, 1, 1);
            }
            p0 = step.p0;
            p1 = step.p1;
        }
        for (const n in this._initQueueProps) {
            if ((v0 = p0[n]) == null) {
                p0[n] = v0 = this._initQueueProps[n];
            }
            if ((v1 = p1[n]) == null) {
                p1[n] = v1 = v0;
            }
            if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof (v0) != "number")) {
                v = ratio == 1 ? v1 : v0;
            }
            else {
                v = v0 + (v1 - v0) * ratio;
            }
            let ignore = false;
            arr = AllPlugins[n];
            if (arr) {
                for (let i = 0, l = arr.length; i < l; i++) {
                    const v2: any = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                    if (v2 == IGNORE) {
                        ignore = true;
                    }
                    else {
                        v = v2;
                    }
                }
            }
            if (!ignore) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this._target![n] = v;
            }
        }
    }

    private setPaused(value: boolean): this {
        if (this.paused == value) {
            return this;
        }
        this.paused = value;
        Executor._register(this, !value);
        return this;
    }

    private _cloneProps(props: { [K in keyof T]?: T[K] }): { [K in keyof T]?: T[K] } {
        const o: { [K in keyof T]?: T[K] } = {};
        for (const n in props) {
            o[n] = props[n];
        }
        return o;
    }

    private _addStep(o: { d: any; p0?: Record<string, unknown>; p1?: Record<string, unknown>; v?: any; e?: any; type?: any; t?: any; }): this {
        if (o.d > 0) {
            o.type = "step";
            this._steps.push(o);
            o.t = this.duration;
            this.duration += o.d;
        }
        return this;
    }

    private _appendQueueProps(o: { [K in keyof T]?: T[K] }): { [K in keyof T]?: T[K] } {
        let arr, oldValue, i, l, injectProps;
        for (const n in o) {
            if (this._initQueueProps[n] === undefined) {
                oldValue = this._target[n];
                //设置plugins
                arr = AllPlugins[n];
                if (arr) {
                    for (i = 0, l = arr.length; i < l; i++) {
                        oldValue = arr[i].init(this, n, oldValue);
                    }
                }
                this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
            }
            else {
                oldValue = this._curQueueProps[n];
            }
        }
        for (const n in o) {
            oldValue = this._curQueueProps[n];
            arr = AllPlugins[n];
            if (arr) {
                injectProps = injectProps || {};
                for (i = 0, l = arr.length; i < l; i++) {
                    if (arr[i].step) {
                        arr[i].step(this, n, oldValue, o[n], injectProps);
                    }
                }
            }
            this._curQueueProps[n] = o[n];
        }
        if (injectProps) {
            this._appendQueueProps(injectProps);
        }
        return this._curQueueProps;
    }

    private _addAction(o: { f?: any; p?: any; o?: any; t?: any; type?: any; }): this {
        o.t = this.duration;
        o.type = "action";
        this._steps.push(o);
        return this;
    }

    private _set(props: Record<string, any>, o: Record<string, any>): void {
        for (const n in props) {
            o[n] = props[n];
        }
    }

    public wait(duration: number | null, passive?: any): this {
        if (duration == null || duration <= 0) {
            return this;
        }
        const o = this._cloneProps(this._curQueueProps);
        return this._addStep({ d: duration, p0: o, p1: o, v: passive });
    }

    public to(props: { [K in keyof T]?: T[K] }, duration: number, ease?: (num: number) => number): this {
        if (ease === void 0) {
            ease = undefined;
        }
        if (isNaN(duration) || duration < 0) {
            duration = 0;
        }
        this._addStep({ d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props)) });
        //加入一步set，防止游戏极其卡顿时候，to后面的call取到的属性值不对
        return this.set(props);
    }

    public toPromise(): Promise<this> {
        return new Promise<this>(resolve =>
            this.call(() =>
                resolve(this)
            )
        );
    }

    public call(callback: any, thisObj?: Executor<T> | undefined, params?: boolean[] | undefined): this {
        if (thisObj === void 0) {
            thisObj = undefined;
        }
        if (params === void 0) {
            params = undefined;
        }

        return this._addAction({ f: callback, p: params ? params : [], o: thisObj ? thisObj : this._target });
    }

    public set(props: { [K in keyof T]?: T[K] }, target?: null | undefined): this {
        if (target === void 0) {
            target = null;
        }
        //更新当前数据，保证缓动流畅性
        this._appendQueueProps(props);
        return this._addAction({ f: this._set, o: this, p: [props, target ? target : this._target] });
    }

    public play(tween = this): this {
        return this.call(tween.setPaused, tween, [false]);
    }

    public pause(tween = this): this {
        return this.call(tween.setPaused, tween, [true]);
    }

    private $tick(delta: number): void {
        if (this.paused) {
            return;
        }
        this.setPosition(this._prevPosition + delta);
    }
}
