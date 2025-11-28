import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        InvalidStateException.assert(this.doGetFileState() == FileState.CLOSED);
        
        // do something
    }

    public read(noBytes: number): Int8Array {
        InvalidStateException.assert(this.doGetFileState() == FileState.OPEN);

        // read something
        return new Int8Array();
    }

    public close(): void {
        InvalidStateException.assert(this.doGetFileState() == FileState.OPEN);

        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}