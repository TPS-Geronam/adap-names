import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        IllegalArgumentException.assert(pn != null);

        this.parentNode = pn;
        this.parentNode.addChildNode(this);

        MethodFailedException.assert(pn.hasChildNode(this));
    }

    public move(to: Directory): void {
        IllegalArgumentException.assert(to != null);

        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;

        MethodFailedException.assert(to.hasChildNode(this));
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(bn != null);

        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        IllegalArgumentException.assert(bn != null);

        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

}
