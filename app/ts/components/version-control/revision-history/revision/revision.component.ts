import { Component, Input } from '@angular/core';
import { AgoPipe } from '../../../shared/ago.pipe';

enum RevisionStatus {
    Historical, Active, AwaitingApproval
}

@Component( {
    selector: 'revision',
    template: require( 'revision.component.html' ),
    styles: [require( './revision.component.scss' ).toString()],
    pipes: [AgoPipe]
} )
export class RevisionComponent {
    @Input() revision;

    protected get revisionStatusText():string {
        if( this.revision.status == RevisionStatus.Active)
            return "active";
        if( this.revision.status == RevisionStatus.AwaitingApproval)
            return "awaiting approval";
        if( this.revision.status == RevisionStatus.Historical)
            return "";
        }
    }
}