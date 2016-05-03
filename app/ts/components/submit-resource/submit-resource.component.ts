import { Component, ChangeDetectionStrategy, ViewChild } from 'angular2/core';
import { ControlGroup, FormBuilder, AbstractControl, Validators } from 'angular2/common';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { TagsService } from '../../services/services';
import { Tag } from '../../models';
import { TagCloudComponent } from './tag-cloud.component/tag-cloud.component';
import { FileUploader } from '../../thirdparty/file-upload/file-uploader';
import { FileDrop } from '../../thirdparty/file-upload/file-drop';
import { FileSelect } from '../../thirdparty/file-upload/file-select';
import 'rxjs/add/operator/scan';

interface ITagsOperation extends Function {
    (tags: Tag[]): Tag[];
}

let initialTags: Tag[] = [];
let _ = require('underscore');

@Component({
    selector: 'submit-resource',
    template: require('./submit-resource.component.html'),
    styles: [require('./submit-resource.scss').toString()],
    directives: [TagCloudComponent, FileDrop, FileSelect]
})
export class SubmitResourceComponent {
    @ViewChild('fileUploadButton') fileUploadButton;

    private _newResourceTags: Subject<Tag> = new Subject<Tag>();
    private _resourceTags: Observable<Tag[]>;
    private _tagUpdates: Subject<any> = new Subject<any>();
    private _create: Subject<Tag> = new Subject<Tag>();
    private _remove: Subject<Tag> = new Subject<Tag>();

    private submitResourceForm: ControlGroup;
    private basicDetailsText: AbstractControl;
    private overviewText: AbstractControl;
    private descriptionText: AbstractControl;
    private trialUrl: AbstractControl;
    private videoUrl: AbstractControl;

    protected uploader: FileUploader;
    
    protected shaking: boolean = false;
    protected submitted: boolean = false;

    constructor(fb: FormBuilder) {
        this.uploader = new FileUploader({});

        this._resourceTags = this._tagUpdates
            .scan((tags: Tag[], operation: ITagsOperation) => operation(tags), initialTags);

        this._create
            .map((tag: Tag): ITagsOperation => (tags: Tag[]) => _.uniq(tags.concat(tag)))
            .subscribe(this._tagUpdates);

        this._remove
            .map((tag: Tag): ITagsOperation => (tags: Tag[]) => _.without(tags, tag))
            .subscribe(this._tagUpdates);

        this._newResourceTags.subscribe(this._create);

        this.buildForm(fb);
    }

    get resourceTags(): Observable<Tag[]> {
        return this._resourceTags;
    }

    protected buildForm(fb: FormBuilder) {
        this.submitResourceForm = fb.group({
            "basicDetailsText": ["", Validators.required],
            "overviewText": ["", Validators.required],
            "descriptionText": ["", Validators.required],
            "trialUrl": ["", Validators.required],
            "videoUrl": ["", Validators.required]
        })

        this.basicDetailsText = this.submitResourceForm.controls['basicDetailsText'];
        this.overviewText = this.submitResourceForm.controls['overviewText'];
        this.descriptionText = this.submitResourceForm.controls['descriptionText'];
        this.trialUrl = this.submitResourceForm.controls['trialUrl'];
        this.videoUrl = this.submitResourceForm.controls['videoUrl'];
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

    protected onSubmit(formValues: any) {
        this.submitted = true;
        
        if (this.submitResourceForm.valid) {
            this.submitResource();
        } else {
            this.shakeForm();
        }
    }
    
    protected submitResource() {
        
    }

    protected shakeForm() {
        this.shaking = true;
        setTimeout(() => {
            this.shaking = false;
        }, 500);
    }
}
