

export class TreeNode<T> {
    private readonly _data      : T;
    private readonly _children  : TreeNode<T>[] = [];

    public constructor(data: T) {
        this._data  = data;
    }

    public getData(): T {
        return this._data;
    }

    public addChild(child: TreeNode<T>): void {
        this._children.push(child);
    }
    public addChildData(data: T): void {
        this.addChild(new TreeNode(data));
    }

    public clone(): TreeNode<T> {
        const node      = new TreeNode(this.getData());
        const children  = node._children;
        for (const child of this._children) {
            children.push(child.clone());
        }
        return node;
    }

    public convert<T1>(func: (data: T) => T1): TreeNode<T1> {
        const node      = new TreeNode(func(this.getData()));
        const children  = node._children;
        for (const child of this._children) {
            children.push(child.convert(func));
        }
        return node;
    }

    public bfs(): T[] {
        const arr: TreeNode<T>[] = [this];
        for (const node of arr) {
            arr.push(...node._children);
        }
        return arr.map(v => v.getData());
    }
    public dfs(): T[] {
        const arr: T[] = [];
        for (const child of this._children) {
            arr.push(...child.dfs());
        }
        arr.push(this.getData());
        return arr;
    }
}
