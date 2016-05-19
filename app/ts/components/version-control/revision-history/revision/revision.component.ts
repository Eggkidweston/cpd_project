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
        switch (this.revision.status) {
            case RevisionStatus.Historical:
                return "";
            case RevisionStatus.Active:
                return "active";
            case RevisionStatus.AwaitingApproval:
                return "awaiting approval";
        }
    }
}