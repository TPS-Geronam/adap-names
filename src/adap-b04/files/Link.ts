import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        this.targetNode = target;
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(bn != null);

        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    /*  I don't understand this method
        Calling it with target = null will cause exception in e.g. this.getBaseName()
        So why annotate the type as Node | null in the first place?
    */
    protected ensureTargetNode(target: Node | null): Node {
        IllegalArgumentException.assert(target != null);

        // is target arg supposed to be unused?
        //const result: Node = this.targetNode as Node;
        const result: Node = target as Node;
        return result;
    }
}