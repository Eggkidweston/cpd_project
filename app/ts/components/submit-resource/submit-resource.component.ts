import { Component, ChangeDetectionStrategy, ViewChild } from 'angular2/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { TagsService } from '../../services/services';
import { Tag } from '../../models';
import { TagCloudComponent } from './tag-cloud.component/tag-cloud.component';
import { FileUploader } from '../../thirdparty/file-upload/file-uploader';
import { FileDrop } from '../../thirdparty/file-upload/file-drop';
import { FileSelect } from '../../thirdparty/file-upload/file-select';

interface ITagsOperation extends Function {
    (messages: Tag[]): Tag[];
}

let initialTags: Tag[] = [];

let _ = require('underscore');

@Component({
    selector: 'submit-resource',
    template: require('./submit-resource.component.html'),
    styles: [require('./submit-resource.scss').toString()],
    directives: [ TagCloudComponent, FileDrop, FileSelect ]
})
export class SubmitResourceComponent {
    @ViewChild('fileUploadButton') fileUploadButton;

    private _newResourceTags: Subject<Tag> = new Subject<Tag>();
    private _resourceTags: Observable<Tag[]>;
    private _tagUpdates: Subject<any> = new Subject<any>();
    private _create: Subject<Tag> = new Subject<Tag>();
    private _remove: Subject<Tag> = new Subject<Tag>();

    public uploader: FileUploader;
    
    constructor() {
        this.uploader = new FileUploader({ });

        this._resourceTags = this._tagUpdates
            .scan((tags: Tag[], operation: ITagsOperation) => operation(tags), initialTags);

        this._create
            .map((tag: Tag): ITagsOperation => (tags: Tag[]) => _.uniq(tags.concat(tag)))
            .subscribe(this._tagUpdates);

        this._remove
            .map((tag: Tag): ITagsOperation => (tags: Tag[]) => _.without(tags, tag))
            .subscribe(this._tagUpdates);

        this._newResourceTags.subscribe(this._create);
    }

    get resourceTags(): Observable<Tag[]> {
        return this._resourceTags;
    } 
    
    protected addTagToResource(tag: Tag): void {
        this._create.next(tag);
    }
    
    protected removeTagFromResource(tag: Tag): void {
        this._remove.next(tag);
    }
    
    protected uploadFileButtonClicked() {
        this.fileUploadButton.nativeElement.click();
    }
}
