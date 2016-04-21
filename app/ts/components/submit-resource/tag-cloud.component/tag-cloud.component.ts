import { Component, ChangeDetectionStrategy, Output, EventEmitter } from 'angular2/core';
import { Observable } from 'rxjs/Observable';
import { TagsService } from '../../../services/services';
import { Tag } from '../../../models';

@Component({
    // we really need to refactor tagcloud.component.x
    // to avoid confusion with this tag cloud component
    selector: 'tag-cloud', 
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [require('./tag-cloud.scss').toString()],
    template: require('./tag-cloud.component.html')
})
export class TagCloudComponent {
    @Output() tagClicked: EventEmitter<Tag> = new EventEmitter<Tag>();

    private tags: Observable<Tag[]>;

    constructor(public tagsService: TagsService) {
        this.loadTagCloud();
    }

    protected loadTagCloud() {
        this.tags = this.tagsService.allTags;
    }
    
    protected clicked(tag: Tag) {
        this.tagClicked.emit(tag);
    }
}