import { Pipe } from "@angular/core";

@Pipe({ name: "ago" })
export class AgoPipe{
    transform(value) {
        var result: string;

        let msDifference: number = (Date.now().valueOf() - Date.parse(value).valueOf());
        let sDifference: number = msDifference / 1000;
        let mDifference: number = sDifference / 60;
        let hDifference: number = mDifference / 60;
        let dDifference: number = hDifference / 24;

        if( dDifference > 1 )
            result = `${ Math.floor(dDifference) } days ago`;
        else if( hDifference > 1 )
            result = `${ Math.floor(hDifference) } hours ago`;
        else if( mDifference > 1 )
            result = `${ Math.floor(mDifference) } minutes ago`;
        else
            result = `${ Math.floor(sDifference) } seconds ago`;

        return result;
    }
}