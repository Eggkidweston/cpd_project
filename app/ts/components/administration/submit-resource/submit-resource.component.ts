import { Component, ViewChild } from '@angular/core';
import { ControlGroup, FormBuilder, AbstractControl, Validators } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Tag } from '../../../models';
import { TagCloudComponent } from './tag-cloud.component/tag-cloud.component.ts';
import { FileUploader } from '../../../thirdparty/file-upload/file-uploader';
import { FileDrop } from '../../../thirdparty/file-upload/file-drop';
import { FileSelect } from '../../../thirdparty/file-upload/file-select';
import 'rxjs/add/operator/scan';
import {AppsService} from "../../../services/apps.service";

let _ = require('underscore');

let initialTags: Tag[] = [];

interface ITagsOperation extends Function {
    (tags: Tag[]): Tag[];
}

@Component({
    selector: 'submit-resource',
    template: require('./submit-resource.component.html'),
    styles: [require('./submit-resource.scss').toString()],
    directives: [TagCloudComponent, FileDrop, FileSelect]
})
export class SubmitResourceComponent {
    @ViewChild('fileUploadButton') fileUploadButton;

    private newResourceTags: Subject<Tag> = new Subject<Tag>();
    private resourceTags: Observable<Tag[]>;
    private tagUpdates: Subject<any> = new Subject<any>();
    private create: Subject<Tag> = new Subject<Tag>();
    private remove: Subject<Tag> = new Subject<Tag>();

    private submitResourceForm: ControlGroup;
    private basicDetailsText: AbstractControl;
    private overviewText: AbstractControl;
    private descriptionText: AbstractControl;
    private trialUrl: AbstractControl;
    private videoUrl: AbstractControl;

    protected uploader: FileUploader;
    
    protected shaking: boolean = false;
    protected submitted: boolean = false;

    constructor(private appsService: AppsService, fb: FormBuilder) {
        this.uploader = new FileUploader({});

        this.resourceTags = this.tagUpdates
            .scan((tags: Tag[], operation: ITagsOperation) => operation(tags), initialTags);

        this.create
            .map((tag: Tag): ITagsOperation => (tags: Tag[]) => _.uniq(tags.concat(tag)))
            .subscribe(this.tagUpdates);

        this.remove
            .map((tag: Tag): ITagsOperation => (tags: Tag[]) => _.without(tags, tag))
            .subscribe(this.tagUpdates);

        this.newResourceTags.subscribe(this.create);

        this.buildForm(fb);
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
        this.create.next(tag);
    }

    protected removeTagFromResource(tag: Tag): void {
        this.remove.next(tag);
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
        this.appsService.getSignedUrl("Test.jpg ", "jpeg",
            (signedUrl) => alert(JSON.stringify(signedUrl)),
            (err) => alert(JSON.stringify(err)));
    }

    protected shakeForm() {
        this.shaking = true;
        setTimeout(() => {
            this.shaking = false;
        }, 500);
    }
}
