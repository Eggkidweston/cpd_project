import { Component, ChangeDetectionStrategy } from 'angular2/core';
import { Subject, Observable } from 'rxjs/Subject';
import { TagsService } from '../../services/services';
import { Tag } from '../../models';
import { TagCloudComponent } from './tag-cloud.component/tag-cloud.component';

interface ITagsOperation extends Function {
    (messages: Tag[]): Tag[];
}

let initialTags: Tag[] = [];

@Component({
    selector: 'submit-resource',
    template: require('./submit-resource.component.html'),
    styles: [require('./submit-resource.scss').toString()],
    directives: [TagCloudComponent]
})
export class SubmitResourceComponent {
    private _newResourceTags: Subject<Tag> = new Subject<Tag>();
    private _resourceTags: Observable<Tag[]>;
    private _tagUpdates: Subject<any> = new Subject<any>();
    private _create: Subject<Tag> = new Subject<Tag>();

    constructor() {
        this._resourceTags = this._tagUpdates
            .scan((tags: Tag[], operation: ITagsOperation) => operation(tags), initialTags)
            .publishReplay(1)
            .refCount();

        this._create
            .map((tag: Tag): ITagsOperation => {
                return (tags: Tag[]) => tags.concat(tag)
            })
            .subscribe(this._tagUpdates);

        this._newResourceTags.subscribe(this._create);
    }

    get resourceTags(): Observable<Tag[]> {
        return this._resourceTags;
    } 
    
    protected tagClicked(tag: Tag) {
        this.addTagToResource(tag);
    }

    protected addTagToResource(tag: Tag): void {
        this._newResourceTags.next(tag);
    }
}
