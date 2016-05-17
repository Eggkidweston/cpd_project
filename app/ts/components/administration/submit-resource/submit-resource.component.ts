import { Component, ViewChild } from '@angular/core';
import { ControlGroup, FormBuilder, AbstractControl, Validators } from '@angular/common';
import { Router } from '@angular/router-deprecated';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Tag, Resource } from '../../../models';
import { TagCloudComponent } from './tag-cloud.component/tag-cloud.component.ts';
import { FileUploader } from '../../../thirdparty/file-upload/file-uploader';
import { FileDrop } from '../../../thirdparty/file-upload/file-drop';
import { FileSelect } from '../../../thirdparty/file-upload/file-select';
import { AppsService } from '../../../services/services';
import { AuthenticationService } from '../../../services/authentication.service';
import 'rxjs/add/operator/scan';
import 'rxjs/Observable/bindNodeCallback';
import 'rxjs/Observable/from';

let _ = require( 'underscore' );

let initialTags:Tag[] = [];

interface ITagsOperation extends Function
{
    ( tags:Tag[] ):Tag[];
}

@Component( {
    selector: 'submit-resource',
    template: require( './submit-resource.component.html' ),
    styles: [require( './submit-resource.scss' ).toString()],
    directives: [TagCloudComponent, FileDrop, FileSelect]
} )
export class SubmitResourceComponent
{
    @ViewChild( 'fileUploadButton' ) fileUploadButton;

    private newResourceTags:Subject<Tag> = new Subject<Tag>();
    private resourceTags:Observable<Tag[]>;
    private tagUpdates:Subject<any> = new Subject<any>();
    private create:Subject<Tag> = new Subject<Tag>();
    private remove:Subject<Tag> = new Subject<Tag>();

    private submitResourceForm:ControlGroup;
    private basicDetailsText:AbstractControl;
    private overviewText:AbstractControl;
    private descriptionText:AbstractControl;
    private trialUrl:AbstractControl;
    private videoUrl:AbstractControl;

    protected uploader:FileUploader;

    protected shaking:boolean = false;
    protected submitted:boolean = false;

    constructor( protected appsService:AppsService,
                 protected authenticationService:AuthenticationService,
                 protected router:Router,
                 fb:FormBuilder )
    {
        this.uploader = new FileUploader( {} );

        this.resourceTags = this.tagUpdates
            .scan( ( tags:Tag[], operation:ITagsOperation ) => operation( tags ), initialTags )
            .publishReplay( 1 )
            .refCount();

        this.create
            .map( ( tag:Tag ):ITagsOperation => ( tags:Tag[] ) => _.uniq( tags.concat( tag ) ) )
            .subscribe( this.tagUpdates );

        this.remove
            .map( ( tag:Tag ):ITagsOperation => ( tags:Tag[] ) => _.without( tags, tag ) )
            .subscribe( this.tagUpdates );

        this.newResourceTags.subscribe( this.create );

        this.buildForm( fb );
    }


    protected buildForm( fb:FormBuilder )
    {
        this.submitResourceForm = fb.group( {
            "basicDetailsText": ["", Validators.required],
            "overviewText": ["", Validators.required],
            "descriptionText": ["", Validators.required],
            "trialUrl": ["", Validators.required],
            "videoUrl": ["", Validators.required]
        } )

        this.basicDetailsText = this.submitResourceForm.controls['basicDetailsText'];
        this.overviewText = this.submitResourceForm.controls['overviewText'];
        this.descriptionText = this.submitResourceForm.controls['descriptionText'];
        this.trialUrl = this.submitResourceForm.controls['trialUrl'];
        this.videoUrl = this.submitResourceForm.controls['videoUrl'];
    }

    protected addTagToResource( tag:Tag ):void
    {
        this.create.next( tag );
    }

    protected removeTagFromResource( tag:Tag ):void
    {
        this.remove.next( tag );
    }

    protected uploadFileButtonClicked()
    {
        this.fileUploadButton.nativeElement.click();
    }

    protected onSubmit( formValues:any )
    {
        this.submitted = true;

        if( this.submitResourceForm.valid ) {
            this.submitResource( formValues );
        } else {
            this.shakeForm();
        }
    }

    protected submitResource( formValues:any )
    {
        console.log( `Form values: ${ JSON.stringify( formValues )}` );

        this.getS3ImageUrls( urls =>
            {
                this.resourceTags.subscribe(
                    tags =>
                    {
                        let newResource = new Resource();
                        newResource.type_id = 1;
                        newResource.licensetype_id = 1;
                        newResource.title = formValues.basicDetailsText ;
                        newResource.description = formValues.descriptionText;
                        newResource.url = formValues.trialUrl;
                        newResource.image = formValues.image;
                        newResource.active = true;
                        newResource.isfree = true;
                        newResource.overview = formValues.overview;
                        newResource.recommended = true;
                        newResource.relatedIds = new Array<number>();
                        newResource.tags = tags;
                        newResource.mediaUrls = urls;

                        this.appsService.submitResource( newResource ).subscribe(
                            resource => this.router.navigate( ['AppDetails', { id: newResource.id }] ),
                            err => console.log( `Error submitting resource: ${err}` ) );
                    }
                )
            }
        )
    }

    protected getS3ImageUrls( next:( urls:Array<string> ) => void )
    {
        let urls = new Array<string>();

        if( this.uploader.queue.length === 0 ) next( urls );
        else {
            //noinspection TypeScriptUnresolvedFunction
            let uploadFile = Observable.bindNodeCallback( this.appsService.uploadFileToS3 );

            //noinspection TypeScriptUnresolvedFunction
            Observable.from( this.uploader.queue )
                .flatMap( e => uploadFile( e, this.authenticationService.apiKey ) )
                .subscribe(
                    url => urls.push( url ),
                    e => console.log( `Could not upload file: ${e}` ),
                    () => next( urls )
                );
        }
    }

    protected shakeForm()
    {
        this.shaking = true;
        setTimeout( () =>
        {
            this.shaking = false;
        }, 500 );
    }
}
